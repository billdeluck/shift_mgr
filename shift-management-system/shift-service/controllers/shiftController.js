// shift-service/controllers/shiftController.js
import { getDb, saveData } from "../db.js";
import Shift from "../models/Shift.js";

export const getAllShifts = async (req, res) => {
  const db = getDb();
  res.status(200).json(db.shifts || []); // Ensure shifts array exists
};

export const getShiftById = async (req, res) => {
  const db = getDb();
  const shiftId = parseInt(req.params.id);
  const shift = db.shifts.find(shift => shift.id === shiftId);

  if (!shift) {
    return res.status(404).json({ error: "Shift not found" });
  }

  res.status(200).json(shift);
};

export const createShift = async (req, res) => {
  const { userId, date, timeIn, timeOut } = req.body;
  const db = getDb();

  if (!db.shifts) { //Initialize the array if needed
    db.shifts = [];
  }
  const newShift = new Shift(db.shifts.length + 1, userId, date, timeIn, timeOut);
  db.shifts.push(newShift);
  await saveData();
  res.status(201).json(newShift);
};

export const updateShift = async (req, res) => {
  const shiftId = parseInt(req.params.id);
  const { userId, date, timeIn, timeOut } = req.body;
  const db = getDb();

  const shiftIndex = db.shifts.findIndex(shift => shift.id === shiftId);

  if (shiftIndex === -1) {
    return res.status(404).json({ error: "Shift not found" });
  }

  db.shifts[shiftIndex] = { ...db.shifts[shiftIndex], userId, date, timeIn, timeOut };
  await saveData();
  res.status(200).json(db.shifts[shiftIndex]);
};

export const deleteShift = async (req, res) => {
  const shiftId = parseInt(req.params.id);
  const db = getDb();

  const initialLength = db.shifts.length;
  db.shifts = db.shifts.filter(shift => shift.id !== shiftId);
  const newLength = db.shifts.length;

  if (newLength === initialLength) {
    return res.status(404).json({ error: "Shift not found" });
  }

  await saveData();
  res.status(204).send();
};

/*
// shift-service/controllers/shiftController.js
import Shift from '../models/Shift.js';
import { validationResult } from 'express-validator';

export const getAllShifts = async (req, res) => {
  try {
      const shifts = await Shift.findAll();
      res.status(200).json(shifts);
   } catch (error) {
       res.status(500).json({ error: 'Error getting shifts' });
  }
};
  export const getShiftById = async (req, res) => {
      const errors = validationResult(req);
        if(!errors.isEmpty()){
          return res.status(400).json({errors: errors.array()})
       }
      const { id } = req.params
     try {
      const shift = await Shift.findById(id);
      if(!shift){
          return res.status(404).json({error: `Shift with id ${id} not found`})
        }
          res.status(200).json(shift);
        } catch (error) {
         res.status(500).json({ error: `Error getting shift with id ${id}` });
       }
  }
export const createShift = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
  }
   try{
        const newShift = await Shift.create(req.body)
        res.status(201).json(newShift);
    }catch(err){
       console.log(err)
        res.status(500).json({error: "Error creating shift"})
   }
}
export const swapShift = async (req, res) => {
   const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
      }
    const { shiftId, newUserId } = req.body;
    try{
      const shift = await Shift.findById(shiftId);
       if (!shift) return res.status(404).json({ error: 'Shift not found' });
       shift.userId = newUserId;
       shift.status = "swapped";
       const db = getDb();
       const shifts = db.shifts.map((sh) => sh.id === shift.id ? shift : sh);
       setDb({...db, shifts: shifts });
       res.status(200).json({ message: "Shift swapped successfully", shift: shift });
    }catch(err){
      console.log(err)
      res.status(500).json({error: "Error swapping shift"})
   }
 };
 */