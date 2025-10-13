import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Database, Globe, Moon, Sun, Settings, Lock, Mail, Phone, MapPin, Building, Calendar, Save, Download, Upload, Trash2, Eye, EyeOff, Key, CheckCircle, AlertCircle, LogOut, Edit, Share2, Zap, Activity, Award, Target, TrendingUp, BarChart3, RefreshCw, X, Loader } from 'lucide-react';
import axios from 'axios';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    alerts: true,
    weeklyReport: true,
    monthlyReport: true
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
    locationTracking: true,
    publicProfile: false
  });

  const [profile, setProfile] = useState({
    id: null,
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    location: '',
    role: '',
    joinDate: '',
    avatar: null
  });

  const [preferences, setPreferences] = useState({
    language: 'English',
    timezone: 'IST (UTC +5:30)',
    temperatureUnit: 'Celsius (°C)',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR (₹)',
    theme: 'light'
  });

  const [storageInfo, setStorageInfo] = useState({
    used: 0,
    total: 10,
    percentage: 0,
    breakdown: {}
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorData, setTwoFactorData] = useState({
    qrCode: '',
    secret: '',
    code: ''
  });

 // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('authToken');

  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User, color: '#3b82f6' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: '#8b5cf6' },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield, color: '#10b981' },
    { id: 'data', name: 'Data Management', icon: Database, color: '#f59e0b' },
    { id: 'preferences', name: 'Preferences', icon: Globe, color: '#ec4899' },
    { id: 'account', name: 'Account', icon: Settings, color: '#6b7280' }
  ];

  // Fetch all settings on component mount
  useEffect(() => {
    fetchAllSettings();
  }, []);

  useEffect(() => {
    if (saveSuccess || error) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess, error]);

  // Fetch all settings from backend
  const fetchAllSettings = async () => {
    setInitialLoad(true);
    try {
      const [profileRes, notifRes, privacyRes, prefsRes, storageRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/settings/profile`, axiosConfig),
        axios.get(`${API_BASE_URL}/settings/notifications`, axiosConfig),
        axios.get(`${API_BASE_URL}/settings/privacy`, axiosConfig),
        axios.get(`${API_BASE_URL}/settings/preferences`, axiosConfig),
        axios.get(`${API_BASE_URL}/settings/storage`, axiosConfig)
      ]);

      setProfile(profileRes.data);
      setNotifications(notifRes.data);
      setPrivacy(privacyRes.data);
      setPreferences(prefsRes.data);
      setStorageInfo(storageRes.data);
      setDarkMode(prefsRes.data.theme === 'dark');
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings. Please refresh the page.');
    } finally {
      setInitialLoad(false);
    }
  };

  // Save profile to backend
  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/settings/profile`,
        profile,
        axiosConfig
      );
      
      setProfile(response.data);
      setSaveSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  // Save notifications to backend
  const handleSaveNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(
        `${API_BASE_URL}/settings/notifications`,
        notifications,
        axiosConfig
      );
      
      setSaveSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save notification settings');
    } finally {
      setLoading(false);
    }
  };

  // Save privacy settings to backend
  const handleSavePrivacy = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(
        `${API_BASE_URL}/settings/privacy`,
        privacy,
        axiosConfig
      );
      
      setSaveSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save privacy settings');
    } finally {
      setLoading(false);
    }
  };

  // Save preferences to backend
  const handleSavePreferences = async () => {
    setLoading(true);
    setError(null);
    try {
      const prefsToSave = {
        ...preferences,
        theme: darkMode ? 'dark' : 'light'
      };

      await axios.put(
        `${API_BASE_URL}/settings/preferences`,
        prefsToSave,
        axiosConfig
      );
      
      setSaveSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  // Export data
  const handleExportData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/settings/export`,
        { format: 'json' },
        {
          ...axiosConfig,
          responseType: 'blob'
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `settings_export_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setSaveSuccess(true);
    } catch (err) {
      setError('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  // Delete all data
  const handleDeleteData = async () => {
    if (window.confirm('⚠️ WARNING: This will permanently delete ALL your data!\n\nAre you absolutely sure?')) {
      if (window.confirm('🔴 FINAL CONFIRMATION: This action CANNOT be undone!')) {
        setLoading(true);
        try {
          await axios.delete(
            `${API_BASE_URL}/settings/data`,
            axiosConfig
          );
          
          // Clear local storage and redirect to login
          localStorage.clear();
          window.location.href = '/login';
        } catch (err) {
          setError('Failed to delete data');
          setLoading(false);
        }
      }
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${API_BASE_URL}/settings/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        axiosConfig
      );
      
      setSaveSuccess(true);
      setShowModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Enable 2FA
  const handleEnable2FA = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!twoFactorData.secret) {
        // Generate 2FA secret
        const response = await axios.post(
          `${API_BASE_URL}/settings/2fa/generate`,
          {},
          axiosConfig
        );
        
        setTwoFactorData({
          qrCode: response.data.qrCode,
          secret: response.data.secret,
          code: ''
        });
      } else {
        // Verify code and enable 2FA
        await axios.post(
          `${API_BASE_URL}/settings/2fa/enable`,
          { code: twoFactorData.code, secret: twoFactorData.secret },
          axiosConfig
        );
        
        setSaveSuccess(true);
        setShowModal(false);
        setTwoFactorData({ qrCode: '', secret: '', code: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enable 2FA');
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        axiosConfig
      );
      
      localStorage.clear();
      window.location.href = '/login';
    } catch (err) {
      // Even if API fails, clear local storage and redirect
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  // Upload avatar
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/settings/avatar`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setProfile({ ...profile, avatar: response.data.avatarUrl });
      setSaveSuccess(true);
    } catch (err) {
      setError('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const toggleNotification = async (key) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    
    // Auto-save on toggle
    try {
      await axios.put(
        `${API_BASE_URL}/settings/notifications`,
        newNotifications,
        axiosConfig
      );
    } catch (err) {
      console.error('Failed to save notification:', err);
    }
  };

  const togglePrivacy = async (key) => {
    const newPrivacy = { ...privacy, [key]: !privacy[key] };
    setPrivacy(newPrivacy);
    
    // Auto-save on toggle
    try {
      await axios.put(
        `${API_BASE_URL}/settings/privacy`,
        newPrivacy,
        axiosConfig
      );
    } catch (err) {
      console.error('Failed to save privacy setting:', err);
    }
  };

  if (initialLoad) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader style={{ width: '48px', height: '48px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .settings-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f9fafb 0%, #dbeafe 50%, #e0f2fe 100%);
          padding: 2rem 1rem;
        }

        .container-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        .header-card {
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          margin-bottom: 2rem;
          border-top: 4px solid #3b82f6;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .header-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .settings-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1.5rem;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .gradient-title {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .layout-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
        }

        .sidebar {
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 1.5rem;
          height: fit-content;
          position: sticky;
          top: 2rem;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 1rem;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .nav-item:hover {
          background: #f3f4f6;
          transform: translateX(5px);
        }

        .nav-item.active {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
          transform: translateX(5px) scale(1.02);
        }

        .content-area {
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 2rem;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .btn {
          padding: 0.875rem 1.5rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .btn-danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }

        .toggle-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem;
          background: #f9fafb;
          border-radius: 0.75rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .toggle-container:hover {
          background: #f3f4f6;
          transform: translateX(5px);
        }

        .toggle-switch {
          position: relative;
          width: 48px;
          height: 24px;
          background: #d1d5db;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-switch.active {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        }

        .toggle-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .toggle-switch.active .toggle-knob {
          transform: translateX(24px);
        }

        .toast {
          position: fixed;
          top: 2rem;
          right: 2rem;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          animation: slideIn 0.3s ease;
          z-index: 1000;
        }

        .toast.success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .toast.error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }

        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal-content {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
        }

        .card {
          background: #f9fafb;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .card:hover {
          border-color: #3b82f6;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.1);
          transform: translateY(-3px);
        }

        @media (max-width: 1024px) {
          .layout-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="settings-container">
        <div className="container-wrapper">
          
          {/* Header */}
          <div className="header-card">
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <div className="settings-icon">
                <Settings style={{ width: '28px', height: '28px', color: 'white' }} />
              </div>
              <div>
                <h1 className="gradient-title">Settings & Preferences</h1>
                <p style={{ color: '#6b7280', fontSize: '1rem' }}>Manage your account • Connected to database</p>
              </div>
            </div>
          </div>

          {/* Success/Error Toasts */}
          {saveSuccess && (
            <div className="toast success">
              <CheckCircle style={{ width: '24px', height: '24px' }} />
              <span style={{ fontWeight: 600 }}>Changes saved successfully!</span>
            </div>
          )}

          {error && (
            <div className="toast error">
              <AlertCircle style={{ width: '24px', height: '24px' }} />
              <span style={{ fontWeight: 600 }}>{error}</span>
            </div>
          )}

          {/* Main Layout */}
          <div className="layout-grid">
            
            {/* Sidebar */}
            <div className="sidebar">
              <nav>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                      style={{ color: activeTab === tab.id ? 'white' : '#374151' }}
                    >
                      <Icon style={{ width: '20px', height: '20px', marginRight: '0.75rem' }} />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content Area */}
            <div className="content-area">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="section-title">Profile Settings</h2>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Organization</label>
                      <input
                        type="text"
                        value={profile.organization}
                        onChange={(e) => setProfile({...profile, organization: e.target.value})}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <select value={profile.role} onChange={(e) => setProfile({...profile, role: e.target.value})} className="form-input">
                        <option>System Administrator</option>
                        <option>Environmental Officer</option>
                        <option>Field Manager</option>
                        <option>Analyst</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Profile Picture</label>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="form-input" />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button onClick={handleSaveProfile} disabled={loading} className="btn btn-primary">
                      {loading ? <Loader style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} /> : <Save style={{ width: '20px', height: '20px' }} />}
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="section-title">Notification Preferences</h2>

                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="toggle-container">
                      <div>
                        <p style={{ fontWeight: 600, color: '#111827', textTransform: 'capitalize', marginBottom: '0.25rem' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Receive {key.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications
                        </p>
                      </div>
                      <div onClick={() => toggleNotification(key)} className={`toggle-switch ${value ? 'active' : ''}`}>
                        <div className="toggle-knob" />
                      </div>
                    </div>
                  ))}

                  <div style={{ marginTop: '2rem' }}>
                    <button onClick={handleSaveNotifications} disabled={loading} className="btn btn-primary">
                      {loading ? <Loader style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} /> : <Save style={{ width: '20px', height: '20px' }} />}
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="section-title">Privacy & Security</h2>

                  <div className="card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Security Actions</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <button onClick={() => { setModalType('password'); setShowModal(true); }} className="btn btn-primary">
                        <Key style={{ width: '20px', height: '20px' }} />
                        Change Password
                      </button>
                      <button onClick={() => { setModalType('2fa'); setShowModal(true); }} className="btn btn-primary">
                        <Shield style={{ width: '20px', height: '20px' }} />
                        Enable 2FA
                      </button>
                    </div>
                  </div>

                  {Object.entries(privacy).map(([key, value]) => (
                    <div key={key} className="toggle-container">
                      <div>
                        <p style={{ fontWeight: 600, color: '#111827', textTransform: 'capitalize', marginBottom: '0.25rem' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Allow {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </p>
                      </div>
                      <div onClick={() => togglePrivacy(key)} className={`toggle-switch ${value ? 'active' : ''}`}>
                        <div className="toggle-knob" />
                      </div>
                    </div>
                  ))}

                  <div style={{ marginTop: '2rem' }}>
                    <button onClick={handleDeleteData} className="btn btn-danger">
                      <Trash2 style={{ width: '20px', height: '20px' }} />
                      Delete All My Data
                    </button>
                  </div>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === 'data' && (
                <div>
                  <h2 className="section-title">Data Management</h2>

                  <div className="card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Export Your Data</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                      Download all your data from the database
                    </p>
                    <button onClick={handleExportData} disabled={loading} className="btn btn-primary">
                      {loading ? <Loader style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} /> : <Download style={{ width: '20px', height: '20px' }} />}
                      Export Data
                    </button>
                  </div>

                  <div className="card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Storage Usage</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      <span>Used: {storageInfo.used} GB</span>
                      <span>Total: {storageInfo.total} GB</span>
                    </div>
                    <div style={{ width: '100%', height: '12px', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${storageInfo.percentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                        borderRadius: '9999px'
                      }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="section-title">System Preferences</h2>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Language</label>
                      <select value={preferences.language} onChange={(e) => setPreferences({...preferences, language: e.target.value})} className="form-input">
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Bengali</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Timezone</label>
                      <select value={preferences.timezone} onChange={(e) => setPreferences({...preferences, timezone: e.target.value})} className="form-input">
                        <option>IST (UTC +5:30)</option>
                        <option>UTC</option>
                        <option>EST</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Temperature Unit</label>
                      <select value={preferences.temperatureUnit} onChange={(e) => setPreferences({...preferences, temperatureUnit: e.target.value})} className="form-input">
                        <option>Celsius (°C)</option>
                        <option>Fahrenheit (°F)</option>
                      </select>
                    </div>
                  </div>

                  <div className="toggle-container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {darkMode ? <Moon style={{ width: '24px', height: '24px' }} /> : <Sun style={{ width: '24px', height: '24px' }} />}
                      <div>
                        <p style={{ fontWeight: 600 }}>Dark Mode</p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Toggle theme</p>
                      </div>
                    </div>
                    <div onClick={() => setDarkMode(!darkMode)} className={`toggle-switch ${darkMode ? 'active' : ''}`}>
                      <div className="toggle-knob" />
                    </div>
                  </div>

                  <button onClick={handleSavePreferences} disabled={loading} className="btn btn-primary">
                    {loading ? <Loader style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} /> : <Save style={{ width: '20px', height: '20px' }} />}
                    Save Preferences
                  </button>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="section-title">Account Management</h2>

                  <div className="card">
                    <button onClick={handleLogout} className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                      <LogOut style={{ width: '20px', height: '20px' }} />
                      Logout
                    </button>
                  </div>

                  <div className="card">
                    <button onClick={handleDeleteData} className="btn btn-danger" style={{ width: '100%', justifyContent: 'flex-start' }}>
                      <Trash2 style={{ width: '20px', height: '20px' }} />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Password Modal */}
        {showModal && modalType === 'password' && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Change Password</h3>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="form-input" />
              </div>
              <button onClick={handleChangePassword} disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                {loading ? <Loader style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} /> : <Save style={{ width: '20px', height: '20px' }} />}
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* 2FA Modal */}
        {showModal && modalType === '2fa' && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Enable 2FA</h3>
              {twoFactorData.qrCode && (
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <img src={twoFactorData.qrCode} alt="QR Code" style={{ maxWidth: '200px' }} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Enter 6-digit code</label>
                <input type="text" value={twoFactorData.code} onChange={(e) => setTwoFactorData({...twoFactorData, code: e.target.value})} className="form-input" maxLength="6" />
              </div>
              <button onClick={handleEnable2FA} disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                {loading ? <Loader style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} /> : <Shield style={{ width: '20px', height: '20px' }} />}
                {twoFactorData.secret ? 'Verify & Enable' : 'Generate QR Code'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
