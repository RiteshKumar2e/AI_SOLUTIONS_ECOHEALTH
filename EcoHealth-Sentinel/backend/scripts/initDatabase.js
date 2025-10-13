// scripts/initDatabase.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/userModel');
const Farm = require('../models/Farm');
const Patient = require('../models/Patient');
const CropDisease = require('../models/CropDisease');
const Appointment = require('../models/Appointment');

const initDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/integrated_app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected');

    // Clear existing data (WARNING: This will delete all data)
    console.log('\n⚠️  Clearing existing data...');
    await User.deleteMany({});
    await Farm.deleteMany({});
    await Patient.deleteMany({});
    await CropDisease.deleteMany({});
    await Appointment.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create Admin User
    console.log('\n📝 Creating admin user...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91-9876543210',
      isActive: true,
      isVerified: true,
      modules: {
        agriculture: true,
        healthcare: true,
        environment: true
      }
    });
    console.log('✅ Admin user created:', admin.email);

    // Create Sample Farmer
    console.log('\n📝 Creating sample farmer...');
    const farmer = await User.create({
      name: 'Rajesh Kumar',
      email: 'farmer@example.com',
      password: 'farmer123',
      role: 'farmer',
      phone: '+91-9876543211',
      isActive: true,
      modules: {
        agriculture: true,
        healthcare: false,
        environment: false
      }
    });
    console.log('✅ Farmer created:', farmer.email);

    // Create Sample Doctor
    console.log('\n📝 Creating sample doctor...');
    const doctor = await User.create({
      name: 'Dr. Priya Sharma',
      email: 'doctor@example.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '+91-9876543212',
      isActive: true,
      modules: {
        agriculture: false,
        healthcare: true,
        environment: false
      }
    });
    console.log('✅ Doctor created:', doctor.email);

    // Create Sample Patient User
    console.log('\n📝 Creating sample patient...');
    const patientUser = await User.create({
      name: 'Amit Patel',
      email: 'patient@example.com',
      password: 'patient123',
      role: 'patient',
      phone: '+91-9876543213',
      isActive: true,
      modules: {
        agriculture: false,
        healthcare: true,
        environment: false
      }
    });
    console.log('✅ Patient user created:', patientUser.email);

    // Create Sample Farm
    console.log('\n📝 Creating sample farm...');
    const farm = await Farm.create({
      owner: farmer._id,
      farmName: 'Green Valley Farm',
      location: {
        type: 'Point',
        coordinates: [88.3639, 22.5726], // Kolkata coordinates
        address: 'Village Rampur',
        city: 'Howrah',
        state: 'West Bengal',
        pincode: '711101'
      },
      area: {
        value: 5,
        unit: 'acres'
      },
      soilType: 'Loamy',
      crops: [
        {
          cropName: 'Rice',
          variety: 'Basmati',
          plantedDate: new Date('2024-06-15'),
          expectedHarvestDate: new Date('2024-10-15'),
          area: 3,
          status: 'growing'
        },
        {
          cropName: 'Wheat',
          variety: 'PBW 343',
          plantedDate: new Date('2024-11-01'),
          expectedHarvestDate: new Date('2025-03-15'),
          area: 2,
          status: 'growing'
        }
      ],
      irrigation: {
        type: 'Drip',
        waterSource: 'Borewell',
        automationEnabled: true
      },
      isActive: true
    });
    console.log('✅ Farm created:', farm.farmName);

    // Create Sample Patient Profile
    console.log('\n📝 Creating patient profile...');
    const patient = await Patient.create({
      user: patientUser._id,
      personalInfo: {
        firstName: 'Amit',
        lastName: 'Patel',
        dateOfBirth: new Date('1985-05-15'),
        gender: 'Male',
        bloodGroup: 'O+',
        maritalStatus: 'Married'
      },
      contact: {
        phone: '+91-9876543213',
        email: 'patient@example.com',
        address: {
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India'
        }
      },
      emergencyContact: {
        name: 'Priya Patel',
        relationship: 'Wife',
        phone: '+91-9876543214'
      },
      medicalHistory: {
        allergies: ['Penicillin'],
        chronicDiseases: ['Hypertension'],
        currentMedications: [
          {
            name: 'Amlodipine',
            dosage: '5mg',
            frequency: 'Once daily',
            startDate: new Date('2023-01-01'),
            prescribedBy: 'Dr. Kumar'
          }
        ]
      },
      vitalSigns: {
        height: 175,
        weight: 75,
        bloodPressure: {
          systolic: 130,
          diastolic: 85
        },
        heartRate: 72,
        temperature: 98.6,
        lastUpdated: new Date()
      },
      isActive: true
    });
    console.log('✅ Patient profile created:', patient.patientId);

    // Create Sample Appointment
    console.log('\n📝 Creating sample appointment...');
    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      timeSlot: {
        start: '10:00',
        end: '10:30'
      },
      type: 'In-Person',
      department: 'General',
      reason: 'Regular checkup',
      symptoms: ['Headache', 'Fatigue'],
      status: 'Scheduled',
      priority: 'Medium',
      payment: {
        amount: 500,
        status: 'Pending'
      }
    });
    console.log('✅ Appointment created:', appointment.appointmentId);

    console.log('\n✅ Database initialization completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('─────────────────────────────────────');
    console.log('Admin:   admin@example.com / admin123');
    console.log('Farmer:  farmer@example.com / farmer123');
    console.log('Doctor:  doctor@example.com / doctor123');
    console.log('Patient: patient@example.com / patient123');
    console.log('─────────────────────────────────────\n');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
};

// Run initialization
initDatabase();