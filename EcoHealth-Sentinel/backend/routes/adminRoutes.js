// ==================== routes/adminRoutes.js ====================
import express from 'express';
import auth from '../middleware/auth.js';
import roleCheck from '../middleware/roleCheck.js';
import User from '../models/User.js';
import mongoose from 'mongoose';


// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// @desc    Get admin dashboard
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsers,
          newUsers,
          totalRevenue: 125000,
          apiCalls: 45230
        },
        recentActivity: [],
        systemHealth: {
          status: 'healthy',
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          cpu: process.cpuUsage()
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get specific user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get analytics
// @route   POST /api/admin/analytics
// @access  Private/Admin
router.post('/analytics', async (req, res, next) => {
  try {
    const { startDate, endDate, metric } = req.body;

    const analytics = {
      userGrowth: [
        { date: '2025-10-01', count: 100 },
        { date: '2025-10-10', count: 150 }
      ],
      apiUsage: {
        total: 45230,
        byEndpoint: {
          '/api/auth': 12000,
          '/api/agriculture': 15000,
          '/api/healthcare': 10000,
          '/api/environment': 8230
        }
      },
      revenue: {
        total: 125000,
        byMonth: [
          { month: 'September', amount: 50000 },
          { month: 'October', amount: 75000 }
        ]
      }
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get settings
// @route   GET /api/admin/settings
// @access  Private/Admin
router.get('/settings', async (req, res, next) => {
  try {
    const settings = {
      siteName: 'Multi-Domain AI Platform',
      maintenanceMode: false,
      allowRegistration: true,
      emailNotifications: true,
      apiRateLimit: 100
    };

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
router.put('/settings', async (req, res, next) => {
  try {
    // Mock update - integrate with database
    const settings = req.body;

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;