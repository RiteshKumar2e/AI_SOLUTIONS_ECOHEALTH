import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Users, Calendar, TrendingUp, Brain, AlertCircle, Heart, Zap, Home, FileText, Stethoscope, Settings, MessageSquare, Video, Menu, X, RefreshCw, CheckCircle, Clock, XCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Simulated API Base URL
const API_BASE_URL = 'https://api.healthai.example.com';

const Dashboard = () => {
  // Core State
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    aiPredictions: 0,
    systemHealth: 0
  });
  
  const [timeRange, setTimeRange] = useState('week');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [alertsProcessing, setAlertsProcessing] = useState({});
  const currentPath = window.location.pathname || '/healthcare/dashboard';

  // Dynamic Data States
  const [patientFlowData, setPatientFlowData] = useState([]);
  const [diseaseData, setDiseaseData] = useState([]);
  const [aiPerformanceData, setAiPerformanceData] = useState([]);
  const [realtimeMetrics, setRealtimeMetrics] = useState({});
  const [departmentData, setDepartmentData] = useState([]);
  const [aiAlerts, setAiAlerts] = useState([]);

  // Simulated API Fetch Function
  const fetchData = useCallback(async (endpoint, options = {}) => {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    
    const responses = {
      '/dashboard/stats': generateDashboardStats(options.timeRange),
      '/dashboard/patient-flow': generatePatientFlow(options.timeRange),
      '/dashboard/diseases': generateDiseaseData(),
      '/dashboard/ai-performance': generateAIPerformance(),
      '/dashboard/realtime': generateRealtimeMetrics(),
      '/dashboard/departments': generateDepartmentData(),
      '/dashboard/alerts': generateAlerts()
    };

    return {
      ok: true,
      data: responses[endpoint] || {}
    };
  }, []);

  // Data Generators
  const generateDashboardStats = (range) => {
    const multiplier = { 'day': 0.15, 'week': 1, 'month': 4.2 }[range];
    return {
      totalPatients: Math.floor(2800 + Math.random() * 300),
      todayAppointments: Math.floor(30 + Math.random() * 15),
      aiPredictions: Math.floor(150 * multiplier + Math.random() * 30),
      systemHealth: Math.round((96 + Math.random() * 3) * 10) / 10
    };
  };

  const generatePatientFlow = (range) => {
    const days = range === 'day' ? ['12AM', '6AM', '12PM', '6PM'] :
                 range === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
                 ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    
    return days.map(day => {
      const actual = Math.floor(20 + Math.random() * 50);
      const predicted = actual + Math.floor((Math.random() - 0.5) * 10);
      return {
        day,
        actual,
        predicted,
        aiAccuracy: Math.floor(88 + Math.random() * 10)
      };
    });
  };

  const generateDiseaseData = () => [
    { name: 'Respiratory', value: 30 + Math.floor(Math.random() * 10), color: '#3B82F6' },
    { name: 'Cardiovascular', value: 20 + Math.floor(Math.random() * 10), color: '#EF4444' },
    { name: 'Diabetes', value: 15 + Math.floor(Math.random() * 10), color: '#F59E0B' },
    { name: 'Neurological', value: 10 + Math.floor(Math.random() * 8), color: '#8B5CF6' },
    { name: 'Other', value: 5 + Math.floor(Math.random() * 8), color: '#6B7280' }
  ];

  const generateAIPerformance = () => [
    { metric: 'Diagnosis', score: 90 + Math.random() * 8 },
    { metric: 'Prediction', score: 88 + Math.random() * 8 },
    { metric: 'Risk Assessment', score: 92 + Math.random() * 6 },
    { metric: 'Treatment', score: 86 + Math.random() * 8 },
    { metric: 'Resource Planning', score: 90 + Math.random() * 7 }
  ];

  const generateRealtimeMetrics = () => ({
    activePatients: Math.floor(20 + Math.random() * 10),
    waitingRoom: Math.floor(5 + Math.random() * 8),
    inTreatment: Math.floor(12 + Math.random() * 8),
    avgWaitTime: Math.floor(10 + Math.random() * 8),
    bedOccupancy: Math.floor(72 + Math.random() * 12),
    staffUtilization: Math.floor(80 + Math.random() * 12)
  });

  const generateDepartmentData = () => [
    { dept: 'Emergency', efficiency: 88 + Math.floor(Math.random() * 8), patients: 40 + Math.floor(Math.random() * 15), aiScore: 92 + Math.floor(Math.random() * 6) },
    { dept: 'Cardiology', efficiency: 85 + Math.floor(Math.random() * 8), patients: 28 + Math.floor(Math.random() * 12), aiScore: 88 + Math.floor(Math.random() * 8) },
    { dept: 'Neurology', efficiency: 82 + Math.floor(Math.random() * 8), patients: 24 + Math.floor(Math.random() * 10), aiScore: 86 + Math.floor(Math.random() * 8) },
    { dept: 'Pediatrics', efficiency: 90 + Math.floor(Math.random() * 6), patients: 45 + Math.floor(Math.random() * 15), aiScore: 94 + Math.floor(Math.random() * 5) },
    { dept: 'Orthopedics', efficiency: 84 + Math.floor(Math.random() * 8), patients: 32 + Math.floor(Math.random() * 12), aiScore: 87 + Math.floor(Math.random() * 8) }
  ];

  const generateAlerts = () => [
    {
      id: 1,
      type: 'warning',
      priority: 'high',
      message: 'Predicted surge in respiratory cases (45% increase) expected in next 48 hours',
      confidence: 87 + Math.floor(Math.random() * 8),
      action: 'Increase respiratory ward staffing',
      status: 'pending'
    },
    {
      id: 2,
      type: 'success',
      priority: 'medium',
      message: 'Resource optimization achieved: 15% reduction in wait times',
      confidence: 93 + Math.floor(Math.random() * 5),
      action: 'Continue current scheduling pattern',
      status: 'pending'
    },
    {
      id: 3,
      type: 'info',
      priority: 'low',
      message: 'Seasonal flu vaccination campaign recommended for next month',
      confidence: 90 + Math.floor(Math.random() * 6),
      action: 'Review and schedule campaign',
      status: 'pending'
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

  // Load All Dashboard Data
  const loadAllDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [stats, flow, diseases, aiPerf, realtime, depts, alerts] = await Promise.all([
        fetchData('/dashboard/stats', { timeRange }),
        fetchData('/dashboard/patient-flow', { timeRange }),
        fetchData('/dashboard/diseases'),
        fetchData('/dashboard/ai-performance'),
        fetchData('/dashboard/realtime'),
        fetchData('/dashboard/departments'),
        fetchData('/dashboard/alerts')
      ]);

      setDashboardData(stats.data);
      setPatientFlowData(flow.data);
      setDiseaseData(diseases.data);
      setAiPerformanceData(aiPerf.data);
      setRealtimeMetrics(realtime.data);
      setDepartmentData(depts.data);
      setAiAlerts(alerts.data);
      setLastUpdated(new Date());
      
      if (!isLoading) {
        showNotification('Dashboard updated successfully', 'success');
      }
    } catch (error) {
      showNotification('Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, fetchData, isLoading, showNotification]);

  // Handle Alert Actions
  const handleAlertAction = async (alertId, action) => {
    setAlertsProcessing(prev => ({ ...prev, [alertId]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAiAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'processed', processedAt: new Date() }
          : alert
      ));
      
      showNotification('Action processed successfully', 'success');
    } catch (error) {
      showNotification('Failed to process action', 'error');
    } finally {
      setAlertsProcessing(prev => ({ ...prev, [alertId]: false }));
    }
  };

  // Handle Time Range Change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    showNotification(`Switched to ${range} view`, 'info');
  };

  // Handle Manual Refresh
  const handleRefresh = () => {
    loadAllDashboardData();
  };

  // Initial Load
  useEffect(() => {
    loadAllDashboardData();
  }, [timeRange]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadAllDashboardData();
    }, 30000);
    return () => clearInterval(interval);
  }, [loadAllDashboardData]);

  // Components
  const StatCard = ({ icon: Icon, title, value, change, trend, color }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-header">
        <div className="stat-icon-wrapper">
          <Icon className="stat-icon" />
        </div>
        {trend && (
          <div className={`stat-trend ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
            <TrendingUp className={`trend-icon ${trend === 'down' ? 'trend-icon-down' : ''}`} />
            <span>{change}%</span>
          </div>
        )}
      </div>
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  );

  const SidebarItem = ({ path, icon: Icon, label, isActive }) => (
    <a href={path} className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}>
      <Icon size={20} />
      <span>{label}</span>
      {isActive && <div className="sidebar-indicator" />}
    </a>
  );

  return (
    <div className="dashboard-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
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

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        /* Sidebar Styles */
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
          color: white;
          padding: 24px 0;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
          overflow-y: auto;
          animation: slideIn 0.5s ease-out;
        }

        .sidebar.hidden {
          transform: translateX(-100%);
        }

        .sidebar-header {
          padding: 0 24px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 24px;
        }

        .sidebar-logo {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 4px;
        }

        .sidebar-tagline {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 12px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #94a3b8;
          background: transparent;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .sidebar-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
          transform: translateX(4px);
        }

        .sidebar-item-active {
          color: #fff;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          font-weight: 600;
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .sidebar-item-active:hover {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: #fff;
        }

        .sidebar-indicator {
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #fff, rgba(255, 255, 255, 0.5));
          border-radius: 0 4px 4px 0;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 280px;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 100vh;
        }

        .main-content.sidebar-closed {
          margin-left: 0;
        }

        .menu-toggle {
          position: fixed;
          top: 20px;
          left: 300px;
          z-index: 1001;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: none;
          border-radius: 12px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: white;
        }

        .menu-toggle.sidebar-closed {
          left: 20px;
        }

        .menu-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
        }

        .content-wrapper {
          padding: 24px;
        }

        .content-inner {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header */
        .page-header {
          margin-bottom: 32px;
          animation: fadeInUp 0.5s ease-out;
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .page-subtitle {
          color: #6b7280;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .last-updated {
          font-size: 0.875rem;
          color: #9ca3af;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          background: #f3f4f6;
          border-radius: 8px;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .refresh-btn {
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          background: white;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
        }

        .refresh-btn:hover:not(:disabled) {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .refresh-btn.loading {
          animation: spin 1s linear infinite;
        }

        .time-range-buttons {
          display: flex;
          gap: 8px;
        }

        .time-btn {
          padding: 10px 20px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          background: white;
          color: #374151;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .time-btn:hover:not(:disabled) {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .time-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .time-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
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
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 300px;
          animation: slideInRight 0.3s ease-out;
          font-weight: 500;
        }

        .notification.success {
          background: #10b981;
          color: white;
        }

        .notification.error {
          background: #ef4444;
          color: white;
        }

        .notification.info {
          background: #3b82f6;
          color: white;
        }

        .notification-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          padding: 24px;
          transition: all 0.3s;
          animation: fadeInUp 0.6s ease-out;
        }

        .stat-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .stat-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s;
        }

        .stat-card:hover .stat-icon-wrapper {
          transform: scale(1.05);
        }

        .stat-card.blue .stat-icon-wrapper {
          background: #3b82f6;
        }

        .stat-card.green .stat-icon-wrapper {
          background: #10b981;
        }

        .stat-card.purple .stat-icon-wrapper {
          background: #8b5cf6;
        }

        .stat-card.indigo .stat-icon-wrapper {
          background: #6366f1;
        }

        .stat-icon {
          width: 24px;
          height: 24px;
          color: white;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .trend-up {
          color: #10b981;
        }

        .trend-down {
          color: #ef4444;
        }

        .trend-icon {
          width: 16px;
          height: 16px;
        }

        .trend-icon-down {
          transform: rotate(180deg);
        }

        .stat-title {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
        }

        /* Card Styles */
        .card {
          background: white;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          padding: 24px;
          margin-bottom: 32px;
          animation: fadeInUp 0.7s ease-out;
        }

        .card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .card-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .card-icon.orange {
          background: linear-gradient(135deg, #f97316, #fb923c);
        }

        .card-icon.purple {
          background: linear-gradient(135deg, #8b5cf6, #a78bfa);
        }

        .card-icon.yellow {
          background: linear-gradient(135deg, #eab308, #fbbf24);
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
        }

        /* Alert Styles */
        .alerts-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .alert-card {
          padding: 16px;
          border-radius: 12px;
          border: 1px solid;
          transition: all 0.2s;
        }

        .alert-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .alert-card.warning {
          background: #fff7ed;
          border-color: #fed7aa;
        }

        .alert-card.success {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        .alert-card.info {
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .alert-content {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .alert-info {
          flex: 1;
          min-width: 250px;
        }

        .alert-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .priority-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .priority-badge.high {
          background: #fee2e2;
          color: #991b1b;
        }

        .priority-badge.medium {
          background: #fef3c7;
          color: #92400e;
        }

        .priority-badge.low {
          background: #dbeafe;
          color: #1e40af;
        }

        .confidence-text {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .alert-message {
          color: #374151;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .alert-action-text {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .action-btn {
          padding: 10px 20px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-btn:hover:not(:disabled) {
          background: #2563eb;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-btn.processed {
          background: #10b981;
        }

        .action-btn.processed:hover {
          background: #059669;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Charts */
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        @media (max-width: 1024px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        .chart-note {
          margin-top: 16px;
          padding: 12px;
          background: #faf5ff;
          border: 1px solid #e9d5ff;
          border-radius: 10px;
        }

        .chart-note p {
          font-size: 0.875rem;
          color: #6b21a8;
        }

        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .metric-box {
          padding: 16px;
          border-radius: 12px;
          border: 1px solid;
          transition: all 0.2s;
        }

        .metric-box:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          transform: translateY(-2px);
        }

        .metric-box.blue {
          background: #eff6ff;
          border-color: #dbeafe;
        }

        .metric-box.orange {
          background: #fff7ed;
          border-color: #fed7aa;
        }

        .metric-box.green {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        .metric-box.purple {
          background: #faf5ff;
          border-color: #e9d5ff;
        }

        .metric-box.indigo {
          background: #eef2ff;
          border-color: #c7d2fe;
        }

        .metric-box.pink {
          background: #fdf2f8;
          border-color: #fbcfe8;
        }

        .metric-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .metric-box.blue .metric-label {
          color: #2563eb;
        }

        .metric-box.orange .metric-label {
          color: #ea580c;
        }

        .metric-box.green .metric-label {
          color: #16a34a;
        }

        .metric-box.purple .metric-label {
          color: #7c3aed;
        }

        .metric-box.indigo .metric-label {
          color: #4f46e5;
        }

        .metric-box.pink .metric-label {
          color: #db2777;
        }

        .metric-value {
          font-size: 1.75rem;
          font-weight: 700;
        }

        .metric-box.blue .metric-value {
          color: #1e40af;
        }

        .metric-box.orange .metric-value {
          color: #c2410c;
        }

        .metric-box.green .metric-value {
          color: #15803d;
        }

        .metric-box.purple .metric-value {
          color: #6b21a8;
        }

        .metric-box.indigo .metric-value {
          color: #3730a3;
        }

        .metric-box.pink .metric-value {
          color: #9f1239;
        }

        /* Department Performance */
        .dept-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dept-item {
          padding: 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .dept-item:hover {
          border-color: #d1d5db;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .dept-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .dept-name {
          font-weight: 700;
          color: #111827;
          font-size: 1rem;
        }

        .dept-stats {
          display: flex;
          gap: 16px;
          font-size: 0.875rem;
        }

        .dept-stat {
          color: #6b7280;
        }

        .dept-stat-value {
          font-weight: 600;
          color: #111827;
        }

        .dept-stat-value.ai {
          color: #8b5cf6;
        }

        .progress-bar {
          width: 100%;
          height: 10px;
          background: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #10b981);
          border-radius: 10px;
          transition: width 1s ease-out;
        }

        .progress-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
        }

        /* Loading Overlay */
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sidebar {
            width: 280px;
          }

          .main-content {
            margin-left: 0;
          }

          .menu-toggle {
            left: 20px;
          }

          .menu-toggle.sidebar-open {
            left: 300px;
          }

          .page-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .header-actions {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>

      {/* Notifications */}
      <div className="notification-container">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            {notification.type === 'success' && <CheckCircle className="notification-icon" />}
            {notification.type === 'error' && <XCircle className="notification-icon" />}
            {notification.type === 'info' && <Activity className="notification-icon" />}
            <span>{notification.message}</span>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${!isSidebarOpen ? 'hidden' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">HealthAI</h2>
          <p className="sidebar-tagline">Intelligent Healthcare Management</p>
        </div>
        
        <div className="sidebar-nav">
          <SidebarItem path="/healthcare/dashboard" icon={Home} label="Dashboard" isActive={currentPath === '/healthcare/dashboard'} />
          <SidebarItem path="/healthcare/patients" icon={Users} label="Patient Records" isActive={currentPath === '/healthcare/patients'} />
          <SidebarItem path="/healthcare/appointments" icon={Calendar} label="Appointments" isActive={currentPath === '/healthcare/appointments'} />
          <SidebarItem path="/healthcare/diagnosis" icon={Stethoscope} label="Diagnosis Assistant" isActive={currentPath === '/healthcare/diagnosis'} />
          <SidebarItem path="/healthcare/medical-images" icon={Activity} label="Medical Imaging" isActive={currentPath === '/healthcare/medical-images'} />
          <SidebarItem path="/healthcare/emergency" icon={AlertCircle} label="Emergency Prediction" isActive={currentPath === '/healthcare/emergency'} />
          <SidebarItem path="/healthcare/telemedicine" icon={Video} label="Telemedicine" isActive={currentPath === '/healthcare/telemedicine'} />
          <SidebarItem path="/healthcare/monitoring" icon={Heart} label="Remote Monitoring" isActive={currentPath === '/healthcare/monitoring'} />
          <SidebarItem path="/healthcare/reports" icon={FileText} label="Reports" isActive={currentPath === '/healthcare/reports'} />
          <SidebarItem path="/healthcare/chatbot" icon={MessageSquare} label="AI Chatbot" isActive={currentPath === '/healthcare/chatbot'} />
          <SidebarItem path="/healthcare/settings" icon={Settings} label="Settings" isActive={currentPath === '/healthcare/settings'} />
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`menu-toggle ${!isSidebarOpen ? 'sidebar-closed' : ''}`}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="content-wrapper">
          <div className="content-inner">
            {/* Header */}
            <div className="page-header">
              <div className="header-top">
                <div>
                  <h1 className="page-title">AI Healthcare Dashboard</h1>
                  <div className="page-subtitle">
                    <span>Real-time analytics and predictive insights</span>
                    <span className="last-updated">
                      <Clock size={14} />
                      Updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="header-actions">
                  <button
                    onClick={handleRefresh}
                    className={`refresh-btn ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                    title="Refresh Dashboard"
                  >
                    <RefreshCw size={20} />
                  </button>
                  <div className="time-range-buttons">
                    {['day', 'week', 'month'].map((range) => (
                      <button
                        key={range}
                        onClick={() => handleTimeRangeChange(range)}
                        className={`time-btn ${timeRange === range ? 'active' : ''}`}
                        disabled={isLoading}
                      >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <StatCard 
                icon={Users} 
                title="Total Patients" 
                value={dashboardData.totalPatients.toLocaleString()} 
                change={8.2} 
                trend="up" 
                color="blue" 
              />
              <StatCard 
                icon={Calendar} 
                title="Today's Appointments" 
                value={dashboardData.todayAppointments} 
                change={5.1} 
                trend="up" 
                color="green" 
              />
              <StatCard 
                icon={Brain} 
                title="AI Predictions Made" 
                value={dashboardData.aiPredictions} 
                change={12.3} 
                trend="up" 
                color="purple" 
              />
              <StatCard 
                icon={Activity} 
                title="System Health" 
                value={`${dashboardData.systemHealth.toFixed(1)}%`} 
                change={0.3} 
                trend="up" 
                color="indigo" 
              />
            </div>

            {/* AI Alerts */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon orange">
                  <AlertCircle size={20} color="white" />
                </div>
                <h2 className="card-title">AI-Generated Alerts & Recommendations</h2>
              </div>
              <div className="alerts-container">
                {aiAlerts.map((alert) => (
                  <div key={alert.id} className={`alert-card ${alert.type}`}>
                    <div className="alert-content">
                      <div className="alert-info">
                        <div className="alert-meta">
                          <span className={`priority-badge ${alert.priority}`}>{alert.priority}</span>
                          <span className="confidence-text">AI Confidence: {alert.confidence}%</span>
                          {alert.status === 'processed' && (
                            <span className="confidence-text" style={{ color: '#10b981', fontWeight: 600 }}>
                              ✓ Processed
                            </span>
                          )}
                        </div>
                        <p className="alert-message">{alert.message}</p>
                        <p className="alert-action-text">Recommended Action: {alert.action}</p>
                      </div>
                      <button 
                        className={`action-btn ${alert.status === 'processed' ? 'processed' : ''}`}
                        onClick={() => handleAlertAction(alert.id, alert.action)}
                        disabled={alertsProcessing[alert.id] || alert.status === 'processed'}
                      >
                        {alertsProcessing[alert.id] ? (
                          <>
                            <div className="btn-spinner" />
                            Processing...
                          </>
                        ) : alert.status === 'processed' ? (
                          <>
                            <CheckCircle size={16} />
                            Completed
                          </>
                        ) : (
                          'Take Action'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
              {/* Patient Flow */}
              <div className="card">
                <h2 className="card-title">Patient Flow - Actual vs AI Predicted</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={patientFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      name="Actual" 
                      dot={{ fill: '#3b82f6', r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#8b5cf6" 
                      strokeWidth={3} 
                      strokeDasharray="5 5" 
                      name="AI Predicted"
                      dot={{ fill: '#8b5cf6', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="chart-note">
                  <p><strong>AI Prediction Accuracy:</strong> {
                    patientFlowData.length > 0 
                      ? (patientFlowData.reduce((sum, d) => sum + d.aiAccuracy, 0) / patientFlowData.length).toFixed(1)
                      : 0
                  }% average across the {timeRange}</p>
                </div>
              </div>

              {/* Disease Prevalence */}
              <div className="card">
                <h2 className="card-title">Disease Prevalence Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={diseaseData} 
                      cx="50%" 
                      cy="50%" 
                      labelLine={false} 
                      label={({ name, value }) => `${name}: ${value}%`} 
                      outerRadius={100} 
                      fill="#8884d8" 
                      dataKey="value"
                    >
                      {diseaseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Model Performance */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon purple">
                  <Brain size={20} color="white" />
                </div>
                <h2 className="card-title">AI Model Performance Metrics</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aiPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="metric" stroke="#6b7280" />
                  <YAxis domain={[0, 100]} stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Real-time Monitoring */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon yellow">
                  <Zap size={20} color="white" />
                </div>
                <h2 className="card-title">Real-Time Facility Monitoring</h2>
              </div>
              <div className="metrics-grid">
                <div className="metric-box blue">
                  <p className="metric-label">Active Patients</p>
                  <p className="metric-value">{realtimeMetrics.activePatients}</p>
                </div>
                <div className="metric-box orange">
                  <p className="metric-label">Waiting Room</p>
                  <p className="metric-value">{realtimeMetrics.waitingRoom}</p>
                </div>
                <div className="metric-box green">
                  <p className="metric-label">In Treatment</p>
                  <p className="metric-value">{realtimeMetrics.inTreatment}</p>
                </div>
                <div className="metric-box purple">
                  <p className="metric-label">Avg Wait Time</p>
                  <p className="metric-value">{realtimeMetrics.avgWaitTime}m</p>
                </div>
                <div className="metric-box indigo">
                  <p className="metric-label">Bed Occupancy</p>
                  <p className="metric-value">{realtimeMetrics.bedOccupancy}%</p>
                </div>
                <div className="metric-box pink">
                  <p className="metric-label">Staff Utilization</p>
                  <p className="metric-value">{realtimeMetrics.staffUtilization}%</p>
                </div>
              </div>
            </div>

            {/* Department Performance */}
            <div className="card">
              <h2 className="card-title">Department Performance & AI Optimization</h2>
              <div className="dept-list">
                {departmentData.map((dept, index) => (
                  <div key={index} className="dept-item">
                    <div className="dept-header">
                      <h3 className="dept-name">{dept.dept}</h3>
                      <div className="dept-stats">
                        <span className="dept-stat">
                          Patients: <span className="dept-stat-value">{dept.patients}</span>
                        </span>
                        <span className="dept-stat">
                          AI Score: <span className="dept-stat-value ai">{dept.aiScore}%</span>
                        </span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${dept.efficiency}%` }}
                      ></div>
                    </div>
                    <p className="progress-label">Efficiency: {dept.efficiency}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;