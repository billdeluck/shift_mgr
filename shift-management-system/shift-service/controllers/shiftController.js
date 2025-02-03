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