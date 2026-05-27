import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";

// SHOPKEEPER DASHBOARD
export const getDashboardStats = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;

    // total customers
    const totalCustomers = await Customer.countDocuments({
      shopkeeperId,
    });

    // active customers
    const activeCustomers = await Customer.countDocuments({
      shopkeeperId,
      status: "active",
    });

    // cleared customers
    const clearedCustomers = await Customer.countDocuments({
      shopkeeperId,
      status: "cleared",
    });

    // overdue customers
    const overdueCustomers = await Customer.countDocuments({
      shopkeeperId,
      status: "overdue",
    });

    // total pending balance
    const customers = await Customer.find({
      shopkeeperId,
    });

    const totalPendingBalance = customers.reduce(
      (acc, customer) => acc + customer.currentBalance,
      0,
    );

    // total transactions
    const totalTransactions = await Transaction.countDocuments({
      shopkeeperId,
    });

    // total collections
    const paymentTransactions = await Transaction.find({
      shopkeeperId,
      transactionType: "payment",
    });

    const totalCollections = paymentTransactions.reduce(
      (acc, transaction) => acc + transaction.paidAmount,
      0,
    );

    res.status(200).json({
      success: true,

      dashboard: {
        totalCustomers,
        activeCustomers,
        clearedCustomers,
        overdueCustomers,
        totalPendingBalance,
        totalTransactions,
        totalCollections,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// RECENT TRANSACTIONS
export const getRecentTransactions = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;

    const transactions = await Transaction.find({
      shopkeeperId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .populate("customerId", "name phone");

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// MONTHLY ANALYTICS
export const getMonthlyAnalytics = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;

    const transactions = await Transaction.find({
      shopkeeperId,
    });

    let totalUdhar = 0;
    let totalCollections = 0;

    transactions.forEach((transaction) => {
      // udhar amount
      if (transaction.paymentType === "udhar") {
        totalUdhar += transaction.remainingAmount;
      }

      // collections
      if (transaction.transactionType === "payment") {
        totalCollections += transaction.paidAmount;
      }
    });

    res.status(200).json({
      success: true,

      analytics: {
        totalUdhar,
        totalCollections,
        profit: totalCollections - totalUdhar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// TOP CUSTOMERS
export const getTopCustomers = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;

    const customers = await Customer.find({
      shopkeeperId,
    })
      .sort({
        currentBalance: -1,
      })
      .limit(5);

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
