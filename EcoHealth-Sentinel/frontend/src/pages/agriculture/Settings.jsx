import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, Globe, Database, HelpCircle, Download, Trash2, Save } from 'lucide-react';

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    name: 'Enter Name',
    phone: 'Enter Phone No.',
    location: 'Enter Location',
    farmSize: 'Enter Farm Size',
    primaryCrop: 'Enter Primary Crop',
    email: 'Enter Email',
    lastUpdated: new Date().toISOString()
  });

  const [notifications, setNotifications] = useState({
    pestAlerts: true,
    priceUpdates: true,
    weatherWarnings: true,
    systemUpdates: false,
    communityPosts: true
  });

  const [privacy, setPrivacy] = useState({
    shareData: false,
    aiAnalytics: true,
    locationTracking: true,
    anonymousUsage: true
  });

  const [language, setLanguage] = useState('en');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Load saved data from memory on mount
  useEffect(() => {
    const savedProfile = window.savedProfileData;
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleNotification = (key) => {
    setNotifications({...notifications, [key]: !notifications[key]});
    showNotification(`${key.replace(/([A-Z])/g, ' $1').trim()} ${!notifications[key] ? 'enabled' : 'disabled'}`);
  };

  const togglePrivacy = (key) => {
    setPrivacy({...privacy, [key]: !privacy[key]});
    showNotification(`${key.replace(/([A-Z])/g, ' $1').trim()} ${!privacy[key] ? 'enabled' : 'disabled'}`);
  };

  const handleSaveProfile = () => {
    const updatedProfile = {
      ...profile,
      lastUpdated: new Date().toISOString()
    };
    setProfile(updatedProfile);
    
    // Save to memory
    window.savedProfileData = updatedProfile;
    
    // Create CSV content
    const csvContent = `Field,Value
Name,${updatedProfile.name}
Phone,${updatedProfile.phone}
Email,${updatedProfile.email}
Location,${updatedProfile.location}
Farm Size,${updatedProfile.farmSize}
Primary Crop,${updatedProfile.primaryCrop}
Last Updated,${new Date(updatedProfile.lastUpdated).toLocaleString()}`;

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `profile_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Profile saved and downloaded successfully!');
  };

  const handleExportData = () => {
    // Create comprehensive data export
    const exportData = {
      profile: profile,
      notifications: notifications,
      privacy: privacy,
      language: language,
      exportDate: new Date().toISOString()
    };

    // Convert to CSV format
    let csvContent = 'Category,Setting,Value\n';
    
    // Profile data
    Object.entries(profile).forEach(([key, value]) => {
      csvContent += `Profile,${key},${value}\n`;
    });
    
    // Notifications
    Object.entries(notifications).forEach(([key, value]) => {
      csvContent += `Notifications,${key},${value}\n`;
    });
    
    // Privacy
    Object.entries(privacy).forEach(([key, value]) => {
      csvContent += `Privacy,${key},${value}\n`;
    });
    
    csvContent += `Settings,Language,${language}\n`;
    csvContent += `Settings,Export Date,${new Date().toLocaleString()}\n`;

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `complete_data_export_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Complete data exported and downloaded successfully!');
  };

  const handleClearCache = () => {
    // Simulate cache clearing
    const cacheSize = Math.floor(Math.random() * 50) + 10;
    
    // Clear any stored data
    delete window.savedProfileData;
    
    setTimeout(() => {
      showNotification(`Cache cleared! ${cacheSize}MB of space freed.`);
    }, 500);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('⚠️ WARNING: This will permanently delete your account and all data. This action cannot be undone. Are you absolutely sure?')) {
      // Create final data backup before deletion
      const backupData = {
        profile: profile,
        notifications: notifications,
        privacy: privacy,
        deletionDate: new Date().toISOString()
      };
      
      const csvContent = `ACCOUNT DELETION BACKUP
Generated: ${new Date().toLocaleString()}

Profile Data:
${Object.entries(profile).map(([k, v]) => `${k}: ${v}`).join('\n')}

Notification Settings:
${Object.entries(notifications).map(([k, v]) => `${k}: ${v}`).join('\n')}

Privacy Settings:
${Object.entries(privacy).map(([k, v]) => `${k}: ${v}`).join('\n')}`;

      const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `account_backup_before_deletion_${Date.now()}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification('Account backup downloaded. Account deletion initiated.', 'warning');
      
      // Simulate account deletion
      setTimeout(() => {
        showNotification('Account deleted. You will be logged out shortly.', 'error');
      }, 2000);
    }
  };

  const handleHelpCenter = () => {
    showNotification('Opening Help Center...');
    setTimeout(() => {
      window.open('https://support.example.com/help', '_blank');
    }, 500);
  };

  const handleContactSupport = () => {
    const supportEmail = 'support@farmapp.com';
    const subject = 'Support Request';
    const body = `Hello Support Team,\n\nUser: ${profile.name}\nPhone: ${profile.phone}\nLocation: ${profile.location}\n\nIssue Description:\n`;
    
    window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showNotification('Opening email client...');
  };

  const handleSendFeedback = () => {
    const feedbackData = `Feedback Form
Submitted: ${new Date().toLocaleString()}
User: ${profile.name}
Location: ${profile.location}

Please write your feedback below:
`;
    
    const blob = new Blob([feedbackData], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `feedback_form_${Date.now()}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Feedback form downloaded. Please fill and email to support.');
  };

  return (
    <>
      <style>{`
        @keyframes slideInFromTop {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }

        .animate-slide-in {
          animation: slideInFromTop 0.3s ease-out;
        }

        .animate-pulse-bg {
          animation: pulse 4s ease-in-out infinite;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .toggle-switch {
          position: relative;
          width: 56px;
          height: 28px;
          border-radius: 9999px;
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .toggle-switch.active {
          background: linear-gradient(to right, #4ade80, #16a34a);
        }

        .toggle-switch.inactive {
          background: #d1d5db;
        }

        .toggle-knob {
          position: absolute;
          top: 2px;
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 9999px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .toggle-knob.active {
          transform: translateX(28px);
        }

        .toggle-knob.inactive {
          transform: translateX(2px);
        }

        .hover-scale {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-scale:hover {
          transform: scale(1.05);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .hover-scale-sm {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-scale-sm:hover {
          transform: scale(1.02);
        }

        .icon-rotate {
          transition: transform 0.5s ease;
        }

        .icon-rotate:hover {
          transform: rotate(180deg);
        }

        .group:hover .group-hover-translate {
          transform: translateX(8px);
          transition: transform 0.3s ease;
        }

        .input-focus {
          transition: all 0.3s ease;
        }

        .input-focus:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
        }

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          mix-blend-mode: multiply;
          animation: pulse 4s ease-in-out infinite;
        }

        .floating-orb-1 {
          top: 80px;
          left: 40px;
          width: 288px;
          height: 288px;
          background: #d8b4fe;
        }

        .floating-orb-2 {
          top: 160px;
          right: 40px;
          width: 288px;
          height: 288px;
          background: #93c5fd;
          animation-delay: 2s;
        }

        .floating-orb-3 {
          bottom: -32px;
          left: 80px;
          width: 288px;
          height: 288px;
          background: #fbcfe8;
          animation-delay: 4s;
        }

        .icon-spin-slow {
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 50%, #fce7f3 100%)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="floating-orb floating-orb-1"></div>
          <div className="floating-orb floating-orb-2"></div>
          <div className="floating-orb floating-orb-3"></div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="animate-slide-in" style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 50
          }}>
            <div className="hover-scale" style={{
              background: toastType === 'success' ? '#16a34a' : toastType === 'warning' ? '#ea580c' : '#dc2626',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div className="animate-pulse-bg" style={{
                width: '8px',
                height: '8px',
                background: 'white',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontWeight: 500 }}>{toastMessage}</span>
            </div>
          </div>
        )}

        <div style={{ maxWidth: '896px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {/* Header */}
          <div className="glass-card hover-scale" style={{
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="icon-rotate" style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <Settings style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '30px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                  background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Settings</h1>
                <p style={{ fontSize: '14px', color: '#4b5563' }}>Manage your account and preferences</p>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="glass-card hover-scale-sm" style={{
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <User style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <span style={{
                background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Profile Information</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="input-focus"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(4px)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="input-focus"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(4px)'
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="input-focus"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(4px)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>Location</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    className="input-focus"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(4px)'
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>Farm Size</label>
                  <input
                    type="text"
                    value={profile.farmSize}
                    onChange={(e) => setProfile({...profile, farmSize: e.target.value})}
                    className="input-focus"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(4px)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>Primary Crops</label>
                  <input
                    type="text"
                    value={profile.primaryCrop}
                    onChange={(e) => setProfile({...profile, primaryCrop: e.target.value})}
                    className="input-focus"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(4px)'
                    }}
                  />
                </div>
              </div>
              <button 
                onClick={handleSaveProfile}
                className="hover-scale"
                style={{
                  padding: '12px 32px',
                  background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                  color: 'white',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center'
                }}
              >
                <Save style={{ width: '20px', height: '20px' }} />
                Save & Download Profile
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="glass-card hover-scale-sm" style={{
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="animate-pulse-bg" style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <Bell style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <span style={{
                background: 'linear-gradient(to right, #d97706, #ea580c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Notification Preferences</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="hover-scale" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'linear-gradient(to right, #f9fafb, #f3f4f6)',
                  borderRadius: '12px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}>
                  <span style={{ color: '#374151', textTransform: 'capitalize', fontWeight: 500 }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => toggleNotification(key)}
                    className={`toggle-switch ${value ? 'active' : 'inactive'}`}
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    <div className={`toggle-knob ${value ? 'active' : 'inactive'}`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="glass-card hover-scale-sm" style={{
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #4ade80 0%, #059669 100%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <Shield style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <span style={{
                background: 'linear-gradient(to right, #16a34a, #059669)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Privacy & Security</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(privacy).map(([key, value]) => (
                <div key={key} className="hover-scale" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'linear-gradient(to right, #f9fafb, #f3f4f6)',
                  borderRadius: '12px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}>
                  <div>
                    <span style={{ color: '#1f2937', textTransform: 'capitalize', display: 'block', fontWeight: 500 }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {key === 'shareData' && 'Share anonymized data for agricultural research'}
                      {key === 'aiAnalytics' && 'Use AI to analyze your farm data'}
                      {key === 'locationTracking' && 'Enable weather & market alerts for your area'}
                      {key === 'anonymousUsage' && 'Help improve the app with usage statistics'}
                    </span>
                  </div>
                  <button
                    onClick={() => togglePrivacy(key)}
                    className={`toggle-switch ${value ? 'active' : 'inactive'}`}
                    style={{ border: 'none', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <div className={`toggle-knob ${value ? 'active' : 'inactive'}`}></div>
                  </button>
                </div>
              ))}
            </div>
            <div className="hover-scale-sm" style={{
              marginTop: '24px',
              padding: '20px',
              background: 'linear-gradient(to right, #dbeafe, #e0e7ff)',
              border: '2px solid #93c5fd',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#1e40af',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
              <Shield className="animate-pulse-bg" style={{ width: '20px', height: '20px', display: 'inline', marginRight: '8px' }} />
              <span style={{ fontWeight: 600 }}>Your data is encrypted and never sold to third parties</span>
            </div>
          </div>

          {/* Language */}
          <div className="glass-card hover-scale-sm" style={{
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #c084fc 0%, #db2777 100%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <Globe className="icon-spin-slow" style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <span style={{
                background: 'linear-gradient(to right, #9333ea, #db2777)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Language & Region</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>Display Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input-focus"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(4px)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>Currency</label>
                <select
                  className="input-focus"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(4px)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="inr">₹ INR (Indian Rupee)</option>
                  <option value="usd">$ USD (US Dollar)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="glass-card hover-scale-sm" style={{
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #22d3ee 0%, #2563eb 100%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <Database style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <span style={{
                background: 'linear-gradient(to right, #0891b2, #2563eb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Data Management</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={handleExportData}
                className="group hover-scale"
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #60a5fa',
                  background: 'linear-gradient(to right, #dbeafe, #e0e7ff)',
                  color: '#1d4ed8',
                  borderRadius: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <Download style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '18px' }}>Export All Data</div>
                  <div style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}>Download complete settings in CSV format</div>
                </div>
              </button>
              <button 
                onClick={handleClearCache}
                className="group hover-scale"
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #d1d5db',
                  background: 'linear-gradient(to right, #f9fafb, #f1f5f9)',
                  color: '#374151',
                  borderRadius: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <Database style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '18px' }}>Clear Cache</div>
                  <div style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}>Free up space by clearing temporary data</div>
                </div>
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="group hover-scale"
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #f87171',
                  background: 'linear-gradient(to right, #fee2e2, #fce7f3)',
                  color: '#b91c1c',
                  borderRadius: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <Trash2 style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '18px' }}>Delete Account</div>
                  <div style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}>Backup downloaded before permanent deletion</div>
                </div>
              </button>
            </div>
          </div>

          {/* Help & Support */}
          <div className="glass-card hover-scale-sm" style={{
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <HelpCircle style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <span style={{
                background: 'linear-gradient(to right, #d97706, #ea580c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Help & Support</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <button onClick={handleHelpCenter} className="group hover-scale" style={{
                padding: '20px',
                border: '2px solid #e5e7eb',
                background: 'linear-gradient(135deg, white, #f9fafb)',
                borderRadius: '12px',
                textAlign: 'left',
                cursor: 'pointer'
              }}>
                <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '18px' }}>Help Center</div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Browse FAQs and guides</div>
              </button>
              <button onClick={handleContactSupport} className="group hover-scale" style={{
                padding: '20px',
                border: '2px solid #e5e7eb',
                background: 'linear-gradient(135deg, white, #f9fafb)',
                borderRadius: '12px',
                textAlign: 'left',
                cursor: 'pointer'
              }}>
                <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '18px' }}>Contact Support</div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Email our support team</div>
              </button>
              <button onClick={handleSendFeedback} className="group hover-scale" style={{
                padding: '20px',
                border: '2px solid #e5e7eb',
                background: 'linear-gradient(135deg, white, #f9fafb)',
                borderRadius: '12px',
                textAlign: 'left',
                cursor: 'pointer'
              }}>
                <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '18px' }}>Send Feedback</div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Download feedback form</div>
              </button>
              <button className="group hover-scale" style={{
                padding: '20px',
                border: '2px solid #e5e7eb',
                background: 'linear-gradient(135deg, white, #f9fafb)',
                borderRadius: '12px',
                textAlign: 'left',
                cursor: 'pointer'
              }}>
                <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '18px' }}>About</div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Version 2.5.0</div>
              </button>
            </div>
          </div>

          {/* Responsible AI Notice */}
          <div className="hover-scale-sm" style={{
            marginTop: '24px',
            background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 50%, #ccfbf1 100%)',
            border: '2px solid #86efac',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontWeight: 700, fontSize: '20px', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="animate-pulse-bg" style={{
                padding: '8px',
                background: 'linear-gradient(135deg, #22c55e 0%, #059669 100%)',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <Shield style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <span style={{
                background: 'linear-gradient(to right, #16a34a, #059669)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Our Commitment to Responsible AI</span>
            </h3>
            <div style={{ fontSize: '14px', color: '#374151', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="hover-scale-sm" style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '8px',
                backdropFilter: 'blur(4px)'
              }}>
                <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '18px' }}>✓</span>
                <p style={{ margin: 0 }}>Your privacy is our priority - data is encrypted and never sold</p>
              </div>
              <div className="hover-scale-sm" style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '8px',
                backdropFilter: 'blur(4px)'
              }}>
                <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '18px' }}>✓</span>
                <p style={{ margin: 0 }}>AI models are trained on verified agricultural data</p>
              </div>
              <div className="hover-scale-sm" style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '8px',
                backdropFilter: 'blur(4px)'
              }}>
                <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '18px' }}>✓</span>
                <p style={{ margin: 0 }}>Transparent decision-making with explainable recommendations</p>
              </div>
              <div className="hover-scale-sm" style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '8px',
                backdropFilter: 'blur(4px)'
              }}>
                <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '18px' }}>✓</span>
                <p style={{ margin: 0 }}>Continuous monitoring for bias and fairness in AI predictions</p>
              </div>
              <div className="hover-scale-sm" style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '8px',
                backdropFilter: 'blur(4px)'
              }}>
                <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '18px' }}>✓</span>
                <p style={{ margin: 0 }}>Local data processing when possible to protect farmer privacy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;