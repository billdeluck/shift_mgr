// report-service/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (req, res, next) => {
  const token = req.header("Authorization");

  // Check if token exists
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Extract token from the header
    const tokenString = token.split(" ")[1];

    // Verify the token
    const verified = jwt.verify(tokenString, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = verified;
    console.log("✅ Authentication middleware passed!") // Add this line
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("❌ Invalid token:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired." });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ error: "Invalid token signature." });
    }
     if (error.name === "NotBeforeError") {
            return res.status(401).json({ error: "Token not yet valid." });
        }

    return res.status(400).json({ error: "Invalid token." });
  }
};