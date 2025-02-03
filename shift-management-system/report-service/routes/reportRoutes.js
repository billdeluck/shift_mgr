// report-service/routes/reportRoutes.js
import express from 'express';
import { getAllReports, getReportById, createReport } from '../controllers/reportController.js';
import { authenticate } from '../middleware/authMiddleware.js';
 import { body, param } from 'express-validator';
const router = express.Router();

router.get('/', authenticate, getAllReports);
router.get('/:id', authenticate, [
    param('id').isInt().withMessage('Report id should be an integer')
], getReportById);
router.post('/', authenticate, [
    body('reportType').notEmpty().withMessage('Report Type is required'),
     body('generatedAt').notEmpty().withMessage('Generated at time is required'),
     body('data').notEmpty().withMessage('Data is Required')
], createReport);


export default router;