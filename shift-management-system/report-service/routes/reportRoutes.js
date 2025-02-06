// report-service/routes/reportRoutes.js
import express from "express";
import { generateReport, getAllReports, getReportsById } from "../controllers/reportController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { body, param } from "express-validator";

const router = express.Router();

// Define report validation requirements
const reportValidationRules = [
    body("reportType")
        .notEmpty().withMessage("Report type is required")
        .isIn(["shiftEvents", "users", "shifts"]).withMessage("Invalid report type"),
    body("startDate").notEmpty().withMessage("Start date is required").isISO8601().withMessage("Invalid start date format"),
    body("endDate").notEmpty().withMessage("End date is required").isISO8601().withMessage("Invalid end date format"),
    body("userId").optional().isInt().withMessage("User ID must be an integer"),
    body("format")
        .notEmpty().withMessage("Report format is required")
        .isIn(["json", "csv", "pdf"]).withMessage("Invalid report format"),
];

// Routes
router.post("/", authenticate, reportValidationRules, generateReport);
router.get("/", authenticate, getAllReports);
router.get("/:id", authenticate, param("id").isInt().withMessage("Report ID must be an integer"), getReportsById);

export default router;