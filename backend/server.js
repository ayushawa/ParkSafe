require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// CONNECT DB
async function connectDB() {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI)
    console.log("DB connected");
  } catch (err) {
    console.log("DB ERROR:", err.message);
  }
}

connectDB();

//  PARKING SCHEMA
const parkingSchema = new mongoose.Schema({
  name: String,
  totalSlots: Number,
  price: Number
});

const Parking = mongoose.model("Parking", parkingSchema);

// BOOKING SCHEMA
const bookingSchema = new mongoose.Schema({
  location: String,
  startTime: Date,
  endTime: Date
});

const Booking = mongoose.model("Booking", bookingSchema);

// TEST
app.get("/", (req, res) => {
  res.send("Backend running");
});


app.get("/add-parking", async (req, res) => {
  await Parking.deleteMany();

  await Parking.insertMany([
  { name: "Metro A", totalSlots: 50, price: 20 },
  { name: "Metro UP", totalSlots: 80, price: 25 },
  { name: "Rajiv Chowk", totalSlots: 100, price: 40 },
  { name: "Huda City Centre", totalSlots: 120, price: 30 },
  { name: "Noida Sector 18", totalSlots: 90, price: 15 },
  { name: "Dwarka Sector 21", totalSlots: 60, price: 18 },
  { name: "Kashmere Gate", totalSlots: 150, price: 35 },

  { name: "Test Parking 1", totalSlots: 5, price: 10 },
  { name: "Test Parking 2", totalSlots: 5, price: 12 },
  { name: "Test Parking 3", totalSlots: 7, price: 15 }
]);

  res.send("Parking data added");
});

//  GET PARKING WITH AVAILABLE SLOTS
app.get("/parking", async (req, res) => {
  try {
    const parkings = await Parking.find();

    const result = [];

    for (let p of parkings) {
      // count ACTIVE bookings (current time)
      const now = new Date();

      const activeBookings = await Booking.find({
        location: p.name,
        startTime: { $lt: now },
        endTime: { $gt: now }
      });

      const availableSlots = p.totalSlots - activeBookings.length;

      result.push({
        name: p.name,
        price: p.price,
        totalSlots: p.totalSlots,
        availableSlots
      });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/book", async (req, res) => {
  try {
    const { location, startTime, endTime } = req.body;

    const parking = await Parking.findOne({ name: location });

    if (!parking) {
      return res.json({ success: false, message: "Parking not found" });
    }

    const overlappingBookings = await Booking.find({
      location,
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) }
    });

    if (overlappingBookings.length >= parking.totalSlots) {
      return res.json({
        success: false,
        message: "Parking Full for selected time"
      });
    }

    const newBooking = new Booking({
      location,
      startTime,
      endTime
    });

    await newBooking.save();

    res.json({
      success: true,
      message: "Booking successful",
      data: newBooking
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET BOOKINGS
app.get("/bookings", async (req, res) => {
  const data = await Booking.find();
  res.json(data);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});