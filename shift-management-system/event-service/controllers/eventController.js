// event-service/controllers/eventController.js
import Event, { EVENT_TYPES } from "../models/Event.js";
import { validationResult } from "express-validator";

// Create a new event
export const createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type, userId, shiftId, data } = req.body;

  try {
    const newEvent = await Event.create({ type, userId, shiftId, data });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("❌ Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    res.status(500).json({ error: "Failed to retrieve events" });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("❌ Error fetching event:", error);
    res.status(500).json({ error: "Failed to retrieve event" });
  }
};

//find events by criteria
export const findEvents = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const events = await Event.find(req.body);
        res.status(200).json(events);
    } catch (e) {
        res.status(500).json({message: "Failed to find Events", error: e})
    }
}