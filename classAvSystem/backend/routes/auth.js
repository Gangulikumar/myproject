const express = require("express");
const router = express.Router();
const User = require("../models/User.js");// relative path is important

// Simple login (no password)
router.post("/login", async (req, res) => {
    try {
        const { name, role } = req.body;
        if (!name) return res.status(400).send("Name required");

        let user = await User.findOne({ name });
        if (!user) {
            user = await User.create({ name, role });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;