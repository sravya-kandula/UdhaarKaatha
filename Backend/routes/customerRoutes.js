import express from "express";

import {
  addCustomer,
  getCustomers,
  filterCustomers,
  archiveCustomer,
  restoreCustomer,
  getArchivedCustomers,
} from "../controllers/customerController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
const router = express.Router();

// ADD CUSTOMER
router.post("/add", protect, authorizeRoles("shopkeeper"), addCustomer);
router.get("/", protect, authorizeRoles("shopkeeper"), getCustomers);

router.get("/filter", protect, authorizeRoles("shopkeeper"), filterCustomers);
// ARCHIVE CUSTOMER
router.patch(
  "/archive/:customerId",
  protect,
  authorizeRoles("shopkeeper"),
  archiveCustomer,
);

// RESTORE CUSTOMER
router.patch(
  "/restore/:customerId",
  protect,
  authorizeRoles("shopkeeper"),
  restoreCustomer,
);

// GET ARCHIVED CUSTOMERS
router.get(
  "/archived",
  protect,
  authorizeRoles("shopkeeper"),
  getArchivedCustomers,
);

export default router;
