// authentication-service/controllers/authController.js
import { getDb, setDb, saveData } from "../db.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { generateAccessToken } from "../middleware/authMiddleware.js";
import fetch from "node-fetch";

export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, role } = req.body;
    const db = getDb();

    try {
        if (db.users.find((user) => user.email === email)) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User(db.users.length + 1, fullName, email, hashedPassword, role);
        db.users.push(newUser);
        await saveData();

        // Send user data to user-service
        try {
            const response = await fetch(`${process.env.USER_SERVICE_URL}/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                console.error(
                    "❌ Error sending user data to user-service:",
                    await response.text()
                );
                // Consider retry logic or a more sophisticated error handling strategy here.
            }
        } catch (error) {
            console.error("❌ Failed to connect to user-service:", error);
            // Consider retry logic or a more sophisticated error handling strategy here.
        }


        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
            token: generateAccessToken(newUser)
        });
    } catch (error) {
        console.error("❌ Error during user registration:", error);
        res.status(500).json({ error: "Failed to register user." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const db = getDb();
    const user = db.users.find((user) => user.email === email);

    try {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.status(200).json({ user, token: generateAccessToken(user) });
    } catch (error) {
        console.error("❌ Error during login:", error);
        res.status(500).json({ error: "Server error during login." });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { fullName, role } = req.body;
    const db = getDb();
    const userIndex = db.users.findIndex(user => user.id === parseInt(id));

    try {
        if (userIndex === -1) {
            return res.status(404).json({ error: "User not found" });
        }

        db.users[userIndex] = { ...db.users[userIndex], fullName, role };
        await saveData();

        res.json({ message: "User updated successfully", user: db.users[userIndex] });
    } catch (error) {
        console.error("❌ Error updating user:", error);
        res.status(500).json({ error: "Failed to update user." });
    }
};

export const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    const db = getDb();

    try {
        if (!db.users.some((user) => user.id === userId)) {
            return res.status(404).json({ error: "User not found" });
        }

        db.users = db.users.filter((user) => user.id !== userId);
        await saveData();

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user." });
    }
};