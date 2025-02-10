// event-service/routes/eventRoutes.js
import express from "express";
import { createEvent, getAllEvents, getEventById } from "../controllers/eventController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { body, param } from "express-validator";

const router = express.Router();

// Get all events (Protected Route)
router.get("/", authenticate, getAllEvents);

// Get event by ID (Protected Route)
router.get(
    "/:id",
    authenticate,
    [param("id").isInt().withMessage("Invalid event ID")],
    getEventById
);

// Create a new event (Protected Route - Admin/Manager Only)
router.post(
    "/",
    authenticate,
    authorize(["admin", "manager"]),
    [
        body("type").notEmpty().withMessage("Event type is required"),
        body("userId").isInt().withMessage("Invalid User ID").notEmpty().withMessage("User ID is required"),
    ],
    createEvent
);

export default router;