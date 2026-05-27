import express from "express";

import {
  addTransaction,
  getCustomerLedger,
  recordPayment,
  getCustomerTransactions,
} from "../controllers/transactionController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ADD TRANSACTION
router.post("/add", protect, authorizeRoles("shopkeeper"), addTransaction);

// GET CUSTOMER LEDGER
router.get(
  "/ledger/:customerId",
  protect,
  authorizeRoles("shopkeeper"),
  getCustomerLedger,
);

// RECORD PAYMENT
router.post("/payment", protect, authorizeRoles("shopkeeper"), recordPayment);

// CUSTOMER DASHBOARD TRANSACTIONS
router.get(
  "/customer",
  protect,
  authorizeRoles("customer"),
  getCustomerTransactions,
);

export default router;
