const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/classBookingDB");
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.log("DB Error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;