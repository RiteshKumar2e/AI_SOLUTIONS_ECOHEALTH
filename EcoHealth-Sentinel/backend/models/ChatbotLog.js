// ==================== models/ChatbotLog.js ====================
const mongoose = require('mongoose');

const chatbotLogSchema = new mongoose.Schema({
  domain: {
    type: String,
    enum: ['agriculture', 'healthcare', 'environment'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userMessage: {
    type: String,
    required: true
  },
  botResponse: {
    type: String,
    required: true
  },
  intent: String,
  confidence: Number,
  urgent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatbotLog', chatbotLogSchema);