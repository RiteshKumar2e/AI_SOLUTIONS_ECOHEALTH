// ==================== routes/chatbotRoutes.js ====================
const express = require('express');
const router = express.Router();
const agricultureBot = require('../services/agricultureBot');
const healthcareBot = require('../services/healthcareBot');
const environmentBot = require('../services/environmentBot');
const ChatbotLog = require('../models/ChatbotLog');

// Agriculture Chatbot
router.post('/agriculture', async (req, res, next) => {
  try {
    const { message, userId, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const response = await agricultureBot.getResponse(message, context);

    // Log conversation
    await ChatbotLog.create({
      domain: 'agriculture',
      userId: userId || null,
      userMessage: message,
      botResponse: response.message,
      intent: response.intent || 'general',
      confidence: response.confidence
    });

    res.json({
      success: true,
      response
    });
  } catch (error) {
    next(error);
  }
});

// Healthcare Chatbot
router.post('/healthcare', async (req, res, next) => {
  try {
    const { message, userId, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const response = await healthcareBot.getResponse(message, context);

    // Log conversation
    await ChatbotLog.create({
      domain: 'healthcare',
      userId: userId || null,
      userMessage: message,
      botResponse: response.message,
      intent: response.intent || 'general',
      confidence: response.confidence,
      urgent: response.urgent || false
    });

    res.json({
      success: true,
      response
    });
  } catch (error) {
    next(error);
  }
});

// Environment Chatbot
router.post('/environment', async (req, res, next) => {
  try {
    const { message, userId, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const response = await environmentBot.getResponse(message, context);

    // Log conversation
    await ChatbotLog.create({
      domain: 'environment',
      userId: userId || null,
      userMessage: message,
      botResponse: response.message,
      intent: response.intent || 'general',
      confidence: response.confidence
    });

    res.json({
      success: true,
      response
    });
  } catch (error) {
    next(error);
  }
});

// Get chat history
router.get('/history/:domain', async (req, res, next) => {
  try {
    const { domain } = req.params;
    const { userId, limit = 50 } = req.query;

    const filter = { domain };
    if (userId) filter.userId = userId;

    const history = await ChatbotLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

