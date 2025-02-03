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