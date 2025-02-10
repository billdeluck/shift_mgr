// event-service/controllers/eventController.js
import Event from "../models/Event.js";
import { getDb, setDb, saveData } from "../db.js";
import { validationResult } from "express-validator";
import dotenv from "dotenv";

dotenv.config();

// Get all events
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll();
        console.log("✅ Retrieved all events");
        res.status(200).json(events);
    } catch (error) {
        console.error("❌ Error fetching events:", error);
        res.status(500).json({ error: "Failed to retrieve events" });
    }
};

// Get event by ID
export const getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        if (!event) {
            console.warn(`⚠️ Event with ID ${id} not found`);
            return res.status(404).json({ error: `Event with ID ${id} not found` });
        }
        console.log(`✅ Retrieved event with ID ${id}`);
        res.status(200).json(event);
    } catch (error) {
        console.error("❌ Error fetching event:", error);
        res.status(500).json({ error: `Failed to retrieve event with ID ${id}` });
    }
};

// Create a new event
export const createEvent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.warn("⚠️ Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { type, userId, shiftId, data } = req.body;

    try {
        const newEvent = await Event.create({
            type,
            userId,
            shiftId,
            data
        });

        console.log(`✅ Event created successfully with ID ${newEvent.id}`);
        res.status(201).json(newEvent);
    } catch (error) {
        console.error("❌ Error creating event:", error);
        res.status(500).json({ error: "Failed to create event" });
    }
};