// notification-service/models/Notification.js
import { getDb, setDb, saveData } from "../db.js";

class Notification {
  constructor(message, userId, type = "email", status = "pending") {
    this.id = this.generateId();
    this.message = message;
    this.userId = userId;
    this.type = type; // email, sms (future-proofing)
    this.status = status;
    this.sentAt = new Date();
  }

  generateId() {
    const db = getDb();
    const notifications = db.notifications || [];
    return notifications.length === 0 ? 1 : Math.max(...notifications.map(n => n.id)) + 1;
  }

  static async create(notificationData) {
    const db = getDb();
    const newNotification = new Notification(
      notificationData.message,
      notificationData.userId,
      notificationData.type,
      notificationData.status
    );

    db.notifications.push(newNotification);
    setDb(db); // Update the in-memory db object.
    await saveData(); // Persist to disk.
    return newNotification;
  }

  static async findAll() {
    return getDb().notifications || [];
  }

  static async findById(id) {
    return getDb().notifications.find(notification => notification.id === parseInt(id));
  }
}

export default Notification;