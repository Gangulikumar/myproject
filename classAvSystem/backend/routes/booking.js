const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// ✅ ADD BOOKING WITH DUPLICATE CHECK
router.post("/add", async (req, res) => {
    try {
        const { room, date, timeSlot } = req.body;

        // 🔥 CHECK DUPLICATE BOOKING
        const existing = await Booking.findOne({
            room,
            date,
            timeSlot
        });

        if(existing){
            return res.json({
                success: false,
                message: "❌ Room already booked for this time!"
            });
        }

        const booking = new Booking(req.body);
        await booking.save();

        res.json({ success: true });

    } catch (err) {
        res.json({ success: false, message: "Server error" });
    }
});

// ✅ GET ALL BOOKINGS
router.get("/", async (req, res) => {
    try {
        const data = await Booking.find();
        res.json(data);
    } catch (err) {
        res.json([]);
    }
});

module.exports = router;