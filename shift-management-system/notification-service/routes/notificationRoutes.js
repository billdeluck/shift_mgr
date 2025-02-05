// notification-service/routes/notificationRoutes.js
import express from "express";
import { sendEmailNotification, getAllNotifications, getNotificationById } from "../controllers/notificationController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send Email Notification (Protected)
router.post("/email", authenticate, sendEmailNotification);

// Get All Notifications (Protected)
router.get("/", authenticate, getAllNotifications);

// Get Notification by ID (Protected) - Added for completeness
router.get("/:id", authenticate, getNotificationById);


export default router;