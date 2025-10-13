import React, { useState, useEffect } from 'react';
import { TrendingUp, Droplets, Leaf, AlertCircle, Sun, Cloud, Home, Sprout, Settings, BarChart, Truck, Bug, MessageSquare, Users, Cog, Menu, X } from 'lucide-react';

const Dashboard = () => {
  const [farmData] = useState({
    soilMoisture: 65,
    temperature: 28,
    humidity: 72,
    cropHealth: 88,
    efficiency: 92
  });
  
  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
    runPredictiveModels();
    generateAlerts();
  }, []);

  const runPredictiveModels = () => {
    const { soilMoisture, temperature, cropHealth } = farmData;
    
    const yieldFactor = (soilMoisture * 0.4 + cropHealth * 0.5 + (100 - Math.abs(temperature - 25) * 2) * 0.1) / 100;
    const predictedYield = (yieldFactor * 5000).toFixed(0);
    
    const weatherImpact = temperature > 35 ? 'High heat may reduce yield by 15%' : 'Favorable conditions';
    const waterOptimization = soilMoisture < 60 ? 'Increase irrigation by 10%' : 'Current levels optimal';
    
    setPredictions([
      { title: 'Yield Prediction', value: `${predictedYield} kg/hectare`, confidence: 87, trend: 'up', details: 'Based on current conditions and historical data' },
      { title: 'Weather Impact', value: weatherImpact, confidence: 92, trend: temperature > 35 ? 'down' : 'neutral', details: '7-day forecast analysis' },
      { title: 'Water Optimization', value: waterOptimization, confidence: 85, trend: 'neutral', details: 'AI-recommended irrigation schedule' }
    ]);
  };

  const generateAlerts = () => {
    const newAlerts = [
      { type: 'info', title: 'Market Price Alert', message: 'Tomato prices up 12% - good time to sell', priority: 'low' },
      { type: 'warning', title: 'Irrigation Reminder', message: 'Schedule next watering in 4 hours', priority: 'medium' }
    ];
    setAlerts(newAlerts);
  };

  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    window.location.href = path;
  };

  const SidebarItem = ({ path, icon: Icon, label, isActive }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div
        onClick={() => navigate(path)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 16px',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '0.9rem',
          fontWeight: 500,
          color: isActive ? 'white' : (isHovered ? 'white' : '#cbd5e1'),
          background: isActive ? 'linear-gradient(135deg, #10b981, #059669)' : (isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent'),
          boxShadow: isActive ? '0 4px 12px rgba(16, 185, 129, 0.4)' : 'none',
          transform: isHovered && !isActive ? 'translateX(4px)' : 'translateX(0)'
        }}
      >
        <Icon size={20} />
        {label}
      </div>
    );
  };

  const MetricCard = ({ icon: Icon, iconColor, badge, badgeType, label, value, info, progress }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: isHovered ? '0 25px 50px rgba(0, 0, 0, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.07)',
          padding: '24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <Icon size={32} color={iconColor} />
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '6px 12px',
            borderRadius: '999px',
            backgroundColor: badgeType === 'live' ? '#dbeafe' : '#dcfce7',
            color: badgeType === 'live' ? '#1e40af' : '#166534'
          }}>
            {badge}
          </span>
        </div>
        <h3 style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500, marginBottom: '8px' }}>{label}</h3>
        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1f2937', margin: '8px 0' }}>{value}</p>
        {info && <p style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>{info}</p>}
        {progress !== undefined && (
          <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '999px', height: '10px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #60a5fa, #2563eb)',
              transition: 'width 1s ease-out',
              width: isLoaded ? `${progress}%` : '0%'
            }} />
          </div>
        )}
      </div>
    );
  };

  const currentPath = window.location.pathname || '/agriculture/dashboard';

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 25%, #e0e7ff 50%, #ddd6fe 75%, #e9d5ff 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '280px',
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        padding: '24px 0',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1000,
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
        overflowY: 'auto',
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
      }}>
        <div style={{ padding: '0 24px 24px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '4px'
          }}>AgriAI</h2>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Smart Farming Solutions</p>
        </div>
       <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
  <SidebarItem path="/agriculture/dashboard" icon={Home} label="Dashboard" isActive={currentPath === '/agriculture/dashboard'} />
  <SidebarItem path="/agriculture/crop-disease" icon={Leaf} label="Crop Disease" isActive={currentPath === '/agriculture/crop-disease'} />
  <SidebarItem path="/agriculture/weather" icon={Sun} label="Weather Forecast" isActive={currentPath === '/agriculture/weather'} />
  <SidebarItem path="/agriculture/irrigation" icon={Droplets} label="Smart Irrigation" isActive={currentPath === '/agriculture/irrigation'} />
  <SidebarItem path="/agriculture/fertilizer" icon={Sprout} label="Fertilizer Recommendations" isActive={currentPath === '/agriculture/fertilizer'} />
  <SidebarItem path="/agriculture/automation" icon={Settings} label="Farm Automation" isActive={currentPath === '/agriculture/automation'} />
  <SidebarItem path="/agriculture/market" icon={BarChart} label="Market Forecast" isActive={currentPath === '/agriculture/market'} />
  <SidebarItem path="/agriculture/supply-chain" icon={Truck} label="Supply Chain" isActive={currentPath === '/agriculture/supply-chain'} />
  <SidebarItem path="/agriculture/pest-control" icon={Bug} label="Pest Control" isActive={currentPath === '/agriculture/pest-control'} />
  <SidebarItem path="/agriculture/chatbot" icon={MessageSquare} label="Reports & Chatbot" isActive={currentPath === '/agriculture/chatbot'} />
  <SidebarItem path="/agriculture/community" icon={Users} label="Community Hub" isActive={currentPath === '/agriculture/community'} />
  <SidebarItem path="/agriculture/settings" icon={Cog} label="Settings" isActive={currentPath === '/agriculture/settings'} />
</div>

      </div>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{
          position: 'fixed',
          top: '24px',
          left: isSidebarOpen ? '304px' : '24px',
          zIndex: 1001,
          background: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isSidebarOpen ? <X size={24} color="#1f2937" /> : <Menu size={24} color="#1f2937" />}
      </button>

      <div style={{
        flex: 1,
        minHeight: '100vh',
        padding: '24px',
        transition: 'all 0.3s ease',
        marginLeft: isSidebarOpen ? '280px' : '0'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
              letterSpacing: '-0.5px'
            }}>Farm Intelligence Dashboard</h1>
            <p style={{ color: '#4b5563', fontSize: '1.125rem', fontWeight: 400 }}>
              AI-powered insights for smarter farming decisions
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <MetricCard icon={Droplets} iconColor="#2563eb" badge="Live" badgeType="live" label="Soil Moisture" value={`${farmData.soilMoisture}%`} progress={farmData.soilMoisture} />
            <MetricCard icon={Sun} iconColor="#ea580c" badge="Live" badgeType="live" label="Temperature" value={`${farmData.temperature}°C`} info={<><Cloud size={14} /> Humidity: {farmData.humidity}%</>} />
            <MetricCard icon={Leaf} iconColor="#059669" badge="AI" badgeType="ai" label="Crop Health" value={`${farmData.cropHealth}%`} info={<span style={{ color: '#059669', fontWeight: 600 }}>↑ 5% from last week</span>} />
            <MetricCard icon={TrendingUp} iconColor="#7c3aed" badge="AI" badgeType="ai" label="Efficiency Score" value={`${farmData.efficiency}%`} info={<span style={{ color: '#059669', fontWeight: 600 }}>Optimal performance</span>} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {predictions.map((pred, idx) => (
              <div key={idx} style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 0 20px rgba(16, 185, 129, 0.15)', padding: '24px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937' }}>{pred.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '6px 10px', borderRadius: '999px' }}>
                    <span style={{ fontWeight: 700, color: '#059669' }}>{pred.confidence}%</span>
                    <span>confident</span>
                  </div>
                </div>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#047857', marginBottom: '12px' }}>{pred.value}</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>{pred.details}</p>
                {pred.trend === 'up' && (
                  <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#dcfce7', padding: '6px 10px', borderRadius: '999px', fontWeight: 600 }}>
                    <TrendingUp size={16} />
                    Positive trend
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)', padding: '32px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={28} color="#ea580c" />
              AI Alerts & Recommendations
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {alerts.map((alert, idx) => (
                <div key={idx} style={{
                  borderLeft: '4px solid',
                  borderColor: alert.type === 'alert' ? '#ef4444' : (alert.type === 'warning' ? '#f59e0b' : '#3b82f6'),
                  backgroundColor: alert.type === 'alert' ? '#fef2f2' : (alert.type === 'warning' ? '#fffbeb' : '#eff6ff'),
                  color: alert.type === 'alert' ? '#991b1b' : (alert.type === 'warning' ? '#92400e' : '#1e3a8a'),
                  borderRadius: '8px',
                  padding: '20px',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                    <div>
                      <h4 style={{ fontWeight: 600, marginBottom: '6px', fontSize: '1rem' }}>{alert.title}</h4>
                      <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{alert.message}</p>
                    </div>
                    <span style={{ fontSize: '0.75rem', padding: '6px 12px', backgroundColor: 'white', borderRadius: '999px', fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
                      {alert.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #10b981, #059669, #0891b2)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)', padding: '40px', color: 'white' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={28} />
              AI Impact on Your Farm
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              {[
                { value: '30%', label: 'Water Saved', width: 30 },
                { value: '25%', label: 'Yield Increase', width: 25 },
                { value: '40%', label: 'Cost Reduction', width: 40 },
                { value: '50%', label: 'Pesticide Reduction', width: 50 }
              ].map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '24px', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                  <p style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px' }}>{item.value}</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, opacity: 0.95 }}>{item.label}</p>
                  <div style={{ marginTop: '12px', height: '4px', background: 'rgba(255, 255, 255, 0.4)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'white', borderRadius: '999px', transition: 'width 1s ease-out', width: isLoaded ? `${item.width}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;