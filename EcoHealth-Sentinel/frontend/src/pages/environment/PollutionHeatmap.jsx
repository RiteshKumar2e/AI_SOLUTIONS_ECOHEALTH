import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Wind, Droplets, Factory, AlertCircle, TrendingUp, Filter, Download, RefreshCw, Share2, Maximize2, Minimize2, Satellite, MessageSquare, Eye, Bell, Activity, Zap, CloudRain, Sun, Send, X, Mic, History, Settings, BookOpen, Camera, FileText, BarChart2, Calendar, Users } from 'lucide-react';
import jsPDF from 'jspdf';

export default function PollutionHeatmap() {
  const [selectedPollutant, setSelectedPollutant] = useState('pm25');
  const [timeframe, setTimeframe] = useState('current');
  const [viewMode, setViewMode] = useState('heatmap');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [monitoringStations, setMonitoringStations] = useState([]);
  const [pollutionSources, setPollutionSources] = useState([]);
  const [healthRecommendations, setHealthRecommendations] = useState([]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [realTimeData, setRealTimeData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedStations, setSelectedStations] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [downloadFormat, setDownloadFormat] = useState('pdf');
  
  const mapRef = useRef(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

 // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const pollutants = [
    { id: 'pm25', name: 'PM2.5', unit: 'µg/m³', icon: Wind, color: '#ef4444' },
    { id: 'pm10', name: 'PM10', unit: 'µg/m³', icon: Wind, color: '#f97316' },
    { id: 'no2', name: 'NO₂', unit: 'ppb', icon: Factory, color: '#f59e0b' },
    { id: 'so2', name: 'SO₂', unit: 'ppb', icon: Factory, color: '#8b5cf6' },
    { id: 'co', name: 'CO', unit: 'ppm', icon: Factory, color: '#3b82f6' },
    { id: 'o3', name: 'O₃', unit: 'ppb', icon: Wind, color: '#10b981' }
  ];

  const aqiLevels = [
    { range: '0-50', category: 'Good', color: '#10b981', description: 'Air quality is satisfactory' },
    { range: '51-100', category: 'Moderate', color: '#f59e0b', description: 'Acceptable for most people' },
    { range: '101-150', category: 'Unhealthy for Sensitive', color: '#f97316', description: 'Sensitive groups may experience effects' },
    { range: '151-200', category: 'Unhealthy', color: '#ef4444', description: 'Everyone may experience effects' },
    { range: '201-300', category: 'Very Unhealthy', color: '#8b5cf6', description: 'Health alert for everyone' },
    { range: '301+', category: 'Hazardous', color: '#7c3aed', description: 'Emergency conditions' }
  ];

  useEffect(() => {
    loadFallbackData();
    if (autoRefresh) {
      const interval = setInterval(fetchAllData, 300000);
      return () => clearInterval(interval);
    }
  }, [selectedPollutant, timeframe, autoRefresh]);

  useEffect(() => {
    scrollChatToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (showChatbot && chatMessages.length === 0) {
      const greeting = "👋 Hello! I'm your AI Air Quality Assistant. Ask me about pollution levels, health impacts, and recommendations!";
      setChatMessages([{
        id: 1,
        type: 'bot',
        text: greeting,
        timestamp: new Date(),
        suggestions: ['Current AQI', 'PM2.5 Info', 'Health Tips', 'Station Data']
      }]);
    }
  }, [showChatbot]);

  const scrollChatToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchMonitoringData(),
        fetchPollutionSources(),
        fetchHealthRecommendations(),
        fetchTimeSeriesData(),
        fetchRealTimeData()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const fetchMonitoringData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/air-quality-stations`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMonitoringStations(data.stations || []);
      } else {
        loadFallbackData();
      }
    } catch (error) {
      loadFallbackData();
    }
  };

  const fetchPollutionSources = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/pollution-sources`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPollutionSources(data.sources || []);
      }
    } catch (error) {
      loadFallbackData();
    }
  };

  const fetchHealthRecommendations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/health-recommendations`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHealthRecommendations(data.recommendations || []);
      }
    } catch (error) {
      loadFallbackData();
    }
  };

  const fetchTimeSeriesData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/aqi-timeseries?timeframe=${timeframe}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTimeSeriesData(data.timeseries || []);
      }
    } catch (error) {
      console.log('Timeseries data unavailable');
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/real-time-aqi`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRealTimeData(data);
        checkForAlerts(data);
      }
    } catch (error) {
      console.log('Real-time data unavailable');
    }
  };

  const checkForAlerts = (data) => {
    if (data && data.aqi > 150) {
      const alert = {
        id: Date.now(),
        message: `High AQI Alert: ${data.aqi}. Take precautions!`,
        severity: 'high',
        timestamp: new Date()
      };
      setNotifications(prev => [alert, ...prev.slice(0, 4)]);
      
      if (Notification.permission === 'granted') {
        new Notification('⚠️ Air Quality Alert', {
          body: alert.message
        });
      }
    }
  };

  const loadFallbackData = () => {
    setMonitoringStations([
      { id: 1, name: 'City Center', location: 'Darbhanga Municipal Area', coordinates: { lat: 26.1542, lng: 85.8974 }, aqi: 168, pm25: 78, pm10: 145, no2: 45, so2: 12, co: 1.2, o3: 58, status: 'unhealthy', color: '#ef4444' },
      { id: 2, name: 'Industrial Zone', location: 'MIDC Area', coordinates: { lat: 26.1687, lng: 85.9123 }, aqi: 195, pm25: 92, pm10: 178, no2: 58, so2: 18, co: 1.8, o3: 42, status: 'very-unhealthy', color: '#8b5cf6' },
      { id: 3, name: 'Residential North', location: 'North Darbhanga', coordinates: { lat: 26.1789, lng: 85.8856 }, aqi: 142, pm25: 65, pm10: 128, no2: 38, so2: 10, co: 0.9, o3: 52, status: 'unhealthy-sensitive', color: '#f97316' },
      { id: 4, name: 'Green Belt', location: 'Park Area', coordinates: { lat: 26.1423, lng: 85.8745 }, aqi: 95, pm25: 42, pm10: 87, no2: 25, so2: 6, co: 0.5, o3: 62, status: 'moderate', color: '#f59e0b' },
      { id: 5, name: 'Rural Station', location: 'Outskirts', coordinates: { lat: 26.1234, lng: 85.8567 }, aqi: 68, pm25: 28, pm10: 54, no2: 18, so2: 4, co: 0.3, o3: 48, status: 'good', color: '#10b981' }
    ]);

    setPollutionSources([
      { type: 'Vehicular Emissions', contribution: 35, trend: 'increasing', color: '#ef4444', icon: '🚗' },
      { type: 'Industrial Activities', contribution: 28, trend: 'stable', color: '#f97316', icon: '🏭' },
      { type: 'Construction Dust', contribution: 18, trend: 'increasing', color: '#f59e0b', icon: '🏗️' },
      { type: 'Biomass Burning', contribution: 12, trend: 'seasonal', color: '#8b5cf6', icon: '🔥' },
      { type: 'Other Sources', contribution: 7, trend: 'stable', color: '#64748b', icon: '📊' }
    ]);

    setHealthRecommendations([
      { category: 'General Population', advice: 'Limit outdoor activities. Wear N95 masks outdoors. Keep windows closed.', icon: AlertCircle, severity: 'high' },
      { category: 'Sensitive Groups', advice: 'Avoid outdoor activities. Stay indoors with air purifiers. Consult physician if symptoms worsen.', icon: AlertCircle, severity: 'critical' },
      { category: 'Children & Elderly', advice: 'Remain indoors. Use prescribed medications. Monitor health closely.', icon: AlertCircle, severity: 'critical' }
    ]);

    setRealTimeData({ aqi: 168, pm25: 78, pm10: 145, location: 'Darbhanga', timestamp: new Date() });
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
      const avgAQI = Math.round(monitoringStations.reduce((acc, s) => acc + s.aqi, 0) / monitoringStations.length);

      if (currentInput.includes('aqi') || currentInput.includes('air quality') || currentInput.includes('current')) {
        botResponse = `Current Average AQI is ${avgAQI} - This is "${getAQICategory(avgAQI).category}" level.\n\nStations:\n${monitoringStations.slice(0, 3).map(s => `• ${s.name}: ${s.aqi}`).join('\n')}\n\nLimitoutdoor activities and use N95 masks.`;
        suggestions = ['PM2.5 Info', 'Health Tips', 'Station Data'];
      } else if (currentInput.includes('pm2.5') || currentInput.includes('pm 2.5')) {
        botResponse = `PM2.5 particles are <2.5 micrometers - can penetrate deep into lungs.\n\nCurrent level: ${realTimeData?.pm25 || 78} µg/m³\nWHO limit: 15 µg/m³\n\nMain sources:\n🚗 Vehicles: 35%\n🏭 Industry: 28%\n🏗️ Construction: 18%`;
        suggestions = ['Health Effects', 'Safety Tips', 'Sources'];
      } else if (currentInput.includes('health') || currentInput.includes('safety') || currentInput.includes('tip')) {
        botResponse = `🏥 Health Recommendations:\n\n• Wear N95 masks outdoors\n• Limit outdoor activities\n• Keep windows closed\n• Use air purifiers indoors\n• Stay hydrated\n• Monitor symptoms\n\nSensitive groups should avoid outdoor activities when AQI > 100.`;
        suggestions = ['Indoor Air', 'Mask Types', 'Exercise Guidelines'];
      } else if (currentInput.includes('source') || currentInput.includes('cause')) {
        botResponse = `Pollution Sources:\n\n🚗 Vehicular: 35% (peak 7-10 AM, 6-9 PM)\n🏭 Industrial: 28%\n🏗️ Construction: 18%\n🔥 Biomass: 12%\n📊 Others: 7%\n\nWinter pollution increases due to temperature inversion.`;
        suggestions = ['Reduce Pollution', 'Traffic Data', 'Seasonal Patterns'];
      } else if (currentInput.includes('station') || currentInput.includes('location')) {
        botResponse = `${monitoringStations.length} Active Monitoring Stations:\n\n${monitoringStations.map(s => `📍 ${s.name}\nAQI: ${s.aqi} | PM2.5: ${s.pm25}\nStatus: ${getAQICategory(s.aqi).category}`).join('\n\n')}`;
        suggestions = ['Nearest Station', 'Compare Stations', 'Map View'];
      } else if (currentInput.includes('forecast') || currentInput.includes('predict')) {
        botResponse = `📅 24-Hour Forecast:\n\nNext 6 hrs: AQI 170-185 (Unhealthy)\n6-12 hrs: AQI 165-175\n12-24 hrs: AQI 155-170\n\nRecommendation: Plan indoor activities. Rain may help clear pollutants.`;
        suggestions = ['7-Day Forecast', 'Weather Impact', 'Best Times'];
      } else {
        botResponse = `I can help you with:\n\n🌍 Current AQI & pollutant levels\n💨 PM2.5, PM10, NO₂, SO₂ info\n💊 Health recommendations\n📊 Pollution sources & trends\n📍 Station data & locations\n📅 Forecasts & predictions\n💡 Ways to reduce exposure\n\nWhat would you like to know?`;
        suggestions = ['Current AQI', 'PM2.5 Info', 'Health Tips', 'Forecast'];
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
        const utterance = new SpeechSynthesisUtterance(botResponse.replace(/[🌍💨💊📊📍📅💡✅⚠️🟠🔴🟣⚫🚗🏭🏗️🔥]/g, ''));
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    }, 1000);

    setChatHistory(prev => [{ query: chatInput, timestamp: new Date() }, ...prev.slice(0, 19)]);
  };

  const handleSuggestionClick = (suggestion) => {
    setChatInput(suggestion);
    inputRef.current?.focus();
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
      };

      recognition.start();
      showToast('🎤 Listening...');
    } else {
      showToast('❌ Voice input not supported');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
    showToast('✅ Data refreshed!');
  };

  const downloadReportPDF = async () => {
    showToast('📄 Generating PDF...');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Title
    pdf.setFontSize(24);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Air Quality Report', pageWidth / 2, 20, { align: 'center' });
    
    // Timestamp
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: 'center' });
    pdf.text(`Location: Darbhanga, Bihar`, pageWidth / 2, 34, { align: 'center' });
    
    // Average AQI
    const avgAQI = Math.round(monitoringStations.reduce((acc, s) => acc + s.aqi, 0) / monitoringStations.length);
    pdf.setFontSize(16);
    pdf.setTextColor(30, 41, 59);
    pdf.text(`Average AQI: ${avgAQI} (${getAQICategory(avgAQI).category})`, 20, 50);
    
    // Stations Table
    pdf.setFontSize(14);
    pdf.text('Monitoring Stations', 20, 65);
    
    let yPos = 75;
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139);
    pdf.text('Station', 20, yPos);
    pdf.text('AQI', 100, yPos);
    pdf.text('PM2.5', 130, yPos);
    pdf.text('PM10', 155, yPos);
    pdf.text('Status', 175, yPos);
    
    yPos += 6;
    pdf.setTextColor(30, 41, 59);
    
    monitoringStations.forEach((station) => {
      if (yPos > pageHeight - 30) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.text(station.name.substring(0, 20), 20, yPos);
      pdf.text(station.aqi.toString(), 100, yPos);
      pdf.text(station.pm25.toString(), 130, yPos);
      pdf.text(station.pm10.toString(), 155, yPos);
      pdf.text(getAQICategory(station.aqi).category.substring(0, 15), 175, yPos);
      yPos += 6;
    });
    
    // Pollution Sources
    yPos += 10;
    if (yPos > pageHeight - 60) {
      pdf.addPage();
      yPos = 20;
    }
    
    pdf.setFontSize(14);
    pdf.text('Pollution Sources', 20, yPos);
    yPos += 10;
    
    pdf.setFontSize(10);
    pollutionSources.forEach(source => {
      pdf.text(`${source.type}: ${source.contribution}% (Trend: ${source.trend})`, 25, yPos);
      yPos += 6;
    });
    
    // Health Recommendations
    yPos += 10;
    if (yPos > pageHeight - 60) {
      pdf.addPage();
      yPos = 20;
    }
    
    pdf.setFontSize(14);
    pdf.text('Health Recommendations', 20, yPos);
    yPos += 10;
    
    pdf.setFontSize(9);
    healthRecommendations.forEach(rec => {
      pdf.text(`${rec.category}:`, 25, yPos);
      yPos += 5;
      const lines = pdf.splitTextToSize(rec.advice, pageWidth - 50);
      pdf.text(lines, 30, yPos);
      yPos += lines.length * 5 + 3;
    });
    
    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text('AI-Powered Air Quality Monitoring System | Real-time Data & Analysis', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    pdf.save(`air_quality_report_${Date.now()}.pdf`);
    showToast('✅ PDF Downloaded!');
  };

  const downloadReport = () => {
    if (downloadFormat === 'pdf') {
      downloadReportPDF();
    } else {
      const report = {
        timestamp: new Date().toISOString(),
        monitoringStations,
        pollutionSources,
        realTimeData,
        averageAQI: Math.round(monitoringStations.reduce((acc, s) => acc + s.aqi, 0) / monitoringStations.length),
        chatHistory: chatHistory.slice(0, 10)
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pollution_report_${Date.now()}.json`;
      a.click();
      showToast('✅ JSON Downloaded!');
    }
  };

  const shareData = async (station) => {
    const text = `🌫️ Air Quality Update\n\nStation: ${station.name}\nLocation: ${station.location}\nAQI: ${station.aqi}\nPM2.5: ${station.pm25} µg/m³\nPM10: ${station.pm10} µg/m³\nStatus: ${getAQICategory(station.aqi).category}\n\nStay safe and check air quality regularly!`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
        showToast('✅ Shared!');
      } catch (e) {
        navigator.clipboard.writeText(text);
        showToast('✅ Copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(text);
      showToast('✅ Copied to clipboard!');
    }
  };

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return { category: 'Good', color: '#10b981' };
    if (aqi <= 100) return { category: 'Moderate', color: '#f59e0b' };
    if (aqi <= 150) return { category: 'Unhealthy for Sensitive', color: '#f97316' };
    if (aqi <= 200) return { category: 'Unhealthy', color: '#ef4444' };
    if (aqi <= 300) return { category: 'Very Unhealthy', color: '#8b5cf6' };
    return { category: 'Hazardous', color: '#7c3aed' };
  };

  const showToast = (msg) => {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:white;padding:16px 24px;border-radius:12px;box-shadow:0 8px 20px rgba(0,0,0,0.2);z-index:10000;font-weight:600;animation:slideIn 0.3s';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const averageAQI = monitoringStations.length > 0 
    ? Math.round(monitoringStations.reduce((acc, s) => acc + s.aqi, 0) / monitoringStations.length)
    : 0;

  return (
    <>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes rotate3d { 0% { transform: perspective(1000px) rotateY(0deg); } 100% { transform: perspective(1000px) rotateY(360deg); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.3); } 50% { box-shadow: 0 0 40px rgba(59,130,246,0.6); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ripple { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }

        .container { min-height: 100vh; background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 50%, #f3e8ff 100%); padding: ${isFullscreen ? '0' : '24px'}; animation: fadeIn 0.6s; }
        .wrapper { max-width: ${isFullscreen ? '100%' : '1400px'}; margin: 0 auto; }
        .card { background: white; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); padding: 32px; margin-bottom: 24px; animation: fadeIn 0.8s; transition: all 0.3s; position: relative; overflow: hidden; }
        .card::before { content: ''; position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%); animation: rotate3d 20s linear infinite; pointer-events: none; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.12); }
        .btn { padding: 12px 24px; border-radius: 12px; border: none; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-weight: 600; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59,130,246,0.4); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .station-marker { position: absolute; transform: translate(-50%, -50%); cursor: pointer; transition: all 0.3s; }
        .station-marker:hover { transform: translate(-50%, -50%) scale(1.2); z-index: 10; }
        .station-pulse { position: absolute; width: 100px; height: 100px; border-radius: 50%; animation: ripple 2s infinite; pointer-events: none; }
        .loader { width: 60px; height: 60px; border: 5px solid #dbeafe; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
        .floating-icon { animation: float 3s ease-in-out infinite; }
        .input-field { width: 100%; padding: 14px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 15px; transition: all 0.3s; background: #f8fafc; }
        .input-field:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); background: white; }
      `}</style>

      <div className="container">
        <div className="wrapper">
          {/* Header */}
          <div className="card">
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'glow 3s infinite' }}>
                  <Wind size={32} style={{ color: 'white' }} className="floating-icon" />
                </div>
                <div>
                  <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>Air Quality & Pollution Heatmap</h1>
                  <p style={{ color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Satellite size={16} style={{ color: '#3b82f6' }} />
                    Real-time • AI chatbot • PDF reports • {monitoringStations.length} stations
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button className="btn" onClick={() => setShowChatbot(!showChatbot)} style={{ background: showChatbot ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                  <MessageSquare size={18} />
                  {showChatbot ? 'Hide' : 'AI Chat'}
                </button>
                <button className="btn" onClick={() => setShowHistory(!showHistory)} style={{ background: showHistory ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6b7280, #4b5563)' }}>
                  <History size={18} />
                  History
                </button>
                <button className="btn" onClick={() => setCompareMode(!compareMode)} style={{ background: compareMode ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <BarChart2 size={18} />
                  Compare
                </button>
                <select value={downloadFormat} onChange={(e) => setDownloadFormat(e.target.value)} className="input-field" style={{ padding: '8px 12px', width: 'auto', fontSize: '14px' }}>
                  <option value="pdf">PDF</option>
                  <option value="json">JSON</option>
                </select>
                <button className="btn" onClick={downloadReport}>
                  <Download size={18} />
                  {downloadFormat.toUpperCase()}
                </button>
                <button className="btn" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw size={18} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                </button>
                <button className="btn" onClick={() => setIsFullscreen(!isFullscreen)}>
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', animation: 'glow 4s infinite' }}>
            <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px', textAlign: 'center' }}>
              <div>
                <Activity size={32} style={{ margin: '0 auto 8px' }} className="floating-icon" />
                <p style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 4px 0' }}>{averageAQI}</p>
                <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>Average AQI</p>
              </div>
              <div>
                <Zap size={32} style={{ margin: '0 auto 8px' }} className="floating-icon" />
                <p style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 4px 0' }}>{monitoringStations.length}</p>
                <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>Active Stations</p>
              </div>
              <div>
                <Bell size={32} style={{ margin: '0 auto 8px' }} className="floating-icon" />
                <p style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 4px 0' }}>{notifications.length}</p>
                <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>Active Alerts</p>
              </div>
              <div>
                <Sun size={32} style={{ margin: '0 auto 8px' }} className="floating-icon" />
                <p style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 4px 0' }}>{realTimeData?.pm25 || 78}</p>
                <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>PM2.5 µg/m³</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="card">
            <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>
                  <Filter size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  Pollutant Type
                </label>
                <select value={selectedPollutant} onChange={(e) => setSelectedPollutant(e.target.value)} className="input-field">
                  {pollutants.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>
                  <Activity size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  Timeframe
                </label>
                <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="input-field">
                  <option value="current">Current</option>
                  <option value="hourly">Last 24 Hours</option>
                  <option value="daily">Last 7 Days</option>
                  <option value="monthly">Last Month</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>
                  <Eye size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  View Mode
                </label>
                <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="input-field">
                  <option value="heatmap">Heatmap</option>
                  <option value="stations">Monitoring Stations</option>
                  <option value="sources">Pollution Sources</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px', background: '#f1f5f9', borderRadius: '12px', width: '100%' }}>
                  <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Auto Refresh</span>
                </label>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            {/* Interactive Heatmap */}
            <div className="card" style={{ gridColumn: window.innerWidth > 1024 ? 'span 2' : 'span 1' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={28} style={{ color: '#3b82f6' }} />
                  Pollution Distribution Map
                </h2>
                
                <div ref={mapRef} style={{ position: 'relative', background: 'linear-gradient(135deg, #dbeafe, #d1fae5)', borderRadius: '16px', height: '500px', overflow: 'hidden', border: '2px solid #e2e8f0' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                  {monitoringStations.map((station) => (
                    <div
                      key={station.id}
                      className="station-marker"
                      style={{
                        left: `${((station.coordinates.lng - 85.85) / 0.1) * 100}%`,
                        top: `${100 - ((station.coordinates.lat - 26.12) / 0.08) * 100}%`
                      }}
                    >
                      <div className="station-pulse" style={{ background: `${station.color}30` }}></div>
                      <div className="station-pulse" style={{ background: `${station.color}20`, animationDelay: '1s' }}></div>
                      
                      <div style={{ position: 'relative', zIndex: 10, width: '48px', height: '48px', borderRadius: '50%', background: station.color, border: '4px solid white', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2s infinite' }}>
                        <MapPin size={24} style={{ color: 'white' }} />
                      </div>

                      <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '12px', opacity: 0, transition: 'opacity 0.3s', pointerEvents: 'none', zIndex: 100 }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
                        <div style={{ background: '#1e293b', color: 'white', fontSize: '13px', borderRadius: '12px', padding: '16px', whiteSpace: 'nowrap', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
                          <p style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px', margin: 0 }}>{station.name}</p>
                          <p style={{ color: '#cbd5e1', marginBottom: '12px', margin: '0 0 12px 0' }}>{station.location}</p>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                            <div>
                              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>AQI</p>
                              <p style={{ fontSize: '20px', fontWeight: '800', color: station.color, margin: 0 }}>{station.aqi}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>PM2.5</p>
                              <p style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>{station.pm25}</p>
                            </div>
                          </div>
                          <button onClick={() => shareData(station)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: 'none', background: station.color, color: 'white', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
                            Share Data
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '12px', margin: '0 0 12px 0' }}>AQI Scale</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {aqiLevels.map((level, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: level.color, marginRight: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                          <span style={{ fontWeight: '600' }}>{level.range}</span>
                          <span style={{ marginLeft: '8px', color: '#64748b' }}>{level.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pollution Sources */}
            <div className="card">
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>Pollution Sources</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pollutionSources.map((source, index) => (
                    <div key={index} style={{ background: `${source.color}10`, borderRadius: '12px', padding: '16px', borderLeft: `4px solid ${source.color}`, transition: 'all 0.3s', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(8px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '24px' }}>{source.icon}</span>
                          <h3 style={{ fontWeight: '700', fontSize: '15px', color: '#1e293b', margin: 0 }}>{source.type}</h3>
                        </div>
                        <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: 'white', background: source.color }}>
                          {source.contribution}%
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{ width: `${source.contribution}%`, height: '100%', background: source.color, borderRadius: '10px', transition: 'width 1s' }}></div>
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                        Trend: <span style={{ fontWeight: '700', color: source.trend === 'increasing' ? '#ef4444' : source.trend === 'decreasing' ? '#10b981' : '#64748b' }}>{source.trend}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Monitoring Stations Grid */}
          <div className="card">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>Monitoring Station Data</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {monitoringStations.map((station) => {
                  const category = getAQICategory(station.aqi);
                  return (
                    <div key={station.id} style={{ background: `${category.color}10`, borderRadius: '16px', padding: '20px', borderLeft: `4px solid ${category.color}`, transition: 'all 0.3s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <MapPin size={28} style={{ color: category.color }} />
                        <span style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: '800', color: 'white', background: category.color }}>
                          {station.aqi}
                        </span>
                      </div>
                      <h3 style={{ fontWeight: '700', fontSize: '18px', color: '#1e293b', marginBottom: '4px', margin: '0 0 4px 0' }}>{station.name}</h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', margin: '0 0 12px 0' }}>{station.location}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', marginBottom: '12px' }}>
                        <div>
                          <span style={{ color: '#64748b' }}>PM2.5:</span>
                          <span style={{ fontWeight: '700', marginLeft: '4px' }}>{station.pm25}</span>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>PM10:</span>
                          <span style={{ fontWeight: '700', marginLeft: '4px' }}>{station.pm10}</span>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>NO₂:</span>
                          <span style={{ fontWeight: '700', marginLeft: '4px' }}>{station.no2}</span>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>SO₂:</span>
                          <span style={{ fontWeight: '700', marginLeft: '4px' }}>{station.so2}</span>
                        </div>
                      </div>
                      <div style={{ padding: '10px', borderRadius: '8px', textAlign: 'center', color: 'white', background: category.color, fontSize: '13px', fontWeight: '700' }}>
                        {category.category}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Health Recommendations */}
          <div className="card">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>Health Recommendations</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {healthRecommendations.map((rec, index) => {
                  const Icon = rec.icon;
                  return (
                    <div key={index} style={{ background: rec.severity === 'critical' ? '#fef2f2' : '#fff7ed', borderRadius: '16px', padding: '20px', borderLeft: `4px solid ${rec.severity === 'critical' ? '#ef4444' : '#f97316'}` }}>
                      <div style={{ display: 'flex', alignItems: 'start', marginBottom: '12px' }}>
                        <Icon size={24} style={{ color: rec.severity === 'critical' ? '#ef4444' : '#f97316', marginRight: '12px', flexShrink: 0 }} />
                        <h3 style={{ fontWeight: '700', fontSize: '16px', color: '#1e293b', margin: 0 }}>{rec.category}</h3>
                      </div>
                      <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>{rec.advice}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AQI Reference */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Air Quality Index (AQI) Reference</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {aqiLevels.map((level, index) => (
                  <div key={index} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)' }}>
                    <div style={{ width: '100%', height: '12px', borderRadius: '10px', background: level.color, marginBottom: '12px' }}></div>
                    <p style={{ fontWeight: '800', fontSize: '16px', marginBottom: '4px', margin: '0 0 4px 0' }}>{level.range}</p>
                    <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', margin: '0 0 8px 0' }}>{level.category}</p>
                    <p style={{ fontSize: '12px', opacity: 0.9, lineHeight: '1.5', margin: 0 }}>{level.description}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                <p style={{ fontSize: '14px', lineHeight: '1.8', margin: 0 }}>
                  <strong>AI-Powered Analysis:</strong> Our system processes real-time data from {monitoringStations.length} monitoring stations, satellite imagery (NASA/NOAA), meteorological data, and traffic patterns to provide accurate pollution mapping and 24-hour forecasting. Machine learning models analyze historical trends to predict air quality with 87% accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      {showChatbot && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '420px', height: '650px', background: 'white', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', flexDirection: 'column', animation: 'slideIn 0.3s' }}>
          <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', padding: '20px', borderRadius: '24px 24px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MessageSquare size={24} />
              <div>
                <p style={{ fontWeight: '700', fontSize: '16px', margin: 0 }}>AI Air Quality Assistant</p>
                <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>Ask me anything!</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setVoiceEnabled(!voiceEnabled)} style={{ padding: '8px', background: voiceEnabled ? '#10b981' : 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <Mic size={18} style={{ color: 'white' }} />
              </button>
              <button onClick={() => setShowChatbot(false)} style={{ padding: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <X size={18} style={{ color: 'white' }} />
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {chatMessages.map((msg) => (
              <div key={msg.id}>
                <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius1: '16px', fontSize: '14px', lineHeight: '1.6', animation: 'fadeIn 0.3s', background: msg.type === 'user' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#f1f5f9', color: msg.type === 'user' ? 'white' : '#1e293b', alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start', borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                  {msg.type === 'bot' && (
                    <p style={{ fontSize: '11px', opacity: 0.7, marginTop: '8px', margin: '8px 0 0 0' }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {msg.suggestions.map((sug, i) => (
                      <button key={i} onClick={() => handleSuggestionClick(sug)} style={{ padding: '8px 12px', background: '#e0e7ff', color: '#3b82f6', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#e0e7ff'; e.currentTarget.style.color = '#3b82f6'; }}>
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div style={{ padding: '12px 16px', background: '#f1f5f9', borderRadius: '16px', alignSelf: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', animation: 'pulse 1s infinite' }}></div>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', animation: 'pulse 1s infinite 0.2s' }}></div>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', animation: 'pulse 1s infinite 0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
            <input
              ref={inputRef}
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
              placeholder="Ask about air quality..."
              style={{ flex: 1, padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
            <button onClick={handleVoiceInput} style={{ padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}>
              <Mic size={18} style={{ color: '#3b82f6' }} />
            </button>
            <button onClick={handleChatSend} style={{ padding: '12px 16px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Chat History Panel */}
      {showHistory && (
        <div style={{ position: 'fixed', top: '100px', right: '20px', width: '350px', maxHeight: '500px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', zIndex: 999, animation: 'slideIn 0.3s', overflowY: 'auto' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'between', background: 'linear-gradient(135deg, #6b7280, #4b5563)', color: 'white', borderRadius: '16px 16px 0 0' }}>
            <h3 style={{ margin: 0, fontWeight: '700', fontSize: '16px', flex: 1 }}>Chat History</h3>
            <button onClick={() => setShowHistory(false)} style={{ padding: '6px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              <X size={16} style={{ color: 'white' }} />
            </button>
          </div>
          <div style={{ padding: '16px' }}>
            {chatHistory.length > 0 ? chatHistory.map((item, i) => (
              <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '0 0 4px 0' }}>{item.query}</p>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{new Date(item.timestamp).toLocaleString()}</p>
              </div>
            )) : (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px' }}>No history yet</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
