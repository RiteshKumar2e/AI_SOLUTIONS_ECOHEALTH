import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Database, Brain, RefreshCw, Download, Upload, Save, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  
  const [settings, setSettings] = useState({
    organizationName: 'Bihar Rural Health Initiative',
    timeZone: 'Asia/Kolkata',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    ipWhitelist: '192.168.1.0/24',
    apiKey: '••••••••••••••••••••••••',
    emailNotifications: true,
    smsAlerts: true,
    criticalAlerts: true,
    dailyReports: true,
    weeklyDigest: false,
    aiModelVersion: 'v2.5',
    predictionThreshold: 0.85,
    autoAlerts: true,
    biasMonitoring: true,
    explainableAI: true,
    dataRetention: 730,
    autoBackup: true,
    backupFrequency: 'daily',
    encryption: 'AES-256',
    anonymization: true,
    shareAnonymizedData: false,
    researchParticipation: false,
    auditLogging: true,
    dataAccessLog: true
  });

  // Inline styles object[web:21][web:24]
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '32px',
      animation: 'fadeIn 0.6s ease-out'
    },
    headerFlex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#1a202c',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      margin: '0 0 8px 0'
    },
    subtitle: {
      color: '#718096',
      fontSize: '1rem',
      margin: 0
    },
    actionButtons: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    primaryButton: {
      backgroundColor: '#3b82f6',
      color: '#fff',
      border: 'none',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '24px'
    },
    sidebar: {
      background: '#fff',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      height: 'fit-content'
    },
    tabButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 16px',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '15px',
      fontWeight: '500',
      marginBottom: '8px',
      backgroundColor: 'transparent',
      color: '#4a5568'
    },
    activeTab: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
      transform: 'scale(1.02)'
    },
    mainContent: {
      background: '#fff',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
    },
    formGroup: {
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '15px',
      transition: 'all 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '15px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      outline: 'none',
      boxSizing: 'border-box'
    },
    gridTwo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px'
    },
    toggleCard: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      marginBottom: '16px'
    },
    toggleInfo: {
      flex: 1
    },
    toggleTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1a202c',
      margin: '0 0 4px 0'
    },
    toggleDesc: {
      fontSize: '14px',
      color: '#718096',
      margin: 0
    },
    switch: {
      position: 'relative',
      width: '56px',
      height: '28px',
      backgroundColor: '#cbd5e0',
      borderRadius: '14px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      border: 'none',
      padding: 0
    },
    switchActive: {
      backgroundColor: '#3b82f6'
    },
    switchThumb: {
      position: 'absolute',
      top: '2px',
      left: '2px',
      width: '24px',
      height: '24px',
      backgroundColor: '#fff',
      borderRadius: '50%',
      transition: 'transform 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    switchThumbActive: {
      transform: 'translateX(28px)'
    },
    alert: {
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'start',
      gap: '12px'
    },
    alertBlue: {
      background: 'linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%)',
      border: '1px solid #90cdf4'
    },
    alertGreen: {
      background: 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)',
      border: '1px solid #9ae6b4'
    },
    alertPurple: {
      background: 'linear-gradient(135deg, #faf5ff 0%, #e9d8fd 100%)',
      border: '1px solid #d6bcfa'
    },
    alertRed: {
      background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
      border: '1px solid #fc8181'
    },
    rangeSlider: {
      width: '100%',
      height: '8px',
      borderRadius: '4px',
      outline: 'none',
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      cursor: 'pointer'
    },
    footer: {
      marginTop: '32px',
      paddingTop: '24px',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    },
    statusMessage: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '16px',
      fontWeight: '500'
    },
    loader: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    },
    loaderContent: {
      textAlign: 'center'
    },
    iconFloat: {
      animation: 'float 3s ease-in-out infinite'
    }
  };

  // API Functions
  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/settings');
      setSettings(response.data);
    } catch (err) {
      setError('Failed to load settings');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await axios.put('/api/settings', settings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus('error');
      setError('Failed to save settings');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await axios.post('/api/settings/sync');
      await fetchSettings();
      setTimeout(() => setSyncing(false), 2000);
    } catch (err) {
      setError('Sync failed');
      setSyncing(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('/api/settings/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'settings-backup.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Export failed');
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        await axios.post('/api/settings/import', formData);
        await fetchSettings();
      } catch (err) {
        setError('Import failed');
      }
    }
  };

  const regenerateApiKey = async () => {
    try {
      const response = await axios.post('/api/settings/regenerate-api-key');
      setSettings(prev => ({ ...prev, apiKey: response.data.apiKey }));
    } catch (err) {
      setError('Failed to regenerate API key');
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon, color: '#3b82f6' },
    { id: 'security', name: 'Security', icon: Shield, color: '#ef4444' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: '#f59e0b' },
    { id: 'ai', name: 'AI Configuration', icon: Brain, color: '#8b5cf6' },
    { id: 'data', name: 'Data & Privacy', icon: Database, color: '#10b981' }
  ];

  const renderGeneralSettings = () => (
    <div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Organization Name</label>
        <input
          type="text"
          value={settings.organizationName}
          onChange={(e) => handleSettingChange('organizationName', e.target.value)}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
      </div>
      
      <div style={styles.gridTwo}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Time Zone</label>
          <select
            value={settings.timeZone}
            onChange={(e) => handleSettingChange('timeZone', e.target.value)}
            style={styles.select}
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="Asia/Dubai">Asia/Dubai</option>
            <option value="America/New_York">America/New York</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Language</label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            style={styles.select}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="bn">বাংলা (Bengali)</option>
          </select>
        </div>
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Date Format</label>
        <select
          value={settings.dateFormat}
          onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
          style={styles.select}
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div>
      <div style={{...styles.alert, ...styles.alertBlue}}>
        <Shield style={{width: '20px', height: '20px', color: '#2b6cb0', flexShrink: 0}} />
        <div>
          <h4 style={{margin: '0 0 4px 0', fontWeight: '600', color: '#2c5282'}}>Security Best Practices</h4>
          <p style={{margin: 0, fontSize: '14px', color: '#2c5282'}}>Enable two-factor authentication and regularly review access logs to maintain system security.</p>
        </div>
      </div>
      
      <div style={styles.toggleCard} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <div style={styles.toggleInfo}>
          <h4 style={styles.toggleTitle}>Two-Factor Authentication</h4>
          <p style={styles.toggleDesc}>Add an extra layer of security to your account</p>
        </div>
        <button
          onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
          style={{...styles.switch, ...(settings.twoFactorAuth ? styles.switchActive : {})}}
        >
          <span style={{...styles.switchThumb, ...(settings.twoFactorAuth ? styles.switchThumbActive : {})}} />
        </button>
      </div>
      
      <div style={styles.gridTwo}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            style={styles.input}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Password Expiry (days)</label>
          <input
            type="number"
            value={settings.passwordExpiry}
            onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
            style={styles.input}
          />
        </div>
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>IP Whitelist (CIDR notation)</label>
        <input
          type="text"
          value={settings.ipWhitelist}
          onChange={(e) => handleSettingChange('ipWhitelist', e.target.value)}
          style={styles.input}
          placeholder="192.168.1.0/24"
        />
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>API Key</label>
        <div style={{display: 'flex', gap: '8px'}}>
          <input
            type={showApiKey ? "text" : "password"}
            value={settings.apiKey}
            readOnly
            style={{...styles.input, backgroundColor: '#f7fafc'}}
          />
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            style={{...styles.button, padding: '12px'}}
          >
            {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <button
            onClick={regenerateApiKey}
            style={{...styles.button, ...styles.primaryButton}}
          >
            <RefreshCw size={20} />
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div>
      {[
        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email', icon: '📧' },
        { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Get critical alerts via SMS', icon: '📱' },
        { key: 'criticalAlerts', label: 'Critical Patient Alerts', desc: 'Immediate notifications for critical conditions', icon: '🚨' },
        { key: 'dailyReports', label: 'Daily Reports', desc: 'Receive daily summary reports', icon: '📊' },
        { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly analytics and insights', icon: '📈' }
      ].map(item => (
        <div key={item.key} style={styles.toggleCard} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: 1}}>
            <span style={{fontSize: '24px'}}>{item.icon}</span>
            <div style={styles.toggleInfo}>
              <h4 style={styles.toggleTitle}>{item.label}</h4>
              <p style={styles.toggleDesc}>{item.desc}</p>
            </div>
          </div>
          <button
            onClick={() => handleSettingChange(item.key, !settings[item.key])}
            style={{...styles.switch, ...(settings[item.key] ? styles.switchActive : {})}}
          >
            <span style={{...styles.switchThumb, ...(settings[item.key] ? styles.switchThumbActive : {})}} />
          </button>
        </div>
      ))}
    </div>
  );

  const renderAISettings = () => (
    <div>
      <div style={{...styles.alert, ...styles.alertPurple}}>
        <Brain style={{width: '20px', height: '20px', color: '#6b46c1', flexShrink: 0}} />
        <div>
          <h4 style={{margin: '0 0 4px 0', fontWeight: '600', color: '#553c9a'}}>Responsible AI Configuration</h4>
          <p style={{margin: 0, fontSize: '14px', color: '#553c9a'}}>Configure AI behavior to ensure ethical, transparent, and accurate predictions.</p>
        </div>
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>AI Model Version</label>
        <select
          value={settings.aiModelVersion}
          onChange={(e) => handleSettingChange('aiModelVersion', e.target.value)}
          style={styles.select}
        >
          <option value="v2.5">v2.5 (Latest - Recommended)</option>
          <option value="v2.0">v2.0 (Stable)</option>
          <option value="v1.5">v1.5 (Legacy)</option>
        </select>
      </div>
      
      <div style={{...styles.formGroup, padding: '20px', background: 'linear-gradient(135deg, #faf5ff 0%, #e9d8fd 100%)', borderRadius: '12px'}}>
        <label style={{...styles.label, marginBottom: '12px'}}>
          Prediction Confidence Threshold: <span style={{color: '#8b5cf6', fontWeight: '700'}}>{(settings.predictionThreshold * 100).toFixed(0)}%</span>
        </label>
        <input
          type="range"
          min="0.5"
          max="0.99"
          step="0.01"
          value={settings.predictionThreshold}
          onChange={(e) => handleSettingChange('predictionThreshold', parseFloat(e.target.value))}
          style={styles.rangeSlider}
        />
        <p style={{fontSize: '12px', color: '#6b7280', marginTop: '8px'}}>Higher threshold = More conservative predictions</p>
      </div>
      
      {[
        { key: 'autoAlerts', label: 'Automatic Alert Generation', desc: 'AI automatically generates alerts for anomalies', icon: '🤖' },
        { key: 'biasMonitoring', label: 'Bias Monitoring', desc: 'Continuous monitoring for algorithmic bias', icon: '⚖️' },
        { key: 'explainableAI', label: 'Explainable AI', desc: 'Provide reasoning for AI predictions', icon: '💡' }
      ].map(item => (
        <div key={item.key} style={styles.toggleCard} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: 1}}>
            <span style={{fontSize: '24px'}}>{item.icon}</span>
            <div style={styles.toggleInfo}>
              <h4 style={styles.toggleTitle}>{item.label}</h4>
              <p style={styles.toggleDesc}>{item.desc}</p>
            </div>
          </div>
          <button
            onClick={() => handleSettingChange(item.key, !settings[item.key])}
            style={{...styles.switch, ...(settings[item.key] ? styles.switchActive : {})}}
          >
            <span style={{...styles.switchThumb, ...(settings[item.key] ? styles.switchThumbActive : {})}} />
          </button>
        </div>
      ))}
    </div>
  );

  const renderDataSettings = () => (
    <div>
      <div style={{...styles.alert, ...styles.alertGreen}}>
        <Database style={{width: '20px', height: '20px', color: '#22543d', flexShrink: 0}} />
        <div>
          <h4 style={{margin: '0 0 4px 0', fontWeight: '600', color: '#22543d'}}>HIPAA Compliant Data Management</h4>
          <p style={{margin: 0, fontSize: '14px', color: '#22543d'}}>All data handling follows HIPAA regulations and healthcare data privacy standards.</p>
        </div>
      </div>
      
      <div style={styles.gridTwo}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Data Retention (days)</label>
          <input
            type="number"
            value={settings.dataRetention}
            onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
            style={styles.input}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Backup Frequency</label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
            style={styles.select}
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Encryption Standard</label>
        <select
          value={settings.encryption}
          onChange={(e) => handleSettingChange('encryption', e.target.value)}
          style={styles.select}
        >
          <option value="AES-256">AES-256 (Recommended)</option>
          <option value="AES-192">AES-192</option>
          <option value="AES-128">AES-128</option>
        </select>
      </div>
      
      {[
        { key: 'autoBackup', label: 'Automatic Backup', desc: 'Enable scheduled automatic backups', icon: '💾' },
        { key: 'anonymization', label: 'Data Anonymization', desc: 'Automatically anonymize sensitive data in exports', icon: '🔒' },
        { key: 'shareAnonymizedData', label: 'Share Anonymized Data', desc: 'Contribute to medical research (fully anonymized)', icon: '🔬' },
        { key: 'auditLogging', label: 'Audit Logging', desc: 'Log all data access and modifications', icon: '📝' },
        { key: 'dataAccessLog', label: 'Data Access Monitoring', desc: 'Track who accesses patient data', icon: '👁️' }
      ].map(item => (
        <div key={item.key} style={styles.toggleCard} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: 1}}>
            <span style={{fontSize: '24px'}}>{item.icon}</span>
            <div style={styles.toggleInfo}>
              <h4 style={styles.toggleTitle}>{item.label}</h4>
              <p style={styles.toggleDesc}>{item.desc}</p>
            </div>
          </div>
          <button
            onClick={() => handleSettingChange(item.key, !settings[item.key])}
            style={{...styles.switch, ...(settings[item.key] ? styles.switchActive : {})}}
          >
            <span style={{...styles.switchThumb, ...(settings[item.key] ? styles.switchThumbActive : {})}} />
          </button>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div style={styles.loader}>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        `}</style>
        <div style={styles.loaderContent}>
          <RefreshCw style={{width: '64px', height: '64px', color: '#3b82f6', margin: '0 auto 16px', display: 'block', animation: 'spin 1s linear infinite'}} />
          <p style={{color: '#4a5568', fontSize: '18px', margin: 0}}>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 1024px) {
          .grid-container { grid-template-columns: 280px 1fr !important; }
        }
      `}</style>
      
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={styles.headerFlex}>
            <div>
              <h1 style={styles.title}>
                <SettingsIcon style={{width: '40px', height: '40px', color: '#3b82f6', animation: 'float 3s ease-in-out infinite'}} />
                System Settings
              </h1>
              <p style={styles.subtitle}>Configure your healthcare platform preferences and security</p>
            </div>
            
            <div style={styles.actionButtons}>
              <button
                onClick={handleSync}
                disabled={syncing}
                style={styles.button}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <RefreshCw style={{width: '20px', height: '20px', animation: syncing ? 'spin 1s linear infinite' : 'none'}} />
                Sync
              </button>
              
              <button
                onClick={handleExport}
                style={styles.button}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Download style={{width: '20px', height: '20px'}} />
                Export
              </button>
              
              <label style={{...styles.button, cursor: 'pointer'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <Upload style={{width: '20px', height: '20px'}} />
                Import
                <input type="file" onChange={handleImport} style={{display: 'none'}} accept=".json" />
              </label>
            </div>
          </div>
          
          {error && (
            <div style={{...styles.alert, ...styles.alertRed, marginTop: '16px'}}>
              <AlertTriangle style={{width: '20px', height: '20px', color: '#c53030', flexShrink: 0}} />
              <p style={{margin: 0, color: '#c53030', flex: 1}}>{error}</p>
              <button onClick={() => setError(null)} style={{border: 'none', background: 'none', color: '#c53030', fontSize: '20px', cursor: 'pointer', padding: 0}}>×</button>
            </div>
          )}
        </div>

        <div style={styles.gridContainer} className="grid-container">
          <div style={styles.sidebar}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    ...styles.tabButton,
                    ...(isActive ? {...styles.activeTab, backgroundColor: tab.color} : {})
                  }}
                  onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = '#f7fafc')}
                  onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Icon style={{width: '20px', height: '20px'}} />
                  {tab.name}
                </button>
              );
            })}
          </div>

          <div style={styles.mainContent}>
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'ai' && renderAISettings()}
            {activeTab === 'data' && renderDataSettings()}

            <div style={styles.footer}>
              {saveStatus && (
                <div style={{
                  ...styles.statusMessage,
                  color: saveStatus === 'success' ? '#10b981' : saveStatus === 'error' ? '#ef4444' : '#3b82f6'
                }}>
                  {saveStatus === 'success' ? (
                    <>
                      <CheckCircle style={{width: '24px', height: '24px'}} />
                      Settings saved successfully!
                    </>
                  ) : saveStatus === 'error' ? (
                    <>
                      <AlertTriangle style={{width: '24px', height: '24px'}} />
                      Failed to save settings
                    </>
                  ) : (
                    <>
                      <RefreshCw style={{width: '24px', height: '24px', animation: 'spin 1s linear infinite'}} />
                      Saving...
                    </>
                  )}
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  marginLeft: 'auto',
                  opacity: saveStatus === 'saving' ? 0.5 : 1,
                  cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => saveStatus !== 'saving' && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Save style={{width: '20px', height: '20px'}} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
