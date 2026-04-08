const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    role: { type: String, default: "teacher" }
});

module.exports = mongoose.model("User", UserSchema);