// event-service/routes/eventRoutes.js
import express from "express";
import { createEvent, getAllEvents, getEventById, findEvents } from "../controllers/eventController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { body, param } from "express-validator";
import { EVENT_TYPES } from "../models/Event.js"; // Import for validation

const router = express.Router();

// Create a new event (protected and validated)
router.post(
  "/",
  authenticate,
  [
    body("type")
      .notEmpty().withMessage("Event type is required")
      .isIn(Object.values(EVENT_TYPES)).withMessage("Invalid event type"), // Validate against allowed types
    body("userId").optional().isInt().withMessage("userId must be an integer"),
    body("shiftId").optional().isInt().withMessage("shiftId must be an integer"),
    // You could add validation for 'data' if it has a specific structure
  ],
  createEvent
);

// Get all events (protected)
router.get("/", authenticate, getAllEvents);

//find events by criteria
router.post("/find", authenticate, findEvents)

// Get event by ID (protected and validated)
router.get(
  "/:id",
  authenticate,
  [param("id").isInt().withMessage("Event ID must be an integer")],
  getEventById
);

export default router;