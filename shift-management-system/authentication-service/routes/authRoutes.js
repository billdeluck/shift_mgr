// authentication-service/routes/authRoutes.js
import express from "express";
import { register, login, updateUser, deleteUser } from "../controllers/authController.js";
import { body, param } from "express-validator";

const router = express.Router();

// Registration route
router.post(
    "/register",
    [
        body("fullName").notEmpty().withMessage("Full name is required"),
        body("email")
            .isEmail()
            .withMessage("Valid email is required")
            .normalizeEmail(),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
    ],
    register
);

// Login route
router.post(
    "/login",
    [
        body("email")
            .isEmail()
            .withMessage("Valid email is required")
            .normalizeEmail(),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ],
    login
);

// Routes for user-service to update and delete users
router.put(
    "/update/:id",
    param("id").isInt().withMessage("User ID must be an integer"),
    updateUser
);
router.delete(
    "/delete/:id",
    param("id").isInt().withMessage("User ID must be an integer"),
    deleteUser
);

export default router;