const mongoose = require("mongoose");

const intersectionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  status: { type: String, enum: ["normal", "congested", "busy", "jammed"], default: "normal" },
  volume: { type: Number, default: 0 },
  avgDelay: { type: Number, default: 0 }
});

module.exports = mongoose.model("Intersection", intersectionSchema);
