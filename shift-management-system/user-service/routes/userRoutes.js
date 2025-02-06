// user-service/routes/userRoutes.js
import express from "express";
import { getAllUsers, getUserById, updateUser, deleteUser, createUser } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all users (Protected)
router.get("/", authenticate, getAllUsers);

// ✅ Get user by ID (Protected)
router.get("/:id", authenticate, getUserById);

//Added Create User (Authentication must add the user on creation)
router.post("/", createUser);

// ✅ Update user details (Protected) Not implemented.
router.put("/:id", authenticate, updateUser);

// ✅ Delete user (Protected). Not implemented.
router.delete("/:id", authenticate, deleteUser);

export default router;