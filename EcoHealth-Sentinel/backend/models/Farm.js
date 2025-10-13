// ==================== models/Farm.js ====================
const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Farm name is required']
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  area: {
    type: Number,
    required: [true, 'Farm area is required']
  },
  areaUnit: {
    type: String,
    enum: ['acres', 'hectares', 'sqm'],
    default: 'acres'
  },
  crops: [String],
  soilType: {
    type: String,
    enum: ['clay', 'sandy', 'loamy', 'silt', 'peat', 'chalk']
  },
  irrigationType: {
    type: String,
    enum: ['drip', 'sprinkler', 'flood', 'manual']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'seasonal'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Farm', farmSchema);
