// report-service/app.js
import express from "express";
import cors from "cors";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/reports", reportRoutes);

// Start server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () =>
  console.log(`Report Service running on port ${PORT}`)
);