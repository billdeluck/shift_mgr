// user-service/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
    const extractedToken = token.split(" ")[1]; // Extract token
    const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach decoded user info
    next();
  } catch (error) {
    console.error("❌ Invalid token:", error);
    res.status(400).json({ error: "Invalid token" });
  }
};