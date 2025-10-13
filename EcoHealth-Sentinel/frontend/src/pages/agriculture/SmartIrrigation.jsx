import React, { useState, useEffect, useCallback } from 'react';
import { Droplets, Zap, TrendingDown, Calendar, Thermometer, Cloud, Shield, RefreshCw, Wifi, WifiOff } from 'lucide-react';

const SmartIrrigation = () => {
  const [soilMoisture, setSoilMoisture] = useState(65);
  const [irrigationMode, setIrrigationMode] = useState('auto');
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [waterUsage, setWaterUsage] = useState(450);
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isConnected, setIsConnected] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [schedule, setSchedule] = useState([
    { day: 'Monday', time: '6:00 AM', duration: 30, status: 'completed' },
    { day: 'Tuesday', time: '6:00 AM', duration: 30, status: 'completed' },
    { day: 'Wednesday', time: '6:00 AM', duration: 30, status: 'scheduled' },
    { day: 'Thursday', time: '6:00 AM', duration: 30, status: 'scheduled' },
    { day: 'Friday', time: '6:00 AM', duration: 30, status: 'scheduled' }
  ]);

  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    humidity: 72,
    rainfall: 0,
    forecast: 'Clear skies for next 3 days'
  });

  // Simulate backend API call
  const fetchDataFromBackend = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate dynamic data from backend
      const mockBackendData = {
        soilMoisture: Math.floor(Math.random() * 30) + 50, // 50-80%
        weatherData: {
          temperature: Math.floor(Math.random() * 10) + 25, // 25-35°C
          humidity: Math.floor(Math.random() * 20) + 60, // 60-80%
          rainfall: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
          forecast: Math.random() > 0.5 ? 'Clear skies for next 3 days' : 'Light rain expected tomorrow'
        },
        waterUsage: Math.floor(Math.random() * 100) + 400, // 400-500L
        isIrrigating: Math.random() > 0.8,
        irrigationMode: Math.random() > 0.5 ? 'auto' : 'manual'
      };

      // Update state with backend data
      setSoilMoisture(mockBackendData.soilMoisture);
      setWeatherData(mockBackendData.weatherData);
      setWaterUsage(mockBackendData.waterUsage);
      setIsIrrigating(mockBackendData.isIrrigating);
      setIrrigationMode(mockBackendData.irrigationMode);
      setLastUpdated(new Date());
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setIsConnected(false);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Manual refresh
  const handleManualRefresh = () => {
    fetchDataFromBackend();
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    setMounted(true);
    fetchDataFromBackend();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchDataFromBackend();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchDataFromBackend]);

  const getIrrigationRecommendation = () => {
    const { temperature, humidity, rainfall } = weatherData;
    
    let needsWater = false;
    let reason = '';
    let urgency = 'low';

    if (soilMoisture < 50) {
      needsWater = true;
      urgency = 'high';
      reason = 'Soil moisture critically low';
    } else if (soilMoisture < 60 && temperature > 30) {
      needsWater = true;
      urgency = 'medium';
      reason = 'High temperature increasing evaporation';
    } else if (soilMoisture < 65 && rainfall === 0) {
      needsWater = true;
      urgency = 'low';
      reason = 'Preventive irrigation recommended';
    } else {
      reason = 'Soil moisture optimal';
    }

    return { needsWater, reason, urgency };
  };

  const recommendation = getIrrigationRecommendation();

  const toggleIrrigation = async () => {
    // Simulate sending command to backend
    setIsIrrigating(!isIrrigating);
    
    // In real implementation, you would send this to backend:
    // await fetch('/api/irrigation/toggle', { method: 'POST', body: JSON.stringify({ action: !isIrrigating }) });
    
    if (!isIrrigating) {
      const interval = setInterval(() => {
        setSoilMoisture(prev => {
          if (prev >= 75) {
            clearInterval(interval);
            setIsIrrigating(false);
            return 75;
          }
          return prev + 1;
        });
        setWaterUsage(prev => prev + 5);
      }, 1000);
    }
  };

  const updateIrrigationMode = async (mode) => {
    setIrrigationMode(mode);
    // In real implementation: await fetch('/api/irrigation/mode', { method: 'POST', body: JSON.stringify({ mode }) });
  };

  const getUrgencyStyles = (urgency) => {
    const styles = {
      high: {
        bg: 'rgb(254, 226, 226)',
        text: 'rgb(185, 28, 28)',
        border: 'rgb(239, 68, 68)'
      },
      medium: {
        bg: 'rgb(254, 243, 199)',
        text: 'rgb(180, 83, 9)',
        border: 'rgb(249, 115, 22)'
      },
      low: {
        bg: 'rgb(220, 252, 231)',
        text: 'rgb(22, 163, 74)',
        border: 'rgb(34, 197, 94)'
      }
    };
    return styles[urgency] || styles.low;
  };

  const urgencyStyle = getUrgencyStyles(recommendation.urgency);

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #a5f3fc 50%, #dbeafe 100%)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
        @keyframes wave {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-5px) translateX(5px); }
          50% { transform: translateY(0) translateX(10px); }
          75% { transform: translateY(5px) translateX(5px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .slide-in-right { animation: slideInRight 0.8s ease-out forwards; }
        .float-animation { animation: float 4s ease-in-out infinite; }
        .pulse-animation { animation: pulse 2s ease-in-out infinite; }
        .wave-animation { animation: wave 3s ease-in-out infinite; }
        .spin-animation { animation: spin 1s linear infinite; }
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        .icon-hover {
          transition: all 0.3s ease;
        }
        .icon-hover:hover {
          transform: translateY(-2px) scale(1.1);
          filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.4));
        }
        .button-hover {
          transition: all 0.3s ease;
        }
        .button-hover:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .glow-effect {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
        .progress-bar {
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
          transition: width 0.5s ease;
        }
        .shimmer-bg {
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(59, 130, 246, 0.1) 100%);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
        .water-ripple { position: relative; }
        .water-ripple::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.3);
          transform: translate(-50%, -50%);
          animation: ripple 2s ease-out infinite;
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
      `}</style>

      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '40px',
        width: '120px',
        height: '120px',
        background: 'rgba(147, 197, 253, 0.3)',
        borderRadius: '50%',
        animation: 'float 4s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '80px',
        right: '40px',
        width: '160px',
        height: '160px',
        background: 'rgba(165, 243, 252, 0.3)',
        borderRadius: '50%',
        animation: 'float 5s ease-in-out infinite 1s'
      }}></div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header with Refresh Controls */}
        <div className={`card-hover ${mounted ? 'fade-in-up' : ''}`} style={{
          ...cardStyle,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="water-ripple">
                <Droplets className="icon-hover" style={{ width: '32px', height: '32px', color: '#2563eb' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Smart Irrigation</h1>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>AI-optimized water management</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Connection Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: isConnected ? '#16a34a' : '#dc2626',
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '6px 12px',
                borderRadius: '9999px'
              }}>
                {isConnected ? (
                  <Wifi style={{ width: '16px', height: '16px' }} />
                ) : (
                  <WifiOff style={{ width: '16px', height: '16px' }} />
                )}
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>

              {/* Auto-refresh Toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="button-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: autoRefresh ? '#2563eb' : '#6b7280',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  border: `2px solid ${autoRefresh ? '#2563eb' : '#d1d5db'}`,
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                <RefreshCw style={{ width: '14px', height: '14px' }} />
                <span>Auto: {autoRefresh ? 'ON' : 'OFF'}</span>
              </button>

              {/* Manual Refresh Button */}
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="button-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  color: 'white',
                  background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: isRefreshing ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  opacity: isRefreshing ? 0.7 : 1
                }}
              >
                <RefreshCw className={isRefreshing ? 'spin-animation' : ''} style={{ width: '16px', height: '16px' }} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              {/* Last Updated */}
              <div style={{
                fontSize: '11px',
                color: '#6b7280',
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '6px 12px',
                borderRadius: '9999px'
              }}>
                Updated: {formatTime(lastUpdated)}
              </div>

              {/* Water Saved Badge */}
              <div className="glow-effect" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#2563eb',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 16px',
                borderRadius: '9999px',
                fontWeight: '600'
              }}>
                <Shield className="pulse-animation" style={{ width: '20px', height: '20px' }} />
                <span>Water Saved: 30%</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Main Content */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className={`card-hover fade-in-up stagger-1`} style={{
                ...cardStyle,
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <Droplets className={`icon-hover ${isIrrigating ? 'wave-animation' : ''}`} style={{ width: '32px', height: '32px', color: '#2563eb' }} />
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '9999px',
                    background: soilMoisture < 50 ? '#fee2e2' : '#dcfce7',
                    color: soilMoisture < 50 ? '#b91c1c' : '#16a34a',
                    fontWeight: '600'
                  }}>
                    {soilMoisture < 50 ? 'Low' : soilMoisture < 65 ? 'Medium' : 'Optimal'}
                  </span>
                </div>
                <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Soil Moisture</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{soilMoisture}%</p>
                <div style={{
                  width: '100%',
                  background: '#e5e7eb',
                  borderRadius: '9999px',
                  height: '8px',
                  marginTop: '12px',
                  overflow: 'hidden'
                }}>
                  <div className="progress-bar" style={{
                    width: `${soilMoisture}%`,
                    height: '100%',
                    borderRadius: '9999px'
                  }}></div>
                </div>
              </div>

              <div className={`card-hover fade-in-up stagger-2`} style={{
                ...cardStyle,
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <Thermometer className="icon-hover pulse-animation" style={{ width: '32px', height: '32px', color: '#ea580c' }} />
                  <span className="pulse-animation" style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '9999px',
                    background: '#fed7aa',
                    color: '#9a3412',
                    fontWeight: '600'
                  }}>Live</span>
                </div>
                <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Temperature</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{weatherData.temperature}°C</p>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>Humidity: {weatherData.humidity}%</p>
              </div>

              <div className={`card-hover fade-in-up stagger-3`} style={{
                ...cardStyle,
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <TrendingDown className="icon-hover" style={{ width: '32px', height: '32px', color: '#16a34a' }} />
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '9999px',
                    background: '#dcfce7',
                    color: '#16a34a',
                    fontWeight: '600'
                  }}>This Week</span>
                </div>
                <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Water Used</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{waterUsage}L</p>
                <p style={{ fontSize: '12px', color: '#16a34a', margin: '4px 0 0 0', fontWeight: '600' }}>↓ 30% vs last week</p>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className={`card-hover fade-in-up stagger-4`} style={{
              ...cardStyle,
              borderRadius: '16px',
              padding: '24px',
              borderLeft: `4px solid ${urgencyStyle.border}`,
              background: urgencyStyle.bg
            }}>
              <h3 style={{
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Zap className="icon-hover pulse-animation" style={{ width: '20px', height: '20px' }} />
                AI Recommendation
              </h3>
              <p style={{ color: '#374151', marginBottom: '12px' }}>{recommendation.reason}</p>
              {recommendation.needsWater && (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={toggleIrrigation}
                    className="button-hover"
                    style={{
                      padding: '10px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      background: isIrrigating 
                        ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                        : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                      color: 'white'
                    }}
                  >
                    {isIrrigating ? 'Stop Irrigation' : 'Start Irrigation'}
                  </button>
                  {!isIrrigating && (
                    <button className="button-hover" style={{
                      padding: '10px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: '2px solid #3b82f6',
                      background: 'white',
                      color: '#3b82f6',
                      cursor: 'pointer'
                    }}>
                      Schedule for Later
                    </button>
                  )}
                </div>
              )}
              {!recommendation.needsWater && (
                <div style={{
                  fontSize: '14px',
                  color: '#16a34a',
                  background: 'rgba(255, 255, 255, 0.8)',
                  padding: '12px 16px',
                  borderRadius: '8px'
                }}>
                  ✓ No irrigation needed. Next check scheduled for tomorrow at 6:00 AM
                </div>
              )}
            </div>

            {/* Mode Control */}
            <div className={`card-hover fade-in-up stagger-5`} style={{
              ...cardStyle,
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>Irrigation Mode</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <button
                  onClick={() => updateIrrigationMode('auto')}
                  className="button-hover"
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: `2px solid ${irrigationMode === 'auto' ? '#3b82f6' : '#d1d5db'}`,
                    background: irrigationMode === 'auto' ? 'linear-gradient(135deg, #dbeafe, #e0f2fe)' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Zap className="icon-hover" style={{ width: '24px', height: '24px', color: '#3b82f6', marginBottom: '8px' }} />
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>Automatic</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>AI-controlled based on conditions</div>
                </button>
                <button
                  onClick={() => updateIrrigationMode('manual')}
                  className="button-hover"
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: `2px solid ${irrigationMode === 'manual' ? '#3b82f6' : '#d1d5db'}`,
                    background: irrigationMode === 'manual' ? 'linear-gradient(135deg, #dbeafe, #e0f2fe)' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Calendar className="icon-hover" style={{ width: '24px', height: '24px', color: '#6b7280', marginBottom: '8px' }} />
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>Manual</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>You control when to irrigate</div>
                </button>
              </div>
            </div>

            {/* Schedule */}
            <div className="card-hover fade-in-up" style={{
              ...cardStyle,
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>Weekly Schedule</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {schedule.map((item, idx) => (
                  <div key={idx} className="card-hover" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: 'rgba(249, 250, 251, 0.8)',
                    borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div className={item.status === 'scheduled' ? 'pulse-animation' : ''} style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: item.status === 'completed' ? '#16a34a' : '#3b82f6'
                      }}></div>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1f2937' }}>{item.day}</div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>{item.time} • {item.duration} minutes</div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontWeight: '600',
                      background: item.status === 'completed' ? '#dcfce7' : '#dbeafe',
                      color: item.status === 'completed' ? '#16a34a' : '#2563eb'
                    }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Weather */}
            <div className={`card-hover ${mounted ? 'slide-in-right stagger-1' : ''}`} style={{
              ...cardStyle,
              borderRadius: '16px',
              padding: '20px'
            }}>
              <h3 style={{
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Cloud className="icon-hover float-animation" style={{ width: '20px', height: '20px', color: '#2563eb' }} />
                Weather Forecast
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Temperature</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>{weatherData.temperature}°C</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Humidity</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>{weatherData.humidity}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Rainfall</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>{weatherData.rainfall} mm</span>
                </div>
              </div>
              <div className="shimmer-bg" style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '14px',
                color: '#1e40af'
              }}>
                {weatherData.forecast}
              </div>
            </div>

            {/* Impact */}
            <div className={`card-hover ${mounted ? 'slide-in-right stagger-2' : ''}`} style={{
              background: 'linear-gradient(135deg, #16a34a, #2563eb, #06b6d4)',
              borderRadius: '16px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
            }}>
              <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Monthly Impact</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="button-hover">
                  <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 4px 0' }}>1,800L</p>
                  <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Water Saved</p>
                </div>
                <div className="button-hover">
                  <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 4px 0' }}>₹540</p>
                  <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Cost Saved</p>
                </div>
                <div className="button-hover">
                  <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 4px 0' }}>92%</p>
                  <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Efficiency Score</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className={`card-hover ${mounted ? 'slide-in-right stagger-3' : ''}`} style={{
              ...cardStyle,
              borderRadius: '16px',
              padding: '20px'
            }}>
              <h3 style={{
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Shield className="icon-hover" style={{ width: '20px', height: '20px', color: '#16a34a' }} />
                AI Features
              </h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li className="button-hover" style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'start', gap: '8px' }}>
                  <span style={{ color: '#16a34a' }}>✓</span>
                  <span>Real-time soil moisture monitoring</span>
                </li>
                <li className="button-hover" style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'start', gap: '8px' }}>
                  <span style={{ color: '#16a34a' }}>✓</span>
                  <span>Weather-based irrigation scheduling</span>
                </li>
                <li className="button-hover" style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'start', gap: '8px' }}>
                  <span style={{ color: '#16a34a' }}>✓</span>
                  <span>Crop-specific water requirements</span>
                </li>
                <li className="button-hover" style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'start', gap: '8px' }}>
                  <span style={{ color: '#16a34a' }}>✓</span>
                  <span>Automated water flow control</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartIrrigation;