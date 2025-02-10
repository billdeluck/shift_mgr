// shift-service/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export const authenticate = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.warn("⚠️ Missing or invalid authorization header");
        return res.status(401).json({ error: "Authorization header is missing or invalid." });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ JWT Verification Failed:", error);
        res.status(401).json({ error: "Invalid or expired token." });
    }
};

export const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            console.warn("⚠️ Unauthorized access attempt");
            return res.status(403).json({ error: "Unauthorized" });
        }
        next();
    };
};