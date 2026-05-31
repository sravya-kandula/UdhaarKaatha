import Transaction from "../models/Transaction.js";
import Customer from "../models/Customer.js";
import Notification from "../models/Notification.js";

/**
 * ADD TRANSACTION (PURCHASE / UDHAR)
 */
export const addTransaction = async (req, res) => {
  try {
    const { customerId, items, totalAmount, paymentType, paidAmount, dueDate } =
      req.body;

    const shopkeeperId = req.user.id;

    console.log("========== ADD TRANSACTION ==========");
    console.log("Shopkeeper ID:", shopkeeperId);
    console.log("Customer ID:", customerId);
    console.log("Request Body:", req.body);

    // FIND CUSTOMER
    const customer = await Customer.findById(customerId);

    console.log("Customer Found:", customer);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // SAFE NUMBER CONVERSION
    const total = Number(totalAmount || 0);
    const paid = Number(paidAmount || 0);

    console.log("Total:", total, "Paid:", paid);

    // REMAINING AMOUNT CALCULATION (FIXED LOGIC)
    let remainingAmount = paymentType === "paid" ? 0 : total - paid;

    if (remainingAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Paid amount cannot exceed total amount",
      });
    }

    console.log("Remaining Amount:", remainingAmount);

    // UDHAR LIMIT CHECK
    if (paymentType === "udhar") {
      const futureBalance = Number(customer.currentBalance) + remainingAmount;

      console.log("Future Balance:", futureBalance);
      console.log("Udhar Limit:", customer.udharLimit);

      if (futureBalance > customer.udharLimit) {
        return res.status(400).json({
          success: false,
          message: "Udhar limit exceeded",
        });
      }
    }

    // STATUS CALCULATION
    let status = "pending";

    if (remainingAmount === 0) status = "completed";
    else if (paid > 0) status = "partial";

    // CREATE TRANSACTION
    const transaction = await Transaction.create({
      shopkeeperId,
      customerId,
      items,
      totalAmount: total,
      paidAmount: paid,
      remainingAmount,
      paymentType,
      dueDate,
      status,
    });

    console.log("Transaction Created:", transaction._id);

    // UPDATE CUSTOMER BALANCE (FIXED LOGIC)
    customer.currentBalance = Number(customer.currentBalance) + remainingAmount;

    customer.status = customer.currentBalance === 0 ? "cleared" : "active";

    await customer.save();

    console.log("Customer Updated:", customer.currentBalance);

    // NOTIFICATION ONLY FOR UDHAR
    if (paymentType === "udhar") {
      await Notification.create({
        customerId,
        shopkeeperId,
        title: "New Udhar Added",
        message: `Udhar of ₹${remainingAmount} added`,
        type: "udhar",
      });
    }

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      transaction,
    });
  } catch (error) {
    console.error("ADD TRANSACTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET LEDGER
 */
export const getCustomerLedger = async (req, res) => {
  try {
    const { customerId } = req.params;
    const shopkeeperId = req.user.id;

    const customer = await Customer.findOne({
      _id: customerId,
      shopkeeperId,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const transactions = await Transaction.find({
      customerId,
      shopkeeperId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      customer,
      totalTransactions: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * RECORD PAYMENT
 */
export const recordPayment = async (req, res) => {
  try {
    const { customerId, amount } = req.body;
    const shopkeeperId = req.user.id;

    const customer = await Customer.findOne({
      _id: customerId,
      shopkeeperId,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const pay = Number(amount);

    if (pay <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    if (pay > customer.currentBalance) {
      return res.status(400).json({
        success: false,
        message: "Payment exceeds balance",
      });
    }

    const transaction = await Transaction.create({
      shopkeeperId,
      customerId,
      items: [],
      totalAmount: pay,
      paidAmount: pay,
      remainingAmount: 0,
      paymentType: "paid",
      transactionType: "payment",
      status: "completed",
    });

    customer.currentBalance -= pay;
    customer.status = customer.currentBalance === 0 ? "cleared" : "active";

    await customer.save();

    await Notification.create({
      customerId,
      shopkeeperId,
      title: "Payment Received",
      message: `Payment of ₹${pay} received`,
      type: "payment",
    });

    res.status(200).json({
      success: true,
      transaction,
      updatedBalance: customer.currentBalance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * CUSTOMER DASHBOARD TRANSACTIONS
 */
export const getCustomerTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const customer = await Customer.findOne({ userId });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not linked",
      });
    }

    const transactions = await Transaction.find({
      customerId: customer._id,
    }).populate("shopkeeperId", "name email shopName");

    let totalPending = 0;
    let totalPaid = 0;
    let totalFine = 0;

    const shopMap = {};

    transactions.forEach((t) => {
      totalPending += t.remainingAmount || 0;
      totalPaid += t.paidAmount || 0;
      totalFine += t.fineAmount || 0;

      const id = t.shopkeeperId?._id?.toString();
      if (!id) return;

      if (!shopMap[id]) {
        shopMap[id] = {
          shopkeeperId: id,
          shopName: t.shopkeeperId?.shopName || t.shopkeeperId?.name,
          totalPending: 0,
          totalTransactions: 0,
          latestTransaction: t.createdAt,
        };
      }

      shopMap[id].totalPending += t.remainingAmount || 0;
      shopMap[id].totalTransactions += 1;
    });

    res.status(200).json({
      success: true,
      customer,
      transactions,
      shops: Object.values(shopMap),
      totalPending,
      totalPaid,
      totalFine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
