// event-service/models/Event.js
import { getDb, setDb, saveData } from "../db.js";

// Define valid event types using constants (best practice)
export const EVENT_TYPES = {
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
  USER_DELETED: "USER_DELETED",
  SHIFT_CREATED: "SHIFT_CREATED",
  SHIFT_UPDATED: "SHIFT_UPDATED",
  SHIFT_DELETED: "SHIFT_DELETED",
  SHIFT_ASSIGNED: "SHIFT_ASSIGNED",
  SHIFT_UNASSIGNED: "SHIFT_UNASSIGNED",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILED: "LOGIN_FAILED",
  // Add more event types as needed
};

class Event {
  constructor(type, userId = null, shiftId = null, data = null) {
    this.id = this.generateId();
    this.type = type;
    this.userId = userId;
    this.shiftId = shiftId;
    this.data = data;
    this.timestamp = new Date();
  }

  generateId() {
    const db = getDb();
    const events = db.events || [];
    return events.length === 0 ? 1 : Math.max(...events.map(e => e.id)) + 1;
  }

  static async create(eventData) {
    const db = getDb();
    const newEvent = new Event(
      eventData.type,
      eventData.userId,
      eventData.shiftId,
      eventData.data
    );
    db.events.push(newEvent);
    setDb(db); // Update in-memory db.
    await saveData(); // Persist to disk.
    return newEvent;
  }

  static async findAll() {
    return getDb().events;
  }

  static async findById(id) {
    const db = getDb();
    return db.events.find(event => event.id === parseInt(id));
  }
     static async find(criteria) {
        const db = getDb();
        return db.events.filter(event =>
            Object.keys(criteria).every(key =>
                criteria[key] === event[key]
            )
        );
    }
}

export default Event;