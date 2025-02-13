// shift-service/models/Shift.js
import { getDb, setDb, saveData } from "../db.js";
import ShiftType from "./ShiftType.js"; // Import ShiftType model

class Shift {
    constructor(id, shiftTypeId, userId, date, timeIn, timeOut, status = "scheduled", notes = null) {
        this.id = id;
        this.shiftTypeId = shiftTypeId;
        this.userId = userId;
        this.date = date;
        this.timeIn = timeIn;
        this.timeOut = timeOut;
        this.status = status;
        this.notes = notes;
    }

    static async create(shiftData) {
        const db = getDb();
        console.log("Current DB state before shift creation:", JSON.stringify(db));
        const shifts = db.shifts || [];

        // Validate shift data
        if (!shiftData.shiftTypeId || !shiftData.userId || !shiftData.date || !shiftData.timeIn || !shiftData.timeOut) {
            throw new Error("Missing required shift data");
        }

        const newShift = new Shift(
            shifts.length ? Math.max(...shifts.map((s) => s.id)) + 1 : 1,
            shiftData.shiftTypeId,
            shiftData.userId,
            shiftData.date,
            shiftData.timeIn,
            shiftData.timeOut,
            shiftData.status || "scheduled", // Default status
            shiftData.notes || null
        );

        console.log("New shift created:", JSON.stringify(newShift));
        shifts.push(newShift); // Push the new shift to the local array
        db.shifts = shifts; // Update the db object with new value
        setDb(db);
        console.log("DB state after push:", JSON.stringify(db));  // Add this line
        await saveData();
        console.log("DB state after save:", JSON.stringify(db));  // Add this line
        console.log(`✅ Created a new shift for user ID ${shiftData.userId}`);
        return newShift;
    }
    static async calculateReturnDate(shiftId, shiftDurationDays = 10) {
        const db = getDb();
        const shifts = db.shifts || [];

        const shift = shifts.find(shift => shift.id === parseInt(shiftId));

        if (!shift) {
            console.warn(`⚠️ Shift with ID ${shiftId} not found for calculating return date`);
            return null;
        }
        // Fetch the shift type to get the off-days
        const shiftType = await ShiftType.findById(shift.shiftTypeId);
        if (!shiftType) {
            console.warn(`⚠️ Shift type with ID ${shift.shiftTypeId} not found for calculating return date`);
            return null;
        }

        const offDays = shiftType.offDays;

        // Calculate the shift end date
        const startDate = new Date(shift.date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + shiftDurationDays);

        // Calculate the return date
        const returnDate = new Date(endDate);
        returnDate.setDate(endDate.getDate() + offDays);

        console.log(`✅ Calculated return date for shift ID ${shiftId}: ${returnDate}`);
        return returnDate;

    }

    static async findAll() {
        const db = getDb();
        const shift = db.shifts || [];
        console.log(`✅ Retrieved all shift: ${shift.length} shift found`);
        return shift;
    }

    static async findById(id) {
        const db = getDb();
        const shifts = db.shifts || [];
        const shift = shifts.find((shift) => shift.id === parseInt(id));
        if (shift) {
            console.log(`✅ Found shift with ID ${id}`);
            return shift;
        } else {
            console.warn(`⚠️ Shift with ID ${id} not found`);
            return null;
        }
    }

    static async update(id, updatedData) {
        const db = getDb();
        const shifts = db.shifts || [];
        const index = shifts.findIndex((shift) => shift.id === parseInt(id));

        if (index === -1) {
            console.warn(`⚠️ Shift with ID ${id} not found for update`);
            return null;
        }

        // Update the shift type properties
        shifts[index] = { ...shifts[index], ...updatedData };
        db.shifts = shifts; // Update the db object with new value
        setDb(db);
        await saveData();
        console.log(`✅ Updated shift with ID ${id}`);
        return shifts[index];
    }

    static async delete(id) {
        const db = getDb();
        const shifts = db.shifts || [];
        const index = shifts.findIndex((shift) => shift.id === parseInt(id));

        if (index === -1) {
            console.warn(`⚠️ Shift with ID ${id} not found for deletion`);
            return false;
        }

        shifts.splice(index, 1);
        db.shifts = shifts; // Update the db object with new value
        setDb(db);
        await saveData();
        console.log(`✅ Deleted shift with ID ${id}`);
        return true;
    }
}

export default Shift;