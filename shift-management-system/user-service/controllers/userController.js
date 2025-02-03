// user-service/controllers/userController.js
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
}