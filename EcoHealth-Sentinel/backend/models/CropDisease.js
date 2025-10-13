// ==================== models/CropDisease.js ====================
const mongoose = require('mongoose');

const cropDiseaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  imagePath: String,
  disease: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical']
  },
  treatment: String,
  detectedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CropDisease', cropDiseaseSchema);