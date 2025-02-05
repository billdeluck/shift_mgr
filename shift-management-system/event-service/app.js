// event-service/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import eventRoutes from "./routes/eventRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);

app.get("/", (req, res) => {
  res.send("Event Service is Running!");
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Event Service running on port ${PORT}`);
});