// notification-service/models/Notification.js
import dbModule from '../db.js';
const { getDb, setDb } = dbModule;

    class Notification {
         constructor(message, userId, sentAt, status) {
            this.id = this.generateId();
          this.message = message;
         this.userId = userId;
           this.sentAt = sentAt;
           this.status = status;
          }
        generateId() {
           const db = getDb();
           const notifications = db.notifications || [];
             if (notifications.length === 0) {
                 return 1;
              }
           const maxId = Math.max(...notifications.map((notification) => notification.id));
             return maxId + 1;
        }

     static async create(notification) {
       const db = getDb();
       const notifications = db.notifications || [];
       const newNotification = new Notification(notification.message, notification.userId, notification.sentAt, notification.status);
        notifications.push(newNotification);
        setDb({ notifications });
        return newNotification;
        }
       static async findOne(condition){
         const db = getDb();
         const notifications = db.notifications || [];
         return notifications.find(notification => {
          for (const key in condition){
              if(notification[key] !== condition[key]){
                return false;
               }
            }
            return true
          });
         }
          static async findAll() {
          const db = getDb();
          return db.notifications || [];
         }
      static async findById(id) {
        const db = getDb();
           const notifications = db.notifications || [];
            return notifications.find(notification => notification.id === parseInt(id));
          }
   }
    export default Notification;