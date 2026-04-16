require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ------------------ CONNECT DB ------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log("DB Error:", err));


// ------------------ SCHEMAS ------------------
const Parking = mongoose.model("Parking", {
  name: String,
  totalSlots: Number,
  price: Number
});

const Booking = mongoose.model("Booking", {
  location: String,
  startTime: Date,
  endTime: Date,
  name: String,
  vehicle: String
});


// ------------------ ROUTES ------------------

// TEST
app.get("/", (req, res) => {
  res.send("Backend running");
});


// ADD SAMPLE PARKING
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


// 🔥 FINAL FIXED PARKING ROUTE (TIME BASED)
app.get("/parking", async (req, res) => {
  try {
    const { startTime, endTime } = req.query;

    console.log("REQ QUERY:", req.query); // DEBUG

    const parkings = await Parking.find();
    const result = [];

    for (let p of parkings) {

      let overlapCount = 0;

      // ✅ IF USER SELECTED TIME
      if (startTime && endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        overlapCount = await Booking.countDocuments({
          location: p.name,
          startTime: { $lt: end },
          endTime: { $gt: start }
        });

      } else {
        // ✅ DEFAULT → CURRENT TIME
        const now = new Date();

        overlapCount = await Booking.countDocuments({
          location: p.name,
          startTime: { $lt: now },
          endTime: { $gt: now }
        });
      }

      result.push({
        name: p.name,
        price: p.price,
        totalSlots: p.totalSlots,
        availableSlots: Math.max(0, p.totalSlots - overlapCount)
      });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 BOOK PARKING (CORRECT)
app.post("/book", async (req, res) => {
  try {
    const { location, startTime, endTime, name, vehicle } = req.body;

    const parking = await Parking.findOne({ name: location });

    if (!parking) {
      return res.json({ success: false, message: "Parking not found" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      return res.json({
        success: false,
        message: "Invalid time range"
      });
    }

    const overlapCount = await Booking.countDocuments({
      location,
      startTime: { $lt: end },
      endTime: { $gt: start }
    });

    if (overlapCount >= parking.totalSlots) {
      return res.json({
        success: false,
        message: "Parking Full for selected time"
      });
    }

    const booking = new Booking({
      location,
      startTime: start,
      endTime: end,
      name,
      vehicle
    });

    await booking.save();

    res.json({
      success: true,
      message: "Booking successful",
      data: booking
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


// CANCEL BOOKING
app.delete("/cancel/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Booking cancelled successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});