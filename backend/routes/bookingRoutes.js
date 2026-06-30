const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const Parking = require("../models/Parking");
const { auth } = require("../middleware/auth");

// BOOK PARKING
router.post("/book", auth, async (req, res) => {
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

    const durationMs = end - start;
    const durationHours = durationMs / (1000 * 60 * 60);
    const roundedDuration = Math.round(durationHours * 100) / 100;
    const totalPrice = Math.round(roundedDuration * parking.price * 100) / 100;

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
      totalPrice,
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
router.get("/bookings", auth, async (req, res) => {
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
router.delete("/cancel/:id", auth, async (req, res) => {
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

module.exports = router;