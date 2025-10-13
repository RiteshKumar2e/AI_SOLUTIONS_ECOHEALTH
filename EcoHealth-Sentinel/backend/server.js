// server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// =====================
// App & Server Setup
// =====================
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// =====================
// CORS Configuration - FIXED for Multiple Origins
// =====================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// MongoDB Connection - FIXED
// =====================
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://aiadmin:mypassword123@cluster0.n9mmmbt.mongodb.net/emergency_prediction?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your MongoDB Atlas connection string');
    console.log('2. Verify network access is allowed in MongoDB Atlas');
    console.log('3. Ensure username/password are correct\n');
  });

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 MongoDB connection closed');
  process.exit(0);
});

// =====================
// Schemas & Models
// =====================

const emergencyMetricsSchema = new mongoose.Schema({
  currentLoad: Number,
  predictedPeak: Number,
  avgResponseTime: Number,
  bedAvailability: Number,
  timestamp: { type: Date, default: Date.now },
});

const predictionSchema = new mongoose.Schema({
  type: String,
  riskLevel: String,
  probability: Number,
  timeframe: String,
  factors: [String],
  recommendedAction: String,
  confidence: Number,
  affectedArea: String,
  estimatedCases: String,
  timestamp: { type: Date, default: Date.now },
});

const historicalDataSchema = new mongoose.Schema({
  hour: String,
  actual: Number,
  predicted: Number,
  capacity: Number,
  x: Number,
  y: Number,
  date: { type: Date, default: Date.now },
});

const categoryDataSchema = new mongoose.Schema({
  category: String,
  current: Number,
  predicted: Number,
  timestamp: { type: Date, default: Date.now },
});

const resourceDataSchema = new mongoose.Schema({
  resource: String,
  current: Number,
  predicted: Number,
  capacity: Number,
  timestamp: { type: Date, default: Date.now },
});

const chatMessageSchema = new mongoose.Schema({
  text: String,
  sender: String,
  timestamp: { type: Date, default: Date.now },
  sessionId: String,
});

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  priority: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

// =====================
// NEW: Access Control Schemas
// =====================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: String,
  domain: String,
  status: { type: String, default: 'active' },
  permissions: [String],
  lastAccess: String,
  lastLogin: Date,
  ipAddress: String,
  loginCount: { type: Number, default: 0 },
  failedAttempts: { type: Number, default: 0 },
  location: String,
  phone: String,
  createdAt: { type: Date, default: Date.now },
});

const securityLogSchema = new mongoose.Schema({
  type: String, // success, warning, danger, info
  action: String,
  user: String,
  time: String,
  timestamp: { type: Date, default: Date.now },
  ip: String,
  details: String,
  domain: String,
});

// Models
const EmergencyMetrics = mongoose.model('EmergencyMetrics', emergencyMetricsSchema);
const Prediction = mongoose.model('Prediction', predictionSchema);
const HistoricalData = mongoose.model('HistoricalData', historicalDataSchema);
const CategoryData = mongoose.model('CategoryData', categoryDataSchema);
const ResourceData = mongoose.model('ResourceData', resourceDataSchema);
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const User = mongoose.model('User', userSchema);
const SecurityLog = mongoose.model('SecurityLog', securityLogSchema);

// =====================
// WebSocket Setup
// =====================
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('🔌 New WebSocket connection');

  ws.on('close', () => {
    clients.delete(ws);
    console.log('🔌 WebSocket client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error.message);
  });
});

function broadcast(data) {
  clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN = 1
      client.send(JSON.stringify(data));
    }
  });
}

// =====================
// API Routes
// =====================

// Health Check
app.get('/', (req, res) => {
  res.json({
    message: 'EcoHealth Sentinel - Emergency Prediction API',
    status: 'running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// =====================
// NEW: Access Control Routes
// =====================

// Get all users with filtering
app.get('/api/admin/access-control/users', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const { role, status, search } = req.query;
    let query = {};

    if (role && role !== 'all') {
      query.domain = role;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get security logs
app.get('/api/admin/access-control/logs', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const logs = await SecurityLog.find()
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update user status (activate/suspend)
app.patch('/api/admin/access-control/users/:userId/status', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create security log
    const log = new SecurityLog({
      type: status === 'active' ? 'success' : 'danger',
      action: `User ${status === 'active' ? 'activated' : 'suspended'}`,
      user: 'Admin',
      time: new Date().toLocaleTimeString(),
      ip: req.ip,
      details: `${user.name} status changed to ${status}`,
      domain: user.domain
    });
    await log.save();

    broadcast({ type: 'user_status_update', data: user });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user status:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete user
app.delete('/api/admin/access-control/users/:userId', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create security log
    const log = new SecurityLog({
      type: 'danger',
      action: 'User deleted',
      user: 'Admin',
      time: new Date().toLocaleTimeString(),
      ip: req.ip,
      details: `${user.name} was deleted from the system`,
      domain: user.domain
    });
    await log.save();

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Emergency Metrics
app.get('/api/metrics', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const metrics = await EmergencyMetrics.findOne().sort({ timestamp: -1 });
    res.json(metrics || {
      currentLoad: 23,
      predictedPeak: 45,
      avgResponseTime: 8.5,
      bedAvailability: 76,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error fetching metrics:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/metrics', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const metrics = new EmergencyMetrics(req.body);
    await metrics.save();
    broadcast({ type: 'metrics_update', data: metrics });
    res.json(metrics);
  } catch (error) {
    console.error('Error creating metrics:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Predictions
app.get('/api/predictions', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const { timeframe, riskLevel } = req.query;
    let query = {};

    if (riskLevel && riskLevel !== 'all') {
      query.riskLevel = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
    }

    const predictions = await Prediction.find(query)
      .sort({ timestamp: -1 })
      .limit(10);

    res.json(predictions);
  } catch (error) {
    console.error('Error fetching predictions:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/predictions', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const prediction = new Prediction(req.body);
    await prediction.save();
    broadcast({ type: 'prediction_update', data: prediction });

    if (prediction.riskLevel === 'High' && prediction.probability > 75) {
      const notification = new Notification({
        title: 'High Risk Alert',
        message: `${prediction.type} predicted with ${prediction.probability}% probability`,
        priority: 'high',
      });
      await notification.save();
      broadcast({ type: 'notification', data: notification });
    }

    res.json(prediction);
  } catch (error) {
    console.error('Error creating prediction:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Historical Data
app.get('/api/historical', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const data = await HistoricalData.find().sort({ date: -1 }).limit(24);
    res.json(data);
  } catch (error) {
    console.error('Error fetching historical data:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Category Data
app.get('/api/categories', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const data = await CategoryData.find().sort({ timestamp: -1 }).limit(5);
    res.json(data);
  } catch (error) {
    console.error('Error fetching category data:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Resource Data
app.get('/api/resources', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const data = await ResourceData.find().sort({ timestamp: -1 }).limit(10);
    res.json(data);
  } catch (error) {
    console.error('Error fetching resource data:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Notifications
app.get('/api/notifications', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const notifications = await Notification.find()
      .sort({ timestamp: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Chat AI Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const { message, sessionId } = req.body;

    const userMessage = new ChatMessage({
      text: message,
      sender: 'user',
      sessionId,
    });
    await userMessage.save();

    let response = 'I can help with emergency predictions, resources, and risk assessment.';

    if (message.toLowerCase().includes('load') || message.toLowerCase().includes('patient')) {
      const metrics = await EmergencyMetrics.findOne().sort({ timestamp: -1 });
      if (metrics) {
        response = `Current load: ${metrics.currentLoad} patients, Bed availability: ${metrics.bedAvailability}%, Predicted peak: ${metrics.predictedPeak}.`;
      }
    } else if (message.toLowerCase().includes('risk') || message.toLowerCase().includes('high')) {
      const highRiskPredictions = await Prediction.find({ riskLevel: 'High' }).sort({ timestamp: -1 }).limit(1);
      if (highRiskPredictions.length > 0) {
        const pred = highRiskPredictions[0];
        response = `High-risk alert: ${pred.type} with ${pred.probability}% probability in ${pred.timeframe}. Action: ${pred.recommendedAction}`;
      }
    } else if (message.toLowerCase().includes('resource')) {
      const resources = await ResourceData.find().sort({ timestamp: -1 }).limit(3);
      if (resources.length > 0) {
        response = `Resource status: ${resources.map(r => `${r.resource}: ${r.current}%`).join(', ')}.`;
      }
    }

    const botMessage = new ChatMessage({
      text: response,
      sender: 'bot',
      sessionId,
    });
    await botMessage.save();

    res.json({ response });
  } catch (error) {
    console.error('Error in chat:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// =====================
// Auto-update Metrics - FIXED
// =====================
let autoUpdateInterval = null;

function startAutoUpdates() {
  if (mongoose.connection.readyState !== 1) {
    console.log('⏸️  Auto-updates paused - waiting for MongoDB connection');
    return;
  }

  console.log('🔄 Starting auto-update metrics...');

  autoUpdateInterval = setInterval(async () => {
    try {
      if (mongoose.connection.readyState !== 1) {
        console.log('⏸️  Auto-update skipped - MongoDB disconnected');
        return;
      }

      const lastMetrics = await EmergencyMetrics.findOne().sort({ timestamp: -1 });
      
      if (lastMetrics) {
        const updatedMetrics = new EmergencyMetrics({
          currentLoad: Math.max(10, Math.min(50, lastMetrics.currentLoad + Math.floor(Math.random() * 7) - 3)),
          predictedPeak: Math.max(30, Math.min(60, lastMetrics.predictedPeak + Math.floor(Math.random() * 5) - 2)),
          avgResponseTime: Math.max(5, Math.min(15, parseFloat((lastMetrics.avgResponseTime + (Math.random() * 2 - 1)).toFixed(1)))),
          bedAvailability: Math.max(50, Math.min(95, lastMetrics.bedAvailability + Math.floor(Math.random() * 5) - 2)),
        });

        await updatedMetrics.save();
        broadcast({ type: 'metrics_update', data: updatedMetrics });
        console.log('✅ Metrics auto-updated');
      } else {
        const initialMetrics = new EmergencyMetrics({
          currentLoad: 23,
          predictedPeak: 45,
          avgResponseTime: 8.5,
          bedAvailability: 76,
        });
        await initialMetrics.save();
        console.log('✅ Initial metrics created');
      }
    } catch (error) {
      if (!error.message.includes('buffering timed out')) {
        console.error('❌ Auto-update error:', error.message);
      }
    }
  }, 5000);
}

// Wait for MongoDB connection before starting auto-updates
mongoose.connection.once('open', () => {
  console.log('🎯 MongoDB connection established');
  startAutoUpdates();
});

// Cleanup on exit
process.on('exit', () => {
  if (autoUpdateInterval) {
    clearInterval(autoUpdateInterval);
    console.log('🛑 Auto-updates stopped');
  }
});

// =====================
// Error Handling
// =====================
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 EcoHealth Sentinel Server Started');
  console.log('='.repeat(60));
  console.log(`📡 HTTP Server: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log(`🗄️  MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`);
  console.log(`🌐 CORS Enabled for: ${allowedOrigins.join(', ')}`);
  console.log('='.repeat(60) + '\n');
});

export { app, server, wss };
