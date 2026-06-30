const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  vehicle: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);