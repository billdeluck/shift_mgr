// shift-service/routes/shiftRoutes.js
import express from "express";
import { createShift, getAllShifts, getShiftById, updateShift, deleteShift } from "../controllers/shiftController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { body, param } from "express-validator";

const router = express.Router();

// Protected routes (require JWT authentication)
router.get("/", authenticate, getAllShifts);
router.get(
    "/:id",
    authenticate,
    [param("id").isInt().withMessage("Invalid shift ID")],
    getShiftById
);

// Create a new shift (requires authentication and admin or manager role)
router.post(
    "/",
    authenticate,
    authorize(["admin", "manager"]),
    [
        body("userId").isInt().withMessage("Invalid User ID").notEmpty().withMessage("User ID is required"),
        body("date").notEmpty().withMessage("Date is required").isISO8601().withMessage("Invalid date format"),
        body("timeIn").notEmpty().withMessage("Time In is required").isISO8601().withMessage("Invalid time format"),
        body("timeOut").notEmpty().withMessage("Time Out is required").isISO8601().withMessage("Invalid time format")
    ],
    createShift
);

// Update a shift (requires authentication)
router.put(
    "/:id",
    authenticate,
    [param("id").isInt().withMessage("Invalid shift ID")],
    updateShift
);

// Delete a shift (requires authentication)
router.delete(
    "/:id",
    authenticate,
    [param("id").isInt().withMessage("Invalid shift ID")],
    deleteShift
);

export default router;