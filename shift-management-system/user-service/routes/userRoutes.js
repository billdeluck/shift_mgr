import express from 'express';
import { getAllUsers, getUserById, createUser } from '../controllers/userController.js';
import { authenticate } from '../../common/middleware/authMiddleware.js';
import { body, param } from 'express-validator';
const router = express.Router();

router.get('/', authenticate, getAllUsers)
router.get('/:id', authenticate,[
    param('id').isInt().withMessage('User id should be an integer')
 ], getUserById)
router.post('/', authenticate, [
   body('fullName').notEmpty().withMessage('Full name is required'),
   body('email').isEmail().withMessage('Invalid email format')
 ], createUser)

 export default router;