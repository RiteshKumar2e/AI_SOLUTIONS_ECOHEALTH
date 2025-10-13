// src/pages/admin/Settings.jsx
import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Lock, Bell, Database, Eye, EyeOff, Save, RefreshCw, Sun, Moon, CheckCircle, AlertTriangle, Upload, Download, Camera, Trash2 } from 'lucide-react';

export default function AdminSettings() {
  // Load theme from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminTheme');
    return saved === 'dark';
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarPreview, setAvatarPreview] = useState('');

  // Profile Settings
  const [profile, setProfile] = useState({
name: 'Ritesh Kumar',
email: 'ritesh.kumar@aju.edu.in',
phone: '+91-98765-43210',
role: 'Administrator',
avatar: '', 
bio: 'Managing and monitoring all AI-driven platforms with a focus on innovation and security.',
department: 'AI & Data Analytics',
location: 'Jamshedpur, India'

  });

  // Security Settings
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    sessionTimeout: '30',
    loginAlerts: true
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    securityAlerts: true,
    userActivityAlerts: true,
    systemUpdates: true,
    weeklyReports: true,
    dailyDigest: false
  });

  // System Settings
  const [system, setSystem] = useState({
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: '90',
    maxUploadSize: '10',
    debugMode: false,
    analyticsEnabled: true
  });

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('adminTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setProfile({ ...profile, avatar: reader.result });
        showNotification('Avatar uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('Profile updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSecurity = async () => {
    if (security.newPassword && security.newPassword !== security.confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }

    if (security.newPassword && security.newPassword.length < 8) {
      showNotification('Password must be at least 8 characters!', 'error');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('Security settings updated successfully!');
      setSecurity({ ...security, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error updating security settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('Notification settings updated!');
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error updating notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSystem = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('System settings updated!');
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error updating system settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportSettings = () => {
    const settings = { profile, security: { ...security, currentPassword: '', newPassword: '', confirmPassword: '' }, notifications, system };
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Settings exported successfully!');
  };

  const handleImportSettings = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported.profile) setProfile(imported.profile);
          if (imported.notifications) setNotifications(imported.notifications);
          if (imported.system) setSystem(imported.system);
          showNotification('Settings imported successfully!');
        } catch (error) {
          showNotification('Invalid settings file!', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetSettings = () => {
    if (!window.confirm('Reset all settings to default? This cannot be undone.')) return;
    
    setProfile({ name: 'Admin User', email: 'admin@ecohealth.com', phone: '+1-555-0100', role: 'Super Admin', avatar: '', bio: 'System Administrator', department: 'IT & Operations', location: 'San Francisco, CA' });
    setNotifications({ emailNotifications: true, smsNotifications: false, pushNotifications: true, securityAlerts: true, userActivityAlerts: true, systemUpdates: true, weeklyReports: true, dailyDigest: false });
    setSystem({ maintenanceMode: false, autoBackup: true, backupFrequency: 'daily', dataRetention: '90', maxUploadSize: '10', debugMode: false, analyticsEnabled: true });
    showNotification('Settings reset to defaults!');
  };

  const theme = {
    bg: isDarkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f8fafc 100%)',
    cardBg: isDarkMode ? 'rgba(51,65,85,0.7)' : 'rgba(255,255,255,0.95)',
    cardBorder: isDarkMode ? 'rgba(71,85,105,0.8)' : 'rgba(226,232,240,0.8)',
    text: isDarkMode ? '#fff' : '#0f172a',
    textSecondary: isDarkMode ? '#94a3b8' : '#64748b',
    inputBg: isDarkMode ? 'rgba(30,41,59,0.6)' : 'rgba(248,250,252,0.9)',
    inputBorder: isDarkMode ? '#475569' : '#cbd5e1',
    shadow: isDarkMode ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.1)'
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Database }
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: theme.bg, backgroundSize: '400% 400%', animation: 'gradientShift 15s ease infinite', fontFamily: 'Inter, sans-serif', color: theme.text, transition: 'all 0.3s ease' }}>
      <style>{`
        @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
        .tab-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3); }
        .save-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); }
        .toggle-switch { position: relative; width: 50px; height: 26px; background: ${isDarkMode ? '#475569' : '#cbd5e1'}; border-radius: 13px; cursor: pointer; transition: all 0.3s; }
        .toggle-switch.active { background: #3b82f6; }
        .toggle-slider { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .toggle-switch.active .toggle-slider { transform: translateX(24px); }
        .avatar-upload { position: relative; width: 120px; height: 120px; border-radius: 50%; overflow: hidden; cursor: pointer; border: 4px solid #3b82f6; transition: all 0.3s; }
        .avatar-upload:hover { transform: scale(1.05); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); }
        .avatar-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
        .avatar-upload:hover .avatar-overlay { opacity: 1; }
        input[type="file"] { display: none; }
      `}</style>

      {/* Notification */}
      {notification.show && (
        <div style={{ position: 'fixed', top: '2rem', right: '2rem', padding: '1rem 1.5rem', background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 10000, display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'slideIn 0.3s ease-out', borderLeft: `4px solid ${notification.type === 'success' ? '#10b981' : '#ef4444'}` }}>
          {notification.type === 'success' ? <CheckCircle size={20} color="#10b981" /> : <AlertTriangle size={20} color="#ef4444" />}
          <span style={{ fontWeight: 700, color: '#1e293b' }}>{notification.message}</span>
        </div>
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '20px', display: 'flex', boxShadow: '0 8px 20px rgba(59,130,246,0.4)', animation: 'pulse 3s ease-in-out infinite' }}>
                <SettingsIcon size={36} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: '2.75rem', fontWeight: '900', margin: 0, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin Settings</h1>
                <p style={{ color: theme.textSecondary, fontSize: '1.125rem', marginTop: '0.5rem', fontWeight: 600 }}>Configure system preferences and security</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="save-btn" style={{ padding: '0.875rem 1.375rem', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: '2px solid #3b82f6', color: theme.text, background: theme.cardBg, transition: 'all 0.3s', fontSize: '0.95rem' }}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} {isDarkMode ? 'Light' : 'Dark'}
              </button>
              <label htmlFor="import-file" className="save-btn" style={{ padding: '0.875rem 1.375rem', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: '2px solid #3b82f6', color: theme.text, background: theme.cardBg, transition: 'all 0.3s', fontSize: '0.95rem' }}>
                <Upload size={20} /> Import
              </label>
              <input id="import-file" type="file" accept=".json" onChange={handleImportSettings} style={{ display: 'none' }} />
              <button onClick={handleExportSettings} className="save-btn" style={{ padding: '0.875rem 1.375rem', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: '2px solid #3b82f6', color: theme.text, background: theme.cardBg, transition: 'all 0.3s', fontSize: '0.95rem' }}>
                <Download size={20} /> Export
              </button>
              <button onClick={handleResetSettings} className="save-btn" style={{ padding: '0.875rem 1.375rem', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: '2px solid #ef4444', color: '#ef4444', background: theme.cardBg, transition: 'all 0.3s', fontSize: '0.95rem' }}>
                <RefreshCw size={20} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', animation: 'fadeInUp 0.6s ease-out 0.2s backwards' }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="tab-btn" style={{ padding: '0.875rem 1.5rem', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: activeTab === tab.id ? 'none' : `2px solid ${theme.inputBorder}`, color: activeTab === tab.id ? 'white' : theme.text, background: activeTab === tab.id ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : theme.cardBg, transition: 'all 0.3s', fontSize: '0.95rem', boxShadow: activeTab === tab.id ? '0 8px 20px rgba(59, 130, 246, 0.4)' : 'none' }}>
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ backgroundColor: theme.cardBg, backdropFilter: 'blur(16px)', border: `2px solid ${theme.cardBorder}`, borderRadius: '24px', padding: '2.5rem', boxShadow: theme.shadow, animation: 'fadeInUp 0.6s ease-out 0.4s backwards' }}>
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem', color: theme.text }}>Profile Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Avatar Upload */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                  <label htmlFor="avatar-upload" className="avatar-upload">
                    {avatarPreview || profile.avatar ? (
                      <img src={avatarPreview || profile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'white', fontWeight: '900' }}>
                        {profile.name.charAt(0)}
                      </div>
                    )}
                    <div className="avatar-overlay">
                      <Camera size={28} color="white" />
                    </div>
                  </label>
                  <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} />
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: theme.text, margin: '0 0 0.5rem 0' }}>{profile.name}</h3>
                    <p style={{ fontSize: '1rem', color: theme.textSecondary, fontWeight: 600, margin: '0 0 0.5rem 0' }}>{profile.role}</p>
                    <label htmlFor="avatar-upload" className="save-btn" style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: '2px solid #3b82f6', color: theme.text, background: theme.cardBg, transition: 'all 0.3s', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      <Upload size={18} /> Change Avatar
                    </label>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Full Name</label>
                    <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} style={{ width: '100%', padding: '0.875rem 1rem', background: theme.inputBg, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.text, fontSize: '1rem', fontWeight: 600 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Email Address</label>
                    <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} style={{ width: '100%', padding: '0.875rem 1rem', background: theme.inputBg, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.text, fontSize: '1rem', fontWeight: 600 }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Phone Number</label>
                    <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} style={{ width: '100%', padding: '0.875rem 1rem', background: theme.inputBg, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.text, fontSize: '1rem', fontWeight: 600 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Department</label>
                    <input type="text" value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} style={{ width: '100%', padding: '0.875rem 1rem', background: theme.inputBg, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.text, fontSize: '1rem', fontWeight: 600 }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Location</label>
                    <input type="text" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} style={{ width: '100%', padding: '0.875rem 1rem', background: theme.inputBg, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.text, fontSize: '1rem', fontWeight: 600 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Role</label>
                    <input type="text" value={profile.role} disabled style={{ width: '100%', padding: '0.875rem 1rem', background: theme.inputBg, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.textSecondary, fontSize: '1rem', fontWeight: 600 }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Bio</label>
                  <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={4} style={{ width: '100%', padding: '0.875rem 1rem', background: theme.inputBg, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.text, fontSize: '1rem', fontWeight: 600, resize: 'vertical' }} />
                </div>
                <button onClick={handleSaveProfile} disabled={loading} className="save-btn" style={{ padding: '1rem 2rem', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none', color: 'white', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', transition: 'all 0.3s', fontSize: '1rem', alignSelf: 'flex-start' }}>
                  {loading ? <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={20} />}
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem', color: theme.text }}>Security Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPassword ? 'text' : 'password'} value={security.currentPassword} onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })} placeholder="Enter current password" style={{ width: '100%', padding: '0.875rem 3rem 0.875rem 1rem', background: theme.inputBg, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.text, fontSize: '1rem', fontWeight: 600 }} />
                    <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: theme.textSecondary }}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.5rem', textTransform: 'uppercase' }}>New Password</label>
                    <input type={showPassword ? 'text' : 'password'} value={security.newPassword} onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })} placeholder="Min 8 characters" style={{ width: '100%', padding: '0.875rem 1rem', background: theme.inputBg, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.text, fontSize: '1rem', fontWeight: 600 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Confirm Password</label>
                    <input type={showPassword ? 'text' : 'password'} value={security.confirmPassword} onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })} placeholder="Re-enter new password" style={{ width: '100%', padding: '0.875rem 1rem', background: theme.inputBg, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.text, fontSize: '1rem', fontWeight: 600 }} />
                  </div>
                </div>
                <div style={{ padding: '1.5rem', background: theme.inputBg, borderRadius: '16px', border: `2px solid ${theme.inputBorder}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: theme.text, margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Two-Factor Authentication</p>
                      <p style={{ color: theme.textSecondary, fontSize: '0.875rem', margin: 0 }}>Add an extra layer of security</p>
                    </div>
                    <div className={`toggle-switch ${security.twoFactorEnabled ? 'active' : ''}`} onClick={() => setSecurity({ ...security, twoFactorEnabled: !security.twoFactorEnabled })}>
                      <div className="toggle-slider"></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: theme.text, margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Login Alerts</p>
                      <p style={{ color: theme.textSecondary, fontSize: '0.875rem', margin: 0 }}>Get notified of new logins</p>
                    </div>
                    <div className={`toggle-switch ${security.loginAlerts ? 'active' : ''}`} onClick={() => setSecurity({ ...security, loginAlerts: !security.loginAlerts })}>
                      <div className="toggle-slider"></div>
                    </div>
                  </div>
                </div>
                <button onClick={handleUpdateSecurity} disabled={loading} className="save-btn" style={{ padding: '1rem 2rem', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none', color: 'white', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', transition: 'all 0.3s', fontSize: '1rem', alignSelf: 'flex-start' }}>
                  {loading ? <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Lock size={20} />}
                  {loading ? 'Updating...' : 'Update Security'}
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem', color: theme.text }}>Notification Preferences</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', background: theme.inputBg, borderRadius: '16px', border: `2px solid ${theme.inputBorder}` }}>
                  {Object.entries(notifications).map(([key, value], index) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: index < Object.entries(notifications).length - 1 ? `1px solid ${theme.cardBorder}` : 'none' }}>
                      <div>
                        <p style={{ fontWeight: 700, color: theme.text, margin: '0 0 0.25rem 0', fontSize: '1rem', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p style={{ color: theme.textSecondary, fontSize: '0.875rem', margin: 0 }}>Receive {key.toLowerCase().replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                      </div>
                      <div className={`toggle-switch ${value ? 'active' : ''}`} onClick={() => setNotifications({ ...notifications, [key]: !value })}>
                        <div className="toggle-slider"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={handleSaveNotifications} disabled={loading} className="save-btn" style={{ padding: '1rem 2rem', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none', color: 'white', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', transition: 'all 0.3s', fontSize: '1rem', alignSelf: 'flex-start' }}>
                  {loading ? <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Bell size={20} />}
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem', color: theme.text }}>System Configuration</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', background: theme.inputBg, borderRadius: '16px', border: `2px solid ${theme.inputBorder}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: theme.text, margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Maintenance Mode</p>
                      <p style={{ color: theme.textSecondary, fontSize: '0.875rem', margin: 0 }}>Enable maintenance mode for system updates</p>
                    </div>
                    <div className={`toggle-switch ${system.maintenanceMode ? 'active' : ''}`} onClick={() => setSystem({ ...system, maintenanceMode: !system.maintenanceMode })}>
                      <div className="toggle-slider"></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: theme.text, margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Auto Backup</p>
                      <p style={{ color: theme.textSecondary, fontSize: '0.875rem', margin: 0 }}>Automatically backup system data</p>
                    </div>
                    <div className={`toggle-switch ${system.autoBackup ? 'active' : ''}`} onClick={() => setSystem({ ...system, autoBackup: !system.autoBackup })}>
                      <div className="toggle-slider"></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: theme.text, margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Debug Mode</p>
                      <p style={{ color: theme.textSecondary, fontSize: '0.875rem', margin: 0 }}>Enable detailed error logging</p>
                    </div>
                    <div className={`toggle-switch ${system.debugMode ? 'active' : ''}`} onClick={() => setSystem({ ...system, debugMode: !system.debugMode })}>
                      <div className="toggle-slider"></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: theme.text, margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Analytics</p>
                      <p style={{ color: theme.textSecondary, fontSize: '0.875rem', margin: 0 }}>Track system usage and performance</p>
                    </div>
                    <div className={`toggle-switch ${system.analyticsEnabled ? 'active' : ''}`} onClick={() => setSystem({ ...system, analyticsEnabled: !system.analyticsEnabled })}>
                      <div className="toggle-slider"></div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Backup Frequency</label>
                    <select value={system.backupFrequency} onChange={(e) => setSystem({ ...system, backupFrequency: e.target.value })} style={{ width: '100%', padding: '0.875rem 1rem', background: theme.inputBg, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.text, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Data Retention (days)</label>
                    <input type="number" value={system.dataRetention} onChange={(e) => setSystem({ ...system, dataRetention: e.target.value })} style={{ width: '100%', padding: '0.875rem 1rem', background: theme.inputBg, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.text, fontSize: '1rem', fontWeight: 600 }} />
                  </div>
                </div>
                <button onClick={handleSaveSystem} disabled={loading} className="save-btn" style={{ padding: '1rem 2rem', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none', color: 'white', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', transition: 'all 0.3s', fontSize: '1rem', alignSelf: 'flex-start' }}>
                  {loading ? <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Database size={20} />}
                  {loading ? 'Saving...' : 'Save System Settings'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
