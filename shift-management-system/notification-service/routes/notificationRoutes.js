// notification-service/routes/notificationRoutes.js
import express from 'express';
import { getAllNotifications, getNotificationById, createNotification } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';
 import { body, param } from 'express-validator';

const router = express.Router();

router.get('/', authenticate, getAllNotifications);
router.get('/:id', authenticate, [
   param('id').isInt().withMessage('Notification id should be an integer')
],getNotificationById);
router.post('/', authenticate, [
 body('message').notEmpty().withMessage('Message is required'),
  body('userId').notEmpty().withMessage('User id is required'),
  body('sentAt').notEmpty().withMessage('Sent at time is required'),
   body('status').notEmpty().withMessage('Status is required')
], createNotification);

export default router;