import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all users (Protected)
router.get("/", authenticate, getAllUsers);

// ✅ Get user by ID (Protected)
router.get("/:id", authenticate, getUserById);

// ✅ Update user details (Protected)
router.put("/:id", authenticate, updateUser);

// ✅ Delete user (Protected)
router.delete("/:id", authenticate, deleteUser);

export default router;


/*import express from 'express';
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
 */