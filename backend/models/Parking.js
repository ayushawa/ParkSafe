const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  totalSlots: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Parking", parkingSchema);