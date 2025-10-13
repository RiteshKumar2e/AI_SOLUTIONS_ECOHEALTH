import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Bell, Activity, Sparkles, Database, Trash2, Edit, Eye, Download, Filter, Search, RefreshCw } from 'lucide-react';

// MongoDB API Simulation (Replace with actual MongoDB API calls)
class MongoDBService {
  constructor() {
    // Simulating MongoDB connection
    this.dbName = 'appointmentDB';
    this.collection = 'appointments';
    this.connectionStatus = 'connected';
    // In-memory storage to simulate MongoDB
    this.appointments = [];
    this.doctors = [
      { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', aiRating: 4.8, avatar: '👩‍⚕️', available: true },
      { id: 2, name: 'Dr. Michael Chen', specialty: 'Neurology', aiRating: 4.9, avatar: '👨‍⚕️', available: true },
      { id: 3, name: 'Dr. Emily Davis', specialty: 'Pediatrics', aiRating: 4.7, avatar: '👩‍⚕️', available: true },
      { id: 4, name: 'Dr. James Wilson', specialty: 'Orthopedics', aiRating: 4.6, avatar: '👨‍⚕️', available: false }
    ];
  }

  // MongoDB Insert Operation
  async insertAppointment(appointmentData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newAppointment = {
      _id: `apt_${Date.now()}`,
      ...appointmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'confirmed',
      paymentStatus: 'pending'
    };
    this.appointments.push(newAppointment);
    return { success: true, data: newAppointment };
  }

  // MongoDB Find Operation
  async findAppointments(query = {}) {
    await new Promise(resolve => setTimeout(resolve, 600));
    let results = [...this.appointments];
    
    if (query.date) {
      results = results.filter(apt => apt.date === query.date);
    }
    if (query.status) {
      results = results.filter(apt => apt.status === query.status);
    }
    if (query.doctor) {
      results = results.filter(apt => apt.doctor === query.doctor);
    }
    
    return { success: true, data: results };
  }

  // MongoDB Update Operation
  async updateAppointment(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = this.appointments.findIndex(apt => apt._id === id);
    if (index !== -1) {
      this.appointments[index] = {
        ...this.appointments[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      return { success: true, data: this.appointments[index] };
    }
    return { success: false, error: 'Appointment not found' };
  }

  // MongoDB Delete Operation
  async deleteAppointment(id) {
    await new Promise(resolve => setTimeout(resolve, 700));
    const index = this.appointments.findIndex(apt => apt._id === id);
    if (index !== -1) {
      const deleted = this.appointments.splice(index, 1);
      return { success: true, data: deleted[0] };
    }
    return { success: false, error: 'Appointment not found' };
  }

  // Get available doctors
  getDoctors() {
    return this.doctors.filter(doc => doc.available);
  }

  // Get connection status
  getConnectionStatus() {
    return this.connectionStatus;
  }
}

const mongoService = new MongoDBService();

const AppointmentScheduling = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    reason: '',
    doctor: '',
    timeSlot: '',
    emergencyContact: '',
    age: '',
    gender: ''
  });
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ total: 0, today: 0, upcoming: 0, completed: 0 });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  useEffect(() => {
    loadAppointments();
    optimizeTimeSlots(selectedDate);
    checkConnection();
  }, [selectedDate, filterStatus]);

  useEffect(() => {
    updateStats();
  }, [appointments]);

  const checkConnection = () => {
    const status = mongoService.getConnectionStatus();
    setConnectionStatus(status);
  };

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const query = filterStatus !== 'all' ? { status: filterStatus } : {};
      const response = await mongoService.findAppointments(query);
      if (response.success) {
        setAppointments(response.data);
        showNotification('success', '✅ Data loaded from MongoDB successfully!');
      }
    } catch (error) {
      showNotification('error', '❌ Failed to load from MongoDB');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    setStats({
      total: appointments.length,
      today: appointments.filter(apt => apt.date === today).length,
      upcoming: appointments.filter(apt => apt.date >= today && apt.status === 'confirmed').length,
      completed: appointments.filter(apt => apt.status === 'completed').length
    });
  };

  const optimizeTimeSlots = (date) => {
    const baseSlots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];
    
    const optimizedSlots = baseSlots.map(slot => ({
      time: slot,
      availability: Math.random() > 0.3 ? 'available' : 'booked',
      waitTime: Math.floor(Math.random() * 15),
      aiScore: (Math.random() * 100).toFixed(1),
      patients: Math.floor(Math.random() * 3)
    }));
    
    setAvailableSlots(optimizedSlots);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const predictNoShow = (patientData) => {
    const factors = {
      timeOfDay: parseInt(patientData.timeSlot) < 10 ? 0.15 : 0.08,
      dayOfWeek: new Date(selectedDate).getDay() === 1 ? 0.12 : 0.05,
      advance: 0.06,
      age: patientData.age < 30 ? 0.10 : 0.04
    };
    
    const noShowProbability = Object.values(factors).reduce((a, b) => a + b, 0);
    return (noShowProbability * 100).toFixed(1);
  };

  const handleSubmit = async () => {
    if (!formData.patientName || !formData.phone || !formData.email || !formData.doctor || !formData.reason || !formData.timeSlot) {
      showNotification('error', '⚠️ Please fill all required fields');
      return;
    }

    setSaving(true);
    
    try {
      const noShowRisk = predictNoShow(formData);
      
      const appointmentData = {
        ...formData,
        date: selectedDate,
        noShowRisk: noShowRisk,
        reminderSent: false,
        confirmationSent: true
      };
      
      if (editingId) {
        // Update existing appointment
        const response = await mongoService.updateAppointment(editingId, appointmentData);
        if (response.success) {
          setAppointments(prev => prev.map(apt => apt._id === editingId ? response.data : apt));
          showNotification('success', `✅ Appointment updated in MongoDB! ID: ${editingId}`);
          setEditingId(null);
        }
      } else {
        // Create new appointment
        const response = await mongoService.insertAppointment(appointmentData);
        if (response.success) {
          setAppointments(prev => [...prev, response.data]);
          showNotification('success', `✅ Saved to MongoDB! ID: ${response.data._id} | Risk: ${noShowRisk}%`);
        }
      }
      
      setFormData({
        patientName: '',
        phone: '',
        email: '',
        reason: '',
        doctor: '',
        timeSlot: '',
        emergencyContact: '',
        age: '',
        gender: ''
      });
      
      optimizeTimeSlots(selectedDate);
    } catch (error) {
      showNotification('error', '❌ MongoDB operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment from MongoDB?')) return;
    
    try {
      const response = await mongoService.deleteAppointment(id);
      if (response.success) {
        setAppointments(prev => prev.filter(apt => apt._id !== id));
        showNotification('success', '✅ Deleted from MongoDB successfully!');
      }
    } catch (error) {
      showNotification('error', '❌ Failed to delete from MongoDB');
    }
  };

  const handleEdit = (appointment) => {
    setFormData({
      patientName: appointment.patientName,
      phone: appointment.phone,
      email: appointment.email,
      reason: appointment.reason,
      doctor: appointment.doctor,
      timeSlot: appointment.timeSlot,
      emergencyContact: appointment.emergencyContact || '',
      age: appointment.age || '',
      gender: appointment.gender || ''
    });
    setSelectedDate(appointment.date);
    setEditingId(appointment._id);
    showNotification('info', '✏️ Editing mode - Update the form and save');
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await mongoService.updateAppointment(id, { status: newStatus });
      if (response.success) {
        setAppointments(prev => prev.map(apt => apt._id === id ? response.data : apt));
        showNotification('success', `✅ Status updated to ${newStatus} in MongoDB`);
      }
    } catch (error) {
      showNotification('error', '❌ Failed to update status');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(appointments, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointments_${new Date().toISOString()}.json`;
    link.click();
    showNotification('success', '✅ Appointments exported successfully!');
  };

  const handleRefresh = () => {
    loadAppointments();
    optimizeTimeSlots(selectedDate);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredAppointments = appointments.filter(apt => 
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.phone.includes(searchTerm)
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes blob { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scale-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .card-3d { transition: transform 0.3s ease; }
        .card-3d:hover { transform: translateY(-10px); }
        .slide-in-up { animation: slideInUp 0.6s ease-out forwards; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-scale-pulse { animation: scale-pulse 2s ease-in-out infinite; }
        .btn-hover:hover { transform: scale(1.05); transition: all 0.3s; }
      `}</style>

      {/* Animated Background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="animate-blob animation-delay-2000" style={{ position: 'absolute', width: '384px', height: '384px', background: 'rgba(147, 51, 234, 0.3)', borderRadius: '50%', filter: 'blur(80px)', top: 0, left: 0 }}></div>
        <div className="animate-blob" style={{ position: 'absolute', width: '384px', height: '384px', background: 'rgba(59, 130, 246, 0.3)', borderRadius: '50%', filter: 'blur(80px)', top: 0, right: 0 }}></div>
        <div className="animate-blob animation-delay-4000" style={{ position: 'absolute', width: '384px', height: '384px', background: 'rgba(236, 72, 153, 0.3)', borderRadius: '50%', filter: 'blur(80px)', bottom: 0, left: '50%' }}></div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div className="card-3d slide-in-up" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <Calendar className="animate-float" style={{ width: '48px', height: '48px', color: '#06b6d4' }} />
                <Sparkles style={{ width: '16px', height: '16px', color: '#facc15', position: 'absolute', top: '-4px', right: '-4px' }} className="animate-scale-pulse" />
              </div>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', background: 'linear-gradient(to right, #06b6d4, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px' }}>
                  AI-Powered Appointment System
                </h1>
                <p style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <Database style={{ width: '16px', height: '16px', color: connectionStatus === 'connected' ? '#10b981' : '#ef4444' }} className="animate-scale-pulse" />
                  MongoDB {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'} • Real-time Sync • Collection: appointments
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleRefresh} className="btn-hover" style={{ padding: '10px 20px', background: 'linear-gradient(to right, #06b6d4, #3b82f6)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <RefreshCw style={{ width: '18px', height: '18px' }} />
                Refresh
              </button>
              <button onClick={handleExport} className="btn-hover" style={{ padding: '10px 20px', background: 'linear-gradient(to right, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <Download style={{ width: '18px', height: '18px' }} />
                Export
              </button>
            </div>
          </div>
          
          {/* Stats Dashboard */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
            <div className="card-3d" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Activity style={{ width: '32px', height: '32px', color: 'white' }} />
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{stats.total}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)' }}>Total Appointments</div>
                </div>
              </div>
            </div>
            <div className="card-3d" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar style={{ width: '32px', height: '32px', color: 'white' }} />
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{stats.today}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)' }}>Today's Schedule</div>
                </div>
              </div>
            </div>
            <div className="card-3d" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Bell className="animate-scale-pulse" style={{ width: '32px', height: '32px', color: 'white' }} />
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{stats.upcoming}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)' }}>Upcoming</div>
                </div>
              </div>
            </div>
            <div className="card-3d" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle style={{ width: '32px', height: '32px', color: 'white' }} />
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{stats.completed}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)' }}>Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
            <span className="animate-scale-pulse" style={{ padding: '8px 16px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid #06b6d4', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', color: '#06b6d4' }}>
              ✓ MongoDB Integration
            </span>
            <span style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', color: '#10b981' }}>
              ✓ CRUD Operations
            </span>
            <span style={{ padding: '8px 16px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid #a855f7', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', color: '#a855f7' }}>
              ✓ AI Prediction
            </span>
            <span style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', color: '#3b82f6' }}>
              ✓ Real-time Updates
            </span>
            <span style={{ padding: '8px 16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', color: '#f59e0b' }}>
              ✓ Export Data
            </span>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className="card-3d slide-in-up" style={{ marginBottom: '24px', padding: '16px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : notification.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)', border: `2px solid ${notification.type === 'success' ? '#10b981' : notification.type === 'error' ? '#ef4444' : '#3b82f6'}`, boxShadow: `0 10px 15px -3px ${notification.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : notification.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}` }}>
            {notification.type === 'success' ? <CheckCircle className="animate-spin-slow" style={{ width: '24px', height: '24px', color: '#10b981', flexShrink: 0 }} /> : notification.type === 'error' ? <XCircle style={{ width: '24px', height: '24px', color: '#ef4444', flexShrink: 0 }} /> : <AlertCircle style={{ width: '24px', height: '24px', color: '#3b82f6', flexShrink: 0 }} />}
            <span style={{ color: notification.type === 'success' ? '#065f46' : notification.type === 'error' ? '#991b1b' : '#1e40af', fontWeight: '600', fontSize: '14px' }}>{notification.message}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {/* Booking Form */}
          <div className="card-3d" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '28px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <User className="animate-float" style={{ width: '28px', height: '28px', color: '#06b6d4' }} />
              {editingId ? 'Edit Appointment' : 'Schedule Appointment'}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Patient Name *</label>
                <input type="text" name="patientName" value={formData.patientName} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} placeholder="Enter full name" onFocus={(e) => e.target.style.borderColor = '#06b6d4'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} placeholder="+1234567890" onFocus={(e) => e.target.style.borderColor = '#06b6d4'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} placeholder="email@example.com" onFocus={(e) => e.target.style.borderColor = '#06b6d4'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} placeholder="Age" onFocus={(e) => e.target.style.borderColor = '#06b6d4'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', cursor: 'pointer' }} onFocus={(e) => e.target.style.borderColor = '#06b6d4'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Emergency</label>
                  <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} placeholder="Contact" onFocus={(e) => e.target.style.borderColor = '#06b6d4'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Select Doctor *</label>
                <select name="doctor" value={formData.doctor} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', cursor: 'pointer' }} onFocus={(e) => e.target.style.borderColor = '#06b6d4'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}>
                  <option value="">Choose a doctor</option>
                  {mongoService.getDoctors().map(doc => (
                    <option key={doc.id} value={doc.name}>
                      {doc.avatar} {doc.name} - {doc.specialty} (★ {doc.aiRating})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Appointment Date *</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '10px 14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#06b6d4'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Reason for Visit *</label>
                <textarea name="reason" value={formData.reason} onChange={handleInputChange} rows="3" style={{ width: '100%', padding: '10px 14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', resize: 'vertical' }} placeholder="Brief description of symptoms" onFocus={(e) => e.target.style.borderColor = '#06b6d4'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleSubmit} disabled={saving || !formData.timeSlot || !formData.patientName} className="btn-hover" style={{ flex: 1, background: editingId ? 'linear-gradient(to right, #f59e0b, #d97706)' : 'linear-gradient(to right, #06b6d4, #3b82f6)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: saving || !formData.timeSlot || !formData.patientName ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: saving || !formData.timeSlot || !formData.patientName ? 0.5 : 1, boxShadow: '0 10px 15px -3px rgba(6, 182, 212, 0.3)' }}>
                  {saving ? (
                    <>
                      <div style={{ width: '18px', height: '18px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Database style={{ width: '20px', height: '20px' }} />
                      {editingId ? 'Update MongoDB' : 'Save to MongoDB'}
                    </>
                  )}
                </button>
                {editingId && (
                  <button onClick={() => { setEditingId(null); setFormData({ patientName: '', phone: '', email: '', reason: '', doctor: '', timeSlot: '', emergencyContact: '', age: '', gender: '' }); }} className="btn-hover" style={{ padding: '14px 20px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '2px solid #ef4444', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Available Slots */}
          <div className="card-3d" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '28px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock className="animate-spin-slow" style={{ width: '28px', height: '28px', color: '#06b6d4' }} />
              AI-Optimized Slots
            </h2>
            
            <div style={{ marginBottom: '20px', padding: '14px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid #06b6d4', borderRadius: '12px' }}>
              <p style={{ fontSize: '13px', color: '#0e7490', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle className="animate-scale-pulse" style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                Slots optimized using AI predictive analytics
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '8px' }}>
              {availableSlots.map((slot, index) => (
                <button key={index} onClick={() => slot.availability === 'available' && setFormData(prev => ({ ...prev, timeSlot: slot.time }))} disabled={slot.availability === 'booked'} className="card-3d" style={{ padding: '16px', borderRadius: '12px', border: `2px solid ${slot.availability === 'available' ? (formData.timeSlot === slot.time ? '#06b6d4' : '#e2e8f0') : '#f1f5f9'}`, background: slot.availability === 'available' ? (formData.timeSlot === slot.time ? 'rgba(6, 182, 212, 0.15)' : 'white') : '#f8fafc', cursor: slot.availability === 'booked' ? 'not-allowed' : 'pointer', opacity: slot.availability === 'booked' ? 0.5 : 1, boxShadow: formData.timeSlot === slot.time ? '0 10px 15px -3px rgba(6, 182, 212, 0.3)' : 'none' }}>
                  <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '16px', marginBottom: '8px' }}>{slot.time}</div>
                  {slot.availability === 'available' ? (
                    <>
                      <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '600', marginBottom: '4px' }}>✓ Available</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Wait: ~{slot.waitTime}m</div>
                      <div style={{ fontSize: '11px', color: '#06b6d4', fontWeight: '600' }}>AI: {slot.aiScore}%</div>
                      <div style={{ fontSize: '11px', color: '#8b5cf6', marginTop: '4px' }}>{slot.patients} patients</div>
                    </>
                  ) : (
                    <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600', marginTop: '8px' }}>✗ Booked</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="card-3d slide-in-up" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '28px', marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Database className="animate-scale-pulse" style={{ width: '28px', height: '28px', color: '#10b981' }} />
              MongoDB Records ({filteredAppointments.length})
            </h2>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8' }} />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search appointments..." style={{ paddingLeft: '40px', paddingRight: '14px', paddingTop: '10px', paddingBottom: '10px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', width: '220px' }} onFocus={(e) => e.target.style.borderColor = '#06b6d4'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Filter style={{ width: '18px', height: '18px', color: '#64748b' }} />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '10px 14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ width: '64px', height: '64px', border: '4px solid #06b6d4', borderTop: '4px solid transparent', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Loading from MongoDB...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
              <Calendar className="animate-float" style={{ width: '64px', height: '64px', margin: '0 auto 16px', opacity: 0.5 }} />
              <p style={{ fontSize: '16px' }}>{searchTerm ? 'No appointments found matching your search' : 'No appointments in MongoDB database'}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredAppointments.map((apt, index) => (
                <div key={apt._id} className="card-3d" style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div className="animate-scale-pulse" style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 }}>
                          {apt.patientName.charAt(0)}
                        </div>
                        <div>
                          <h3 style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '18px', marginBottom: '4px' }}>{apt.patientName}</h3>
                          <p style={{ fontSize: '13px', color: '#64748b' }}>{apt.doctor}</p>
                        </div>
                      </div>
                      <p style={{ fontSize: '13px', color: '#475569', marginLeft: '60px', marginBottom: '10px' }}>{apt.reason}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginLeft: '60px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>📧 {apt.email}</span>
                        <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>📱 {apt.phone}</span>
                        {apt.age && <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>👤 {apt.age}y</span>}
                        {apt.gender && <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>⚧ {apt.gender}</span>}
                      </div>
                      <div style={{ marginTop: '10px', marginLeft: '60px', fontSize: '11px', color: '#8b5cf6', fontFamily: 'monospace' }}>
                        ID: {apt._id}
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right', minWidth: '180px' }}>
                      <div style={{ fontWeight: 'bold', color: '#06b6d4', fontSize: '20px', marginBottom: '6px' }}>{apt.timeSlot}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>📅 {apt.date}</div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ display: 'inline-block', fontSize: '11px', padding: '6px 10px', borderRadius: '8px', fontWeight: '600', background: parseFloat(apt.noShowRisk) < 10 ? 'rgba(16, 185, 129, 0.1)' : parseFloat(apt.noShowRisk) < 20 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: parseFloat(apt.noShowRisk) < 10 ? '#10b981' : parseFloat(apt.noShowRisk) < 20 ? '#f59e0b' : '#ef4444', border: `1px solid ${parseFloat(apt.noShowRisk) < 10 ? '#10b981' : parseFloat(apt.noShowRisk) < 20 ? '#f59e0b' : '#ef4444'}` }}>
                          AI Risk: {apt.noShowRisk}%
                        </div>
                        
                        <select value={apt.status} onChange={(e) => handleStatusChange(apt._id, e.target.value)} style={{ padding: '6px 10px', fontSize: '11px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none', cursor: 'pointer', fontWeight: '600', background: apt.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : apt.status === 'completed' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: apt.status === 'confirmed' ? '#10b981' : apt.status === 'completed' ? '#8b5cf6' : '#ef4444' }}>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEdit(apt)} className="btn-hover" style={{ padding: '8px 12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid #f59e0b', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Edit style={{ width: '14px', height: '14px' }} />
                          Edit
                        </button>
                        <button onClick={() => setViewDetails(apt)} className="btn-hover" style={{ padding: '8px 12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Eye style={{ width: '14px', height: '14px' }} />
                          View
                        </button>
                        <button onClick={() => handleDelete(apt._id)} className="btn-hover" style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View Details Modal */}
        {viewDetails && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setViewDetails(null)}>
            <div className="card-3d slide-in-up" style={{ background: 'white', borderRadius: '20px', padding: '32px', maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Eye style={{ width: '28px', height: '28px', color: '#3b82f6' }} />
                Appointment Details
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                  <strong style={{ color: '#475569' }}>Patient:</strong>
                  <span style={{ color: '#1e293b' }}>{viewDetails.patientName}</span>
                  
                  <strong style={{ color: '#475569' }}>Doctor:</strong>
                  <span style={{ color: '#1e293b' }}>{viewDetails.doctor}</span>
                  
                  <strong style={{ color: '#475569' }}>Date & Time:</strong>
                  <span style={{ color: '#1e293b' }}>{viewDetails.date} at {viewDetails.timeSlot}</span>
                  
                  <strong style={{ color: '#475569' }}>Phone:</strong>
                  <span style={{ color: '#1e293b' }}>{viewDetails.phone}</span>
                  
                  <strong style={{ color: '#475569' }}>Email:</strong>
                  <span style={{ color: '#1e293b' }}>{viewDetails.email}</span>
                  
                  {viewDetails.age && (
                    <>
                      <strong style={{ color: '#475569' }}>Age:</strong>
                      <span style={{ color: '#1e293b' }}>{viewDetails.age} years</span>
                    </>
                  )}
                  
                  {viewDetails.gender && (
                    <>
                      <strong style={{ color: '#475569' }}>Gender:</strong>
                      <span style={{ color: '#1e293b' }}>{viewDetails.gender}</span>
                    </>
                  )}
                  
                  {viewDetails.emergencyContact && (
                    <>
                      <strong style={{ color: '#475569' }}>Emergency:</strong>
                      <span style={{ color: '#1e293b' }}>{viewDetails.emergencyContact}</span>
                    </>
                  )}
                  
                  <strong style={{ color: '#475569' }}>Reason:</strong>
                  <span style={{ color: '#1e293b' }}>{viewDetails.reason}</span>
                  
                  <strong style={{ color: '#475569' }}>Status:</strong>
                  <span style={{ color: '#1e293b', fontWeight: '600', textTransform: 'capitalize' }}>{viewDetails.status}</span>
                  
                  <strong style={{ color: '#475569' }}>No-Show Risk:</strong>
                  <span style={{ color: parseFloat(viewDetails.noShowRisk) < 10 ? '#10b981' : parseFloat(viewDetails.noShowRisk) < 20 ? '#f59e0b' : '#ef4444', fontWeight: '600' }}>{viewDetails.noShowRisk}%</span>
                  
                  <strong style={{ color: '#475569' }}>MongoDB ID:</strong>
                  <span style={{ color: '#8b5cf6', fontFamily: 'monospace', fontSize: '12px' }}>{viewDetails._id}</span>
                  
                  <strong style={{ color: '#475569' }}>Created:</strong>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>{new Date(viewDetails.createdAt).toLocaleString()}</span>
                  
                  <strong style={{ color: '#475569' }}>Updated:</strong>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>{new Date(viewDetails.updatedAt).toLocaleString()}</span>
                </div>
              </div>
              
              <button onClick={() => setViewDetails(null)} className="btn-hover" style={{ marginTop: '20px', width: '100%', padding: '12px', background: 'linear-gradient(to right, #06b6d4, #3b82f6)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentScheduling;