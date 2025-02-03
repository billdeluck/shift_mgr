// notification-service/app.js
import express from "express";
import cors from "cors";
 import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/notifications", notificationRoutes);

// Start server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () =>
  console.log(`Notification Service running on port ${PORT}`)
);