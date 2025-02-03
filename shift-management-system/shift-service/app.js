// shift-service/app.js
import express from "express";
import cors from "cors";
import shiftRoutes from "./routes/shiftRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/shifts", shiftRoutes);

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () =>
  console.log(`Shift Service running on port ${PORT}`)
);