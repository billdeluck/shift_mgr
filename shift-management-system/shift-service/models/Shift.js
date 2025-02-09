// shift-service/models/Shift.js
export default class Shift {
  constructor(id, userId, date, timeIn, timeOut, status = "scheduled") {
      this.id = id;
      this.userId = userId;
      this.date = date;
      this.timeIn = timeIn;
      this.timeOut = timeOut;
      this.status = status; // scheduled, swapped, cancelled, completed
  }
}

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

        // Check for shift overlap (customize this logic as needed)
        const existingOverlap = shifts.some((shift) => {
            const newShiftDate = new Date(shiftData.date);
            const existingShiftDate = new Date(shift.date);
            return (
                newShiftDate.getTime() === existingShiftDate.getTime() &&
                shift.userId === shiftData.userId &&
                (
                    (newShiftDate.getTime() >= new Date(shift.timeIn).getTime() && newShiftDate.getTime() < new Date(shift.timeOut).getTime()) ||
                    (new Date(shiftData.timeOut).getTime() > new Date(shift.timeIn).getTime() && new Date(shiftData.timeOut).getTime() <= new Date(shift.timeOut).getTime())
                )
            )
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
        return newShift;
    }

    static async findAll() {
        return getDb().shifts || [];
    }

    static async findById(id) {
        const shifts = getDb().shifts || [];
        return shifts.find((shift) => shift.id === parseInt(id));
    }

    static async update(id, updatedData) {
        const db = getDb();
        const index = db.shifts.findIndex((shift) => shift.id === parseInt(id));
        if (index === -1) {
            return null;
        }
        db.shifts[index] = { ...db.shifts[index], ...updatedData };
        setDb(db);
        await saveData();
        return db.shifts[index];
    }

    static async delete(id) {
        const db = getDb();
        const index = db.shifts.findIndex((shift) => shift.id === parseInt(id));
        if (index === -1) {
            return false;
        }
        db.shifts.splice(index, 1);
        setDb(db);
        await saveData();
        return true;
    }
}

export default Shift;
*/