import express from "express";

import {
  getDashboardStats,
  getRecentTransactions,
  getMonthlyAnalytics,
  getTopCustomers,
} from "../controllers/dashboardController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// DASHBOARD STATS
router.get("/", protect, authorizeRoles("shopkeeper"), getDashboardStats);
// RECENT TRANSACTIONS
router.get(
  "/recent-transactions",
  protect,
  authorizeRoles("shopkeeper"),
  getRecentTransactions,
);

// MONTHLY ANALYTICS
router.get(
  "/analytics",
  protect,
  authorizeRoles("shopkeeper"),
  getMonthlyAnalytics,
);

// TOP CUSTOMERS
router.get(
  "/top-customers",
  protect,
  authorizeRoles("shopkeeper"),
  getTopCustomers,
);

export default router;
