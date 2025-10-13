// ==================== models/Patient.js ====================
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  bloodGroup: String,
  allergies: [String],
  chronicConditions: [String],
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  insurance: {
    provider: String,
    policyNumber: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);