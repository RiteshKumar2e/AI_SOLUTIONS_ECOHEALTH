// ==================== routes/healthcareRoutes.js ====================
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/auth');
const aiClient = require('../services/aiClient');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

const upload = multer({ dest: 'uploads/healthcare/' });

// @desc    Get healthcare dashboard
// @route   GET /api/healthcare/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res, next) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    const todayAppointments = await Appointment.countDocuments({
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999)
      }
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalPatients: 1247,
          todayAppointments,
          totalAppointments,
          emergencyCases: 12
        },
        upcomingAppointments: await Appointment.find({ status: 'scheduled' })
          .populate('patientId', 'name email')
          .limit(5),
        criticalAlerts: []
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Schedule appointment
// @route   POST /api/healthcare/appointments
// @access  Private
router.post('/appointments', protect, async (req, res, next) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      patientId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get appointments
// @route   GET /api/healthcare/appointments
// @access  Private
router.get('/appointments', protect, async (req, res, next) => {
  try {
    const { status, date, doctorId } = req.query;
    
    const filter = { patientId: req.user.id };
    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }
    if (doctorId) filter.doctorId = doctorId;

    const appointments = await Appointment.find(filter)
      .populate('doctorId', 'name specialization')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get specific appointment
// @route   GET /api/healthcare/appointments/:id
// @access  Private
router.get('/appointments/:id', protect, async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialization');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update appointment
// @route   PUT /api/healthcare/appointments/:id
// @access  Private
router.put('/appointments/:id', protect, async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Cancel appointment
// @route   DELETE /api/healthcare/appointments/:id
// @access  Private
router.delete('/appointments/:id', protect, async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    AI Diagnosis Assistant
// @route   POST /api/healthcare/diagnosis
// @access  Public
router.post('/diagnosis', async (req, res, next) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide symptoms'
      });
    }

    const diagnosis = await aiClient.getDiagnosis(symptoms);

    res.json({
      success: true,
      data: diagnosis,
      disclaimer: 'This is not a medical diagnosis. Please consult a doctor.'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Register patient
// @route   POST /api/healthcare/patients
// @access  Private
router.post('/patients', protect, authorize('admin', 'doctor'), async (req, res, next) => {
  try {
    const patient = await Patient.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get patient details
// @route   GET /api/healthcare/patients/:id
// @access  Private
router.get('/patients/:id', protect, async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Medical image analysis
// @route   POST /api/healthcare/image-analysis
// @access  Private
router.post('/image-analysis', protect, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const fs = require('fs');
    const imageBuffer = fs.readFileSync(req.file.path);
    const analysis = await aiClient.analyzeImage(imageBuffer, req.body.imageType);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Medicine recommendations
// @route   POST /api/healthcare/medicine-recommend
// @access  Public
router.post('/medicine-recommend', async (req, res, next) => {
  try {
    const { condition, age, weight, allergies } = req.body;

    // Mock recommendations
    const recommendations = {
      medicines: [
        {
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '3 days',
          precautions: ['Take after meals', 'Avoid alcohol']
        }
      ],
      lifestyle: [
        'Get adequate rest',
        'Stay hydrated',
        'Avoid cold drinks'
      ],
      followUp: 'If symptoms persist after 3 days, consult a doctor'
    };

    res.json({
      success: true,
      data: recommendations,
      disclaimer: 'This is not a prescription. Consult a doctor before taking any medication.'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Submit vital signs
// @route   POST /api/healthcare/vital-signs
// @access  Private
router.post('/vital-signs', protect, async (req, res, next) => {
  try {
    const { heartRate, bloodPressure, temperature, oxygenLevel, weight } = req.body;

    // Mock vital signs submission
    const vitalSigns = {
      patientId: req.user.id,
      heartRate,
      bloodPressure,
      temperature,
      oxygenLevel,
      weight,
      timestamp: new Date(),
      status: 'normal' // AI analysis result
    };

    res.status(201).json({
      success: true,
      message: 'Vital signs recorded successfully',
      data: vitalSigns
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Emergency prediction
// @route   GET /api/healthcare/emergency-prediction
// @access  Private
router.get('/emergency-prediction', protect, async (req, res, next) => {
  try {
    // Mock emergency risk prediction
    const prediction = {
      riskLevel: 'low',
      riskScore: 15,
      factors: [
        'Normal vital signs',
        'No critical symptoms reported'
      ],
      recommendations: [
        'Continue regular check-ups',
        'Maintain healthy lifestyle'
      ],
      nextCheckup: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get telemedicine sessions
// @route   GET /api/healthcare/telemedicine
// @access  Private
router.get('/telemedicine', protect, async (req, res, next) => {
  try {
    // Mock telemedicine sessions
    const sessions = [
      {
        id: '1',
        doctorName: 'Dr. Sharma',
        date: new Date(),
        duration: 30,
        status: 'completed',
        recording: 'available'
      }
    ];

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;