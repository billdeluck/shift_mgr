// user-service/routes/userRoutes.js
import express from "express";
import { getAllUsers, getUserById, updateUser, deleteUser, createUser } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { body, param } from "express-validator";

const router = express.Router();

// Protected routes (require JWT authentication)
router.get("/", authenticate, getAllUsers);
router.get("/:id", authenticate, [param("id").isInt().withMessage("Invalid user ID")], getUserById);
router.put("/:id", authenticate, [param("id").isInt().withMessage("Invalid user ID")], updateUser);
router.delete("/:id", authenticate, [param("id").isInt().withMessage("Invalid user ID")], deleteUser);

// Unprotected route for creating a user (called by authentication-service)
router.post(
    "/",
    [
        body("fullName").notEmpty().withMessage("Full name is required"),
        body("email")
            .isEmail()
            .withMessage("Valid email is required")
            .normalizeEmail(),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
        body("role").isIn(["admin", "manager", "employee"]).withMessage("Invalid role"),
    ],
    createUser
);

export default router;