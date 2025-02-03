// event-service/app.js
import express from "express";
import cors from "cors";
import eventRoutes from "./routes/eventRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/events", eventRoutes);

// Start server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () =>
  console.log(`Event Service running on port ${PORT}`)
);