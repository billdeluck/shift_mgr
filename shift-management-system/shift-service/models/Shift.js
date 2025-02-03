// shift-service/models/Shift.js
import dbModule from '../db.js';
const { getDb, setDb } = dbModule;
  class Shift {
       constructor(userId, date, timeIn, timeOut, status = "scheduled") {
        this.id = this.generateId();
        this.userId = userId;
        this.date = date;
        this.timeIn = timeIn;
        this.timeOut = timeOut;
        this.status = status
      }
       generateId() {
         const db = getDb();
          const shifts = db.shifts || [];
          if (shifts.length === 0) {
             return 1;
            }
         const maxId = Math.max(...shifts.map((shift) => shift.id));
         return maxId + 1;
     }

      static async create(shift) {
      const db = getDb();
        const shifts = db.shifts || [];
         const newShift = new Shift(shift.userId, shift.date, shift.timeIn, shift.timeOut, shift.status);
       shifts.push(newShift);
        setDb({ shifts });
      return newShift;
    }

    static async findOne(condition){
      const db = getDb();
         const shifts = db.shifts || [];
       return shifts.find(shift => {
            for (const key in condition){
              if(shift[key] !== condition[key]){
                  return false;
                }
             }
          return true
     });
    }
    static async findAll() {
    const db = getDb();
    return db.shifts || [];
   }
   static async findById(id) {
     const db = getDb();
     const shifts = db.shifts || [];
       return shifts.find(shift => shift.id === parseInt(id));
   }
 }
export default Shift;