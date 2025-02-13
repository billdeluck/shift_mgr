// shift-service/db.js
import { promises as fs } from "fs";
import path from "path";

const __dirname = path.resolve();
const dataFilePath = path.join(__dirname, "data.json");
let db = { shifts: [], shiftTypes: [] }; // Initialize with both shifts and shiftTypes

export async function loadData() {
    try {
        console.log("Loading data from data.json...");
        const data = await fs.readFile(dataFilePath, "utf-8");
        db = JSON.parse(data);
        console.log("Data loaded successfully:", JSON.stringify(db));
    } catch (error) {
        if (error.code === "ENOENT") {
            console.log("⚠️ data.json not found. Creating empty file...");
            db = { shifts: [], shiftTypes: [] }; // Initialize with empty arrays
            await saveData();
        } else {
            console.error("❌ Error reading data.json:", error);
            throw error;
        }
    } finally {
        // Ensure both shifts and shiftTypes are initialized as arrays if they don't exist
        if (!db.shifts) {
            db.shifts = [];
        }
        if (!db.shiftTypes) {
            db.shiftTypes = [];
        }
    }
    console.log("✅ Shift Service data.json loaded.");
}

export async function saveData() {
    try {
        console.log("Saving data to data.json:", JSON.stringify(db));
        await fs.writeFile(dataFilePath, JSON.stringify(db, null, 2), "utf-8");
        
        console.log("✅ Shift Service data.json saved.");
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

loadData();