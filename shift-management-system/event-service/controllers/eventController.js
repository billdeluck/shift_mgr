// event-service/controllers/eventController.js
import Event from '../models/Event.js';
import { validationResult } from 'express-validator';

export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll();
       res.status(200).json(events);
      } catch (error) {
         res.status(500).json({ error: 'Error getting events' });
     }
};
 export const getEventById = async (req, res) => {
    const errors = validationResult(req);
      if(!errors.isEmpty()){
         return res.status(400).json({errors: errors.array()})
       }
      const { id } = req.params
     try {
        const event = await Event.findById(id);
        if(!event){
            return res.status(404).json({error: `Event with id ${id} not found`})
          }
           res.status(200).json(event);
        } catch (error) {
         res.status(500).json({ error: `Error getting event with id ${id}` });
       }
 };
 export const createEvent = async (req, res) => {
    const errors = validationResult(req);
   if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
   }
   try{
        const newEvent = await Event.create(req.body)
         res.status(201).json(newEvent);
    }catch(err){
        console.log(err)
      res.status(500).json({error: "Error creating event"})
     }
 }