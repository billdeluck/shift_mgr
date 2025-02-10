// shift-service/controllers/shiftController.js
import Shift from "../models/Shift.js";
import ShiftType from "../models/ShiftType.js"; // Import ShiftType model
import { getDb, setDb, saveData } from "../db.js";
import { validationResult } from "express-validator";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const userServiceUrl = process.env.USER_SERVICE_URL;
const eventServiceUrl = process.env.EVENT_SERVICE_URL;
const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL; // Notification service URL

// Helper function to fetch user data (to verify user exists)
async function fetchUserData(userId, token) {
    try {
        const response = await fetch(`${userServiceUrl}/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const message = await response.text();
            console.error(`❌ Failed to fetch user data for user ID ${userId}: ${response.status} ${message}`);
            throw new Error(`Failed to fetch user data: ${response.status} ${message}`);
        }

        const userData = await response.json();
        console.log(`✅ User data fetched successfully for user ID ${userId}`);
        return userData;
    } catch (error) {
        console.error(`❌ Error fetching user data for user ID ${userId}:`, error);
        throw error; // Re-throw to be handled by the controller
    }
}

// Helper function to create event (requires event-service)
async function createEvent(eventData, token) {
    try {
        const response = await fetch(`${eventServiceUrl}/api/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(eventData)
        });

        if (!response.ok) {
            const message = await response.text();
            console.error(`❌ Failed to create event: ${response.status} ${message}`);
            throw new Error(`Failed to create event: ${response.status} ${message}`);
        }

        console.log("✅ Event created successfully");
        return await response.json(); // Return the created event
    } catch (error) {
        console.error("❌ Error creating event:", error);
        throw error; // Re-throw to be handled by the controller
    }
}

// Helper function to send email notification
async function sendShiftAssignmentNotification(userId, shift, token) {
    try {
        const userResponse = await fetch(`${userServiceUrl}/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!userResponse.ok) {
            const message = await userResponse.text();
            console.error(`❌ Failed to fetch user data for notification: ${userResponse.status} ${message}`);
            throw new Error(`Failed to fetch user data for notification: ${userResponse.status} ${message}`);
        }

        const userData = await userResponse.json();

        // Fetch shift type details
        const shiftType = await ShiftType.findById(shift.shiftTypeId);
        if (!shiftType) {
            throw new Error(`Shift type with ID ${shift.shiftTypeId} not found`);
        }

        const notificationMessage = `You have been assigned to a ${shiftType.name} shift on ${shift.date} from ${shift.timeIn} to ${shift.timeOut}.`;

        const response = await fetch(`${notificationServiceUrl}/api/notifications/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: userId,
                email: userData.email,
                message: notificationMessage
            })
        });

        if (!response.ok) {
            const message = await response.text();
            console.error(`❌ Failed to send email notification: ${response.status} ${message}`);
            throw new Error(`Failed to send email notification: ${response.status} ${message}`);
        }

        console.log("✅ Email notification sent successfully");
        return await response.json();
    } catch (error) {
        console.error("❌ Error sending email notification:", error);
        throw error; // Re-throw to be handled by the controller
    }
}

// Get all shifts
export const getAllShifts = async (req, res) => {
    try {
        const shifts = await Shift.findAll();
        console.log("✅ Retrieved all shifts");
        res.status(200).json(shifts);
    } catch (error) {
        console.error("❌ Error fetching shifts:", error);
        res.status(500).json({ error: "Failed to retrieve shifts" });
    }
};

// Get shift by ID
export const getShiftById = async (req, res) => {
    const { id } = req.params;
    try {
        const shift = await Shift.findById(id);
        if (!shift) {
            console.warn(`⚠️ Shift with ID ${id} not found`);
            return res.status(404).json({ error: `Shift with ID ${id} not found` });
        }
        console.log(`✅ Retrieved shift with ID ${id}`);
        res.status(200).json(shift);
    } catch (error) {
        console.error("❌ Error fetching shift:", error);
        res.status(500).json({ error: `Failed to retrieve shift with ID ${id}` });
    }
};

// Create a new shift
export const createShift = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.warn("⚠️ Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { shiftTypeId, userId, date, timeIn, timeOut, status, notes } = req.body;
    const token = req.header("Authorization").split(" ")[1]; // Extract token

    try {
        // Verify user exists
        await fetchUserData(userId, token);

        // Create the shift
        const newShift = await Shift.create({
            shiftTypeId,
            userId,
            date,
            timeIn,
            timeOut,
            status,
            notes
        });

        // Send shift assignment notification
        await sendShiftAssignmentNotification(userId, newShift, token);

        // Create an event
        await createEvent({
            type: "SHIFT_CREATED",
            userId: userId,
            shiftId: newShift.id,
            data: newShift
        }, token);

        console.log(`✅ Shift created successfully with ID ${newShift.id}`);
        res.status(201).json(newShift);
    } catch (error) {
        console.error("❌ Error creating shift:", error);
        res.status(500).json({ error: "Failed to create shift" });
    }
};

// Update an existing shift
export const updateShift = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.warn("⚠️ Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedShift = await Shift.update(id, req.body);
        if (!updatedShift) {
            console.warn(`⚠️ Shift with ID ${id} not found`);
            return res.status(404).json({ error: `Shift with ID ${id} not found` });
        }

        console.log(`✅ Shift with ID ${id} updated successfully`);
        res.status(200).json(updatedShift);
    } catch (error) {
        console.error("❌ Error updating shift:", error);
        res.status(500).json({ error: "Failed to update shift" });
    }
};

// Delete a shift
export const deleteShift = async (req, res) => {
    const { id } = req.params;

    try {
        const success = await Shift.delete(id);
        if (!success) {
            console.warn(`⚠️ Shift with ID ${id} not found`);
            return res.status(404).json({ error: `Shift with ID ${id} not found` });
        }

        console.log(`✅ Shift with ID ${id} deleted successfully`);
        res.status(200).json({ message: "Shift deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting shift:", error);
        res.status(500).json({ error: "Failed to delete shift" });
    }
};

// Get all shift types
export const getAllShiftTypes = async (req, res) => {
    try {
        const shiftTypes = await ShiftType.findAll();
        console.log("✅ Retrieved all shift types");
        res.status(200).json(shiftTypes);
    } catch (error) {
        console.error("❌ Error fetching shift types:", error);
        res.status(500).json({ error: "Failed to retrieve shift types" });
    }
};

// Get shift type by ID
export const getShiftTypeById = async (req, res) => {
    const { id } = req.params;
    try {
        const shiftType = await ShiftType.findById(id);
        if (!shiftType) {
            console.warn(`⚠️ Shift type with ID ${id} not found`);
            return res.status(404).json({ error: `Shift type with ID ${id} not found` });
        }
        console.log(`✅ Retrieved shift type with ID ${id}`);
        res.status(200).json(shiftType);
    } catch (error) {
        console.error("❌ Error fetching shift type:", error);
        res.status(500).json({ error: `Failed to retrieve shift type with ID ${id}` });
    }
};

// Create a new shift type (Admin only)
export const createShiftType = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.warn("⚠️ Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, category, offDays } = req.body;

    try {
        const newShiftType = await ShiftType.create({
            name,
            category,
            offDays
        });

        console.log(`✅ Shift type created successfully with ID ${newShiftType.id}`);
        res.status(201).json(newShiftType);
    } catch (error) {
        console.error("❌ Error creating shift type:", error);
        res.status(500).json({ error: "Failed to create shift type" });
    }
};

// Update an existing shift type (Admin only)
export const updateShiftType = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.warn("⚠️ Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedShiftType = await ShiftType.update(id, req.body);
        if (!updatedShiftType) {
            console.warn(`⚠️ Shift type with ID ${id} not found`);
            return res.status(404).json({ error: `Shift type with ID ${id} not found` });
        }

        console.log(`✅ Shift type with ID ${id} updated successfully`);
        res.status(200).json(updatedShiftType);
    } catch (error) {
        console.error("❌ Error updating shift type:", error);
        res.status(500).json({ error: "Failed to update shift type" });
    }
};

// Delete a shift type (Admin only)
export const deleteShiftType = async (req, res) => {
    const { id } = req.params;

    try {
        const success = await ShiftType.delete(id);
        if (!success) {
            console.warn(`⚠️ Shift type with ID ${id} not found`);
            return res.status(404).json({ error: `Shift type with ID ${id} not found` });
        }

        console.log(`✅ Shift type with ID ${id} deleted successfully`);
        res.status(200).json({ message: "Shift type deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting shift type:", error);
        res.status(500).json({ error: "Failed to delete shift type" });
    }
};

/*
// shift-service/controllers/shiftController.js
import Shift from "../models/Shift.js";
import { getDb, setDb, saveData } from "../db.js";
import { validationResult } from "express-validator";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const userServiceUrl = process.env.USER_SERVICE_URL;
const eventServiceUrl = process.env.EVENT_SERVICE_URL;

// Helper function to fetch user data (to verify user exists)
async function fetchUserData(userId, token) {
    try {
        const response = await fetch(`${userServiceUrl}/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const message = await response.text();
            console.error(`❌ Failed to fetch user data for user ID ${userId}: ${response.status} ${message}`);
            throw new Error(`Failed to fetch user data: ${response.status} ${message}`);
        }

        const userData = await response.json();
        console.log(`✅ User data fetched successfully for user ID ${userId}`);
        return userData;
    } catch (error) {
        console.error(`❌ Error fetching user data for user ID ${userId}:`, error);
        throw error; // Re-throw to be handled by the controller
    }
}

// Helper function to create event (requires event-service)
async function createEvent(eventData, token) {
    try {
        const response = await fetch(`${eventServiceUrl}/api/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(eventData)
        });

        if (!response.ok) {
            const message = await response.text();
            console.error(`❌ Failed to create event: ${response.status} ${message}`);
            throw new Error(`Failed to create event: ${response.status} ${message}`);
        }

        console.log("✅ Event created successfully");
        return await response.json(); // Return the created event
    } catch (error) {
        console.error("❌ Error creating event:", error);
        throw error; // Re-throw to be handled by the controller
    }
}

// Get all shifts
export const getAllShifts = async (req, res) => {
    try {
        const shifts = await Shift.findAll();
        console.log("✅ Retrieved all shifts");
        res.status(200).json(shifts);
    } catch (error) {
        console.error("❌ Error fetching shifts:", error);
        res.status(500).json({ error: "Failed to retrieve shifts" });
    }
};

// Get shift by ID
export const getShiftById = async (req, res) => {
    const { id } = req.params;
    try {
        const shift = await Shift.findById(id);
        if (!shift) {
            console.warn(`⚠️ Shift with ID ${id} not found`);
            return res.status(404).json({ error: `Shift with ID ${id} not found` });
        }
        console.log(`✅ Retrieved shift with ID ${id}`);
        res.status(200).json(shift);
    } catch (error) {
        console.error("❌ Error fetching shift:", error);
        res.status(500).json({ error: `Failed to retrieve shift with ID ${id}` });
    }
};

// Create a new shift
export const createShift = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.warn("⚠️ Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, date, timeIn, timeOut, status } = req.body;
    const token = req.header("Authorization").split(" ")[1]; // Extract token

    try {
        // Verify user exists
        await fetchUserData(userId, token);

        // Create the shift
        const newShift = await Shift.create({
            userId,
            date,
            timeIn,
            timeOut,
            status
        });

        // Create an event
        await createEvent({
            type: "SHIFT_CREATED",
            userId: userId,
            shiftId: newShift.id,
            data: newShift
        }, token);

        console.log(`✅ Shift created successfully with ID ${newShift.id}`);
        res.status(201).json(newShift);
    } catch (error) {
        console.error("❌ Error creating shift:", error);
        res.status(500).json({ error: "Failed to create shift" });
    }
};

// Update an existing shift
export const updateShift = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.warn("⚠️ Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedShift = await Shift.update(id, req.body);
        if (!updatedShift) {
            console.warn(`⚠️ Shift with ID ${id} not found`);
            return res.status(404).json({ error: `Shift with ID ${id} not found` });
        }

        console.log(`✅ Shift with ID ${id} updated successfully`);
        res.status(200).json(updatedShift);
    } catch (error) {
        console.error("❌ Error updating shift:", error);
        res.status(500).json({ error: "Failed to update shift" });
    }
};

// Delete a shift
export const deleteShift = async (req, res) => {
    const { id } = req.params;

    try {
        const success = await Shift.delete(id);
        if (!success) {
            console.warn(`⚠️ Shift with ID ${id} not found`);
            return res.status(404).json({ error: `Shift with ID ${id} not found` });
        }

        console.log(`✅ Shift with ID ${id} deleted successfully`);
        res.status(200).json({ message: "Shift deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting shift:", error);
        res.status(500).json({ error: "Failed to delete shift" });
    }
};*/