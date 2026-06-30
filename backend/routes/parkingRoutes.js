const express = require("express");
const router = express.Router();

const Parking = require("../models/Parking");
const Booking = require("../models/Booking");

// ADD SAMPLE PARKING
router.get("/add-parking", async (req, res) => {
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

// GET PARKING
router.get("/parking", async (req, res) => {
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

module.exports = router;