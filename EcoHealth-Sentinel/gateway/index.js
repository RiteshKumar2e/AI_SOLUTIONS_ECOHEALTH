/**
 * EcoHealth-Sentinel API Gateway (React + Node + FastAPI)
 * Unified entry point for microservices
 */

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
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // React app
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })
);

app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.disable('x-powered-by');

// ==================== Service URLs ====================

const SERVICES = {
  frontend: process.env.FRONTEND_URL || 'http://localhost:5173',
  fastapi: process.env.FASTAPI_URL || 'http://localhost:8000',
  nodejs: process.env.NODEJS_URL || 'http://localhost:5000',
};

// ==================== Health Checks ====================

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

// ==================== Proxy Setup ====================

const createProxyOptions = (target, pathRewrite = {}) => ({
  target,
  changeOrigin: true,
  pathRewrite,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req) => {
    console.log(`[Proxy] ${req.method} ${req.url} -> ${target}`);
  },
  onError: (err, req, res) => {
    console.error(`[Proxy Error] ${err.message}`);
    res.status(503).json({
      error: 'Service Unavailable',
      message: `Cannot reach ${target}`,
      timestamp: new Date().toISOString(),
    });
  },
});

// ML/FastAPI routes
app.use('/api/ml', createProxyMiddleware(createProxyOptions(SERVICES.fastapi, { '^/api/ml': '' })));
app.use('/api/predict', createProxyMiddleware(createProxyOptions(SERVICES.fastapi, { '^/api/predict': '/predict' })));

// Node.js backend routes
app.use('/api/data', createProxyMiddleware(createProxyOptions(SERVICES.nodejs, { '^/api/data': '' })));
app.use('/api/users', createProxyMiddleware(createProxyOptions(SERVICES.nodejs, { '^/api/users': '/users' })));
app.use('/api/reports', createProxyMiddleware(createProxyOptions(SERVICES.nodejs, { '^/api/reports': '/reports' })));

// React frontend routes
app.use('/', createProxyMiddleware(createProxyOptions(SERVICES.frontend)));

// ==================== Root Info ====================

app.get('/info', (req, res) => {
  res.status(200).json({
    name: 'EcoHealth-Sentinel Gateway',
    version: '1.0.0',
    frontend: SERVICES.frontend,
    backends: {
      fastapi: SERVICES.fastapi,
      nodejs: SERVICES.nodejs,
    },
    documentation: 'https://github.com/RiteshKumar2e/EcoHealth-Sentinel',
  });
});

// ==================== Server Startup ====================

const server = app.listen(PORT, () => {
  console.log('\n🚀 ===================================');
  console.log(`   EcoHealth-Sentinel Gateway Running`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('   ===================================');
  console.log(`\n📍 Services:`);
  console.log(`   Frontend: ${SERVICES.frontend}`);
  console.log(`   Node.js Backend: ${SERVICES.nodejs}`);
  console.log(`   FastAPI Backend: ${SERVICES.fastapi}`);
  console.log(`\n🌐 Gateway URL: http://localhost:${PORT}`);
  console.log('\n✅ All systems operational...\n');
});

// ==================== Graceful Shutdown ====================

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

module.exports = app;
