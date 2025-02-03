// notification-service/controllers/notificationController.js
import Notification from '../models/Notification.js';
import { validationResult } from 'express-validator';

 export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
          res.status(200).json(notifications);
      } catch (error) {
          res.status(500).json({ error: 'Error getting notifications' });
       }
 };
  export const getNotificationById = async (req, res) => {
    const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
      }
      const { id } = req.params
     try {
        const notification = await Notification.findById(id);
         if(!notification){
              return res.status(404).json({error: `Notification with id ${id} not found`})
          }
           res.status(200).json(notification);
        } catch (error) {
        res.status(500).json({ error: `Error getting notification with id ${id}` });
      }
  };
  export const createNotification = async (req, res) => {
    const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }
   try{
        const newNotification = await Notification.create(req.body)
        res.status(201).json(newNotification);
     }catch(err){
        console.log(err)
         res.status(500).json({error: "Error creating notification"})
    }
 }