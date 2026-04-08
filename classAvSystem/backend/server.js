const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/booking");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});