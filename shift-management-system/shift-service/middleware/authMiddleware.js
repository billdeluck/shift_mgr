// user-service/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization header is missing or invalid." });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Make user data available in req.user
        next();
    } catch (error) {
        console.error("❌ JWT Verification Failed:", error);
        res.status(401).json({ error: "Invalid or expired token." });
    }
};


export const authorize = (roles) => {
    return (req, res, next) => {
        //Check if the user has been authenticated
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        next();
    };
};