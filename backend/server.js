require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const { auth } = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

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
  vehicle: String,
  totalPrice: Number, // ✅ ADDED
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

// ------------------ ROUTES ------------------

// TEST
app.get("/", (req, res) => {
  res.send("Backend running");
});

// TEST AUTH
app.get("/test", auth, (req, res) => {
  res.json(req.user);
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

// PARKING (UNCHANGED)
app.get("/parking", async (req, res) => {
  try {
    const { startTime, endTime } = req.query;

    const parkings = await Parking.find();
    const result = [];

    for (let p of parkings) {
      let overlapCount = 0;

      if (startTime && endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        overlapCount = await Booking.countDocuments({
          location: p.name,
          startTime: { $lt: end },
          endTime: { $gt: start }
        });

      } else {
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

// 🔥 BOOK PARKING (WITH PRICING)
app.post("/book", auth, async (req, res) => {
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

    // ✅ PRICE CALCULATION (SAFE)
    const durationMs = end - start;
    const durationHours = durationMs / (1000 * 60 * 60);
    const roundedDuration = Math.round(durationHours * 100) / 100;
    const totalPrice = Math.round(roundedDuration * parking.price * 100) / 100;

    // 🔥 PREVENT SAME USER DUPLICATE BOOKING
    const existing = await Booking.findOne({
      userId: req.user.id,
      location,
      startTime: { $lt: end },
      endTime: { $gt: start }
    });

    if (existing) {
      return res.json({
        success: false,
        message: "You already booked this slot"
      });
    }

    // 🔥 CHECK SLOT AVAILABILITY
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
      vehicle,
      totalPrice, // ✅ SAVED
      userId: req.user.id
    });

    await booking.save();

    res.json({
      success: true,
      message: "Booking successful",
      data: booking,
      totalPrice,
      duration: roundedDuration
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET BOOKINGS
app.get("/bookings", auth, async (req, res) => {
  try {
    let data;

    if (req.user.role === "admin") {
      data = await Booking.find();
    } else {
      data = await Booking.find({ userId: req.user.id });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CANCEL BOOKING
app.delete("/cancel/:id", auth, async (req, res) => {
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