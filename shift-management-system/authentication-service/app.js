import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Ensure JSON body parsing
app.use(express.urlencoded({ extended: true })); // Ensure URL-encoded body parsing

// ✅ Register authentication routes correctly
app.use("/api/auth", authRoutes);  

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Authentication Service is Running!");
});

// ✅ Use GitHub Codespaces Port
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
