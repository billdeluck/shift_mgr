// user-service/models/User.js
import { getDb, setDb, saveData } from "../db.js";

class User {
  constructor(id, fullName, email, password, role = "employee") {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static async create(userData) {
    const db = getDb();
    const users = db.users || [];

    const newUser = new User(
      userData.id, //From Authentication,
      userData.fullName,
      userData.email,
      userData.password,
      userData.role
    );

    db.users.push(newUser);
    setDb(db); // Update the in-memory db
    await saveData(); // Persist to data.json
    return newUser;
  }

  static async findAll() {
    const db = getDb();
    return db.users || [];
  }

  static async findById(id) {
    const db = getDb();
    const users = db.users || [];
    return users.find((user) => user.id === parseInt(id));
  }
}

export default User;