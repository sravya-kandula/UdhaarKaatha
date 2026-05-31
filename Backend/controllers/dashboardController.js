import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";

// SHOPKEEPER DASHBOARD
export const getDashboardStats = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;

    console.log("========== DASHBOARD STATS ==========");
    console.log("Shopkeeper ID:", shopkeeperId);

    // GET ALL CUSTOMERS
    const customers = await Customer.find({
      shopkeeperId,
      isArchived: false,
    }).sort({
      createdAt: -1,
    });

    console.log("Customers Found:", customers.length);

    // ADD TRANSACTIONS TO EACH CUSTOMER
    const customersWithTransactions = await Promise.all(
      customers.map(async (customer) => {
        const transactions = await Transaction.find({
          customerId: customer._id,
          shopkeeperId,
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
      (acc, customer) => acc + Number(customer.currentBalance || 0),
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
      (acc, transaction) => acc + Number(transaction.paidAmount || 0),
      0,
    );

    console.log("Total Customers:", totalCustomers);
    console.log("Active Customers:", activeCustomers);
    console.log("Cleared Customers:", clearedCustomers);
    console.log("Overdue Customers:", overdueCustomers);
    console.log("Pending Balance:", totalPendingBalance);
    console.log("Total Transactions:", totalTransactions);
    console.log("Total Collections:", totalCollections);
    console.log("========== DASHBOARD SUCCESS ==========");

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
    console.error("DASHBOARD ERROR:", error);

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

    console.log("========== RECENT TRANSACTIONS ==========");
    console.log("Shopkeeper ID:", shopkeeperId);

    const transactions = await Transaction.find({
      shopkeeperId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .populate("customerId", "name phone");

    console.log("Transactions Found:", transactions.length);
    console.log("========== RECENT TRANSACTIONS SUCCESS ==========");

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("RECENT TRANSACTIONS ERROR:", error);

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

    console.log("========== MONTHLY ANALYTICS ==========");
    console.log("Shopkeeper ID:", shopkeeperId);

    const transactions = await Transaction.find({
      shopkeeperId,
    });

    let totalUdhar = 0;
    let totalCollections = 0;

    transactions.forEach((transaction) => {
      if (transaction.paymentType === "udhar") {
        totalUdhar += Number(transaction.remainingAmount || 0);
      }

      if (transaction.transactionType === "payment") {
        totalCollections += Number(transaction.paidAmount || 0);
      }
    });

    const profit = totalCollections - totalUdhar;

    console.log("Total Udhar:", totalUdhar);
    console.log("Total Collections:", totalCollections);
    console.log("Profit:", profit);
    console.log("========== ANALYTICS SUCCESS ==========");

    res.status(200).json({
      success: true,

      analytics: {
        totalUdhar,
        totalCollections,
        profit,
      },
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);

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

    console.log("========== TOP CUSTOMERS ==========");
    console.log("Shopkeeper ID:", shopkeeperId);

    const customers = await Customer.find({
      shopkeeperId,
      isArchived: false,
    })
      .sort({
        currentBalance: -1,
      })
      .limit(5);

    console.log("Top Customers Found:", customers.length);
    console.log("========== TOP CUSTOMERS SUCCESS ==========");

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("TOP CUSTOMERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
