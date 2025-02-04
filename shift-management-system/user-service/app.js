import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Register user routes
app.use("/api/users", userRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("User Service is Running!");
});

// ✅ Use GitHub Codespaces Port
const PORT = process.env.PORT || 3002;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ User Service running on port ${PORT}`);
});

/*
// user-service/app.js
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () =>
  console.log(`User Service running on port ${PORT}`)
);
*/