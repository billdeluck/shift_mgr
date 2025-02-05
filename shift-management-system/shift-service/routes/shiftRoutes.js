// shift-service/routes/shiftRoutes.js
import express from "express";
import {
  getAllShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
} from "../controllers/shiftController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all shifts (requires authentication)
router.get("/", authenticate, getAllShifts);

// Get shift by ID (requires authentication)
router.get("/:id", authenticate, getShiftById);

// Create a new shift (requires authentication and 'admin' role)
router.post("/", authenticate, authorize(['admin', 'manager']), createShift);

// Update shift (requires authentication)
router.put("/:id", authenticate, updateShift);

// Delete shift (requires authentication and 'admin' role)
router.delete("/:id", authenticate, authorize(['admin', 'manager']), deleteShift);

export default router;

/*
// shift-service/routes/shiftRoutes.js
import express from 'express';
import { getAllShifts, getShiftById, createShift, swapShift } from '../controllers/shiftController.js';
  import { authenticate } from '../middleware/authMiddleware.js';
import { body, param } from 'express-validator';

const router = express.Router();
router.get('/', authenticate, getAllShifts)
router.get('/:id', authenticate, [
    param('id').isInt().withMessage('Shift id should be an integer')
],getShiftById)
router.post('/', authenticate, [
  body('userId').notEmpty().withMessage("User id is required"),
    body('date').notEmpty().withMessage("Date is required"),
  body('timeIn').notEmpty().withMessage('Time In is required'),
  body('timeOut').notEmpty().withMessage("Time out is required")
], createShift);
router.post('/swap', authenticate,[
    body('shiftId').notEmpty().withMessage("Shift id is required"),
    body('newUserId').notEmpty().withMessage("New User Id is Required")
] ,swapShift);

export default router
*/