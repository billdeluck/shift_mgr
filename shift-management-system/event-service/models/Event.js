// event-service/models/Event.js
import { getDb, setDb, saveData } from "../db.js";

class Event {
    constructor(id, type, userId, shiftId, data) {
        this.id = id;
        this.type = type;
        this.userId = userId;
        this.shiftId = shiftId;
        this.data = data;
    }

    static async create(eventData) {
        const db = getDb();
        const events = db.events || [];

        // Validate event data
        if (!eventData.type || !eventData.userId) {
            throw new Error("Missing required event data");
        }

        const newEvent = new Event(
            events.length ? Math.max(...events.map((e) => e.id)) + 1 : 1,
            eventData.type,
            eventData.userId,
            eventData.shiftId,
            eventData.data
        );

        events.push(newEvent);
        setDb({ events });
        await saveData();
        console.log(`✅ Created a new event with type ${eventData.type} for user ID ${eventData.userId}`);
        return newEvent;
    }

    static async findAll() {
        const events = getDb().events || [];
        console.log(`✅ Retrieved all events: ${events.length} events found`);
        return events;
    }

    static async findById(id) {
        const events = getDb().events || [];
        const event = events.find((event) => event.id === parseInt(id));
        if (event) {
            console.log(`✅ Found event with ID ${id}`);
            return event;
        } else {
            console.warn(`⚠️ Event with ID ${id} not found`);
            return null;
        }
    }
}

export default Event;