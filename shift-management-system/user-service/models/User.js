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

        // Check for duplicate emails
        if (users.some((user) => user.email === userData.email)) {
            throw new Error("Email already exists");
        }

        const newUser = new User(
            userData.id || (users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1),
            userData.fullName,
            userData.email,
            userData.password,
            userData.role
        );
        db.users.push(newUser);
        setDb(db);
        await saveData();
        return newUser;
    }

    static async findAll() {
        return getDb().users || [];
    }

    static async findById(id) {
        return getDb().users.find((user) => user.id === parseInt(id));
    }

    static async update(id, updatedData) {
        const db = getDb();
        const index = (db.users || []).findIndex((user) => user.id === parseInt(id));
        if (index === -1) {
            return null;
        }
        db.users[index] = { ...db.users[index], ...updatedData };
        setDb(db);
        await saveData();
        return db.users[index];
    }

    static async delete(id) {
        const db = getDb();
        const index = (db.users || []).findIndex((user) => user.id === parseInt(id));
        if (index === -1) {
            return false;
        }
        db.users.splice(index, 1);
        setDb(db);
        await saveData();
        return true;
    }
}

export default User;