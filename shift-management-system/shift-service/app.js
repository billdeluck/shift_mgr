// shift-service/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import shiftRoutes from "./routes/shiftRoutes.js";
import { getDb, loadData, saveData } from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/shifts", shiftRoutes);

app.get("/", (req, res) => {
    res.send("Shift Service is Running!");
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Shift Service running on port ${PORT}`);
});

// Load data on startup
loadData();