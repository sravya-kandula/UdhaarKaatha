import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";

// SHOPKEEPER DASHBOARD
export const getDashboardStats = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;

    // GET ALL CUSTOMERS
    const customers = await Customer.find({
      shopkeeperId,
    }).sort({
      createdAt: -1,
    });

    // ADD TRANSACTIONS TO EACH CUSTOMER
    const customersWithTransactions = await Promise.all(
      customers.map(async (customer) => {
        const transactions = await Transaction.find({
          customerId: customer._id,
        }).sort({
          createdAt: -1,
        });

        return {
          ...customer._doc,
          transactions,
        };
      }),
    );

    // TOTAL CUSTOMERS
    const totalCustomers = customers.length;

    // ACTIVE CUSTOMERS
    const activeCustomers = customers.filter(
      (customer) => customer.status === "active",
    ).length;

    // CLEARED CUSTOMERS
    const clearedCustomers = customers.filter(
      (customer) => customer.status === "cleared",
    ).length;

    // OVERDUE CUSTOMERS
    const overdueCustomers = customers.filter(
      (customer) => customer.status === "overdue",
    ).length;

    // TOTAL PENDING BALANCE
    const totalPendingBalance = customers.reduce(
      (acc, customer) => acc + customer.currentBalance,
      0,
    );

    // TOTAL TRANSACTIONS
    const totalTransactions = await Transaction.countDocuments({
      shopkeeperId,
    });

    // TOTAL COLLECTIONS
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

      customers: customersWithTransactions,
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
      // TOTAL UDHAR
      if (transaction.paymentType === "udhar") {
        totalUdhar += transaction.remainingAmount;
      }

      // TOTAL COLLECTIONS
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
