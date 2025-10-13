require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== Middleware ====================

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // React frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })
);

app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.disable('x-powered-by');

// ==================== Service URLs ====================

const SERVICES = {
  frontend: process.env.FRONTEND_URL || 'http://localhost:5173',
  fastapi: process.env.FASTAPI_URL || 'http://localhost:8000',
  nodejs: process.env.NODEJS_URL || 'http://localhost:5000',
};

// ==================== Health Check ====================

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'API Gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/health/services', async (req, res) => {
  const healthStatus = {};
  for (const [name, url] of Object.entries(SERVICES)) {
    try {
      await axios.get(`${url}/health`, { timeout: 5000 });
      healthStatus[name] = { status: 'healthy', url };
    } catch (error) {
      healthStatus[name] = { status: 'unhealthy', url, error: error.message };
    }
  }
  res.status(200).json({
    gateway: 'healthy',
    services: healthStatus,
    timestamp: new Date().toISOString(),
  });
});

// ==================== Proxy Helper ====================

const createProxyOptions = (target, pathRewrite = {}) => ({
  target,
  changeOrigin: true,
  pathRewrite,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req) => console.log(`[Proxy] ${req.method} ${req.url} -> ${target}`),
  onProxyRes: (proxyRes) => console.log(`[Proxy Response] Status: ${proxyRes.statusCode}`),
  onError: (err, req, res) => {
    console.error(`[Proxy Error] ${err.message}`);
    res.status(503).json({
      error: 'Service Unavailable',
      message: 'The requested service is currently unavailable',
      service: target,
      timestamp: new Date().toISOString(),
    });
  },
});

// ==================== Proxy Routes ====================

// FastAPI (Machine Learning)
app.use('/api/ml', createProxyMiddleware(createProxyOptions(SERVICES.fastapi, { '^/api/ml': '' })));
app.use('/api/predict', createProxyMiddleware(createProxyOptions(SERVICES.fastapi, { '^/api/predict': '/predict' })));

// Node.js Backend (Data / Users / Reports)
app.use('/api/data', createProxyMiddleware(createProxyOptions(SERVICES.nodejs, { '^/api/data': '' })));
app.use('/api/users', createProxyMiddleware(createProxyOptions(SERVICES.nodejs, { '^/api/users': '/users' })));
app.use('/api/reports', createProxyMiddleware(createProxyOptions(SERVICES.nodejs, { '^/api/reports': '/reports' })));

// Frontend (React)
app.use('/', createProxyMiddleware(createProxyOptions(SERVICES.frontend)));

// ==================== Root Endpoint ====================

app.get('/info', (req, res) => {
  res.status(200).json({
    message: 'EcoHealth-Sentinel API Gateway',
    version: '1.0.0',
    services: {
      frontend: SERVICES.frontend,
      fastapi: SERVICES.fastapi,
      nodejs: SERVICES.nodejs,
    },
    endpoints: {
      health: '/health',
      service_health: '/health/services',
      ml: '/api/ml',
      predict: '/api/predict',
      data: '/api/data',
      users: '/api/users',
      reports: '/api/reports',
    },
  });
});

// ==================== 404 & Error Handlers ====================

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  console.error('[Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
});

// ==================== Server Init ====================

const server = app.listen(PORT, () => {
  console.log('\n🚀 ===================================');
  console.log(`   EcoHealth-Sentinel Gateway`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('   ===================================');
  console.log('\n📍 Service Routes:');
  console.log(`   React Frontend: ${SERVICES.frontend}`);
  console.log(`   Node.js Backend: ${SERVICES.nodejs}`);
  console.log(`   FastAPI Backend: ${SERVICES.fastapi}`);
  console.log('\n📌 Endpoints:');
  console.log(`   Gateway: http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log('\n✅ Gateway is running...\n');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
