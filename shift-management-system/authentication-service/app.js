// authentication-service/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { getDb, loadData, saveData } from "./db.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register authentication routes
app.use("/api/auth", authRoutes);

// Health check route
app.get("/", (req, res) => {
    res.send("Authentication Service is Running!");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Authentication Service running on port ${PORT}`);
});