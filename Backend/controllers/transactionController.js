import Transaction from "../models/Transaction.js";
import Customer from "../models/Customer.js";
import Notification from "../models/Notification.js";

// ADD TRANSACTION
export const addTransaction = async (req, res) => {
  try {
    const { customerId, items, totalAmount, paymentType, paidAmount, dueDate } =
      req.body;

    const shopkeeperId = req.user.id;

    // find customer
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // check udhar limit
    if (paymentType === "udhar") {
      const futureBalance = customer.currentBalance + totalAmount;

      if (futureBalance > customer.udharLimit) {
        return res.status(400).json({
          success: false,
          message: "Udhar limit exceeded",
        });
      }
    }

    // calculate remaining amount
    let remainingAmount = 0;

    if (paymentType === "paid") {
      remainingAmount = 0;
    } else {
      remainingAmount = totalAmount - (paidAmount || 0);
    }

    // determine status
    let status = "pending";

    if (remainingAmount === 0) {
      status = "completed";
    } else if (paidAmount > 0 && remainingAmount > 0) {
      status = "partial";
    }

    // create transaction
    const transaction = await Transaction.create({
      shopkeeperId,
      customerId,
      items,
      totalAmount,
      paidAmount: paidAmount || 0,
      remainingAmount,
      paymentType,
      dueDate,
      status,
    });

    // update customer balance
    customer.currentBalance += remainingAmount;

    // update customer status
    if (customer.currentBalance === 0) {
      customer.status = "cleared";
    } else {
      customer.status = "active";
    }

    await customer.save();

    // CREATE NOTIFICATION FOR UDHAR
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET CUSTOMER KHATA / LEDGER
export const getCustomerLedger = async (req, res) => {
  try {
    const { customerId } = req.params;

    const shopkeeperId = req.user.id;

    // verify customer belongs to shopkeeper
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

    // get all transactions
    const transactions = await Transaction.find({
      customerId,
      shopkeeperId,
    }).sort({
      createdAt: -1,
    });

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

// RECORD PAYMENT
export const recordPayment = async (req, res) => {
  try {
    const { customerId, amount } = req.body;

    const shopkeeperId = req.user.id;

    // find customer
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

    // validation
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    // prevent extra payment
    if (amount > customer.currentBalance) {
      return res.status(400).json({
        success: false,
        message: "Payment exceeds current balance",
      });
    }

    // create payment transaction
    const transaction = await Transaction.create({
      shopkeeperId,
      customerId,
      items: [],
      totalAmount: amount,
      paidAmount: amount,
      remainingAmount: 0,
      paymentType: "paid",
      transactionType: "payment",
      status: "completed",
    });

    // reduce customer balance
    customer.currentBalance -= amount;

    // auto-clear customer
    if (customer.currentBalance === 0) {
      customer.status = "cleared";
    } else {
      customer.status = "active";
    }

    await customer.save();

    // CREATE PAYMENT NOTIFICATION
    await Notification.create({
      customerId,
      shopkeeperId,
      title: "Payment Received",
      message: `Payment of ₹${amount} received`,
      type: "payment",
    });

    res.status(200).json({
      success: true,
      message: "Payment recorded successfully",
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
// GET CUSTOMER TRANSACTIONS
export const getCustomerTransactions = async (req, res) => {
  try {
    const customerId = req.user.id;

    const transactions = await Transaction.find({
      customerId,
    })
      .populate("shopkeeperId", "name")
      .sort({
        createdAt: -1,
      });

    // TOTALS
    let totalPending = 0;
    let totalPaid = 0;
    let totalFine = 0;

    transactions.forEach((transaction) => {
      totalPending += transaction.remainingAmount;

      totalPaid += transaction.paidAmount;

      totalFine += transaction.fineAmount || 0;
    });

    res.status(200).json({
      success: true,
      transactions,
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
