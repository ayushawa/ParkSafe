require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const parkingRoutes = require("./routes/parkingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const { auth } = require("./middleware/auth");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/", parkingRoutes);
app.use("/", bookingRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Protected Test Route
app.get("/test", auth, (req, res) => {
  res.json(req.user);
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});