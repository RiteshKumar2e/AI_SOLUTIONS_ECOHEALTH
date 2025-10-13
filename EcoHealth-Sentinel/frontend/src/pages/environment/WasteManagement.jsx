import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, RadialBarChart, RadialBar
} from 'recharts';
import { 
  Trash2, Recycle, TrendingUp, MapPin, AlertCircle, Leaf, Package, 
  MessageCircle, Send, X, Loader, RefreshCw, Plus, Eye, Edit, Bell, 
  Sparkles, Zap, Calendar, Filter, Search, Download, Share2, Target,
  Activity, DollarSign, Users, Truck, Clock, Award, TrendingDown,
  BarChart3, PieChart as PieChartIcon, Map, Shield, ArrowUp, Settings,
  FileText, Upload, Database, Wifi, WifiOff, CheckCircle, XCircle,
  AlertTriangle, Info, ChevronUp, Menu, Maximize2, Minimize2
} from 'lucide-react';

export default function WasteManagement() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('overview');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: 'Hello! I\'m your AI Waste Management Assistant with real-time analytics, predictive insights, and optimization capabilities. How can I help you today?', sender: 'bot', timestamp: new Date().toISOString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(12);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const ws = useRef(null);
  const chatEndRef = useRef(null);
 // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  //const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';

  // Comprehensive Data
  const wasteStats = [
    { type: 'Recyclable', collected: 450, recycled: 380, percentage: 84, icon: Recycle, color: '#10b981', trend: '+12%', cost: '$2,340', revenue: '$3,200' },
    { type: 'Organic', collected: 680, recycled: 610, percentage: 90, icon: Leaf, color: '#059669', trend: '+8%', cost: '$1,890', revenue: '$2,800' },
    { type: 'Hazardous', collected: 85, recycled: 75, percentage: 88, icon: AlertCircle, color: '#ef4444', trend: '+5%', cost: '$4,500', revenue: '$0' },
    { type: 'General', collected: 920, recycled: 280, percentage: 30, icon: Trash2, color: '#6b7280', trend: '-3%', cost: '$5,600', revenue: '$800' },
    { type: 'E-Waste', collected: 125, recycled: 115, percentage: 92, icon: Package, color: '#8b5cf6', trend: '+15%', cost: '$3,200', revenue: '$4,500' },
    { type: 'Metal', collected: 340, recycled: 330, percentage: 97, icon: Shield, color: '#f59e0b', trend: '+10%', cost: '$2,100', revenue: '$5,200' }
  ];

  const monthlyTrends = [
    { month: 'Jan', recyclable: 420, organic: 650, general: 880, hazardous: 78, cost: 12400, revenue: 6200, efficiency: 82 },
    { month: 'Feb', recyclable: 435, organic: 670, general: 900, hazardous: 82, cost: 12800, revenue: 6500, efficiency: 84 },
    { month: 'Mar', recyclable: 440, organic: 680, general: 910, hazardous: 80, cost: 13100, revenue: 6800, efficiency: 85 },
    { month: 'Apr', recyclable: 445, organic: 675, general: 920, hazardous: 83, cost: 13400, revenue: 7100, efficiency: 86 },
    { month: 'May', recyclable: 450, organic: 680, general: 920, hazardous: 85, cost: 13700, revenue: 7400, efficiency: 88 },
    { month: 'Jun', recyclable: 455, organic: 690, general: 915, hazardous: 84, cost: 14000, revenue: 7800, efficiency: 90 }
  ];

  const hourlyData = [
    { hour: '00:00', amount: 45 }, { hour: '02:00', amount: 32 }, { hour: '04:00', amount: 28 },
    { hour: '06:00', amount: 52 }, { hour: '08:00', amount: 89 }, { hour: '10:00', amount: 112 },
    { hour: '12:00', amount: 145 }, { hour: '14:00', amount: 138 }, { hour: '16:00', amount: 156 },
    { hour: '18:00', amount: 132 }, { hour: '20:00', amount: 98 }, { hour: '22:00', amount: 67 }
  ];

  const wasteComposition = [
    { name: 'Plastic', value: 28, color: '#3b82f6' },
    { name: 'Paper', value: 22, color: '#10b981' },
    { name: 'Food Waste', value: 35, color: '#059669' },
    { name: 'Metal', value: 8, color: '#6b7280' },
    { name: 'Glass', value: 7, color: '#06b6d4' }
  ];

  const performanceMetrics = [
    { metric: 'Collection Efficiency', value: 92, fullMark: 100 },
    { metric: 'Recycling Rate', value: 84, fullMark: 100 },
    { metric: 'Route Optimization', value: 88, fullMark: 100 },
    { metric: 'Cost Efficiency', value: 76, fullMark: 100 },
    { metric: 'Customer Satisfaction', value: 94, fullMark: 100 },
    { metric: 'Environmental Impact', value: 89, fullMark: 100 }
  ];

  const collectionPoints = [
    { id: 1, name: 'Central Hub', location: 'Main Market', status: 'operational', capacity: 85, lastCollection: '2 hours ago', types: ['All'], priority: 'high' },
    { id: 2, name: 'Residential A', location: 'North Zone', status: 'operational', capacity: 62, lastCollection: '4 hours ago', types: ['Recyclable', 'Organic'], priority: 'medium' },
    { id: 3, name: 'Industrial Area', location: 'MIDC', status: 'full', capacity: 95, lastCollection: '30 mins ago', types: ['General', 'Hazardous'], priority: 'urgent' },
    { id: 4, name: 'Educational Campus', location: 'University', status: 'operational', capacity: 45, lastCollection: '6 hours ago', types: ['Recyclable'], priority: 'low' },
    { id: 5, name: 'Commercial District', location: 'Business Center', status: 'maintenance', capacity: 0, lastCollection: '12 hours ago', types: ['All'], priority: 'high' },
    { id: 6, name: 'Hospital Complex', location: 'Medical District', status: 'operational', capacity: 78, lastCollection: '1 hour ago', types: ['Hazardous'], priority: 'urgent' },
    { id: 7, name: 'Tech Park', location: 'IT Hub', status: 'operational', capacity: 55, lastCollection: '3 hours ago', types: ['E-Waste', 'Recyclable'], priority: 'medium' },
    { id: 8, name: 'Food Market', location: 'Central Market', status: 'operational', capacity: 82, lastCollection: '1.5 hours ago', types: ['Organic'], priority: 'high' }
  ];

  const kpiMetrics = [
    { label: 'Collection Rate', value: '95.2%', change: '+2.3%', icon: Truck, color: '#10b981' },
    { label: 'Avg Response Time', value: '42 min', change: '-8 min', icon: Clock, color: '#3b82f6' },
    { label: 'Cost per Ton', value: '$124', change: '-$12', icon: DollarSign, color: '#f59e0b' },
    { label: 'Recycling Rate', value: '84%', change: '+6%', icon: Recycle, color: '#059669' },
    { label: 'Customer Satisfaction', value: '4.7/5', change: '+0.3', icon: Award, color: '#8b5cf6' },
    { label: 'Fleet Efficiency', value: '89%', change: '+4%', icon: Activity, color: '#ec4899' },
    { label: 'CO₂ Reduction', value: '1.2T', change: '+0.3T', icon: Leaf, color: '#14b8a6' },
    { label: 'Active Users', value: '12.4K', change: '+840', icon: Users, color: '#6366f1' },
    { label: 'Waste Diverted', value: '2,450T', change: '+180T', icon: TrendingUp, color: '#10b981' },
    { label: 'Revenue Generated', value: '$45K', change: '+$8K', icon: DollarSign, color: '#059669' },
    { label: 'Processing Speed', value: '98%', change: '+3%', icon: Zap, color: '#f59e0b' },
    { label: 'Compliance Score', value: '96%', change: '+2%', icon: CheckCircle, color: '#10b981' }
  ];

  const recyclingPrograms = [
    { name: 'Plastic to Fuel', status: 'Active', processed: 2400, unit: 'kg/month', impact: '1.2 tons CO₂ saved', participants: 340 },
    { name: 'E-Waste Recovery', status: 'Active', processed: 850, unit: 'kg/month', impact: '450 kg metals recovered', participants: 120 },
    { name: 'Organic Composting', status: 'Active', processed: 5200, unit: 'kg/month', impact: '3.5 tons fertilizer produced', participants: 580 },
    { name: 'Paper Recycling', status: 'Active', processed: 1800, unit: 'kg/month', impact: '42 trees saved', participants: 290 },
    { name: 'Glass Recycling', status: 'Active', processed: 1200, unit: 'kg/month', impact: '30% energy saved', participants: 180 },
    { name: 'Metal Recovery', status: 'Active', processed: 3400, unit: 'kg/month', impact: '$12K revenue', participants: 410 }
  ];

  const tips = [
    'Separate waste at source into recyclable, organic, and general categories',
    'Rinse containers before recycling to prevent contamination',
    'Compost organic waste to create nutrient-rich soil',
    'Avoid single-use plastics and opt for reusable alternatives',
    'Donate or sell items instead of throwing them away',
    'Properly dispose of hazardous waste at designated collection points',
    'Use reusable bags when shopping to reduce plastic waste',
    'Buy products with minimal packaging',
    'Participate in local recycling programs and initiatives'
  ];

  // Initialize
  useEffect(() => {
    initializeWebSocket();
    
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (ws.current) ws.current.close();
    };
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
        // Simulate data refresh
        console.log('Auto-refreshing data...');
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const initializeWebSocket = () => {
    try {
      ws.current = new WebSocket(WS_URL);
      ws.current.onopen = () => {
        console.log('✅ WebSocket connected');
        setConnectionStatus('connected');
      };
      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'chat') {
          setChatMessages(prev => [...prev, {
            text: message.text || message.reply,
            sender: 'bot',
            timestamp: new Date().toISOString()
          }]);
          setChatLoading(false);
        }
      };
      ws.current.onerror = () => setConnectionStatus('error');
      ws.current.onclose = () => setConnectionStatus('disconnected');
    } catch (error) {
      setConnectionStatus('error');
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { text: chatInput, sender: 'user', timestamp: new Date().toISOString() }]);
    const query = chatInput;
    setChatInput('');
    setChatLoading(true);

    setTimeout(() => {
      let botResponse = '';
      const lowerQuery = query.toLowerCase();
      
      if (lowerQuery.includes('kpi') || lowerQuery.includes('metric')) {
        botResponse = '📊 **Key Performance Indicators:**\n\n✅ Collection Rate: 95.2% (+2.3%)\n⏱️ Response Time: 42 min (-8 min)\n💰 Cost per Ton: $124 (-$12)\n♻️ Recycling: 84% (+6%)\n⭐ Satisfaction: 4.7/5\n\nAll metrics trending positively!';
      } else if (lowerQuery.includes('predict')) {
        botResponse = '🔮 **AI Predictions:**\n\nExpected peak: Saturday 1,150kg\nOptimal collection: Friday 3 PM\nResource allocation: +2 trucks needed\nConfidence: 94%';
      } else if (lowerQuery.includes('optimize') || lowerQuery.includes('route')) {
        botResponse = '🚛 **Route Optimization Complete!**\n\nFuel savings: 28%\nTime saved: 52 minutes\nCO₂ reduced: 45kg\nOptimized path visits 8 points efficiently';
      } else {
        botResponse = '👋 I can help with:\n\n📊 KPI Analysis\n🔮 Predictions\n🚛 Route Optimization\n♻️ Recycling Stats\n💰 Cost Analysis\n🗺️ Zone Performance\n\nWhat would you like to explore?';
      }
      
      setChatMessages(prev => [...prev, { text: botResponse, sender: 'bot', timestamp: new Date().toISOString() }]);
      setChatLoading(false);
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exportData = () => {
    alert('📊 Exporting comprehensive report...\n\nFormat: PDF + Excel\nSize: 4.2 MB\nIncludes: All charts, KPIs, and analytics');
  };

  const scheduleCollection = (pointId) => {
    alert(`✅ Collection scheduled for ${collectionPoints.find(p => p.id === pointId)?.name}\n\nScheduled: Tomorrow 9:00 AM\nVehicle: Truck-03\nEstimated duration: 45 min`);
    setNotifications(prev => prev + 1);
  };

  const optimizeRoute = () => {
    setLoading(true);
    setTimeout(() => {
      alert('🚛 AI Route Optimization Complete!\n\n✅ Fuel savings: 28%\n✅ Time saved: 52 minutes\n✅ CO₂ reduced: 45kg\n✅ Efficiency: +12%\n\nNew route applied to all vehicles!');
      setLoading(false);
      setNotifications(prev => prev + 1);
    }, 2000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

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

        html {
          scroll-behavior: smooth;
        }

        .waste-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdf4 0%, #dbeafe 50%, #e0f2fe 100%);
          padding: 1rem;
        }

        .top-navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 1rem 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .menu-btn {
          padding: 0.625rem;
          background: #f3f4f6;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .menu-btn:hover {
          background: #e5e7eb;
          transform: scale(1.05);
        }

        .nav-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .status-connected {
          background: #d1fae5;
          color: #059669;
        }

        .status-disconnected {
          background: #fee2e2;
          color: #dc2626;
        }

        .nav-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .icon-btn {
          padding: 0.625rem;
          background: #f3f4f6;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover {
          background: #e5e7eb;
          transform: scale(1.05);
        }

        .icon-btn-primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .icon-btn-primary:hover {
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .notification-btn {
          position: relative;
          padding: 0.625rem;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        .notification-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #ef4444;
          color: white;
          font-size: 0.7rem;
          min-width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: 700;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .container-wrapper {
          max-width: 1800px;
          margin: 0 auto;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .kpi-card {
          background: white;
          border-radius: 1rem;
          padding: 1.25rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border-top: 3px solid;
        }

        .kpi-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
        }

        .kpi-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .kpi-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          opacity: 0.2;
        }

        .kpi-label {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .kpi-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
        }

        .kpi-change {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
          margin-top: 0.5rem;
          display: inline-block;
        }

        .kpi-change.positive {
          background: #d1fae5;
          color: #059669;
        }

        .kpi-change.negative {
          background: #fee2e2;
          color: #dc2626;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .chart-card {
          background: white;
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .chart-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
        }

        .chart-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .col-span-8 { grid-column: span 8; }
        .col-span-6 { grid-column: span 6; }
        .col-span-4 { grid-column: span 4; }
        .col-span-12 { grid-column: span 12; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border-left: 4px solid;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
        }

        .collection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .collection-card {
          background: white;
          border-radius: 1rem;
          padding: 1.25rem;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .collection-card:hover {
          border-color: #3b82f6;
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .priority-urgent { border-left: 4px solid #ef4444; }
        .priority-high { border-left: 4px solid #f59e0b; }
        .priority-medium { border-left: 4px solid #3b82f6; }
        .priority-low { border-left: 4px solid #10b981; }

        .schedule-btn {
          width: 100%;
          margin-top: 1rem;
          padding: 0.625rem;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          font-weight: 600;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .schedule-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .scroll-to-top {
          position: fixed;
          bottom: 6rem;
          right: 2rem;
          padding: 1rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(16, 185, 129, 0.5);
          z-index: 40;
          transition: all 0.3s ease;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .scroll-to-top:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 48px rgba(16, 185, 129, 0.7);
        }

        .chat-fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          padding: 1.25rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(16, 185, 129, 0.5);
          z-index: 40;
          animation: float 3s infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .chat-fab:hover {
          transform: scale(1.1);
        }

        .chat-panel {
          position: fixed;
          bottom: 2rem;
          right: 8rem;
          width: 450px;
          height: 700px;
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          z-index: 50;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .chat-header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 1.25rem;
          border-radius: 1.5rem 1.5rem 0 0;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          background: #f9fafb;
        }

        .chat-message {
          margin-bottom: 1rem;
          animation: messageSlide 0.3s ease;
        }

        @keyframes messageSlide {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .message-bubble-user {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 1rem 1.25rem;
          border-radius: 1.25rem 1.25rem 0.25rem 1.25rem;
          margin-left: auto;
          max-width: 80%;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .message-bubble-bot {
          background: white;
          color: #111827;
          padding: 1rem 1.25rem;
          border-radius: 1.25rem 1.25rem 1.25rem 0.25rem;
          max-width: 80%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          white-space: pre-wrap;
        }

        .chat-input-wrapper {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .chat-input-container {
          display: flex;
          gap: 0.75rem;
        }

        .chat-input {
          flex: 1;
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .chat-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .loading-overlay {
          position: fixed;
          inset: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #10b981, #059669);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #059669, #047857);
        }

        @media (max-width: 1024px) {
          .col-span-8, .col-span-6, .col-span-4 { grid-column: span 12; }
          .chat-panel { right: 1rem; width: calc(100% - 2rem); }
        }
      `}</style>

      <div className="waste-container">
        {/* Top Navigation */}
        <div className="top-navbar">
          <div className="nav-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu style={{ width: '20px', height: '20px' }} />
            </button>
            <h2 className="nav-title">🌍 Smart Waste Management</h2>
          </div>
          
          <div className={`connection-status ${connectionStatus === 'connected' ? 'status-connected' : 'status-disconnected'}`}>
            {connectionStatus === 'connected' ? <Wifi style={{ width: '16px', height: '16px' }} /> : <WifiOff style={{ width: '16px', height: '16px' }} />}
            {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </div>

          <div className="nav-actions">
            <button className="icon-btn" onClick={() => setAutoRefresh(!autoRefresh)} title={autoRefresh ? 'Disable Auto-refresh' : 'Enable Auto-refresh'}>
              <RefreshCw style={{ width: '18px', height: '18px', animation: autoRefresh ? 'spin 2s linear infinite' : 'none' }} />
            </button>
            <button className="icon-btn" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 style={{ width: '18px', height: '18px' }} /> : <Maximize2 style={{ width: '18px', height: '18px' }} />}
            </button>
            <button className="icon-btn" onClick={exportData}>
              <Download style={{ width: '18px', height: '18px' }} />
            </button>
            <button className="notification-btn" onClick={() => setNotifications(0)}>
              <Bell style={{ width: '18px', height: '18px', color: 'white' }} />
              {notifications > 0 && <span className="notification-badge">{notifications}</span>}
            </button>
            <button className="icon-btn icon-btn-primary" onClick={optimizeRoute} disabled={loading}>
              {loading ? <Loader className="spinner" style={{ width: '18px', height: '18px' }} /> : <Zap style={{ width: '18px', height: '18px' }} />}
            </button>
          </div>
        </div>

        <div className="container-wrapper">
          
          {/* KPI Metrics */}
          <div className="kpi-grid">
            {kpiMetrics.map((kpi, index) => {
              const Icon = kpi.icon;
              const isPositive = kpi.change.startsWith('+') || (kpi.change.startsWith('-') && (kpi.label.includes('Time') || kpi.label.includes('Cost')));
              return (
                <div key={index} className="kpi-card" style={{ borderTopColor: kpi.color }}>
                  <div className="kpi-header">
                    <div className="kpi-icon" style={{ backgroundColor: kpi.color }}>
                      <Icon style={{ width: '20px', height: '20px', color: kpi.color }} />
                    </div>
                  </div>
                  <p className="kpi-label">{kpi.label}</p>
                  <p className="kpi-value">{kpi.value}</p>
                  <span className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
                    {kpi.change}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Main Charts */}
          <div className="charts-grid">
            <div className="chart-card col-span-8">
              <h3 className="chart-title"><TrendingUp style={{ width: '24px', height: '24px', color: '#10b981' }} />Monthly Collection Trends</h3>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="colorRecyclable" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                  <Legend />
                  <Area type="monotone" dataKey="recyclable" stroke="#10b981" fillOpacity={1} fill="url(#colorRecyclable)" strokeWidth={2} />
                  <Area type="monotone" dataKey="organic" stroke="#059669" fillOpacity={0.6} fill="#059669" strokeWidth={2} />
                  <Area type="monotone" dataKey="general" stroke="#6b7280" fillOpacity={0.4} fill="#6b7280" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card col-span-4">
              <h3 className="chart-title"><Target style={{ width: '24px', height: '24px', color: '#3b82f6' }} />Performance Metrics</h3>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={performanceMetrics}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Score" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} strokeWidth={2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card col-span-6">
              <h3 className="chart-title"><DollarSign style={{ width: '24px', height: '24px', color: '#f59e0b' }} />Cost vs Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cost" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card col-span-6">
              <h3 className="chart-title"><PieChartIcon style={{ width: '24px', height: '24px', color: '#8b5cf6' }} />Waste Composition</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={wasteComposition}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {wasteComposition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card col-span-12">
              <h3 className="chart-title"><Clock style={{ width: '24px', height: '24px', color: '#ec4899' }} />Hourly Collection Pattern</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#hourlyGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Waste Stats */}
          <div className="stats-grid">
            {wasteStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: stat.color + '20', borderRadius: '0.75rem' }}>
                      <Icon style={{ width: '32px', height: '32px', color: stat.color }} />
                    </div>
                    <span style={{ padding: '0.375rem 0.75rem', backgroundColor: stat.color, color: 'white', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 700 }}>
                      {stat.percentage}%
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>{stat.type} Waste</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ color: '#6b7280' }}>Collected</p>
                      <p style={{ fontWeight: 600 }}>{stat.collected} kg</p>
                    </div>
                    <div>
                      <p style={{ color: '#6b7280' }}>Processed</p>
                      <p style={{ fontWeight: 600 }}>{stat.recycled} kg</p>
                    </div>
                    <div>
                      <p style={{ color: '#6b7280' }}>Cost</p>
                      <p style={{ fontWeight: 600 }}>{stat.cost}</p>
                    </div>
                    <div>
                      <p style={{ color: '#6b7280' }}>Revenue</p>
                      <p style={{ fontWeight: 600, color: '#10b981' }}>{stat.revenue}</p>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${stat.percentage}%`, height: '100%', backgroundColor: stat.color, borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Collection Points */}
          <div className="chart-card">
            <h3 className="chart-title"><MapPin style={{ width: '24px', height: '24px', color: '#3b82f6' }} />Collection Points Status</h3>
            <div className="collection-grid">
              {collectionPoints.map((point) => (
                <div key={point.id} className={`collection-card priority-${point.priority}`}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <MapPin style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'white',
                      backgroundColor: point.status === 'operational' ? '#10b981' : point.status === 'full' ? '#ef4444' : '#f59e0b'
                    }}>
                      {point.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{point.name}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>{point.location}</p>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>Capacity</span>
                      <span style={{ fontWeight: 600 }}>{point.capacity}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '9999px' }}>
                      <div style={{
                        width: `${point.capacity}%`,
                        height: '100%',
                        backgroundColor: point.capacity > 80 ? '#ef4444' : point.capacity > 60 ? '#f59e0b' : '#10b981',
                        borderRadius: '9999px'
                      }} />
                    </div>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Last: {point.lastCollection}</p>
                  <button className="schedule-btn" onClick={() => scheduleCollection(point.id)}>
                    <Calendar style={{ width: '16px', height: '16px' }} />
                    Schedule Collection
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recycling Programs */}
          <div className="chart-card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="chart-title"><Recycle style={{ width: '24px', height: '24px', color: '#059669' }} />Recycling Programs</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {recyclingPrograms.map((program, index) => (
                <div key={index} style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  borderLeft: '4px solid #10b981'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4 style={{ fontWeight: 700 }}>{program.name}</h4>
                    <span style={{
                      padding: '0.375rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: program.status === 'Active' ? '#10b981' : '#f59e0b',
                      color: 'white'
                    }}>
                      {program.status}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ color: '#6b7280' }}>Processed</p>
                      <p style={{ fontWeight: 600 }}>{program.processed.toLocaleString()} {program.unit}</p>
                    </div>
                    <div>
                      <p style={{ color: '#6b7280' }}>Participants</p>
                      <p style={{ fontWeight: 600 }}>{program.participants}</p>
                    </div>
                  </div>
                  <div style={{ padding: '1rem', background: 'white', borderRadius: '0.5rem', border: '2px solid #10b981' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Impact:</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#10b981' }}>{program.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="chart-card">
            <h3 className="chart-title"><Info style={{ width: '24px', height: '24px', color: '#6366f1' }} />Waste Reduction Tips</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {tips.map((tip, index) => (
                <div key={index} style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  borderLeft: '4px solid #10b981',
                  display: 'flex',
                  gap: '0.75rem'
                }}>
                  <span style={{
                    background: '#10b981',
                    color: 'white',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </span>
                  <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.5 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll to Top */}
        {showScrollTop && (
          <button className="scroll-to-top" onClick={scrollToTop}>
            <ArrowUp style={{ width: '24px', height: '24px' }} />
          </button>
        )}

        {/* Chat FAB */}
        <button onClick={() => setChatOpen(!chatOpen)} className="chat-fab">
          <MessageCircle style={{ width: '28px', height: '28px' }} />
        </button>

        {/* Chat Panel */}
        {chatOpen && (
          <div className="chat-panel">
            <div className="chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Sparkles style={{ width: '28px', height: '28px' }} />
                <div>
                  <h3 style={{ fontWeight: 700 }}>Waste AI Assistant</h3>
                  <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Online • Analytics</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '0.5rem', color: 'white', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className="chat-message">
                  <div className={msg.sender === 'user' ? 'message-bubble-user' : 'message-bubble-bot'}>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{msg.text}</p>
                    <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.5rem' }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="chat-message">
                  <div className="message-bubble-bot">
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <div style={{ width: '8px', height: '8px', background: '#9ca3af', borderRadius: '50%', animation: 'pulse 1.4s infinite' }} />
                      <div style={{ width: '8px', height: '8px', background: '#9ca3af', borderRadius: '50%', animation: 'pulse 1.4s infinite 0.2s' }} />
                      <div style={{ width: '8px', height: '8px', background: '#9ca3af', borderRadius: '50%', animation: 'pulse 1.4s infinite 0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-wrapper">
              <div className="chat-input-container">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Ask about KPIs, predictions, costs..."
                  className="chat-input"
                />
                <button onClick={sendChatMessage} disabled={chatLoading} style={{
                  padding: '0.875rem 1rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer'
                }}>
                  <Send style={{ width: '20px', height: '20px' }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <Loader className="spinner" style={{ width: '64px', height: '64px', color: '#10b981' }} />
          </div>
        )}
      </div>
    </>
  );
}
