import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";
import Notification from "../models/Notification.js";

/**
 * CREATE RAZORPAY ORDER
 */
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerId,
      shopkeeperId,
    } = req.body;

    // 1. VERIFY SIGNATURE
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // 2. FIND CUSTOMER
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // 3. CREATE PAYMENT ENTRY (IMPORTANT)
    const paymentAmount = customer.currentBalance;

    // 4. RESET BALANCE
    customer.currentBalance = 0;
    customer.status = "cleared";

    await customer.save();

    // 5. TRANSACTION ENTRY
    await Transaction.create({
      shopkeeperId,
      customerId,
      items: [],
      totalAmount: paymentAmount,
      paidAmount: paymentAmount,
      remainingAmount: 0,
      paymentType: "paid",
      transactionType: "payment",
      status: "completed",
    });

    // 6. NOTIFICATION (FIX MISSING IMPORT)
    await Notification.create({
      customerId,
      shopkeeperId,
      title: "Payment Successful",
      message: `Payment of ₹${paymentAmount} completed`,
      type: "payment",
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
