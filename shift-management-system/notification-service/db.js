// notification-service/db.js
import { promises as fs } from "fs";
import path from "path";

const __dirname = path.resolve();
const dataFilePath = path.join(__dirname, "data.json");
let db = { notifications: [] };

// Load data from `data.json`
export async function loadData() {
  try {
    const fileData = await fs.readFile(dataFilePath, "utf-8");
    db = JSON.parse(fileData);

    if (!db.notifications) {
      db.notifications = [];
    }
    console.log("✅ data.json loaded with notifications:", db.notifications);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("⚠️ data.json not found. Initializing...");
      db = { notifications: [] };
      await saveData(); // Initialize the file
    } else {
      console.error("❌ Error reading data.json:", error);
    }
  }
}

// Save data to `data.json`
export async function saveData() {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(db, null, 2), "utf-8");
    console.log("✅ data.json saved");
  } catch (error) {
    console.error("❌ Error saving data.json:", error);
    // Consider throwing the error here, or handling it more robustly,
    // so calling functions are aware of the failure.
    throw error;
  }
}

// Get current database object
export function getDb() {
  return db;
}

// Update database object
export function setDb(newDb) {
  db = newDb;
}

// Load data when the module is imported
await loadData();