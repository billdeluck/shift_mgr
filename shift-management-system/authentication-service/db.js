import { promises as fs } from "fs";
import path from "path";

const __dirname = path.resolve();
const dataFilePath = path.join(__dirname, "data.json");
let db = {};

// ✅ Load data from `data.json`
export async function loadData() {
  try {
    const fileData = await fs.readFile(dataFilePath, "utf-8");
    db = JSON.parse(fileData);
    console.log("✅ data.json loaded");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("⚠️ data.json not found. Initializing...");
      db = { users: [] };
      await saveData();
    } else {
      console.error("❌ Error reading data.json:", error);
    }
  }
}

// ✅ Save data to `data.json`
export async function saveData() {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(db, null, 2), "utf-8");
    console.log("✅ data.json saved");
  } catch (error) {
    console.error("❌ Error saving data.json:", error);
  }
}

// ✅ Get current database object
export function getDb() {
  return db;
}

// ✅ Update database object
export function setDb(newDb) {
  db = newDb;
}

// Load data when the module is imported
await loadData();