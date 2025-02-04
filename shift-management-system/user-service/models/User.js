export default class User {
  constructor(id, fullName, email, password, role = "employee") {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}







/* 
// user-service/models/User.js
import dbModule from '../db.js';
const { getDb, setDb } = dbModule;
class User {
   constructor(fullName, email, role = "employee") {
        this.id = this.generateId();
        this.fullName = fullName;
        this.email = email;
        this.role = role
        this.createdAt = new Date();
    }
  generateId() {
       const db = getDb();
      const users = db.users || [];
      if (users.length === 0) {
        return 1;
      }
    const maxId = Math.max(...users.map((user) => user.id));
      return maxId + 1;
  }
    static async create(user) {
      const db = getDb();
      const users = db.users || [];
        const newUser = new User(user.fullName, user.email, user.role);
      users.push(newUser);
        setDb({ users });
      return newUser;
    }
     static async findOne(condition) {
       const db = getDb();
         const users = db.users || [];
      return users.find(user => {
         for (const key in condition){
              if (user[key] !== condition[key]){
                return false;
                }
          }
        return true
      });
  }
    static async findAll() {
    const db = getDb();
    return db.users || [];
  }
  static async findById(id) {
    const db = getDb();
    const users = db.users || [];
    return users.find(user => user.id === parseInt(id));
  }
}
export default User; */