const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    block: String,
    floor: String,
    room: String,
    date: String,
    timeSlot: String,
    teacher: String
});

module.exports = mongoose.model("Booking", bookingSchema);