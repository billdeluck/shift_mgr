import { getDb, saveData } from "../db.js";

// Get all users
export const getAllUsers = async (req, res) => {
  const db = getDb();
  res.json(db.users);
};

// Get user by ID
export const getUserById = async (req, res) => {
  const db = getDb();
  const user = db.users.find((user) => user.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

// Update user
export const updateUser = async (req, res) => {
  const db = getDb();
  const userIndex = db.users.findIndex(
    (user) => user.id === parseInt(req.params.id)
  );
  if (userIndex === -1) return res.status(404).json({ error: "User not found" });

  db.users[userIndex] = { ...db.users[userIndex], ...req.body };
  await saveData();
  res.json(db.users[userIndex]);
};

// Delete user
export const deleteUser = async (req, res) => {
  const db = getDb();
  db.users = db.users.filter((user) => user.id !== parseInt(req.params.id));
  await saveData();
  res.json({ message: "User deleted successfully" });
};


/* // user-service/controllers/userController.js
import User from '../models/User.js';
import { validationResult } from 'express-validator';

export const getAllUsers = async (req, res) => {
   try {
       const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
       res.status(500).json({ error: 'Error getting users' });
  }
};
export const getUserById = async (req, res) => {
    const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
      }
    const { id } = req.params
   try {
    const user = await User.findById(id);
    if(!user){
        return res.status(404).json({error: `User with id ${id} not found`})
      }
        res.status(200).json(user);
      } catch (error) {
       res.status(500).json({ error: `Error getting user with id ${id}` });
     }
}
export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }
    try{
       const newUser = await User.create(req.body)
      res.status(201).json(newUser);
    }catch(err){
       console.log(err)
      res.status(500).json({error: "Error creating user"})
  }
}*/