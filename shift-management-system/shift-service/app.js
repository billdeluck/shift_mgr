// shift-service/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import shiftRoutes from "./routes/shiftRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Ensure JSON body parsing
app.use(express.urlencoded({ extended: true }));

// Register shift routes
app.use("/api/shifts", shiftRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Shift Service is Running!");
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Shift Service running on port ${PORT}`);
});
/*
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
*/