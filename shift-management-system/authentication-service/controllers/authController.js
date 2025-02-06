// authentication-service/controllers/authController.js
import { getDb, setDb, saveData } from "../db.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { generateAccessToken } from "../middleware/authMiddleware.js";
import fetch from "node-fetch";

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullName, email, password, role } = req.body;
  const db = getDb();

  if (db.users.find(user => user.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User(db.users.length + 1, fullName, email, hashedPassword, role);
  db.users.push(newUser);

  await saveData();
  //New User Call
  try {
    const userCreationResponse = await fetch(process.env.USER_SERVICE_URL + '/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
       // 'Authorization': `Bearer ${generateAccessToken(newUser)}`, //Comment this out, you don't need this
      },
      body: JSON.stringify({
        id: newUser.id, // Transfer User ID to userservice
        fullName: newUser.fullName,
        email: newUser.email,
        password: hashedPassword, // Send hashed pass to user service
        role: newUser.role
      }),
    });

    if (!userCreationResponse.ok) {
      console.error('❌ Failed to create user in user-service:', userCreationResponse.status, await userCreationResponse.text());
      // Consider what to do if this fails.  Maybe log the error, but still
      // return success for user creation?  Or return an error to the client?
    } else {
      console.log('✅ Successfully created user in user-service');
    }
  } catch (error) {
    console.error('❌ Error creating user in user-service:', error);
    // Handle the error (log, retry, etc.)
  }

  res.status(201).json({ user: newUser, token: generateAccessToken(newUser) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const user = db.users.find(user => user.email === email);

  if (!user) return res.status(404).json({ error: "User not found" });
  if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ error: "Invalid credentials" });

  res.status(200).json({ user, token: generateAccessToken(user) });
};
export const updateUser = async (req, res) => {
  const db = getDb();
  const userIndex = db.users.findIndex((user) => user.id === parseInt(req.params.id));

  if (userIndex === -1) return res.status(404).json({ error: "User not found" });

  // ✅ Update user details.  Only allow specific fields to be updated:
  db.users[userIndex] = { ...db.users[userIndex], ...req.body };
  await saveData();

  res.json({ message: "User updated successfully in authentication-service", user: db.users[userIndex] });
};

export const deleteUser = async (req, res) => {
  const db = getDb();
  const userId = parseInt(req.params.id);

  if (!db.users.some((user) => user.id === userId)) {
    return res.status(404).json({ error: "User not found" });
  }

  db.users = db.users.filter((user) => user.id !== userId);
  await saveData();

  res.json({ message: "User deleted successfully from authentication-service" });
};