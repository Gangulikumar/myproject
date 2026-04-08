const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Add booking (PREVENT DUPLICATE)
router.post("/add", async (req, res) => {
    try {
        const { room, date, timeSlot } = req.body;

        const existing = await Booking.findOne({ room, date, timeSlot });

        if (existing) {
            return res.json({ success: false, message: "Room already booked!" });
        }

        const booking = await Booking.create(req.body);
        res.json({ success: true, booking });

    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// Get all bookings
router.get("/", async (req, res) => {
    const data = await Booking.find().sort({ date: -1 });
    res.json(data);
});

module.exports = router;