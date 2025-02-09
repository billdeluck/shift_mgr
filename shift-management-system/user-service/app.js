// user-service/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("User Service is Running!");
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ User Service running on port ${PORT}`);
});

/*
// user-service/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔍 Temporary logging middleware for debugging
app.use((req, res, next) => {
  console.log(`📡 Incoming request: ${req.method} ${req.path}`);
  console.log("📦 Request body:", req.body);
  next();
});

// ✅ Register user routes
app.use("/api/users", userRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("User Service is Running!");
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ User Service running on port ${PORT}`);
});
*/
