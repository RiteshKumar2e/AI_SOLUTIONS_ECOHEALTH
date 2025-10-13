import React, { useState, useEffect, useCallback } from 'react';
import { User, Heart, Activity, FileText, Calendar, AlertCircle, Search, Lock, Eye, Download, Edit, Plus, RefreshCw, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

// Simulated API Base URL
const API_BASE_URL = 'https://api.healthai.example.com';

export default function PatientRecords() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [vitalSigns, setVitalSigns] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [stats, setStats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulated API fetch
  const fetchData = useCallback(async (endpoint, options = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));
    
    const responses = {
      '/patients/list': generatePatients(),
      '/patients/stats': generateStats(),
      '/patients/history': generateMedicalHistory(),
      '/patients/vitals': generateVitals(),
      '/patients/prescriptions': generatePrescriptions(),
      '/patients/ai-insights': generateAIInsights()
    };

    return {
      ok: true,
      data: responses[endpoint] || []
    };
  }, []);

  // Data Generators
  const generatePatients = () => [
    {
      id: 'P-2024-' + Math.floor(1000 + Math.random() * 9000),
      name: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      bloodGroup: 'O+',
      contact: '+91 98765-43210',
      lastVisit: '2025-10-01',
      condition: 'Hypertension',
      status: 'stable',
      riskLevel: 'medium'
    },
    {
      id: 'P-2024-' + Math.floor(1000 + Math.random() * 9000),
      name: 'Priya Sharma',
      age: 32,
      gender: 'Female',
      bloodGroup: 'A+',
      contact: '+91 98765-43211',
      lastVisit: '2025-10-03',
      condition: 'Type 2 Diabetes',
      status: 'monitoring',
      riskLevel: 'high'
    },
    {
      id: 'P-2024-' + Math.floor(1000 + Math.random() * 9000),
      name: 'Amit Singh',
      age: 28,
      gender: 'Male',
      bloodGroup: 'B+',
      contact: '+91 98765-43212',
      lastVisit: '2025-09-28',
      condition: 'Asthma',
      status: 'stable',
      riskLevel: 'low'
    },
    {
      id: 'P-2024-' + Math.floor(1000 + Math.random() * 9000),
      name: 'Sunita Devi',
      age: 58,
      gender: 'Female',
      bloodGroup: 'AB+',
      contact: '+91 98765-43213',
      lastVisit: '2025-10-04',
      condition: 'Arthritis',
      status: 'treatment',
      riskLevel: 'medium'
    },
    {
      id: 'P-2024-' + Math.floor(1000 + Math.random() * 9000),
      name: 'Mohammed Ali',
      age: 51,
      gender: 'Male',
      bloodGroup: 'O-',
      contact: '+91 98765-43214',
      lastVisit: '2025-10-02',
      condition: 'Cardiac Disease',
      status: 'monitoring',
      riskLevel: 'high'
    }
  ];

  const generateStats = () => [
    { label: 'Total Patients', value: (2800 + Math.floor(Math.random() * 100)).toString(), icon: User, color: 'blue', trend: '+8%' },
    { label: 'Active Cases', value: (340 + Math.floor(Math.random() * 20)).toString(), icon: Activity, color: 'green', trend: '+12%' },
    { label: 'Records Updated', value: (150 + Math.floor(Math.random() * 20)).toString(), icon: FileText, color: 'purple', trend: '+5%' },
    { label: 'High Risk', value: (25 + Math.floor(Math.random() * 10)).toString(), icon: AlertCircle, color: 'red', trend: '-3%' }
  ];

  const generateMedicalHistory = () => [
    {
      date: '2025-10-01',
      type: 'Consultation',
      doctor: 'Dr. Mehta',
      diagnosis: 'Hypertension - Stage 1',
      notes: 'Blood pressure 145/92. Started on Amlodipine 5mg.'
    },
    {
      date: '2025-09-15',
      type: 'Lab Test',
      doctor: 'Lab Technician',
      diagnosis: 'Complete Blood Count',
      notes: 'All parameters within normal range.'
    },
    {
      date: '2025-08-20',
      type: 'Follow-up',
      doctor: 'Dr. Mehta',
      diagnosis: 'Routine Check-up',
      notes: 'Patient responding well to medication.'
    }
  ];

  const generateVitals = () => ({
    bloodPressure: { value: '140/88', status: 'elevated', timestamp: new Date().toLocaleString() },
    heartRate: { value: (72 + Math.floor(Math.random() * 15)) + ' bpm', status: 'normal', timestamp: new Date().toLocaleString() },
    temperature: { value: '98.4°F', status: 'normal', timestamp: new Date().toLocaleString() },
    oxygenLevel: { value: (95 + Math.floor(Math.random() * 5)) + '%', status: 'normal', timestamp: new Date().toLocaleString() },
    glucose: { value: (100 + Math.floor(Math.random() * 30)) + ' mg/dL', status: 'normal', timestamp: new Date().toLocaleString() },
    weight: { value: '75 kg', status: 'normal', timestamp: new Date().toLocaleString() }
  });

  const generatePrescriptions = () => [
    {
      medicine: 'Amlodipine 5mg',
      dosage: 'Once daily',
      startDate: '2025-10-01',
      duration: 'Ongoing',
      status: 'active'
    },
    {
      medicine: 'Atorvastatin 10mg',
      dosage: 'Once daily at night',
      startDate: '2025-09-15',
      duration: 'Ongoing',
      status: 'active'
    },
    {
      medicine: 'Aspirin 75mg',
      dosage: 'Once daily after breakfast',
      startDate: '2025-08-01',
      duration: 'Ongoing',
      status: 'active'
    }
  ];

  const generateAIInsights = () => [
    {
      type: 'alert',
      title: 'Blood Pressure Trending Up',
      message: 'Average BP increased by 5 mmHg over last 2 weeks',
      recommendation: 'Consider medication adjustment',
      priority: 'medium'
    },
    {
      type: 'positive',
      title: 'Excellent Medication Adherence',
      message: '95% adherence rate for prescribed medications',
      recommendation: 'Continue current routine',
      priority: 'low'
    },
    {
      type: 'schedule',
      title: 'Upcoming Check-up Due',
      message: 'Quarterly follow-up scheduled in 2 weeks',
      recommendation: 'Schedule lab tests before visit',
      priority: 'medium'
    }
  ];

  // Notification System
  const showNotification = useCallback((message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  // Load all data
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [patientsRes, statsRes] = await Promise.all([
        fetchData('/patients/list'),
        fetchData('/patients/stats')
      ]);

      setPatients(patientsRes.data);
      setStats(statsRes.data);
      setLastUpdated(new Date());
      showNotification('Patient records updated', 'success');
    } catch (error) {
      showNotification('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, showNotification]);

  // Load patient details
  const loadPatientDetails = useCallback(async (patient) => {
    setSelectedPatient(patient);
    setIsLoading(true);
    
    try {
      const [history, vitals, rx, insights] = await Promise.all([
        fetchData('/patients/history'),
        fetchData('/patients/vitals'),
        fetchData('/patients/prescriptions'),
        fetchData('/patients/ai-insights')
      ]);

      setMedicalHistory(history.data);
      setVitalSigns(vitals.data);
      setPrescriptions(rx.data);
      setAiInsights(insights.data);
      showNotification(`Loaded ${patient.name}'s records`, 'info');
    } catch (error) {
      showNotification('Failed to load patient details', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, showNotification]);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'stable': return 'bg-green-500';
      case 'monitoring': return 'bg-blue-500';
      case 'treatment': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getVitalStatus = (status) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'elevated': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      red: 'from-red-500 to-red-600'
    };
    return colors[color] || colors.blue;
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patient-records-container">
      <style>{`
      * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.patient-records-container {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #0a0f1e, #1a1f35, #0f1729);
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  position: relative;
  overflow-x: hidden;
  color: #e5e7eb;
}

.patient-records-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15), transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15), transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(16, 185, 129, 0.1), transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Notifications */
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification {
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 320px;
  animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  backdrop-filter: blur(10px);
  font-weight: 500;
}

.notification.success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.notification.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.notification.info {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

/* Header Card */
.header-card {
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  padding: 32px;
  margin-bottom: 24px;
  animation: fadeInUp 0.6s ease-out;
  border: 1px solid rgba(99, 102, 241, 0.2);
  position: relative;
  overflow: hidden;
}

.header-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(99, 102, 241, 0.1),
    transparent
  );
  transform: rotate(45deg);
  animation: shimmer 3s infinite;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.header-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #818cf8, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.header-subtitle {
  color: #9ca3af;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 12px;
}

.last-updated {
  font-size: 0.875rem;
  color: #d1d5db;
  background: rgba(55, 65, 81, 0.8);
  padding: 6px 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.header-icon {
  animation: float 3s ease-in-out infinite;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
  border: 1px solid rgba(99, 102, 241, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(99, 102, 241, 0.4);
  border-color: rgba(99, 102, 241, 0.4);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--stat-color-from), var(--stat-color-to));
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--stat-color-from), var(--stat-color-to));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.stat-label {
  font-size: 0.875rem;
  color: #9ca3af;
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #f3f4f6;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 0.875rem;
  font-weight: 600;
  color: #10b981;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Main Content Grid */
.main-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

/* Patient List Card */
.patient-list-card {
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(99, 102, 241, 0.2);
  animation: fadeInUp 0.7s ease-out;
  max-height: 800px;
  display: flex;
  flex-direction: column;
}

.search-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid rgba(75, 85, 99, 0.5);
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s;
  background: rgba(17, 24, 39, 0.8);
  color: #e5e7eb;
}

.search-input::placeholder {
  color: #6b7280;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
  background: rgba(17, 24, 39, 0.95);
}

.patient-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.patient-list::-webkit-scrollbar {
  width: 6px;
}

.patient-list::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5);
  border-radius: 10px;
}

.patient-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 10px;
}

.patient-item {
  padding: 16px;
  border-radius: 16px;
  border: 2px solid rgba(75, 85, 99, 0.3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: rgba(17, 24, 39, 0.6);
  position: relative;
  overflow: hidden;
}

.patient-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
  transition: width 0.3s;
}

.patient-item:hover {
  border-color: #6366f1;
  transform: translateX(8px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
}

.patient-item:hover::before {
  width: 100%;
}

.patient-item.active {
  border-color: #6366f1;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.patient-item-content {
  position: relative;
  z-index: 1;
}

.patient-header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.patient-name {
  font-weight: 700;
  color: #f3f4f6;
  font-size: 1.05rem;
  margin-bottom: 4px;
}

.patient-id {
  font-size: 0.75rem;
  color: #9ca3af;
  font-family: 'Courier New', monospace;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: white;
  letter-spacing: 0.5px;
}

.patient-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #9ca3af;
}

.risk-badge {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 1px solid;
}

/* Patient Details */
.patient-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.details-card {
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(99, 102, 241, 0.2);
  animation: fadeInUp 0.8s ease-out;
  transition: all 0.3s;
}

.details-card:hover {
  box-shadow: 0 24px 70px rgba(99, 102, 241, 0.3);
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.3);
}

.patient-overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.patient-avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.patient-avatar {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.5);
  animation: pulse 2s ease-in-out infinite;
}

.patient-name-section h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #f3f4f6;
  margin-bottom: 4px;
}

.patient-name-section p {
  color: #9ca3af;
  font-family: 'Courier New', monospace;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.action-btn:hover {
  transform: scale(1.1) rotate(5deg);
}

.btn-blue {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.btn-green {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.btn-purple {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.patient-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.info-item label {
  display: block;
  font-size: 0.875rem;
  color: #9ca3af;
  margin-bottom: 4px;
  font-weight: 600;
}

.info-item value {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  color: #f3f4f6;
}

/* View Mode Tabs */
.view-tabs {
  display: flex;
  gap: 10px;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.2);
  animation: fadeInUp 0.75s ease-out;
}

.tab-btn {
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  text-transform: capitalize;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: transparent;
  color: #9ca3af;
}

.tab-btn:hover {
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
}

.tab-btn.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.5);
  transform: scale(1.05);
}

/* AI Insights */
.insights-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.insight-card {
  padding: 20px;
  border-radius: 16px;
  border-left: 4px solid;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.insight-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.03));
  pointer-events: none;
}

.insight-card:hover {
  transform: translateX(8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.insight-card.alert {
  background: rgba(251, 191, 36, 0.15);
  border-color: #f59e0b;
}

.insight-card.positive {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
}

.insight-card.schedule {
  background: rgba(59, 130, 246, 0.15);
  border-color: #3b82f6;
}

.insight-title {
  font-weight: 700;
  color: #f3f4f6;
  margin-bottom: 8px;
  font-size: 1.05rem;
}

.insight-message {
  color: #d1d5db;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.insight-recommendation {
  font-size: 0.85rem;
  font-weight: 600;
  color: #9ca3af;
}

/* Vitals Grid */
.vitals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.vital-card {
  background: rgba(17, 24, 39, 0.8);
  padding: 20px;
  border-radius: 16px;
  border: 2px solid rgba(75, 85, 99, 0.3);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.vital-card::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.vital-card:hover {
  border-color: #6366f1;
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(99, 102, 241, 0.3);
}

.vital-card:hover::after {
  opacity: 1;
}

.vital-label {
  font-size: 0.875rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 8px;
}

.vital-value {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: #f3f4f6;
}

.vital-timestamp {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 12px;
}

.vital-status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.vital-status-badge.normal {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.vital-status-badge.elevated {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.vital-status-badge.critical {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

/* Medical History */
.history-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-card {
  background: rgba(99, 102, 241, 0.08);
  padding: 20px;
  border-radius: 16px;
  border: 2px solid rgba(99, 102, 241, 0.3);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.history-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: linear-gradient(180deg, #6366f1, #8b5cf6);
}

.history-card:hover {
  border-color: #6366f1;
  transform: translateX(8px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
}

.history-type {
  font-weight: 700;
  color: #f3f4f6;
  font-size: 1.05rem;
}

.history-doctor {
  font-size: 0.9rem;
  color: #9ca3af;
}

.history-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #9ca3af;
  background: rgba(17, 24, 39, 0.6);
  padding: 6px 12px;
  border-radius: 8px;
}

.history-diagnosis {
  font-weight: 600;
  color: #d1d5db;
  margin-bottom: 8px;
}

.history-notes {
  font-size: 0.9rem;
  color: #9ca3af;
  line-height: 1.5;
}

/* Prescriptions */
.prescriptions-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prescription-card {
  background: rgba(16, 185, 129, 0.08);
  padding: 20px;
  border-radius: 16px;
  border: 2px solid rgba(16, 185, 129, 0.3);
  transition: all 0.3s;
}

.prescription-card:hover {
  border-color: #10b981;
  transform: translateX(8px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
}

.prescription-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.prescription-name {
  font-weight: 800;
  color: #f3f4f6;
  font-size: 1.1rem;
}

.prescription-status {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: #10b981;
  color: white;
}

.prescription-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.prescription-detail-item label {
  display: block;
  font-size: 0.85rem;
  color: #9ca3af;
  margin-bottom: 4px;
  font-weight: 600;
}

.prescription-detail-item value {
  display: block;
  font-weight: 700;
  color: #f3f4f6;
}

.prescription-start-date {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 12px;
}

/* Empty State */
.empty-state {
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 80px 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.empty-state-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  color: #4b5563;
  animation: float 3s ease-in-out infinite;
}

.empty-state-text {
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Security Notice */
.security-notice {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(99, 102, 241, 0.2);
  animation: fadeInUp 0.9s ease-out;
}

.security-content {
  display: flex;
  align-items: start;
  gap: 24px;
}

.security-icon {
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}

.security-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #f3f4f6;
  margin-bottom: 12px;
}

.security-description {
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 20px;
}

.security-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.security-feature {
  background: rgba(99, 102, 241, 0.1);
  padding: 16px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.security-feature:hover {
  background: rgba(99, 102, 241, 0.15);
  transform: translateY(-2px);
  border-color: rgba(99, 102, 241, 0.3);
}

.security-feature-title {
  font-weight: 700;
  color: #f3f4f6;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.security-feature-desc {
  font-size: 0.8rem;
  color: #9ca3af;
}

/* Loading Spinner */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 40px auto;
}

/* Refresh Button */
.refresh-btn {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s;
  z-index: 100;
}

.refresh-btn:hover {
  transform: scale(1.1) rotate(180deg);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.7);
}

.refresh-btn.loading {
  animation: spin 1s linear infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .header-title {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .main-grid {
    grid-template-columns: 1fr;
  }

  .patient-info-grid {
    grid-template-columns: 1fr;
  }

  .view-tabs {
    overflow-x: auto;
  }

  .security-features {
    grid-template-columns: 1fr;
  }
}
      `}</style>

      {/* Notifications */}
      <div className="notification-container">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            {notification.type === 'success' && <CheckCircle size={20} />}
            {notification.type === 'error' && <XCircle size={20} />}
            {notification.type === 'info' && <Activity size={20} />}
            <span>{notification.message}</span>
          </div>
        ))}
      </div>

      <div className="content-wrapper">
        {/* Header */}
        <div className="header-card">
          <div className="header-content">
            <div>
              <h1 className="header-title">Electronic Health Records</h1>
              <div className="header-subtitle">
                <span>Secure AI-powered patient data management system</span>
                <span className="last-updated">
                  <Clock size={14} />
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            </div>
            <FileText size={64} className="header-icon" style={{ color: 'rgba(102, 126, 234, 0.2)' }} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="stat-card"
                style={{ 
                  '--stat-color-from': `var(--${stat.color}-500)`,
                  '--stat-color-to': `var(--${stat.color}-600)`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="stat-icon-wrapper">
                  <Icon size={28} color="white" />
                </div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-trend">
                  <TrendingUp size={16} />
                  {stat.trend}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="main-grid">
          {/* Patient List */}
          <div className="patient-list-card">
            <div className="search-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search patients by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="patient-list">
              {filteredPatients.map((patient, index) => (
                <div
                  key={patient.id}
                  onClick={() => loadPatientDetails(patient)}
                  className={`patient-item ${selectedPatient?.id === patient.id ? 'active' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="patient-item-content">
                    <div className="patient-header">
                      <div>
                        <div className="patient-name">{patient.name}</div>
                        <div className="patient-id">{patient.id}</div>
                      </div>
                      <span className={`status-badge ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </div>
                    <div className="patient-meta">
                      <span>{patient.age}Y • {patient.gender}</span>
                      <span className={`risk-badge ${getRiskColor(patient.riskLevel)}`}>
                        {patient.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Details */}
          <div className="patient-details">
            {selectedPatient ? (
              <>
                {/* Patient Overview */}
                <div className="details-card">
                  <div className="patient-overview-header">
                    <div className="patient-avatar-section">
                      <div className="patient-avatar">
                        <User size={40} color="white" />
                      </div>
                      <div className="patient-name-section">
                        <h2>{selectedPatient.name}</h2>
                        <p>{selectedPatient.id}</p>
                      </div>
                    </div>
                    <div className="action-buttons">
                      <button className="action-btn btn-blue" title="View Full Profile">
                        <Eye size={20} />
                      </button>
                      <button className="action-btn btn-green" title="Download Records">
                        <Download size={20} />
                      </button>
                      <button className="action-btn btn-purple" title="Edit Record">
                        <Edit size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="patient-info-grid">
                    <div className="info-item">
                      <label>Age</label>
                      <value>{selectedPatient.age} years</value>
                    </div>
                    <div className="info-item">
                      <label>Blood Group</label>
                      <value>{selectedPatient.bloodGroup}</value>
                    </div>
                    <div className="info-item">
                      <label>Last Visit</label>
                      <value>{selectedPatient.lastVisit}</value>
                    </div>
                    <div className="info-item">
                      <label>Condition</label>
                      <value>{selectedPatient.condition}</value>
                    </div>
                  </div>
                </div>

                {/* View Mode Tabs */}
                <div className="view-tabs">
                  {['overview', 'vitals', 'history', 'prescriptions'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`tab-btn ${viewMode === mode ? 'active' : ''}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {/* Content Based on View Mode */}
                {viewMode === 'overview' && (
                  <div className="details-card">
                    <h3 className="card-title" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>
                      AI Health Insights
                    </h3>
                    {isLoading ? (
                      <div className="loading-spinner" />
                    ) : (
                      <div className="insights-container">
                        {aiInsights.map((insight, index) => (
                          <div key={index} className={`insight-card ${insight.type}`}>
                            <h4 className="insight-title">{insight.title}</h4>
                            <p className="insight-message">{insight.message}</p>
                            <p className="insight-recommendation">
                              💡 {insight.recommendation}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {viewMode === 'vitals' && (
                  <div className="details-card">
                    <h3 className="card-title" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>
                      Vital Signs
                    </h3>
                    {isLoading ? (
                      <div className="loading-spinner" />
                    ) : (
                      <div className="vitals-grid">
                        {Object.entries(vitalSigns).map(([key, vital]) => (
                          <div key={key} className="vital-card">
                            <div className="vital-label">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div className={`vital-value ${getVitalStatus(vital.status)}`}>
                              {vital.value}
                            </div>
                            <div className="vital-timestamp">{vital.timestamp}</div>
                            <span className={`vital-status-badge ${vital.status}`}>
                              {vital.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {viewMode === 'history' && (
                  <div className="details-card">
                    <h3 className="card-title" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>
                      Medical History
                    </h3>
                    {isLoading ? (
                      <div className="loading-spinner" />
                    ) : (
                      <div className="history-container">
                        {medicalHistory.map((record, index) => (
                          <div key={index} className="history-card">
                            <div className="history-header">
                              <div>
                                <div className="history-type">{record.type}</div>
                                <div className="history-doctor">{record.doctor}</div>
                              </div>
                              <div className="history-date">
                                <Calendar size={14} />
                                {record.date}
                              </div>
                            </div>
                            <div className="history-diagnosis">{record.diagnosis}</div>
                            <div className="history-notes">{record.notes}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {viewMode === 'prescriptions' && (
                  <div className="details-card">
                    <h3 className="card-title" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>
                      Active Prescriptions
                    </h3>
                    {isLoading ? (
                      <div className="loading-spinner" />
                    ) : (
                      <div className="prescriptions-container">
                        {prescriptions.map((rx, index) => (
                          <div key={index} className="prescription-card">
                            <div className="prescription-header">
                              <div className="prescription-name">{rx.medicine}</div>
                              <span className="prescription-status">{rx.status}</span>
                            </div>
                            <div className="prescription-details">
                              <div className="prescription-detail-item">
                                <label>Dosage</label>
                                <value>{rx.dosage}</value>
                              </div>
                              <div className="prescription-detail-item">
                                <label>Duration</label>
                                <value>{rx.duration}</value>
                              </div>
                            </div>
                            <div className="prescription-start-date">
                              Started: {rx.startDate}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <User className="empty-state-icon" />
                <p className="empty-state-text">Select a patient to view records</p>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="security-notice">
          <div className="security-content">
            <Lock size={40} color="white" className="security-icon" />
            <div style={{ flex: 1 }}>
              <h3 className="security-title">HIPAA-Compliant Data Security</h3>
              <p className="security-description">
                All patient records are encrypted with military-grade AES-256 encryption. Access is logged and monitored. 
                Role-based permissions ensure only authorized healthcare providers can view sensitive medical information.
              </p>
              <div className="security-features">
                <div className="security-feature">
                  <div className="security-feature-title">🔐 End-to-End Encryption</div>
                  <div className="security-feature-desc">Data encrypted in transit and at rest</div>
                </div>
                <div className="security-feature">
                  <div className="security-feature-title">📋 Audit Trails</div>
                  <div className="security-feature-desc">Complete access logging</div>
                </div>
                <div className="security-feature">
                  <div className="security-feature-title">👥 Role-Based Access</div>
                  <div className="security-feature-desc">Granular permission control</div>
                </div>
                <div className="security-feature">
                  <div className="security-feature-title">✓ HIPAA Certified</div>
                  <div className="security-feature-desc">Fully compliant infrastructure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Refresh Button */}
      <button
        onClick={loadAllData}
        className={`refresh-btn ${isLoading ? 'loading' : ''}`}
        disabled={isLoading}
        title="Refresh Data"
      >
        <RefreshCw size={24} />
      </button>
    </div>
  );
}