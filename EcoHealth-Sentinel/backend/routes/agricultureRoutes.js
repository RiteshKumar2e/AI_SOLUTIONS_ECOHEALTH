// ==================== routes/agricultureRoutes.js ====================
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/auth');
const aiClient = require('../services/aiClient');
const Farm = require('../models/Farm');
const CropDisease = require('../models/CropDisease');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/agriculture/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// @desc    Get agriculture dashboard
// @route   GET /api/agriculture/dashboard
// @access  Public
router.get('/dashboard', async (req, res, next) => {
  try {
    const totalFarms = await Farm.countDocuments();
    const activeFarms = await Farm.countDocuments({ status: 'active' });
    const recentDiseases = await CropDisease.find()
      .sort({ detectedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        stats: {
          totalFarms,
          activeFarms,
          totalCrops: 150,
          diseaseDetections: recentDiseases.length
        },
        recentActivity: recentDiseases,
        weatherSummary: {
          temperature: 28,
          humidity: 65,
          rainfall: '40%',
          windSpeed: 12
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Detect crop disease
// @route   POST /api/agriculture/crop-disease-detection
// @access  Public
router.post('/crop-disease-detection', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    // Use AI service to detect disease
    const fs = require('fs');
    const imageBuffer = fs.readFileSync(req.file.path);
    const detection = await aiClient.detectCropDisease(imageBuffer, req.file.filename);

    // Save detection to database
    const diseaseRecord = await CropDisease.create({
      imagePath: req.file.path,
      disease: detection.disease,
      confidence: detection.confidence,
      severity: detection.severity,
      treatment: detection.treatment,
      userId: req.user?.id
    });

    res.json({
      success: true,
      data: {
        id: diseaseRecord._id,
        disease: detection.disease,
        confidence: detection.confidence,
        severity: detection.severity,
        treatment: detection.treatment,
        preventiveMeasures: detection.preventiveMeasures,
        image: req.file.filename
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create farm
// @route   POST /api/agriculture/farms
// @access  Private
router.post('/farms', protect, async (req, res, next) => {
  try {
    const farm = await Farm.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: farm
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all farms
// @route   GET /api/agriculture/farms
// @access  Private
router.get('/farms', protect, async (req, res, next) => {
  try {
    const farms = await Farm.find({ userId: req.user.id });

    res.json({
      success: true,
      count: farms.length,
      data: farms
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get irrigation schedules
// @route   GET /api/agriculture/irrigation/schedules
// @access  Private
router.get('/irrigation/schedules', protect, async (req, res, next) => {
  try {
    // Mock data - replace with actual database query
    const schedules = [
      {
        id: '1',
        farmId: 'farm1',
        cropType: 'wheat',
        frequency: 'daily',
        duration: 30,
        time: '06:00',
        waterAmount: 25,
        status: 'active'
      }
    ];

    res.json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create irrigation schedule
// @route   POST /api/agriculture/irrigation/schedule
// @access  Private
router.post('/irrigation/schedule', protect, async (req, res, next) => {
  try {
    const { farmId, cropType, frequency, duration, time, waterAmount } = req.body;

    // Mock creation - replace with actual database operation
    const schedule = {
      id: Date.now().toString(),
      farmId,
      cropType,
      frequency,
      duration,
      time,
      waterAmount,
      userId: req.user.id,
      status: 'active',
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Irrigation schedule created successfully',
      data: schedule
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get fertilizer recommendations
// @route   POST /api/agriculture/fertilizer/recommend
// @access  Public
router.post('/fertilizer/recommend', async (req, res, next) => {
  try {
    const { cropType, soilType, area, season } = req.body;

    // Mock recommendations - integrate with AI model
    const recommendations = {
      npkRatio: '19-19-19',
      quantity: `${area * 200}kg`,
      applicationSchedule: [
        { stage: 'Planting', percentage: 50, timing: 'Day 0' },
        { stage: 'Vegetative', percentage: 25, timing: 'Day 30' },
        { stage: 'Reproductive', percentage: 25, timing: 'Day 60' }
      ],
      organicAlternatives: [
        'Compost: 5 tons per hectare',
        'Vermicompost: 2 tons per hectare'
      ],
      estimatedCost: area * 3500
    };

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get market forecast
// @route   GET /api/agriculture/market/forecast
// @access  Public
router.get('/market/forecast', async (req, res, next) => {
  try {
    const { crop, duration = 30 } = req.query;

    const forecast = {
      crop: crop || 'wheat',
      currentPrice: 2150,
      predictedPrices: [
        { date: '2025-10-15', price: 2180, trend: 'up' },
        { date: '2025-10-20', price: 2200, trend: 'up' },
        { date: '2025-10-25', price: 2175, trend: 'down' }
      ],
      recommendation: 'Hold - prices expected to rise in next 2 weeks',
      confidence: 0.85
    };

    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get weather forecast
// @route   GET /api/agriculture/weather
// @access  Public
router.get('/weather', async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    const weather = {
      current: {
        temperature: 28,
        humidity: 65,
        rainfall: 0,
        windSpeed: 12,
        condition: 'Partly Cloudy'
      },
      forecast: [
        { date: '2025-10-11', temp: 29, rain: 40, condition: 'Rain' },
        { date: '2025-10-12', temp: 27, rain: 60, condition: 'Heavy Rain' },
        { date: '2025-10-13', temp: 28, rain: 20, condition: 'Cloudy' }
      ],
      alerts: ['Heavy rainfall expected in next 48 hours'],
      farmingAdvice: 'Delay irrigation. Ensure proper drainage.'
    };

    res.json({
      success: true,
      data: weather
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;