import express from "express";

import {
  getNotifications,
  markNotificationRead,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET NOTIFICATIONS
router.get("/", protect, authorizeRoles("shopkeeper"), getNotifications);

// MARK AS READ
router.patch(
  "/:id",
  protect,
  authorizeRoles("shopkeeper"),
  markNotificationRead,
);

export default router;
