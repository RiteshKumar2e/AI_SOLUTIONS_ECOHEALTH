import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Sun, Wind, Droplets, Zap, TrendingUp, Battery, DollarSign, Leaf, MessageSquare, Send, X, Mic, Download, RefreshCw, Bell, BarChart2, Maximize2, Minimize2, Users, Share2 } from 'lucide-react';

export default function RenewableEnergy() {
  const [selectedEnergy, setSelectedEnergy] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [liveData, setLiveData] = useState(true);
  
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const energySources = [
    { type: 'Solar', icon: Sun, capacity: 2500, generation: 2180, efficiency: 87.2, color: '#f59e0b', bgColor: '#fef3c7', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
    { type: 'Wind', icon: Wind, capacity: 1800, generation: 1440, efficiency: 80.0, color: '#3b82f6', bgColor: '#dbeafe', gradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)' },
    { type: 'Hydro', icon: Droplets, capacity: 3200, generation: 2880, efficiency: 90.0, color: '#06b6d4', bgColor: '#cffafe', gradient: 'linear-gradient(135deg, #22d3ee, #06b6d4)' },
    { type: 'Biomass', icon: Leaf, capacity: 800, generation: 640, efficiency: 80.0, color: '#10b981', bgColor: '#d1fae5', gradient: 'linear-gradient(135deg, #34d399, #10b981)' }
  ];

  const monthlyGeneration = [
    { month: 'Jan', solar: 180, wind: 120, hydro: 240, biomass: 52 },
    { month: 'Feb', solar: 195, wind: 135, hydro: 245, biomass: 54 },
    { month: 'Mar', solar: 210, wind: 110, hydro: 250, biomass: 55 },
    { month: 'Apr', solar: 225, wind: 95, hydro: 240, biomass: 53 },
    { month: 'May', solar: 240, wind: 85, hydro: 235, biomass: 52 },
    { month: 'Jun', solar: 220, wind: 140, hydro: 250, biomass: 54 },
    { month: 'Jul', solar: 200, wind: 160, hydro: 280, biomass: 56 },
    { month: 'Aug', solar: 205, wind: 155, hydro: 275, biomass: 55 },
    { month: 'Sep', solar: 215, wind: 145, hydro: 260, biomass: 54 },
    { month: 'Oct', solar: 210, wind: 130, hydro: 250, biomass: 53 },
    { month: 'Nov', solar: 195, wind: 115, hydro: 245, biomass: 52 },
    { month: 'Dec', solar: 185, wind: 125, hydro: 240, biomass: 51 }
  ];

  const energyMix = [
    { name: 'Solar', value: 32, color: '#f59e0b' },
    { name: 'Wind', value: 21, color: '#3b82f6' },
    { name: 'Hydro', value: 38, color: '#06b6d4' },
    { name: 'Biomass', value: 9, color: '#10b981' }
  ];

  const [stats, setStats] = useState({
    totalCapacity: 8300,
    currentGeneration: 7140,
    co2Saved: 125400,
    costSavings: 4250000,
    householdsPowered: 28500
  });

  const projects = [
    { name: 'Solar Farm Expansion', type: 'Solar', capacity: 500, status: 'In Progress', completion: 68, investment: 2500000, expectedCompletion: 'Q2 2026' },
    { name: 'Wind Turbine Installation', type: 'Wind', capacity: 300, status: 'Planning', completion: 25, investment: 1800000, expectedCompletion: 'Q4 2026' },
    { name: 'Micro-hydro Plant', type: 'Hydro', capacity: 200, status: 'In Progress', completion: 82, investment: 1200000, expectedCompletion: 'Q1 2026' },
    { name: 'Biomass Energy Center', type: 'Biomass', capacity: 150, status: 'Operational', completion: 100, investment: 800000, expectedCompletion: 'Completed' }
  ];

  const predictions = [
    { year: '2025', capacity: 8300, generation: 7140 },
    { year: '2026', capacity: 9450, generation: 8350 },
    { year: '2027', capacity: 10800, generation: 9720 },
    { year: '2028', capacity: 12500, generation: 11500 },
    { year: '2029', capacity: 14200, generation: 13200 },
    { year: '2030', capacity: 16000, generation: 15000 }
  ];

  const benefits = [
    { icon: Leaf, title: 'Carbon Reduction', value: '125,400', unit: 'tons CO₂/year', description: 'Equivalent to planting 5.6 million trees', color: '#10b981', bgColor: '#d1fae5' },
    { icon: DollarSign, title: 'Cost Savings', value: '₹42.5', unit: 'Lakh/year', description: 'Reduced electricity costs', color: '#3b82f6', bgColor: '#dbeafe' },
    { icon: Zap, title: 'Energy Independence', value: '86%', unit: 'Self-sufficient', description: 'Reduced grid dependence', color: '#8b5cf6', bgColor: '#ede9fe' },
    { icon: Battery, title: 'Grid Stability', value: '99.7%', unit: 'Uptime', description: 'Reliable power supply', color: '#f59e0b', bgColor: '#fef3c7' }
  ];

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Solar efficiency increased by 3%', time: '5 mins ago', type: 'success' },
    { id: 2, message: 'Wind turbine maintenance scheduled', time: '1 hour ago', type: 'info' },
    { id: 3, message: 'New biomass project approved', time: '3 hours ago', type: 'success' }
  ]);

  const chatbotKnowledge = {
    greeting: ["👋 Hello! I'm your Renewable Energy AI Assistant. Ask me about energy production, efficiency, or sustainability!"],
    solar: [`Solar capacity: ${Math.round(stats.totalCapacity * 0.32)} kW generating ${Math.round(stats.currentGeneration * 0.32)} kW. Efficiency: 87.2%. Peak hours: 10 AM - 4 PM.`],
    wind: [`Wind capacity: ${Math.round(stats.totalCapacity * 0.21)} kW generating ${Math.round(stats.currentGeneration * 0.21)} kW. Efficiency: 80%. Optimal wind speed: 12-25 mph.`],
    hydro: [`Hydro capacity: ${Math.round(stats.totalCapacity * 0.38)} kW generating ${Math.round(stats.currentGeneration * 0.38)} kW. Efficiency: 90%. Most reliable 24/7 source.`],
    savings: [`Total savings: ₹${(stats.costSavings / 100000).toFixed(1)} Lakh/year. CO₂ reduction: ${(stats.co2Saved / 1000).toFixed(1)} tons. Powering ${stats.householdsPowered.toLocaleString()} homes!`],
    efficiency: [`Overall system efficiency: 85.8%. Solar: 87.2%, Wind: 80%, Hydro: 90%, Biomass: 80%. AI optimization increased efficiency by 12%.`]
  };

  useEffect(() => {
    if (autoRefresh && liveData) {
      const interval = setInterval(() => {
        updateLiveData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, liveData]);

  useEffect(() => {
    if (showChatbot && chatMessages.length === 0) {
      setChatMessages([{
        id: 1,
        type: 'bot',
        text: chatbotKnowledge.greeting[0],
        timestamp: new Date(),
        suggestions: ['Solar Info', 'Cost Savings', 'Efficiency', 'Projects']
      }]);
    }
  }, [showChatbot]);

  useEffect(() => {
    scrollChatToBottom();
  }, [chatMessages]);

  const scrollChatToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateLiveData = () => {
    setStats(prev => ({
      ...prev,
      currentGeneration: prev.currentGeneration + Math.floor(Math.random() * 10 - 5),
      co2Saved: prev.co2Saved + Math.floor(Math.random() * 5)
    }));
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput.toLowerCase();
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      let suggestions = [];

      if (currentInput.includes('solar') || currentInput.includes('sun')) {
        botResponse = chatbotKnowledge.solar[0];
        suggestions = ['Wind Info', 'Hydro Info', 'Compare'];
      } else if (currentInput.includes('wind')) {
        botResponse = chatbotKnowledge.wind[0];
        suggestions = ['Solar Info', 'Efficiency'];
      } else if (currentInput.includes('hydro') || currentInput.includes('water')) {
        botResponse = chatbotKnowledge.hydro[0];
        suggestions = ['Biomass', 'Projects'];
      } else if (currentInput.includes('cost') || currentInput.includes('saving')) {
        botResponse = chatbotKnowledge.savings[0];
        suggestions = ['CO₂ Reduction', 'ROI'];
      } else if (currentInput.includes('efficiency')) {
        botResponse = chatbotKnowledge.efficiency[0];
        suggestions = ['Optimization', 'AI Features'];
      } else if (currentInput.includes('project')) {
        botResponse = `Active Projects:\n${projects.map(p => `• ${p.name} (${p.status}): ${p.completion}%`).join('\n')}`;
        suggestions = ['Timeline', 'Investment'];
      } else {
        botResponse = `I can help with:\n\n🌞 Solar, Wind, Hydro & Biomass\n💰 Cost savings & ROI\n📊 Efficiency data\n🏗️ Active projects\n🔮 Future predictions`;
        suggestions = ['Solar Info', 'Savings', 'Efficiency'];
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: botResponse,
        timestamp: new Date(),
        suggestions
      };

      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(botResponse.replace(/[🌞💰📊🏗️🔮•]/g, ''));
        window.speechSynthesis.speak(utterance);
      }
    }, 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setChatInput(suggestion);
    inputRef.current?.focus();
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.onresult = (event) => {
        setChatInput(event.results[0][0].transcript);
      };
      recognition.start();
      showToast('🎤 Listening...');
    } else {
      showToast('❌ Voice not supported');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      updateLiveData();
      setRefreshing(false);
      showToast('✅ Data refreshed!');
    }, 1000);
  };

  const downloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      stats,
      energySources,
      projects
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `renewable_energy_report_${Date.now()}.json`;
    a.click();
    showToast('✅ Report downloaded!');
  };

  const shareData = async () => {
    const text = `🌱 Renewable Energy Update\n\nCapacity: ${stats.totalCapacity} kW\nGeneration: ${stats.currentGeneration} kW\nCO₂ Saved: ${(stats.co2Saved / 1000).toFixed(1)} tons\nHomes Powered: ${stats.householdsPowered.toLocaleString()}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        navigator.clipboard.writeText(text);
        showToast('✅ Copied!');
      }
    } else {
      navigator.clipboard.writeText(text);
      showToast('✅ Copied!');
    }
  };

  const showToast = (msg) => {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg,#10b981,#059669);color:white;padding:16px 24px;border-radius:12px;box-shadow:0 8px 20px rgba(0,0,0,0.2);z-index:10000;font-weight:600;animation:slideIn 0.3s';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #d1fae5 50%, #dbeafe 100%)',
      padding: isFullscreen ? '0' : '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      background: 'white',
      borderRadius: '24px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
      padding: '32px',
      marginBottom: '24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    statCard: {
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      padding: '24px',
      color: 'white',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '12px',
      border: 'none',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(16,185,129,0.4); } 50% { box-shadow: 0 0 40px rgba(16,185,129,0.8); } }
        
        .energy-card { animation: fadeIn 0.6s ease; }
        .energy-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.15); }
        .stat-card:hover { transform: translateY(-4px) scale(1.02); }
        .floating-icon { animation: float 3s ease-in-out infinite; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
        .progress-bar { transition: width 1s ease; }
      `}</style>

      <div style={styles.container}>
        <div style={{ maxWidth: isFullscreen ? '100%' : '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div className="energy-card" style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #34d399, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'glow 3s infinite' }}>
                  <Zap size={32} style={{ color: 'white' }} className="floating-icon" />
                </div>
                <div>
                  <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1f2937', margin: '0 0 8px 0' }}>Renewable Energy Management</h1>
                  <p style={{ color: '#6b7280', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <Leaf size={16} style={{ color: '#10b981' }} />
                    AI-optimized clean energy • Real-time monitoring • {energySources.length} sources
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button onClick={() => setShowChatbot(!showChatbot)} className="btn" style={{ ...styles.button, background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <MessageSquare size={18} />
                  AI Chat
                </button>
                <button onClick={() => setShowNotifications(!showNotifications)} className="btn" style={{ ...styles.button, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', position: 'relative' }}>
                  <Bell size={18} />
                  {notifications.length > 0 && (
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '20px', height: '20px', background: '#ef4444', borderRadius: '50%', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>{notifications.length}</span>
                  )}
                </button>
                <button onClick={() => setCompareMode(!compareMode)} className="btn" style={{ ...styles.button, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                  <BarChart2 size={18} />
                </button>
                <button onClick={downloadReport} className="btn" style={{ ...styles.button, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <Download size={18} />
                </button>
                <button onClick={handleRefresh} disabled={refreshing} className="btn" style={{ ...styles.button, background: 'linear-gradient(135deg, #6b7280, #4b5563)' }}>
                  <RefreshCw size={18} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                </button>
                <button onClick={() => setIsFullscreen(!isFullscreen)} className="btn" style={{ ...styles.button, background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="stat-card" style={{ ...styles.statCard, background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
              <Zap size={32} style={{ marginBottom: '12px' }} className="floating-icon" />
              <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 4px 0' }}>Total Capacity</p>
              <p style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 4px 0' }}>{stats.totalCapacity.toLocaleString()}</p>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>kW</p>
            </div>

            <div className="stat-card" style={{ ...styles.statCard, background: 'linear-gradient(135deg, #34d399, #10b981)' }}>
              <TrendingUp size={32} style={{ marginBottom: '12px' }} className="floating-icon" />
              <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 4px 0' }}>Current Output</p>
              <p style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 4px 0' }}>{stats.currentGeneration.toLocaleString()}</p>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                kW {liveData && <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'white', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>} Live
              </p>
            </div>

            <div className="stat-card" style={{ ...styles.statCard, background: 'linear-gradient(135deg, #60a5fa, #3b82f6)' }}>
              <Leaf size={32} style={{ marginBottom: '12px' }} className="floating-icon" />
              <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 4px 0' }}>CO₂ Saved</p>
              <p style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 4px 0' }}>{(stats.co2Saved / 1000).toFixed(1)}</p>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>tons/year</p>
            </div>

            <div className="stat-card" style={{ ...styles.statCard, background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)' }}>
              <DollarSign size={32} style={{ marginBottom: '12px' }} className="floating-icon" />
              <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 4px 0' }}>Cost Savings</p>
              <p style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 4px 0' }}>₹{(stats.costSavings / 100000).toFixed(1)}</p>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>Lakh/year</p>
            </div>

            <div className="stat-card" style={{ ...styles.statCard, background: 'linear-gradient(135deg, #22d3ee, #06b6d4)' }}>
              <Users size={32} style={{ marginBottom: '12px' }} className="floating-icon" />
              <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 4px 0' }}>Households</p>
              <p style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 4px 0' }}>{(stats.householdsPowered / 1000).toFixed(1)}K</p>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>powered</p>
            </div>
          </div>

          {/* Energy Sources */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {energySources.map((source, index) => {
              const Icon = source.icon;
              return (
                <div key={index} className="energy-card" style={{ ...styles.card, background: source.bgColor }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: source.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={28} style={{ color: 'white' }} className="floating-icon" />
                    </div>
                    <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', color: source.color, background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      {source.efficiency}%
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', margin: '0 0 12px 0' }}>{source.type} Energy</h3>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span style={{ color: '#6b7280' }}>Capacity:</span>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>{source.capacity} kW</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#6b7280' }}>Generation:</span>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>{source.generation} kW</span>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                    <div className="progress-bar" style={{ width: `${source.efficiency}%`, height: '100%', background: source.gradient, borderRadius: '10px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <div className="energy-card" style={{ ...styles.card, gridColumn: 'span 2' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', marginBottom: '16px' }}>Monthly Energy Generation</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyGeneration}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Bar dataKey="solar" stackId="a" fill="#f59e0b" name="Solar" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="wind" stackId="a" fill="#3b82f6" name="Wind" />
                  <Bar dataKey="hydro" stackId="a" fill="#06b6d4" name="Hydro" />
                  <Bar dataKey="biomass" stackId="a" fill="#10b981" name="Biomass" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="energy-card" style={styles.card}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginBottom: '16px' }}>Energy Mix Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={energyMix}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {energyMix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Projects */}
          <div className="energy-card" style={{ ...styles.card, marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', marginBottom: '16px' }}>Active & Planned Projects</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {projects.map((project, index) => (
                <div key={index} style={{ background: 'linear-gradient(135deg, #ede9fe, #f3f4f6)', borderRadius: '16px', padding: '20px', border: '2px solid #e0e7ff' }}>
                  <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0', fontSize: '16px' }}>{project.name}</h3>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{project.type} • {project.capacity} kW</p>
                    </div>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'white',
                      background: project.status === 'Operational' ? '#10b981' : project.status === 'In Progress' ? '#3b82f6' : '#f59e0b'
                    }}>
                      {project.status}
                    </span>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ color: '#6b7280' }}>Progress</span>
                      <span style={{ fontWeight: '700', color: '#1f2937' }}>{project.completion}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                      <div className="progress-bar" style={{ width: `${project.completion}%`, height: '100%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '10px' }}></div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                    <div>
                      <p style={{ color: '#6b7280', margin: '0 0 4px 0' }}>Investment</p>
                      <p style={{ fontWeight: '700', color: '#1f2937', margin: 0 }}>₹{(project.investment / 100000).toFixed(1)}L</p>
                    </div>
                    <div>
                      <p style={{ color: '#6b7280', margin: '0 0 4px 0' }}>Completion</p>
                      <p style={{ fontWeight: '700', color: '#1f2937', margin: 0 }}>{project.expectedCompletion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Predictions Chart */}
          <div className="energy-card" style={{ ...styles.card, marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', marginBottom: '16px' }}>AI-Powered Growth Predictions</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="capacity" stroke="#3b82f6" strokeWidth={3} name="Capacity (kW)" dot={{ r: 6 }} />
                <Line type="monotone" dataKey="generation" stroke="#10b981" strokeWidth={3} name="Generation (kW)" dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Benefits */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="energy-card" style={{ ...styles.card, background: benefit.bgColor }}>
                  <Icon size={32} style={{ color: benefit.color, marginBottom: '12px' }} />
                  <h3 style={{ fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0', fontSize: '16px' }}>{benefit.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '800', color: benefit.color }}>{benefit.value}</span>
                    <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '8px' }}>{benefit.unit}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{benefit.description}</p>
                </div>
              );
            })}
          </div>

          {/* AI Optimization Info */}
          <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '24px', padding: '40px', color: 'white', boxShadow: '0 10px 40px rgba(16,185,129,0.3)', animation: 'glow 4s infinite' }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '24px' }}>
              <Zap size={40} style={{ flexShrink: 0 }} className="floating-icon" />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 16px 0' }}>AI-Powered Energy Optimization</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)' }}>
                    <h3 style={{ fontWeight: '700', margin: '0 0 8px 0', fontSize: '16px' }}>🤖 Smart Load Balancing</h3>
                    <p style={{ fontSize: '13px', opacity: 0.9, margin: 0, lineHeight: '1.6' }}>AI algorithms dynamically distribute power based on weather, demand, and efficiency.</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)' }}>
                    <h3 style={{ fontWeight: '700', margin: '0 0 8px 0', fontSize: '16px' }}>📊 Predictive Maintenance</h3>
                    <p style={{ fontSize: '13px', opacity: 0.9, margin: 0, lineHeight: '1.6' }}>ML models predict failures, reducing downtime by 40% and extending equipment life.</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)' }}>
                    <h3 style={{ fontWeight: '700', margin: '0 0 8px 0', fontSize: '16px' }}>☀️ Weather Forecasting</h3>
                    <p style={{ fontSize: '13px', opacity: 0.9, margin: 0, lineHeight: '1.6' }}>AI predicts solar and wind patterns 7 days ahead for optimal energy planning.</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)' }}>
                    <h3 style={{ fontWeight: '700', margin: '0 0 8px 0', fontSize: '16px' }}>⚡ Grid Optimization</h3>
                    <p style={{ fontSize: '13px', opacity: 0.9, margin: 0, lineHeight: '1.6' }}>Real-time AI balances renewable generation with grid demand for stability.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      {showChatbot && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '400px', height: '600px', background: 'white', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', flexDirection: 'column', animation: 'slideIn 0.3s' }}>
          <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '20px', borderRadius: '24px 24px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Zap size={24} />
              <div>
                <p style={{ fontWeight: '700', fontSize: '16px', margin: 0 }}>Energy AI Assistant</p>
                <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>Ask me anything!</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setVoiceEnabled(!voiceEnabled)} style={{ padding: '8px', background: voiceEnabled ? '#fff' : 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <Mic size={18} style={{ color: voiceEnabled ? '#10b981' : 'white' }} />
              </button>
              <button onClick={() => setShowChatbot(false)} style={{ padding: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {chatMessages.map((msg) => (
              <div key={msg.id}>
                <div style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.type === 'user' ? 'linear-gradient(135deg, #10b981, #059669)' : '#f3f4f6',
                  color: msg.type === 'user' ? 'white' : '#1f2937',
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}
                </div>
                {msg.suggestions && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(sug)}
                        style={{ padding: '6px 12px', background: '#d1fae5', color: '#059669', border: 'none', borderRadius: '16px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#a7f3d0'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#d1fae5'}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: '4px', padding: '12px 16px', background: '#f3f4f6', borderRadius: '16px', alignSelf: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', animation: 'pulse 1s infinite' }}></div>
                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }}></div>
                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }}></div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
            <input
              ref={inputRef}
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
              placeholder="Ask about renewable energy..."
              style={{ ...styles.input, flex: 1 }}
            />
            <button onClick={handleVoiceInput} style={{ padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
              <Mic size={20} style={{ color: '#6b7280' }} />
            </button>
            <button onClick={handleChatSend} style={{ padding: '12px 16px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {showNotifications && (
        <div style={{ position: 'fixed', top: '100px', right: '20px', width: '320px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', zIndex: 999, padding: '16px', animation: 'slideIn 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: '700', fontSize: '16px', color: '#1f2937', margin: 0 }}>Notifications</h3>
            <button onClick={() => setShowNotifications(false)} style={{ padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <X size={18} style={{ color: '#6b7280' }} />
            </button>
          </div>
          {notifications.map(notif => (
            <div key={notif.id} style={{ padding: '12px', borderRadius: '8px', marginBottom: '8px', background: notif.type === 'success' ? '#d1fae5' : '#dbeafe' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>{notif.message}</p>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>{notif.time}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
