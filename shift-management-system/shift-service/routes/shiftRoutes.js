// shift-service/routes/shiftRoutes.js
import express from "express";
import {
    createShift,
    getAllShifts,
    getShiftById,
    updateShift,
    deleteShift,
    getAllShiftTypes,
    getShiftTypeById,
    createShiftType,
    updateShiftType,
    deleteShiftType
} from "../controllers/shiftController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { body, param } from "express-validator";

const router = express.Router();

// Shift Routes
router.get("/", authenticate, getAllShifts);
router.get("/:id", authenticate, [param("id").isInt().withMessage("Invalid shift ID")], getShiftById);
router.post(
    "/",
    authenticate,
    authorize(["admin", "manager"]),
    [
        body("shiftTypeId").isInt().withMessage("Invalid Shift Type ID").notEmpty().withMessage("Shift Type ID is required"),
        body("userId").isInt().withMessage("Invalid User ID").notEmpty().withMessage("User ID is required"),
        body("date").notEmpty().withMessage("Date is required").isISO8601().withMessage("Invalid date format"),
        body("timeIn")
            .notEmpty()
            .withMessage("Time In is required")
            .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
            .withMessage("Invalid timeIn format. Use HH:mm:ss"),
        body("timeOut")
            .notEmpty()
            .withMessage("Time Out is required")
            .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
            .withMessage("Invalid timeOut format. Use HH:mm:ss"),
        body("status")
            .optional()
            .isIn(["scheduled", "completed", "canceled"])
            .withMessage("Invalid status"),
        body("notes").optional().isString().withMessage("Notes must be a string")
    ],
    createShift
);
router.put("/:id", authenticate, [param("id").isInt().withMessage("Invalid shift ID")], updateShift);
router.delete("/:id", authenticate, [param("id").isInt().withMessage("Invalid shift ID")], deleteShift);

// Shift Type Routes (Admin only)
router.get("/types", authenticate, getAllShiftTypes);
router.get("/types/:id", authenticate, [param("id").isInt().withMessage("Invalid shift type ID")], getShiftTypeById);
router.post(
    "/types",
    authenticate,
    authorize(["admin"]),
    [
        body("name").notEmpty().withMessage("Shift type name is required"),
        body("category").notEmpty().withMessage("Shift type category is required"),
        body("offDays").isInt().withMessage("Off days must be an integer")
    ],
    createShiftType
);
router.put(
    "/types/:id",
    authenticate,
    authorize(["admin"]),
    [param("id").isInt().withMessage("Invalid shift type ID")],
    updateShiftType
);
router.delete(
    "/types/:id",
    authenticate,
    authorize(["admin"]),
    [param("id").isInt().withMessage("Invalid shift type ID")],
    deleteShiftType
);

export default router;
/*
// shift-service/routes/shiftRoutes.js
import express from "express";
import {
    createShift,
    getAllShifts,
    getShiftById,
    updateShift,
    deleteShift
} from "../controllers/shiftController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { body, param } from "express-validator";

const router = express.Router();

// Get all shifts (Protected Route)
router.get("/", authenticate, getAllShifts);

// Get shift by ID (Protected Route)
router.get(
    "/:id",
    authenticate,
    [param("id").isInt().withMessage("Invalid shift ID")],
    getShiftById
);

// Create a new shift (Admin/Manager Only)
router.post(
    "/",
    authenticate,
    authorize(["admin", "manager"]),
    [
        body("userId").isInt().withMessage("Invalid User ID").notEmpty().withMessage("User ID is required"),
        body("date").notEmpty().withMessage("Date is required").isISO8601().withMessage("Invalid date format"),
        body("timeIn")
            .notEmpty()
            .withMessage("Time In is required")
            .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
            .withMessage("Invalid timeIn format. Use HH:mm:ss"),
        body("timeOut")
            .notEmpty()
            .withMessage("Time Out is required")
            .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
            .withMessage("Invalid timeOut format. Use HH:mm:ss"),
        body("status")
            .notEmpty()
            .withMessage("Status is required")
            .isIn(["scheduled", "completed", "canceled"])
            .withMessage("Invalid status"),
    ],
    createShift
);

// Update a shift (Protected Route)
router.put(
    "/:id",
    authenticate,
    [param("id").isInt().withMessage("Invalid shift ID")],
    updateShift
);

// Delete a shift (Protected Route)
router.delete(
    "/:id",
    authenticate,
    [param("id").isInt().withMessage("Invalid shift ID")],
    deleteShift
);

export default router;*/