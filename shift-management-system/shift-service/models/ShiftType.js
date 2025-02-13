// shift-service/models/ShiftType.js
import { getDb, setDb, saveData } from "../db.js";

class ShiftType {
    constructor(id, name, category, offDays) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.offDays = offDays;
    }

    static async create(shiftTypeData) {
        const db = getDb();
        console.log("Current DB state before creation:", JSON.stringify(db));
        const shiftTypes = db.shiftTypes || [];

        if (!shiftTypeData.name || !shiftTypeData.category || !shiftTypeData.offDays) {
            throw new Error("Missing required shift type data");
        }

        const newShiftType = new ShiftType(
            shiftTypes.length ? Math.max(...shiftTypes.map((st) => st.id)) + 1 : 1,
            shiftTypeData.name,
            shiftTypeData.category,
            shiftTypeData.offDays
        );

        console.log("New shift type created:", JSON.stringify(newShiftType));

        shiftTypes.push(newShiftType); // Push the new shift type to the local array
        db.shiftTypes = shiftTypes; // Update the db object with new value
        setDb(db);
        await saveData();
        console.log(`✅ Created a new shift type with ID ${newShiftType.id}`);
        return newShiftType;
    }

    static async findAll() {
        const db = getDb();
        const shiftTypes = db.shiftTypes || [];
        console.log(`✅ Retrieved all shift types: ${shiftTypes.length} shift types found`);
        return shiftTypes;
    }

    static async findById(id) {
        const db = getDb();
        const shiftTypes = db.shiftTypes || [];
        const shiftType = shiftTypes.find((shiftType) => shiftType.id === parseInt(id));
        if (shiftType) {
            console.log(`✅ Found shift type with ID ${id}`);
            return shiftType;
        } else {
            console.warn(`⚠️ Shift type with ID ${id} not found`);
            return null;
        }
    }

    static async update(id, updatedData) {
        const db = getDb();
        const shiftTypes = db.shiftTypes || [];
        const index = shiftTypes.findIndex((shiftType) => shiftType.id === parseInt(id));

        if (index === -1) {
            console.warn(`⚠️ Shift type with ID ${id} not found for update`);
            return null;
        }

        // Update the shift type properties
        shiftTypes[index] = { ...shiftTypes[index], ...updatedData };
        db.shiftTypes = shiftTypes; // Update the db object with new value
        setDb(db);
        await saveData();
        console.log(`✅ Updated shift type with ID ${id}`);
        return shiftTypes[index];
    }

    static async delete(id) {
        const db = getDb();
        const shiftTypes = db.shiftTypes || [];
        const index = shiftTypes.findIndex((shiftType) => shiftType.id === parseInt(id));

        if (index === -1) {
            console.warn(`⚠️ Shift type with ID ${id} not found for deletion`);
            return false;
        }

        shiftTypes.splice(index, 1);
        db.shiftTypes = shiftTypes; // Update the db object with new value
        setDb(db);
        await saveData();
        console.log(`✅ Deleted shift type with ID ${id}`);
        return true;
    }
}

export default ShiftType;