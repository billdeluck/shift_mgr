// shift-service/models/Shift.js
import { getDb, setDb, saveData } from "../db.js";

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

        shifts.push(newShift);
        setDb({ shifts });
        await saveData();
        console.log(`✅ Created a new shift for user ID ${shiftData.userId}`);
        return newShift;
    }

    static async findAll() {
        const shifts = getDb().shifts || [];
        console.log(`✅ Retrieved all shifts: ${shifts.length} shifts found`);
        return shifts;
    }

    static async findById(id) {
        const shifts = getDb().shifts || [];
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
        const index = db.shifts.findIndex((shift) => shift.id === parseInt(id));

        if (index === -1) {
            console.warn(`⚠️ Shift with ID ${id} not found for update`);
            return null;
        }

        db.shifts[index] = { ...db.shifts[index], ...updatedData };
        setDb(db);
        await saveData();
        console.log(`✅ Updated shift with ID ${id}`);
        return db.shifts[index];
    }

    static async delete(id) {
        const db = getDb();
        const index = db.shifts.findIndex((shift) => shift.id === parseInt(id));

        if (index === -1) {
            console.warn(`⚠️ Shift with ID ${id} not found for deletion`);
            return false;
        }

        db.shifts.splice(index, 1);
        setDb(db);
        await saveData();
        console.log(`✅ Deleted shift with ID ${id}`);
        return true;
    }
}

export default Shift;

/*
// shift-service/models/Shift.js
import { getDb, setDb, saveData } from "../db.js";

class Shift {
    constructor(id, userId, date, timeIn, timeOut, status = "scheduled") {
        this.id = id;
        this.userId = userId;
        this.date = date;
        this.timeIn = timeIn;
        this.timeOut = timeOut;
        this.status = status;
    }

    static async create(shiftData) {
        const db = getDb();
        const shifts = db.shifts || [];

        // Validate shift data
        if (!shiftData.userId || !shiftData.date || !shiftData.timeIn || !shiftData.timeOut || !shiftData.status) {
            throw new Error("Missing required shift data");
        }

        // Check for shift overlap
        const existingOverlap = shifts.some((shift) => {
            const newShiftDate = new Date(shiftData.date);
            const existingShiftDate = new Date(shift.date);

            return (
                newShiftDate.getTime() === existingShiftDate.getTime() &&
                shift.userId === shiftData.userId &&
                (
                    (new Date(shiftData.timeIn).getTime() >= new Date(shift.timeIn).getTime() && new Date(shiftData.timeIn).getTime() < new Date(shift.timeOut).getTime()) ||
                    (new Date(shiftData.timeOut).getTime() > new Date(shift.timeIn).getTime() && new Date(shiftData.timeOut).getTime() <= new Date(shift.timeOut).getTime())
                )
            );
        });

        if (existingOverlap) {
            throw new Error("Shift overlaps with an existing shift for this user.");
        }

        const newShift = new Shift(
            shifts.length ? Math.max(...shifts.map((s) => s.id)) + 1 : 1,
            shiftData.userId,
            shiftData.date,
            shiftData.timeIn,
            shiftData.timeOut,
            shiftData.status
        );

        shifts.push(newShift);
        setDb({ shifts });
        await saveData();
        console.log(`✅ Created a new shift for user ID ${shiftData.userId}`);
        return newShift;
    }

    static async findAll() {
        const shifts = getDb().shifts || [];
        console.log(`✅ Retrieved all shifts: ${shifts.length} shifts found`);
        return shifts;
    }

    static async findById(id) {
        const shifts = getDb().shifts || [];
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
        const index = db.shifts.findIndex((shift) => shift.id === parseInt(id));

        if (index === -1) {
            console.warn(`⚠️ Shift with ID ${id} not found for update`);
            return null;
        }

        db.shifts[index] = { ...db.shifts[index], ...updatedData };
        setDb(db);
        await saveData();
        console.log(`✅ Updated shift with ID ${id}`);
        return db.shifts[index];
    }

    static async delete(id) {
        const db = getDb();
        const index = db.shifts.findIndex((shift) => shift.id === parseInt(id));

        if (index === -1) {
            console.warn(`⚠️ Shift with ID ${id} not found for deletion`);
            return false;
        }

        db.shifts.splice(index, 1);
        setDb(db);
        await saveData();
        console.log(`✅ Deleted shift with ID ${id}`);
        return true;
    }
}

export default Shift;
*/