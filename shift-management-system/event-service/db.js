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
    if (!db.events) {
      db.events = [];
    }
    console.log("✅ data.json loaded. Events:", db.events);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("⚠️ data.json not found, initializing.");
      db = { events: [] };
      await saveData(); // Create the initial file.
    } else {
      console.error("❌ Error reading data.json:", error);
      throw error; // Re-throw to handle at a higher level.
    }
  }
}

export async function saveData() {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(db, null, 2), "utf-8");
    console.log("✅ data.json saved.");
  } catch (error) {
    console.error("❌ Error saving data.json:", error);
    throw error; // Crucial: Re-throw to handle upstream.
  }
}

export function getDb() {
  return db;
}

export function setDb(newDb) {
  db = newDb;
}

await loadData(); // Load data on startup.