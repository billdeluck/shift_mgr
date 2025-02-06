import express from "express";
import { register, login, updateUser, deleteUser } from "../controllers/authController.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    body("fullName").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  register
);
router.post("/login", login);
   // ✅ Update user (Called by user-service)
router.put("/update/:id", updateUser);

// ✅ Delete user (Called by user-service)
router.delete("/delete/:id", deleteUser);

export default router;