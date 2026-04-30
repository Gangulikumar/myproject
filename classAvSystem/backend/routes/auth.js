const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
    const { name, role } = req.body;

    if (!name) {
        return res.json({ success: false });
    }

    res.json({ name, role });
});

module.exports = router;