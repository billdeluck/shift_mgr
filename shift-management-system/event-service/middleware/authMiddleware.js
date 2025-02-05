// event-service/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
    const extractedToken = token.split(" ")[1];
    req.user = jwt.verify(extractedToken, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.error("❌ Invalid token:", error); // Log for debugging
    res.status(400).json({ error: "Invalid token" });
  }
};