// event-service/db.js
import { promises as fs } from "fs";
import path from "path";

const __dirname = path.resolve();
const dataFilePath = path.join(__dirname, "data.json");
let db = { events: [] };

export async function loadData() {
    try {
        const data = await fs.readFile(dataFilePath, "utf-8");
        db = JSON.parse(data);
        console.log("✅ Event Service data.json loaded.");
    } catch (error) {
        if (error.code === "ENOENT") {
            console.log("⚠️ data.json not found. Creating empty file...");
            await saveData();
        } else {
            console.error("❌ Error reading data.json:", error);
            throw error;
        }
    }
}

export async function saveData() {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(db, null, 2), "utf-8");
        console.log("✅ Event Service data.json saved.");
    } catch (error) {
        console.error("❌ Error saving data.json:", error);
        throw error;
    }
}

export function getDb() {
    return db;
}

export function setDb(newDb) {
    db = newDb;
}

loadData(); // Load data on startup