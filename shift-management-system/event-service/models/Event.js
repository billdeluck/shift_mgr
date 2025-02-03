// event-service/models/Event.js
import dbModule from '../db.js';
const { getDb, setDb } = dbModule;

  class Event {
      constructor(eventType, eventTime, description, userId) {
         this.id = this.generateId();
        this.eventType = eventType;
       this.eventTime = eventTime;
        this.description = description;
       this.userId = userId
    }
     generateId() {
        const db = getDb();
        const events = db.events || [];
         if (events.length === 0) {
            return 1;
        }
         const maxId = Math.max(...events.map((event) => event.id));
        return maxId + 1;
     }
   static async create(event) {
        const db = getDb();
        const events = db.events || [];
         const newEvent = new Event(event.eventType, event.eventTime, event.description, event.userId);
        events.push(newEvent);
       setDb({ events });
     return newEvent;
   }
    static async findOne(condition){
        const db = getDb();
        const events = db.events || [];
         return events.find(event => {
           for (const key in condition){
               if(event[key] !== condition[key]){
                    return false;
                }
             }
            return true
      });
    }
    static async findAll() {
      const db = getDb();
     return db.events || [];
  }
     static async findById(id) {
      const db = getDb();
       const events = db.events || [];
         return events.find(event => event.id === parseInt(id));
     }
  }

   export default Event;