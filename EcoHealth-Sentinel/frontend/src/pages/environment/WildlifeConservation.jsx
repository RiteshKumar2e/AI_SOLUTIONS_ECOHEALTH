import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell } from 'recharts';
import { Bird, Trees, Camera, TrendingUp, MapPin, AlertTriangle, Heart, Shield, MessageCircle, Send, X, Loader, RefreshCw, Download, Share2, Bell, Settings, ArrowUp, Zap, Eye, Calendar, Filter, Search, Upload, Database, Wifi, WifiOff, CheckCircle, XCircle, Plus, Edit, Trash2, Award, Users, DollarSign, Leaf, Target, Activity } from 'lucide-react';

export default function WildlifeConservation() {
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: 'Hello! I\'m your AI Wildlife Conservation Assistant. I can help you with species tracking, habitat analysis, threat assessment, and conservation strategies. How can I assist you today?', sender: 'bot', timestamp: new Date().toISOString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(8);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedThreat, setSelectedThreat] = useState(null);
  
  const ws = useRef(null);
  const chatEndRef = useRef(null);
  //const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  //const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';

  const speciesData = [
    {
      name: 'Bengal Tigers',
      population: 42,
      trend: 'increasing',
      status: 'endangered',
      habitat: 'Forest Reserve',
      icon: '🐅',
      change: +8,
      color: '#f97316',
      bgColor: '#fff7ed',
      threats: ['Habitat Loss', 'Poaching'],
      lastSeen: '2 days ago',
      healthScore: 87
    },
    {
      name: 'Indian Elephants',
      population: 127,
      trend: 'stable',
      status: 'vulnerable',
      habitat: 'Wildlife Corridor',
      icon: '🐘',
      change: +2,
      color: '#6b7280',
      bgColor: '#f9fafb',
      threats: ['Human Conflict'],
      lastSeen: '5 hours ago',
      healthScore: 92
    },
    {
      name: 'Gangetic Dolphins',
      population: 68,
      trend: 'increasing',
      status: 'endangered',
      habitat: 'River System',
      icon: '🐬',
      change: +12,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      threats: ['Pollution', 'Noise'],
      lastSeen: '1 day ago',
      healthScore: 78
    },
    {
      name: 'Great Indian Bustard',
      population: 15,
      trend: 'critical',
      status: 'critically endangered',
      habitat: 'Grasslands',
      icon: '🦅',
      change: -3,
      color: '#ef4444',
      bgColor: '#fef2f2',
      threats: ['Power Lines', 'Habitat Loss'],
      lastSeen: '3 days ago',
      healthScore: 65
    },
    {
      name: 'Asiatic Lions',
      population: 34,
      trend: 'stable',
      status: 'endangered',
      habitat: 'Protected Reserve',
      icon: '🦁',
      change: 0,
      color: '#eab308',
      bgColor: '#fefce8',
      threats: ['Disease', 'Inbreeding'],
      lastSeen: '6 hours ago',
      healthScore: 85
    },
    {
      name: 'Snow Leopards',
      population: 23,
      trend: 'increasing',
      status: 'vulnerable',
      habitat: 'Mountain Region',
      icon: '🐆',
      change: +5,
      color: '#8b5cf6',
      bgColor: '#faf5ff',
      threats: ['Climate Change'],
      lastSeen: '4 days ago',
      healthScore: 81
    }
  ];

  const populationTrends = [
    { year: '2020', tigers: 38, elephants: 118, dolphins: 55, bustards: 22, lions: 32, leopards: 19 },
    { year: '2021', tigers: 39, elephants: 120, dolphins: 58, bustards: 19, lions: 33, leopards: 20 },
    { year: '2022', tigers: 40, elephants: 123, dolphins: 62, bustards: 17, lions: 34, leopards: 21 },
    { year: '2023', tigers: 41, elephants: 125, dolphins: 65, bustards: 16, lions: 34, leopards: 22 },
    { year: '2024', tigers: 42, elephants: 127, dolphins: 68, bustards: 15, lions: 34, leopards: 23 }
  ];

  const habitatData = [
    { habitat: 'Forest', area: 4500, protected: 3200, status: 'good', quality: 88 },
    { habitat: 'Wetlands', area: 1200, protected: 980, status: 'moderate', quality: 72 },
    { habitat: 'Grasslands', area: 800, protected: 450, status: 'critical', quality: 58 },
    { habitat: 'Rivers', area: 600, protected: 520, status: 'good', quality: 85 },
    { habitat: 'Mountains', area: 2200, protected: 1800, status: 'good', quality: 90 }
  ];

  const conservationProjects = [
    {
      name: 'Tiger Corridor Restoration',
      status: 'Active',
      funding: 2500000,
      completion: 68,
      beneficiary: 'Bengal Tigers',
      impact: 'Habitat connectivity improved by 45%',
      startDate: '2023-01',
      team: 45
    },
    {
      name: 'Dolphin Sanctuary Expansion',
      status: 'Active',
      funding: 1800000,
      completion: 82,
      beneficiary: 'Gangetic Dolphins',
      impact: 'Protected river stretch increased by 32km',
      startDate: '2022-06',
      team: 28
    },
    {
      name: 'Anti-Poaching Task Force',
      status: 'Operational',
      funding: 3200000,
      completion: 100,
      beneficiary: 'All Species',
      impact: 'Zero poaching incidents in 18 months',
      startDate: '2021-03',
      team: 120
    },
    {
      name: 'Grassland Revival Initiative',
      status: 'Planning',
      funding: 1500000,
      completion: 25,
      beneficiary: 'Great Indian Bustard',
      impact: 'Expected to restore 2000 hectares',
      startDate: '2024-09',
      team: 18
    },
    {
      name: 'Elephant Corridor Network',
      status: 'Active',
      funding: 2800000,
      completion: 55,
      beneficiary: 'Indian Elephants',
      impact: 'Reduced human conflict by 40%',
      startDate: '2023-04',
      team: 62
    },
    {
      name: 'Mountain Habitat Preservation',
      status: 'Active',
      funding: 2200000,
      completion: 72,
      beneficiary: 'Snow Leopards',
      impact: 'Protected 1500 km² of alpine habitat',
      startDate: '2022-11',
      team: 35
    }
  ];

  const threats = [
    {
      type: 'Habitat Loss',
      severity: 'high',
      affected: 'Multiple species',
      mitigation: 'Forest restoration and protected areas expansion',
      incidents: 45,
      trend: 'decreasing'
    },
    {
      type: 'Human-Wildlife Conflict',
      severity: 'medium',
      affected: 'Elephants, Tigers',
      mitigation: 'Community engagement and compensation schemes',
      incidents: 28,
      trend: 'stable'
    },
    {
      type: 'Poaching',
      severity: 'medium',
      affected: 'Tigers, Rhinos',
      mitigation: 'Enhanced surveillance and law enforcement',
      incidents: 12,
      trend: 'decreasing'
    },
    {
      type: 'Climate Change',
      severity: 'high',
      affected: 'All species',
      mitigation: 'Habitat adaptation and species relocation programs',
      incidents: 67,
      trend: 'increasing'
    },
    {
      type: 'Pollution',
      severity: 'medium',
      affected: 'Dolphins, Fish',
      mitigation: 'Water quality monitoring and cleanup initiatives',
      incidents: 34,
      trend: 'stable'
    }
  ];

  const aiApplications = [
    {
      icon: Camera,
      title: 'Camera Trap Analysis',
      description: 'AI analyzes 50,000+ camera trap images monthly to track wildlife movements and population',
      accuracy: 94,
      processed: '52,340'
    },
    {
      icon: MapPin,
      title: 'Movement Prediction',
      description: 'Machine learning predicts animal migration patterns to prevent human-wildlife conflict',
      accuracy: 88,
      processed: '18,920'
    },
    {
      icon: AlertTriangle,
      title: 'Poaching Detection',
      description: 'Real-time alert system using acoustic sensors and AI to detect illegal activities',
      accuracy: 91,
      processed: '8,450'
    },
    {
      icon: Trees,
      title: 'Habitat Monitoring',
      description: 'Satellite imagery analysis tracks deforestation and habitat quality changes',
      accuracy: 96,
      processed: '125,600'
    },
    {
      icon: Activity,
      title: 'Health Monitoring',
      description: 'AI-powered thermal imaging detects signs of disease and injury in wildlife',
      accuracy: 89,
      processed: '15,780'
    },
    {
      icon: Target,
      title: 'Population Estimation',
      description: 'Advanced algorithms estimate population sizes with minimal human intervention',
      accuracy: 92,
      processed: '42,150'
    }
  ];

  const kpiMetrics = [
    { label: 'Total Species Tracked', value: '6', change: '+2', icon: Bird, color: '#10b981' },
    { label: 'Protected Area', value: '6.95K km²', change: '+450 km²', icon: Trees, color: '#3b82f6' },
    { label: 'Conservation Budget', value: '₹14.2 Cr', change: '+₹2.8 Cr', icon: DollarSign, color: '#f59e0b' },
    { label: 'Active Projects', value: '6', change: '+1', icon: Target, color: '#8b5cf6' },
    { label: 'AI Accuracy', value: '92%', change: '+4%', icon: Zap, color: '#ec4899' },
    { label: 'Team Members', value: '308', change: '+42', icon: Users, color: '#14b8a6' },
    { label: 'Success Rate', value: '87%', change: '+8%', icon: Award, color: '#10b981' },
    { label: 'Threats Mitigated', value: '186', change: '+23', icon: Shield, color: '#6366f1' }
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
      
      if (lowerQuery.includes('tiger') || lowerQuery.includes('bengal')) {
        botResponse = '🐅 **Bengal Tigers Status:**\n\nPopulation: 42 (+8 from last year)\nHealth Score: 87%\nLast Seen: 2 days ago\nThreats: Habitat Loss, Poaching\n\n✅ Tiger Corridor project at 68% completion\n💡 Recommendation: Increase patrol frequency in Sector-7';
      } else if (lowerQuery.includes('threat') || lowerQuery.includes('danger')) {
        botResponse = '⚠️ **Threat Assessment:**\n\nHigh Priority:\n• Habitat Loss (45 incidents)\n• Climate Change (67 incidents)\n\nMedium Priority:\n• Human Conflict (28 incidents)\n• Poaching (12 incidents - decreasing)\n\n✅ Anti-poaching task force: 100% operational';
      } else if (lowerQuery.includes('project') || lowerQuery.includes('conservation')) {
        botResponse = '🎯 **Active Projects:**\n\n1. Tiger Corridor (68% complete)\n2. Dolphin Sanctuary (82% complete)\n3. Anti-Poaching (100% operational)\n4. Grassland Revival (25% planning)\n5. Elephant Network (55% active)\n\nTotal Budget: ₹14.2 Crore\nTeam: 308 members';
      } else if (lowerQuery.includes('ai') || lowerQuery.includes('technology')) {
        botResponse = '🤖 **AI Conservation Tools:**\n\n📸 Camera Traps: 94% accuracy\n📍 Movement Prediction: 88% accuracy\n🚨 Poaching Detection: 91% accuracy\n🌳 Habitat Monitoring: 96% accuracy\n\n✅ Processed 263,240 data points this month';
      } else {
        botResponse = '👋 I can help you with:\n\n🐅 Species Status & Tracking\n⚠️ Threat Assessment\n🎯 Conservation Projects\n🤖 AI Technology\n📊 Population Analytics\n🌳 Habitat Analysis\n\nWhat would you like to know?';
      }
      
      setChatMessages(prev => [...prev, { text: botResponse, sender: 'bot', timestamp: new Date().toISOString() }]);
      setChatLoading(false);
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exportReport = () => {
    alert('📊 Exporting Wildlife Conservation Report...\n\nFormat: PDF + Excel\nSize: 5.8 MB\nIncludes: Species data, projects, AI analytics');
  };

  const schedulePatrol = (species) => {
    alert(`🚁 Patrol Scheduled for ${species}\n\nTime: Tomorrow 6:00 AM\nTeam: Wildlife Rangers Unit-3\nDuration: 4 hours\nEquipment: Drones + AI Cameras`);
    setNotifications(prev => prev + 1);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'critically endangered': return '#dc2626';
      case 'endangered': return '#f97316';
      case 'vulnerable': return '#eab308';
      default: return '#10b981';
    }
  };

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

        .wildlife-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdf4 0%, #dbeafe 50%, #faf5ff 100%);
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

        .nav-title {
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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

        .header-card {
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          margin-bottom: 1.5rem;
          border-top: 4px solid #10b981;
          position: relative;
          overflow: hidden;
        }

        .header-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(30%, -30%);
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

        .species-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .species-card {
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border-left: 4px solid;
          position: relative;
          overflow: hidden;
        }

        .species-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
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

        .col-span-8 { grid-column: span 8; }
        .col-span-6 { grid-column: span 6; }
        .col-span-4 { grid-column: span 4; }
        .col-span-12 { grid-column: span 12; }

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

        .message-bubble-user {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 1rem 1.25rem;
          border-radius: 1.25rem 1.25rem 0.25rem 1.25rem;
          margin-left: auto;
          max-width: 80%;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          margin-bottom: 1rem;
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
          margin-bottom: 1rem;
        }

        .chat-input-wrapper {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
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

        ::-webkit-scrollbar {
          width: 12px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #10b981, #059669);
          border-radius: 10px;
        }

        @media (max-width: 1024px) {
          .col-span-8, .col-span-6, .col-span-4 { grid-column: span 12; }
          .chat-panel { right: 1rem; width: calc(100% - 2rem); }
        }
      `}</style>

      <div className="wildlife-container">
        {/* Top Navigation */}
        <div className="top-navbar">
          <h2 className="nav-title">🦁 Wildlife Conservation System</h2>
          
          <div className={`connection-status ${connectionStatus === 'connected' ? 'status-connected' : ''}`}>
            {connectionStatus === 'connected' ? <Wifi style={{ width: '16px', height: '16px' }} /> : <WifiOff style={{ width: '16px', height: '16px' }} />}
            {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </div>

          <div className="nav-actions">
            <button className="icon-btn" onClick={() => setAutoRefresh(!autoRefresh)}>
              <RefreshCw style={{ width: '18px', height: '18px', animation: autoRefresh ? 'spin 2s linear infinite' : 'none' }} />
            </button>
            <button className="icon-btn" onClick={exportReport}>
              <Download style={{ width: '18px', height: '18px' }} />
            </button>
            <button className="notification-btn" onClick={() => setNotifications(0)}>
              <Bell style={{ width: '18px', height: '18px', color: 'white' }} />
              {notifications > 0 && <span className="notification-badge">{notifications}</span>}
            </button>
          </div>
        </div>

        <div className="container-wrapper">
          
          {/* Header */}
          <div className="header-card">
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                    Wildlife Conservation
                  </h1>
                  <p style={{ color: '#6b7280', fontSize: '1rem' }}>AI-powered monitoring and protection of endangered species</p>
                </div>
                <Bird style={{ width: '64px', height: '64px', color: '#10b981', opacity: 0.2 }} />
              </div>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="kpi-grid">
            {kpiMetrics.map((kpi, index) => {
              const Icon = kpi.icon;
              const isPositive = kpi.change.startsWith('+');
              return (
                <div key={index} className="kpi-card" style={{ borderTopColor: kpi.color }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', backgroundColor: kpi.color + '20' }}>
                      <Icon style={{ width: '20px', height: '20px', color: kpi.color }} />
                    </div>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>{kpi.label}</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{kpi.value}</p>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.5rem',
                    marginTop: '0.5rem',
                    display: 'inline-block',
                    background: isPositive ? '#d1fae5' : '#fee2e2',
                    color: isPositive ? '#059669' : '#dc2626'
                  }}>
                    {kpi.change}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Species Cards */}
          <div className="species-grid">
            {speciesData.map((species, index) => (
              <div key={index} className="species-card" style={{ backgroundColor: species.bgColor, borderLeftColor: species.color }}>
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '3rem' }}>{species.icon}</div>
                  <span style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'white',
                    backgroundColor: getStatusBadge(species.status)
                  }}>
                    {species.status.toUpperCase()}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>{species.name}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ color: '#6b7280' }}>Population</p>
                    <p style={{ fontWeight: 600 }}>{species.population}</p>
                  </div>
                  <div>
                    <p style={{ color: '#6b7280' }}>Change</p>
                    <p style={{ fontWeight: 600, color: species.change >= 0 ? '#10b981' : '#ef4444' }}>
                      {species.change >= 0 ? '+' : ''}{species.change}%
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#6b7280' }}>Health Score</p>
                    <p style={{ fontWeight: 600 }}>{species.healthScore}%</p>
                  </div>
                  <div>
                    <p style={{ color: '#6b7280' }}>Last Seen</p>
                    <p style={{ fontWeight: 600 }}>{species.lastSeen}</p>
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Habitat</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{species.habitat}</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Threats</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {species.threats.map((threat, i) => (
                      <span key={i} style={{ padding: '0.25rem 0.5rem', background: '#fee2e2', color: '#dc2626', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
                        {threat}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{
                  padding: '0.75rem',
                  textAlign: 'center',
                  fontWeight: 600,
                  borderRadius: '0.75rem',
                  color: 'white',
                  background: species.trend === 'increasing' ? 'linear-gradient(135deg, #10b981, #059669)' : species.trend === 'stable' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #ef4444, #dc2626)'
                }}>
                  {species.trend.toUpperCase()}
                </div>
                <button onClick={() => schedulePatrol(species.name)} style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}>
                  <Camera style={{ width: '16px', height: '16px' }} />
                  Schedule Patrol
                </button>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <div className="chart-card col-span-8">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp style={{ width: '24px', height: '24px', color: '#10b981' }} />
                Population Trends (2020-2024)
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={populationTrends}>
                  <defs>
                    <linearGradient id="colorTigers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="year" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                  <Legend />
                  <Area type="monotone" dataKey="tigers" stroke="#f97316" fillOpacity={1} fill="url(#colorTigers)" strokeWidth={2} name="Bengal Tigers" />
                  <Area type="monotone" dataKey="elephants" stroke="#6b7280" fillOpacity={0.6} fill="#6b7280" strokeWidth={2} name="Elephants" />
                  <Area type="monotone" dataKey="dolphins" stroke="#3b82f6" fillOpacity={0.4} fill="#3b82f6" strokeWidth={2} name="Dolphins" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card col-span-4">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target style={{ width: '24px', height: '24px', color: '#8b5cf6' }} />
                Habitat Status
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={habitatData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ habitat, quality }) => `${habitat}: ${quality}%`}
                    outerRadius={100}
                    dataKey="quality"
                  >
                    {habitatData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#ef4444', '#06b6d4', '#8b5cf6'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card col-span-12">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trees style={{ width: '24px', height: '24px', color: '#10b981' }} />
                Habitat Protection Comparison
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={habitatData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="habitat" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" label={{ value: 'km²', angle: -90, position: 'insideLeft' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                  <Legend />
                  <Bar dataKey="area" fill="#94a3b8" name="Total Area" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="protected" fill="#10b981" name="Protected Area" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Conservation Projects */}
          <div className="chart-card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target style={{ width: '28px', height: '28px', color: '#10b981' }} />
              Active Conservation Projects
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {conservationProjects.map((project, index) => (
                <div key={index} style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  borderLeft: '4px solid #10b981'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4 style={{ fontWeight: 700, color: '#111827' }}>{project.name}</h4>
                    <span style={{
                      padding: '0.375rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: project.status === 'Operational' ? '#10b981' : project.status === 'Active' ? '#3b82f6' : '#f59e0b',
                      color: 'white'
                    }}>
                      {project.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                    Beneficiary: <span style={{ fontWeight: 600, color: '#111827' }}>{project.beneficiary}</span>
                  </p>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>Progress</span>
                      <span style={{ fontWeight: 600 }}>{project.completion}%</span>
                    </div>
                    <div style={{ width: '100%', height: '12px', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${project.completion}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                        borderRadius: '9999px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ color: '#6b7280' }}>Funding</p>
                      <p style={{ fontWeight: 600 }}>₹{(project.funding / 100000).toFixed(1)}L</p>
                    </div>
                    <div>
                      <p style={{ color: '#6b7280' }}>Team Size</p>
                      <p style={{ fontWeight: 600 }}>{project.team} members</p>
                    </div>
                  </div>
                  <div style={{ padding: '1rem', background: 'white', borderRadius: '0.75rem', border: '2px solid #10b981' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Impact:</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#10b981' }}>{project.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Threats */}
          <div className="chart-card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle style={{ width: '28px', height: '28px', color: '#ef4444' }} />
              Threats & Mitigation Strategies
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {threats.map((threat, index) => (
                <div key={index} style={{
                  background: 'linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  borderLeft: '4px solid',
                  borderLeftColor: getSeverityColor(threat.severity)
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4 style={{ fontWeight: 700, color: '#111827' }}>{threat.type}</h4>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'white',
                      backgroundColor: getSeverityColor(threat.severity)
                    }}>
                      {threat.severity.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                    <p style={{ color: '#6b7280' }}>Affected Species:</p>
                    <p style={{ fontWeight: 600, color: '#111827' }}>{threat.affected}</p>
                  </div>
                  <div style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                    <p style={{ color: '#6b7280' }}>Incidents:</p>
                    <p style={{ fontWeight: 600, color: '#111827' }}>{threat.incidents} reported</p>
                  </div>
                  <div style={{ fontSize: '0.875rem' }}>
                    <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Mitigation:</p>
                    <p style={{ color: '#374151', lineHeight: 1.5 }}>{threat.mitigation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Applications */}
          <div className="chart-card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera style={{ width: '28px', height: '28px', color: '#8b5cf6' }} />
              AI-Powered Conservation Tools
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {aiApplications.map((app, index) => {
                const Icon = app.icon;
                return (
                  <div key={index} style={{
                    background: 'linear-gradient(135deg, #faf5ff 0%, #dbeafe 100%)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid #e9d5ff'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'start', marginBottom: '1rem' }}>
                      <div style={{ padding: '0.75rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '0.75rem', marginRight: '1rem' }}>
                        <Icon style={{ width: '28px', height: '28px', color: '#8b5cf6' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>{app.title}</h4>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5, marginBottom: '0.75rem' }}>{app.description}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                          <div>
                            <p style={{ color: '#6b7280' }}>Accuracy</p>
                            <p style={{ fontWeight: 700, color: '#8b5cf6' }}>{app.accuracy}%</p>
                          </div>
                          <div>
                            <p style={{ color: '#6b7280' }}>Processed</p>
                            <p style={{ fontWeight: 700, color: '#8b5cf6' }}>{app.processed}</p>
                          </div>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '9999px' }}>
                          <div style={{
                            width: `${app.accuracy}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)',
                            borderRadius: '9999px'
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Success Stories */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            color: 'white',
            boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '1.5rem' }}>
              <Heart style={{ width: '48px', height: '48px', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1.5rem' }}>Conservation Success Stories</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {[
                    { icon: '🐅', title: 'Tiger Population Recovery', text: 'Bengal tiger numbers increased by 25% over 5 years through habitat protection and AI surveillance.' },
                    { icon: '🐬', title: 'Dolphin Sanctuary Success', text: 'Gangetic dolphin population grew by 35% after establishing protected zones with acoustic AI sensors.' },
                    { icon: '🌳', title: 'Habitat Restoration', text: 'AI-guided reforestation restored 5,000 hectares of critical wildlife corridors.' },
                    { icon: '👥', title: 'Community Engagement', text: '12,000 community members trained as wildlife guardians, reducing conflict by 60%.' }
                  ].map((story, i) => (
                    <div key={i} style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{story.icon}</p>
                      <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{story.title}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6 }}>{story.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Responsible AI */}
          <div style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            borderRadius: '1.5rem',
            padding: '2rem',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
              <Shield style={{ width: '40px', height: '40px', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Responsible AI for Wildlife Conservation</h3>
                <p style={{ color: '#d1d5db', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Our AI systems are designed with ethical considerations and environmental impact at the forefront. 
                  All wildlife monitoring data is secured with end-to-end encryption, and AI models are regularly audited.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                  {[
                    { icon: '🔒', title: 'Data Privacy', text: 'Protected location data' },
                    { icon: '🤝', title: 'Community Partnership', text: 'Local involvement' },
                    { icon: '🌍', title: 'Environmental First', text: 'Minimal footprint' }
                  ].map((item, i) => (
                    <div key={i} style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.75rem', padding: '1rem' }}>
                      <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</p>
                      <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.title}</p>
                      <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
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
                <Bird style={{ width: '28px', height: '28px' }} />
                <div>
                  <h3 style={{ fontWeight: 700 }}>Wildlife AI Assistant</h3>
                  <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Conservation Intelligence</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '0.5rem', color: 'white', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index}>
                  <div className={msg.sender === 'user' ? 'message-bubble-user' : 'message-bubble-bot'}>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{msg.text}</p>
                    <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.5rem' }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="message-bubble-bot">
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: '8px', height: '8px', background: '#9ca3af', borderRadius: '50%', animation: `pulse 1.4s infinite ${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-wrapper">
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Ask about species, threats, projects..."
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
      </div>
    </>
  );
}
