// notification-service/controllers/notificationController.js
import Notification from "../models/Notification.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,  // Use App Password if 2FA is enabled
  },
});

// Send Email Notification
export const sendEmailNotification = async (req, res) => {
  const { userId, email, message } = req.body;

  if (!email || !message || !userId) {
    return res.status(400).json({ error: "userId, email, and message are required" });
  }

  try {
    const newNotification = await Notification.create({ message, userId, type: "email" });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Shift Management Notification",
      text: message,
    });

    res.status(200).json({ message: "Email sent successfully", notification: newNotification });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    // Distinguish between database and email sending errors
    if (error.message.startsWith("❌ Error saving data.json")) {
      res.status(500).json({ error: "Failed to save notification to database" });
    } else {
      res.status(500).json({ error: "Failed to send email" });
    }
  }
};

// Get All Notifications
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to retrieve notifications" });
  }
};

// Get Notification by ID (added for completeness)
export const getNotificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    console.error("❌ Error fetching notification:", error);
    res.status(500).json({ error: "Failed to retrieve notification" });
  }
};