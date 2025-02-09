// shift-service/controllers/shiftController.js
import Shift from "../models/Shift.js";
import { getDb, setDb, saveData } from "../db.js";
import { validationResult } from "express-validator";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// Helper function to fetch user data
async function fetchUserData(userId, token) {
    const response = await fetch(`${process.env.USER_SERVICE_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
        const message = await response.text();
        throw new Error(`Failed to fetch user data: ${response.status} ${message}`);
    }
    return await response.json();
}

export const getAllShifts = async (req, res) => {
    try {
        const shifts = await Shift.findAll();
        res.status(200).json(shifts);
    } catch (error) {
        console.error("❌ Error fetching shifts:", error);
        res.status(500).json({ error: "Failed to retrieve shifts" });
    }
};

export const getShiftById = async (req, res) => {
    const { id } = req.params;
    try {
        const shift = await Shift.findById(id);
        if (!shift) {
            return res.status(404).json({ error: `Shift with ID ${id} not found` });
        }
        res.status(200).json(shift);
    } catch (error) {
        console.error("❌ Error fetching shift:", error);
        res.status(500).json({ error: `Failed to retrieve shift with ID ${id}` });
    }
};

export const createShift = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, date, timeIn, timeOut } = req.body;
    const token = req.header("Authorization").split(" ")[1];

    try {
        //Fetch user data to verify user exists
        const userData = await fetchUserData(userId, token);
        const newShift = new Shift(
            (getDb().shifts || []).length + 1,
            userId,
            date,
            timeIn,
            timeOut
        );
        getDb().shifts.push(newShift);
        await saveData();

        // Emit event (if event service is implemented)
        try {
            const eventResponse = await fetch(`${process.env.EVENT_SERVICE_URL}/api/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: "SHIFT_CREATED",
                    userId: userId,
                    shiftId: newShift.id,
                    data: newShift
                })
            });

            if (!eventResponse.ok) {
                console.error("❌ Error creating event:", await eventResponse.text());
            }
        } catch (e) {
            console.error("❌ Error connecting to event service:", e)
        }

        res.status(201).json(newShift);
    } catch (error) {
        console.error("❌ Error creating shift:", error);
        res.status(500).json({ error: "Failed to create shift" });
    }
};

export const updateShift = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const updatedShift = await Shift.update(id, req.body);
        if (!updatedShift) {
            return res.status(404).json({ error: `Shift with ID ${id} not found` });
        }
        res.status(200).json(updatedShift);
    } catch (error) {
        console.error("❌ Error updating shift:", error);
        res.status(500).json({ error: "Failed to update shift" });
    }
};

export const deleteShift = async (req, res) => {
    const { id } = req.params;
    try {
        const success = await Shift.delete(id);
        if (!success) {
            return res.status(404).json({ error: `Shift with ID ${id} not found` });
        }
        res.status(200).json({ message: "Shift deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting shift:", error);
        res.status(500).json({ error: "Failed to delete shift" });
    }
};