// report-service/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
    res.send("Report Service is Running!");
});

const PORT = process.env.PORT || 3004; // Use a different port
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Report Service running on port ${PORT}`);
});
/*
// report-service/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
    res.send("Report Service is Running!");
});

const PORT = process.env.PORT || 3004; // Use a different port
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Report Service running on port ${PORT}`);
});

*/