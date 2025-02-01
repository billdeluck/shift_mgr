import { getDb, setDb, saveData } from "../db.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { generateAccessToken } from "../middleware/authMiddleware.js";

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
