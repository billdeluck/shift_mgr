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