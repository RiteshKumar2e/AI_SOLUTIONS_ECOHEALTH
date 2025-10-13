// ==================== models/Appointment.js ====================
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  type: {
    type: String,
    enum: ['consultation', 'followup', 'emergency', 'checkup'],
    default: 'consultation'
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  symptoms: [String],
  notes: String,
  prescription: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);
