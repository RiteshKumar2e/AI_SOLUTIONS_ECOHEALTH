import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, TrendingDown, AlertCircle, Leaf, Droplets, Wind, Sun, Home, Settings, Recycle, Cloud, FileText, Cog, MessageSquare, MapPin, Zap, Shield, TreePine, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

// Sidebar Item Component
const SidebarItem = ({ path, icon: Icon, label, isActive, onClick, collapsed }) => {
  return (
    <div
      onClick={() => onClick(path)}
      className={`sidebar-item ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}
      title={collapsed ? label : ''}
    >
      <Icon size={20} className="sidebar-icon" />
      {!collapsed && <span className="sidebar-label">{label}</span>}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [timeRange, setTimeRange] = useState('week');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Backend Data States
  const [environmentalMetrics, setEnvironmentalMetrics] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [emissionsBySource, setEmissionsBySource] = useState([]);
  const [conservationProgress, setConservationProgress] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [regionalComparison, setRegionalComparison] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // API Base URL
  //const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch all dashboard data on mount and when timeRange changes
  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  // Fetch all dashboard data from backend
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const authToken = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      };

      // Parallel API calls for better performance
      const [
        metricsRes,
        trendsRes,
        emissionsRes,
        progressRes,
        alertsRes,
        regionalRes,
        insightsRes
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/environment/metrics?timeRange=${timeRange}`, { headers }),
        fetch(`${API_BASE_URL}/environment/trends?timeRange=${timeRange}`, { headers }),
        fetch(`${API_BASE_URL}/environment/emissions?timeRange=${timeRange}`, { headers }),
        fetch(`${API_BASE_URL}/environment/conservation-progress`, { headers }),
        fetch(`${API_BASE_URL}/environment/alerts`, { headers }),
        fetch(`${API_BASE_URL}/environment/regional-comparison`, { headers }),
        fetch(`${API_BASE_URL}/environment/ai-insights`, { headers })
      ]);

      // Check if all responses are OK
      if (!metricsRes.ok || !trendsRes.ok || !emissionsRes.ok || !progressRes.ok || 
          !alertsRes.ok || !regionalRes.ok || !insightsRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      // Parse JSON responses
      const metricsData = await metricsRes.json();
      const trendsData = await trendsRes.json();
      const emissionsData = await emissionsRes.json();
      const progressData = await progressRes.json();
      const alertsData = await alertsRes.json();
      const regionalData = await regionalRes.json();
      const insightsData = await insightsRes.json();

      // Update states with backend data
      setEnvironmentalMetrics(metricsData.data || metricsData || []);
      setWeeklyData(trendsData.data || trendsData || []);
      setEmissionsBySource(emissionsData.data || emissionsData || []);
      setConservationProgress(progressData.data || progressData || []);
      setAlerts(alertsData.data || alertsData || []);
      setRegionalComparison(regionalData.data || regionalData || []);
      setAiInsights(insightsData.data || insightsData || []);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      // Fallback to dummy data
      loadDummyData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load dummy data as fallback
  const loadDummyData = () => {
    setEnvironmentalMetrics([
      {
        icon: 'Leaf',
        title: 'Air Quality Index',
        value: 156,
        unit: 'AQI',
        change: -12,
        status: 'moderate',
        color: '#f59e0b',
        bgColor: '#fef3c7',
        trend: 'down'
      },
      {
        icon: 'Droplets',
        title: 'Water Quality',
        value: 78,
        unit: '/100',
        change: 5,
        status: 'good',
        color: '#3b82f6',
        bgColor: '#dbeafe',
        trend: 'up'
      },
      {
        icon: 'Wind',
        title: 'CO2 Levels',
        value: 421,
        unit: 'ppm',
        change: 2.3,
        status: 'warning',
        color: '#ef4444',
        bgColor: '#fee2e2',
        trend: 'up'
      },
      {
        icon: 'Sun',
        title: 'Solar Radiation',
        value: 5.2,
        unit: 'kWh/m²',
        change: 0.8,
        status: 'excellent',
        color: '#f97316',
        bgColor: '#ffedd5',
        trend: 'up'
      }
    ]);

    setWeeklyData([
      { day: 'Mon', aqi: 145, water: 75, co2: 418, temp: 28 },
      { day: 'Tue', aqi: 152, water: 76, co2: 419, temp: 29 },
      { day: 'Wed', aqi: 168, water: 74, co2: 420, temp: 30 },
      { day: 'Thu', aqi: 155, water: 77, co2: 421, temp: 29 },
      { day: 'Fri', aqi: 149, water: 78, co2: 422, temp: 28 },
      { day: 'Sat', aqi: 142, water: 79, co2: 420, temp: 27 },
      { day: 'Sun', aqi: 156, water: 78, co2: 421, temp: 28 }
    ]);

    setEmissionsBySource([
      { name: 'Transportation', value: 35, color: '#ef4444' },
      { name: 'Industry', value: 28, color: '#f59e0b' },
      { name: 'Agriculture', value: 18, color: '#10b981' },
      { name: 'Residential', value: 12, color: '#3b82f6' },
      { name: 'Commercial', value: 7, color: '#8b5cf6' }
    ]);

    setConservationProgress([
      { category: 'Energy Saved', current: 2340, target: 3000, unit: 'kWh', percentage: 78 },
      { category: 'Water Conserved', current: 18500, target: 25000, unit: 'L', percentage: 74 },
      { category: 'Waste Recycled', current: 450, target: 600, unit: 'kg', percentage: 75 },
      { category: 'Trees Planted', current: 1250, target: 1500, unit: 'trees', percentage: 83 }
    ]);

    setAlerts([
      {
        severity: 'high',
        title: 'Air Quality Alert',
        message: 'AQI levels above safe threshold in industrial zones',
        time: '2 hours ago',
        icon: 'AlertCircle',
        color: '#ef4444'
      },
      {
        severity: 'medium',
        title: 'Water Usage Spike',
        message: 'Unusual increase in water consumption detected',
        time: '5 hours ago',
        icon: 'Droplets',
        color: '#f59e0b'
      },
      {
        severity: 'low',
        title: 'Renewable Energy Goal',
        message: 'Solar panel efficiency up by 12%',
        time: '1 day ago',
        icon: 'Sun',
        color: '#10b981'
      }
    ]);

    setRegionalComparison([
      { region: 'Darbhanga', score: 68, trend: 'stable' },
      { region: 'Bihar Avg', score: 62, trend: 'up' },
      { region: 'National Avg', score: 58, trend: 'down' },
      { region: 'Target', score: 80, trend: 'neutral' }
    ]);

    setAiInsights([
      {
        title: '⚡ Immediate Action Required',
        message: 'Air quality in industrial zones requires intervention. Recommend increasing green cover and implementing emission controls.'
      },
      {
        title: '📈 Positive Trend Detected',
        message: 'Water conservation efforts showing results. 18% improvement over last month with community participation.'
      },
      {
        title: '🎯 Goal Achievement',
        message: 'Tree plantation campaign on track to exceed targets by 15%. Continue momentum through winter season.'
      },
      {
        title: '⚠️ Risk Prediction',
        message: 'Model predicts increased heat stress next week. Prepare public health advisories and cooling centers.'
      }
    ]);
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Get icon component from string
  const getIconComponent = (iconName) => {
    const icons = {
      Leaf, Droplets, Wind, Sun, AlertCircle
    };
    return icons[iconName] || Activity;
  };

  const navigationItems = [
    { path: '/environment/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/environment/awareness', icon: Leaf, label: 'Awareness Hub' },
    { path: '/environment/carbon', icon: Cloud, label: 'Carbon Calculator' },
    { path: '/environment/chatbot', icon: MessageSquare, label: 'Chatbot' },
    { path: '/environment/climate', icon: Wind, label: 'Climate Predictions' },
    { path: '/environment/disaster', icon: Shield, label: 'Disaster Prediction' },
    { path: '/environment/pollution', icon: MapPin, label: 'Pollution Heatmap' },
    { path: '/environment/renewable', icon: Zap, label: 'Renewable Energy' },
    { path: '/environment/reports', icon: FileText, label: 'Reports' },
    { path: '/environment/waste', icon: Recycle, label: 'Waste Management' },
    { path: '/environment/wildlife', icon: TreePine, label: 'Wildlife Conservation' },
    { path: '/environment/settings', icon: Cog, label: 'Settings' }
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '16px', color: '#64748b', fontSize: '14px', textAlign: 'center' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 5px solid #e2e8f0;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
          position: relative;
        }

        /* Sidebar Styles */
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          width: 280px;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
          z-index: 1000;
          overflow-y: auto;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar.collapsed {
          width: 80px;
        }

        .sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .sidebar-logo {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #1e293b;
          border-bottom: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .sidebar.collapsed .sidebar-logo {
          padding: 24px 12px;
          justify-content: center;
        }

        .sidebar-logo-icon {
          min-width: 32px;
          color: #3b82f6;
        }

        .sidebar-logo h2 {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          white-space: nowrap;
          transition: opacity 0.3s ease;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sidebar.collapsed .sidebar-logo h2 {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        .sidebar-nav {
          padding: 16px 0 80px 0;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          padding: 14px 20px;
          margin: 4px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          color: #64748b;
          background: transparent;
          font-weight: 500;
        }

        .sidebar-item.collapsed {
          padding: 14px;
          justify-content: center;
          margin: 4px 8px;
        }

        .sidebar-icon {
          min-width: 20px;
          transition: all 0.3s ease;
        }

        .sidebar-label {
          margin-left: 12px;
          font-size: 14px;
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        .sidebar-item.collapsed .sidebar-label {
          opacity: 0;
          width: 0;
          margin: 0;
          overflow: hidden;
        }

        .sidebar-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 0;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 0 4px 4px 0;
          transition: height 0.3s ease;
        }

        .sidebar-item:hover {
          background: #f1f5f9;
          color: #3b82f6;
          transform: translateX(4px);
        }

        .sidebar-item.collapsed:hover {
          transform: scale(1.08);
        }

        .sidebar-item.active {
          background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%);
          color: #3b82f6;
          font-weight: 600;
        }

        .sidebar-item.active::before {
          height: 60%;
        }

        .toggle-btn {
          position: fixed;
          bottom: 20px;
          left: 12px;
          width: calc(280px - 24px);
          padding: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          z-index: 1001;
        }

        .sidebar.collapsed ~ * .toggle-btn,
        .sidebar.collapsed .toggle-btn {
          width: 56px;
          left: 12px;
        }

        .toggle-btn:hover {
          background: #e2e8f0;
          color: #3b82f6;
          transform: scale(1.02);
        }

        .toggle-btn-text {
          transition: all 0.3s ease;
        }

        .sidebar.collapsed .toggle-btn-text {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        .refresh-btn {
          padding: 10px 20px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover {
          background: #f8fafc;
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .refresh-btn.refreshing {
          pointer-events: none;
          opacity: 0.6;
        }

        .refresh-btn.refreshing svg {
          animation: spin 1s linear infinite;
        }

        /* Main Content */
        .main-content {
          margin-left: 280px;
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          height: 100vh;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: #f8fafc;
        }

        .main-content.expanded {
          margin-left: 80px;
        }

        /* Cards */
        .glass-card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          animation: fadeInUp 0.6s ease-out;
        }

        .glass-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
        }

        .metric-card {
          position: relative;
          overflow: hidden;
          animation: fadeInUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .metric-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
        }

        .metric-card:hover::after {
          animation: shimmer 1.5s ease-in-out;
        }

        .metric-card:nth-child(1) { animation-delay: 0.1s; }
        .metric-card:nth-child(2) { animation-delay: 0.2s; }
        .metric-card:nth-child(3) { animation-delay: 0.3s; }
        .metric-card:nth-child(4) { animation-delay: 0.4s; }

        .metric-icon {
          animation: pulse 3s ease-in-out infinite;
        }

        .chart-container {
          transition: transform 0.3s ease;
        }

        .chart-container:hover {
          transform: scale(1.01);
        }

        .progress-bar {
          position: relative;
          overflow: hidden;
          background: #e2e8f0;
        }

        .progress-fill {
          height: 100%;
          border-radius: 12px;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }

        .alert-item {
          animation: slideInLeft 0.5s ease-out;
          animation-fill-mode: both;
          transition: all 0.3s ease;
        }

        .alert-item:hover {
          transform: translateX(4px);
        }

        .alert-item:nth-child(1) { animation-delay: 0.1s; }
        .alert-item:nth-child(2) { animation-delay: 0.2s; }
        .alert-item:nth-child(3) { animation-delay: 0.3s; }

        .time-range-btn {
          position: relative;
          overflow: hidden;
        }

        .time-range-btn::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.1);
          transform: translate(-50%, -50%);
          transition: width 0.5s, height 0.5s;
        }

        .time-range-btn:hover::after {
          width: 300px;
          height: 300px;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-280px);
          }

          .sidebar.collapsed {
            transform: translateX(0);
            width: 80px;
          }

          .main-content {
            margin-left: 0;
          }

          .main-content.expanded {
            margin-left: 80px;
          }

          .toggle-btn {
            left: 12px;
          }

          .sidebar.collapsed .toggle-btn {
            left: 12px;
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-logo">
            <Activity size={32} className="sidebar-logo-icon" />
            <h2>EcoMonitor</h2>
          </div>
          <nav className="sidebar-nav">
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
                onClick={handleNavigation}
                collapsed={sidebarCollapsed}
              />
            ))}
          </nav>
          <button 
            className="toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            <span className="toggle-btn-text">
              {sidebarCollapsed ? 'Expand' : 'Collapse'}
            </span>
          </button>
        </aside>

        {/* Main Content */}
        <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div className="glass-card" style={{ padding: '32px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity className="metric-icon" size={48} style={{ color: '#3b82f6' }} />
                  </div>
                  <div>
                    <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>
                      Environmental Dashboard
                    </h1>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
                      Real-time monitoring and AI-powered insights for Darbhanga, Bihar
                    </p>
                  </div>
                </div>
                <button 
                  className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw size={18} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="glass-card" style={{ padding: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['day', 'week', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className="time-range-btn"
                    style={{
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontWeight: '600',
                      border: timeRange === range ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: timeRange === range ? '#3b82f6' : '#ffffff',
                      color: timeRange === range ? '#ffffff' : '#64748b',
                      position: 'relative',
                    }}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {environmentalMetrics.map((metric, index) => {
                const Icon = getIconComponent(metric.icon);
                const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
                return (
                  <div key={index} className="metric-card glass-card" style={{ padding: '24px', borderLeft: `4px solid ${metric.color}` }}>
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: metric.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon className="metric-icon" size={24} style={{ color: metric.color }} />
                      </div>
                      <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', background: metric.bgColor, color: metric.color }}>
                        {metric.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{metric.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '12px' }}>
                      <p style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{metric.value}</p>
                      <span style={{ fontSize: '14px', color: '#94a3b8', marginLeft: '8px', fontWeight: '600' }}>{metric.unit}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: metric.change > 0 ? '#fee2e2' : '#d1fae5', borderRadius: '8px' }}>
                      <TrendIcon size={16} style={{ marginRight: '6px', color: metric.change > 0 ? '#ef4444' : '#10b981' }} />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: metric.change > 0 ? '#ef4444' : '#10b981' }}>
                        {Math.abs(metric.change)}% vs last {timeRange}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              {/* Weekly Trends Chart */}
              <div className="glass-card chart-container" style={{ padding: '24px', gridColumn: window.innerWidth > 1024 ? 'span 2' : 'span 1' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Weekly Environmental Trends</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="aqi" stroke="#f59e0b" strokeWidth={3} name="AQI" dot={{ fill: '#f59e0b', r: 4 }} />
                    <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={3} name="Water Quality" dot={{ fill: '#3b82f6', r: 4 }} />
                    <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3} name="Temperature (°C)" dot={{ fill: '#ef4444', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Emissions by Source */}
              <div className="glass-card chart-container" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Emissions by Source</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={emissionsBySource}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {emissionsBySource.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Conservation Progress */}
            <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>Conservation Progress</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                {conservationProgress.map((item, index) => (
                  <div key={index} style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)', borderRadius: '16px', padding: '24px', border: '1px solid #d1fae5' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.category}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '12px' }}>
                      <span style={{ fontSize: '28px', fontWeight: '800', color: '#059669' }}>{item.current.toLocaleString()}</span>
                      <span style={{ fontSize: '14px', color: '#94a3b8', marginLeft: '8px', fontWeight: '600' }}>/ {item.target.toLocaleString()} {item.unit}</span>
                    </div>
                    <div className="progress-bar" style={{ position: 'relative', width: '100%', height: '10px', borderRadius: '12px', overflow: 'hidden', marginBottom: '8px' }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${item.percentage}%`,
                          background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
                        }}
                      ></div>
                    </div>
                    <p style={{ textAlign: 'right', fontSize: '13px', fontWeight: '700', color: '#059669', margin: 0 }}>{item.percentage}% Complete</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              {/* Alerts Section */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Recent Alerts</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {alerts.map((alert, index) => {
                    const Icon = getIconComponent(alert.icon);
                    const bgColor = alert.severity === 'high' ? '#fef2f2' : alert.severity === 'medium' ? '#fefce8' : '#f0fdf4';
                    return (
                      <div key={index} className="alert-item" style={{ background: bgColor, borderRadius: '12px', padding: '16px', borderLeft: `4px solid ${alert.color}` }}>
                        <div style={{ display: 'flex', alignItems: 'start' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: alert.severity === 'high' ? '#fee2e2' : alert.severity === 'medium' ? '#fef3c7' : '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', flexShrink: 0 }}>
                            <Icon size={20} style={{ color: alert.color }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <h3 style={{ fontWeight: '700', color: '#1e293b', margin: 0, fontSize: '15px' }}>{alert.title}</h3>
                              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>{alert.time}</span>
                            </div>
                            <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>{alert.message}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Regional Comparison */}
              <div className="glass-card chart-container" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Regional Comparison</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={regionalComparison} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 100]} stroke="#64748b" style={{ fontSize: '12px' }} />
                    <YAxis type="category" dataKey="region" stroke="#64748b" width={100} style={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                    <Bar dataKey="score" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Insights Panel */}
            <div className="glass-card" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', padding: '32px', color: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Activity size={32} />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>AI-Powered Insights</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {aiInsights.map((insight, index) => (
                      <div key={index} style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '12px', padding: '20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                        <h3 style={{ fontWeight: '700', marginBottom: '8px', fontSize: '16px' }}>{insight.title}</h3>
                        <p style={{ fontSize: '14px', opacity: 0.95, margin: 0, lineHeight: '1.6' }}>{insight.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div style={{ marginTop: '24px', padding: '16px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', color: '#92400e' }}>
                <strong>⚠️ Note:</strong> {error}. Displaying sample data for demonstration.
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
