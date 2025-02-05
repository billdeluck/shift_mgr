// notification-service/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Notification Service is Running!");
});

const PORT = process.env.PORT || 3005; // Use 3005 as specified
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Notification Service running on port ${PORT}`);
});