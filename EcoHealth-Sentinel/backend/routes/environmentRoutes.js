// ==================== routes/environmentRoutes.js ====================
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @desc    Get environment dashboard
// @route   GET /api/environment/dashboard
// @access  Public
router.get('/dashboard', async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        stats: {
          totalCarbonCalculations: 523,
          activeAlerts: 3,
          wildlifeSightings: 142,
          conservationProjects: 8,
          avgAQI: 156
        },
        currentAlerts: [
          { type: 'air_quality', severity: 'moderate', message: 'AQI at 156' },
          { type: 'weather', severity: 'low', message: 'Heavy rainfall expected' }
        ],
        recentActivity: []
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Calculate carbon footprint
// @route   POST /api/environment/carbon-calculator
// @access  Public
router.post('/carbon-calculator', async (req, res, next) => {
  try {
    const { transportation, energy, diet, lifestyle } = req.body;

    // Mock calculation
    const calculation = {
      totalCO2: 8.5,
      breakdown: {
        transportation: 3.2,
        energy: 2.8,
        diet: 1.5,
        lifestyle: 1.0
      },
      comparison: {
        nationalAvg: 1.9,
        globalAvg: 4.5
      },
      recommendations: [
        'Switch to public transport to reduce 1.5 tons CO2/year',
        'Use renewable energy to save 2.0 tons CO2/year',
        'Reduce meat consumption to save 0.8 tons CO2/year'
      ],
      offsetOptions: [
        { method: 'Tree Plantation', cost: 500, impact: '1 ton CO2/year' },
        { method: 'Renewable Energy', cost: 1000, impact: '2 tons CO2/year' }
      ]
    };

    res.json({
      success: true,
      data: calculation
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get climate predictions
// @route   GET /api/environment/climate-predictions
// @access  Public
router.get('/climate-predictions', async (req, res, next) => {
  try {
    const predictions = {
      temperature: {
        current: 28.5,
        predicted30Days: 29.2,
        predicted90Days: 30.1,
        trend: 'increasing'
      },
      rainfall: {
        current: 120,
        predicted30Days: 150,
        predicted90Days: 180,
        trend: 'increasing'
      },
      extremeEvents: [
        { type: 'heatwave', probability: 0.35, timeframe: '30 days' },
        { type: 'heavy_rainfall', probability: 0.60, timeframe: '15 days' }
      ],
      recommendations: [
        'Prepare for increased rainfall',
        'Ensure proper drainage systems',
        'Stock emergency supplies'
      ]
    };

    res.json({
      success: true,
      data: predictions
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Predict disasters
// @route   POST /api/environment/disaster-prediction
// @access  Public
router.post('/disaster-prediction', async (req, res, next) => {
  try {
    const { location, disasterType } = req.body;

    const prediction = {
      type: disasterType || 'flood',
      location: location || 'Jamshedpur',
      risk: 'moderate',
      probability: 0.45,
      timeframe: '7-10 days',
      affectedAreas: ['Zone A', 'Zone B'],
      severity: 'medium',
      recommendations: [
        'Stay alert for weather updates',
        'Keep emergency kit ready',
        'Identify evacuation routes',
        'Store 3 days of food and water'
      ],
      emergencyContacts: [
        { service: 'Disaster Management', number: '108' },
        { service: 'Fire Brigade', number: '101' },
        { service: 'Police', number: '100' }
      ]
    };

    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get pollution heatmap
// @route   GET /api/environment/pollution-heatmap
// @access  Public
router.get('/pollution-heatmap', async (req, res, next) => {
  try {
    const { city, pollutant } = req.query;

    const heatmapData = {
      city: city || 'Jamshedpur',
      pollutant: pollutant || 'PM2.5',
      timestamp: new Date(),
      zones: [
        { area: 'Industrial Zone', lat: 22.8046, lng: 86.2029, value: 178, level: 'unhealthy' },
        { area: 'Residential', lat: 22.7950, lng: 86.1850, value: 142, level: 'moderate' },
        { area: 'Green Belt', lat: 22.7700, lng: 86.1450, value: 88, level: 'good' }
      ],
      avgAQI: 156,
      dominantPollutant: 'PM2.5',
      healthAdvisory: 'Limit outdoor activities. Wear mask if going outside.'
    };

    res.json({
      success: true,
      data: heatmapData
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get renewable energy data
// @route   GET /api/environment/renewable-energy
// @access  Public
router.get('/renewable-energy', async (req, res, next) => {
  try {
    const energyData = {
      solarPotential: {
        dailyAverage: 5.2,
        unit: 'kWh/m²/day',
        suitability: 'high'
      },
      windPotential: {
        averageSpeed: 3.5,
        unit: 'm/s',
        suitability: 'moderate'
      },
      costEstimate: {
        solar: {
          installation: 75000,
          maintenance: 5000,
          paybackPeriod: 4.5,
          annualSavings: 18000
        }
      },
      governmentSchemes: [
        {
          name: 'PM-KUSUM',
          subsidy: '30%',
          eligibility: 'Farmers'
        },
        {
          name: 'Grid Connected Rooftop',
          subsidy: '40%',
          eligibility: 'Residential'
        }
      ],
      nearbyInstallers: [
        { name: 'Solar Energy Solutions', distance: '2.5 km', rating: 4.5 },
        { name: 'Green Power Systems', distance: '5.0 km', rating: 4.8 }
      ]
    };

    res.json({
      success: true,
      data: energyData
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get wildlife conservation data
// @route   GET /api/environment/wildlife-conservation
// @access  Public
router.get('/wildlife-conservation', async (req, res, next) => {
  try {
    const conservationData = {
      recentSightings: [
        {
          species: 'Indian Elephant',
          location: '12 km from city',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'safe'
        },
        {
          species: 'Spotted Deer',
          location: 'Forest Reserve',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'safe'
        }
      ],
      activeProjects: [
        {
          name: 'Tree Plantation Drive 2025',
          target: 10000,
          completed: 6500,
          volunteersNeeded: 50,
          nextEvent: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        {
          name: 'Elephant Corridor Protection',
          status: 'ongoing',
          fundingProgress: 75,
          description: 'Protecting elephant migration routes'
        }
      ],
      endangeredSpecies: [
        { name: 'Bengal Tiger', population: 42, trend: 'stable' },
        { name: 'Indian Leopard', population: 28, trend: 'increasing' }
      ]
    };

    res.json({
      success: true,
      data: conservationData
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Log wildlife sighting
// @route   POST /api/environment/wildlife-sighting
// @access  Private
router.post('/wildlife-sighting', protect, async (req, res, next) => {
  try {
    const { species, location, description, imageUrl } = req.body;

    const sighting = {
      id: Date.now().toString(),
      userId: req.user.id,
      species,
      location,
      description,
      imageUrl,
      status: 'pending_verification',
      timestamp: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Wildlife sighting reported successfully',
      data: sighting
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Log waste data
// @route   POST /api/environment/waste-log
// @access  Private
router.post('/waste-log', protect, async (req, res, next) => {
  try {
    const { wasteType, quantity, disposalMethod } = req.body;

    const wasteLog = {
      id: Date.now().toString(),
      userId: req.user.id,
      wasteType,
      quantity,
      disposalMethod,
      recyclingScore: 75,
      carbonSaved: 2.5,
      timestamp: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Waste logged successfully',
      data: wasteLog
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get awareness content
// @route   GET /api/environment/awareness
// @access  Public
router.get('/awareness', async (req, res, next) => {
  try {
    const content = [
      {
        id: '1',
        title: 'Understanding Climate Change',
        category: 'education',
        content: 'Climate change refers to long-term shifts in temperatures...',
        image: 'climate.jpg',
        views: 1250,
        likes: 340
      },
      {
        id: '2',
        title: '10 Ways to Reduce Plastic Use',
        category: 'tips',
        content: 'Simple daily habits can significantly reduce plastic waste...',
        image: 'plastic.jpg',
        views: 2100,
        likes: 680
      }
    ];

    res.json({
      success: true,
      count: content.length,
      data: content
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get environment reports
// @route   GET /api/environment/reports
// @access  Private
router.get('/reports', protect, authorize('admin'), async (req, res, next) => {
  try {
    const reports = [
      {
        id: '1',
        title: 'Monthly Environmental Report - October 2025',
        type: 'monthly',
        generatedAt: new Date(),
        summary: {
          totalCalculations: 523,
          avgCarbonFootprint: 8.5,
          treesPlanted: 1200,
          wasteRecycled: 5600
        }
      }
    ];

    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;