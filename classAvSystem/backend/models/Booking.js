const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    block: String,
    floor: String,
    room: String,
    date: String,
    timeSlot: String,
    teacher: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", BookingSchema);