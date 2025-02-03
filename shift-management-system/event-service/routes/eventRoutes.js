// event-service/routes/eventRoutes.js
import express from 'express';
import { getAllEvents, getEventById, createEvent } from '../controllers/eventController.js';
import { authenticate } from '../middleware/authMiddleware.js';
 import { body, param } from 'express-validator';

const router = express.Router();

router.get('/', authenticate, getAllEvents);
router.get('/:id', authenticate, [
  param('id').isInt().withMessage('Event id should be an integer')
], getEventById);
 router.post('/', authenticate,[
      body('eventType').notEmpty().withMessage('Event Type is required'),
    body('eventTime').notEmpty().withMessage('Event Time is required'),
      body('description').notEmpty().withMessage('Description is required'),
     body('userId').notEmpty().withMessage("User Id is Required")
  ], createEvent);
export default router;