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

        db.shiftTypes.push(newShiftType);
        setDb(db);
        await saveData();
        console.log(`✅ Created a new shift type with ID ${newShiftType.id}`);
        return newShiftType;
    }

    static async findAll() {
        const shiftTypes = getDb().shiftTypes || [];
        console.log(`✅ Retrieved all shift types: ${shiftTypes.length} shift types found`);
        return shiftTypes;
    }

    static async findById(id) {
        const shiftTypes = getDb().shiftTypes || [];
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
        const index = db.shiftTypes.findIndex((shiftType) => shiftType.id === parseInt(id));

        if (index === -1) {
            console.warn(`⚠️ Shift type with ID ${id} not found for update`);
            return null;
        }

        db.shiftTypes[index] = { ...db.shiftTypes[index], ...updatedData };
        setDb(db);
        await saveData();
        console.log(`✅ Updated shift type with ID ${id}`);
        return db.shiftTypes[index];
    }

    static async delete(id) {
        const db = getDb();
        const index = db.shiftTypes.findIndex((shiftType) => shiftType.id === parseInt(id));

        if (index === -1) {
            console.warn(`⚠️ Shift type with ID ${id} not found for deletion`);
            return false;
        }

        db.shiftTypes.splice(index, 1);
        setDb(db);
        await saveData();
        console.log(`✅ Deleted shift type with ID ${id}`);
        return true;
    }
}

export default ShiftType;