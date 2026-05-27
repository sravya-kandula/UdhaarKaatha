import express from "express";

import {
  addTransaction,
  getCustomerLedger,
  recordPayment,
} from "../controllers/transactionController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ADD TRANSACTION
router.post("/add", protect, authorizeRoles("shopkeeper"), addTransaction);

router.get(
  "/ledger/:customerId",
  protect,
  authorizeRoles("shopkeeper"),
  getCustomerLedger,
);

router.post("/payment", protect, authorizeRoles("shopkeeper"), recordPayment);

export default router;
