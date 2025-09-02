const mongoose = require('mongoose');

const intersectionSchema = new mongoose.Schema({
  id: Number,          // or mongoose.Schema.Types.ObjectId
  name: String,
  lat: Number,
  lng: Number,
  status: {
    type: String,
    enum: ['normal','busy','congested','critical','offline','unknown'],
    default: 'unknown'
  },
  volume: Number,
  avgDelay: Number
});

const Intersection = mongoose.model('Intersection', intersectionSchema);

module.exports = Intersection;
