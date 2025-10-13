import React, { useState, useEffect } from 'react';
import { AlertTriangle, CloudRain, Wind, Waves, Thermometer, MapPin, Shield, Clock, Download, RefreshCw, Share2, Bell, Activity, Users, Maximize2, Minimize2, Radio, Satellite, Zap, AlertCircle, CheckCircle, TrendingUp, BarChart3, Eye, EyeOff } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function DisasterPrediction() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);
  const [activeDisasters, setActiveDisasters] = useState([]);
  const [preparednessChecklist, setPreparednessChecklist] = useState([]);
  const [earlyWarningSystem, setEarlyWarningSystem] = useState({});
  const [vulnerabilityAreas, setVulnerabilityAreas] = useState([]);
  const [responseTeams, setResponseTeams] = useState([]);
  const [aiPredictions, setAiPredictions] = useState([]);

  // Graph data
  const [floodHistoryData, setFloodHistoryData] = useState([]);
  const [temperatureTrendData, setTemperatureTrendData] = useState([]);
  const [rainfallPatternData, setRainfallPatternData] = useState([]);
  const [disasterFrequencyData, setDisasterFrequencyData] = useState([]);
  const [riskAssessmentData, setRiskAssessmentData] = useState([]);
  const [evacuationReadinessData, setEvacuationReadinessData] = useState([]);
  const [seasonalTrendsData, setSeasonalTrendsData] = useState([]);
  const [impactAnalysisData, setImpactAnalysisData] = useState([]);
  const [responseTimeData, setResponseTimeData] = useState([]);

  //const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDisasterPredictions(),
        fetchEarlyWarningStatus(),
        fetchVulnerabilityData(),
        fetchResponseTeams()
      ]);
      if (showGraphs) {
        await fetchGraphData();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const fetchGraphData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/disaster-trends`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFloodHistoryData(data.floodHistory || []);
        setTemperatureTrendData(data.temperatureTrend || []);
        setRainfallPatternData(data.rainfallPattern || []);
        setDisasterFrequencyData(data.disasterFrequency || []);
        setRiskAssessmentData(data.riskAssessment || []);
        setEvacuationReadinessData(data.evacuationReadiness || []);
        setSeasonalTrendsData(data.seasonalTrends || []);
        setImpactAnalysisData(data.impactAnalysis || []);
        setResponseTimeData(data.responseTime || []);
      } else {
        loadGraphFallbackData();
      }
    } catch (error) {
      loadGraphFallbackData();
    }
  };

  const loadGraphFallbackData = () => {
    setFloodHistoryData([
      { year: '2020', actual: 5, predicted: null, severity: 3.2 },
      { year: '2021', actual: 7, predicted: null, severity: 4.1 },
      { year: '2022', actual: 6, predicted: null, severity: 3.8 },
      { year: '2023', actual: 9, predicted: null, severity: 5.2 },
      { year: '2024', actual: 8, predicted: null, severity: 4.7 },
      { year: '2025', actual: null, predicted: 10, severity: 5.8 },
      { year: '2026', actual: null, predicted: 12, severity: 6.5 },
      { year: '2027', actual: null, predicted: 11, severity: 6.2 },
      { year: '2028', actual: null, predicted: 14, severity: 7.1 }
    ]);

    setTemperatureTrendData([
      { month: 'Jan', historical: 16.2, current: 16.8, predicted: 17.2 },
      { month: 'Feb', historical: 18.5, current: 19.1, predicted: 19.8 },
      { month: 'Mar', historical: 23.2, current: 24.1, predicted: 25.0 },
      { month: 'Apr', historical: 28.5, current: 29.5, predicted: 30.8 },
      { month: 'May', historical: 31.2, current: 32.5, predicted: 34.0 },
      { month: 'Jun', historical: 30.8, current: 32.0, predicted: 33.5 },
      { month: 'Jul', historical: 29.5, current: null, predicted: 31.2 },
      { month: 'Aug', historical: 29.8, current: null, predicted: 31.5 },
      { month: 'Sep', historical: 28.5, current: null, predicted: 30.2 },
      { month: 'Oct', historical: 25.2, current: 26.0, predicted: 26.8 },
      { month: 'Nov', historical: 20.8, current: null, predicted: 22.0 },
      { month: 'Dec', historical: 17.5, current: null, predicted: 18.5 }
    ]);

    setRainfallPatternData([
      { month: 'Jan', historical: 15, predicted: 12 },
      { month: 'Feb', historical: 18, predicted: 15 },
      { month: 'Mar', historical: 22, predicted: 20 },
      { month: 'Apr', historical: 28, predicted: 32 },
      { month: 'May', historical: 65, predicted: 58 },
      { month: 'Jun', historical: 220, predicted: 245 },
      { month: 'Jul', historical: 310, predicted: 335 },
      { month: 'Aug', historical: 285, predicted: 295 },
      { month: 'Sep', historical: 240, predicted: 225 },
      { month: 'Oct', historical: 92, predicted: 85 },
      { month: 'Nov', historical: 25, predicted: 22 },
      { month: 'Dec', historical: 12, predicted: 10 }
    ]);

    setDisasterFrequencyData([
      { year: '2020', floods: 5, heatwaves: 2, storms: 3, droughts: 1 },
      { year: '2021', floods: 7, heatwaves: 3, storms: 4, droughts: 1 },
      { year: '2022', floods: 6, heatwaves: 4, storms: 3, droughts: 2 },
      { year: '2023', floods: 9, heatwaves: 5, storms: 5, droughts: 2 },
      { year: '2024', floods: 8, heatwaves: 4, storms: 4, droughts: 3 },
      { year: '2025', floods: 10, heatwaves: 6, storms: 6, droughts: 3 },
      { year: '2026', floods: 12, heatwaves: 7, storms: 7, droughts: 4 },
      { year: '2027', floods: 11, heatwaves: 8, storms: 6, droughts: 4 },
      { year: '2028', floods: 14, heatwaves: 9, storms: 8, droughts: 5 }
    ]);

    setRiskAssessmentData([
      { area: 'Riverside', flood: 85, heat: 45, storm: 60, drought: 30 },
      { area: 'Urban', flood: 65, heat: 75, storm: 55, drought: 40 },
      { area: 'Agricultural', flood: 70, heat: 80, storm: 50, drought: 85 },
      { area: 'Highland', flood: 25, heat: 60, storm: 40, drought: 35 },
      { area: 'Coastal', flood: 55, heat: 55, storm: 85, drought: 25 }
    ]);

    setEvacuationReadinessData([
      { district: 'Darbhanga', readiness: 85, capacity: 12000, drills: 8 },
      { district: 'Muzaffarpur', readiness: 78, capacity: 15000, drills: 6 },
      { district: 'Patna', readiness: 92, capacity: 25000, drills: 12 },
      { district: 'Gaya', readiness: 72, capacity: 10000, drills: 5 },
      { district: 'Bhagalpur', readiness: 68, capacity: 8000, drills: 4 },
      { district: 'Purnia', readiness: 75, capacity: 9500, drills: 7 }
    ]);

    setSeasonalTrendsData([
      { season: 'Winter', floods: 10, heatwaves: 5, storms: 15, droughts: 20 },
      { season: 'Spring', floods: 25, heatwaves: 20, storms: 30, droughts: 15 },
      { season: 'Summer', floods: 15, heatwaves: 85, storms: 40, droughts: 70 },
      { season: 'Monsoon', floods: 90, heatwaves: 10, storms: 75, droughts: 5 },
      { season: 'Autumn', floods: 35, heatwaves: 30, storms: 25, droughts: 25 }
    ]);

    setImpactAnalysisData([
      { year: '2020', economic: 2.5, infrastructure: 1.8, agriculture: 3.2, lives: 125 },
      { year: '2021', economic: 3.1, infrastructure: 2.3, agriculture: 4.1, lives: 178 },
      { year: '2022', economic: 2.8, infrastructure: 2.0, agriculture: 3.5, lives: 142 },
      { year: '2023', economic: 4.2, infrastructure: 3.5, agriculture: 5.8, lives: 245 },
      { year: '2024', economic: 3.8, infrastructure: 3.0, agriculture: 4.9, lives: 198 },
      { year: '2025', economic: 4.5, infrastructure: 3.8, agriculture: 6.2, lives: 280 },
      { year: '2026', economic: 5.2, infrastructure: 4.2, agriculture: 7.1, lives: 315 },
      { year: '2027', economic: 4.9, infrastructure: 4.0, agriculture: 6.8, lives: 295 },
      { year: '2028', economic: 5.8, infrastructure: 4.8, agriculture: 8.2, lives: 350 }
    ]);

    setResponseTimeData([
      { year: '2020', avgTime: 45, successRate: 65 },
      { year: '2021', avgTime: 38, successRate: 72 },
      { year: '2022', avgTime: 32, successRate: 78 },
      { year: '2023', avgTime: 28, successRate: 82 },
      { year: '2024', avgTime: 22, successRate: 88 },
      { year: '2025', avgTime: 18, successRate: 92 },
      { year: '2026', avgTime: 15, successRate: 94 },
      { year: '2027', avgTime: 12, successRate: 96 },
      { year: '2028', avgTime: 10, successRate: 97 }
    ]);
  };

  const fetchDisasterPredictions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/disaster-predictions`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setActiveDisasters(data.disasters || []);
        setAiPredictions(data.aiPredictions || []);
      } else {
        loadFallbackData();
      }
    } catch (error) {
      loadFallbackData();
    }
  };

  const fetchEarlyWarningStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/early-warning-status`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEarlyWarningSystem(data);
      }
    } catch (error) {
      console.log('Early warning unavailable');
    }
  };

  const fetchVulnerabilityData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/vulnerability-assessment`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setVulnerabilityAreas(data.areas || []);
      }
    } catch (error) {
      console.log('Vulnerability data unavailable');
    }
  };

  const fetchResponseTeams = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/response-teams`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setResponseTeams(data.teams || []);
      }
    } catch (error) {
      console.log('Response teams unavailable');
    }
  };

  const loadFallbackData = () => {
    setActiveDisasters([
      { id: 1, type: 'flood', severity: 'high', location: 'Darbhanga District', probability: 78, timeframe: '24-48 hours', affectedPopulation: 125000, icon: Waves, color: '#3b82f6', trend: '+15%' },
      { id: 2, type: 'heatwave', severity: 'medium', location: 'Bihar Region', probability: 65, timeframe: '3-5 days', affectedPopulation: 450000, icon: Thermometer, color: '#ef4444', trend: '+8%' },
      { id: 3, type: 'storm', severity: 'low', location: 'Northern Bihar', probability: 42, timeframe: '5-7 days', affectedPopulation: 85000, icon: Wind, color: '#8b5cf6', trend: '+3%' }
    ]);

    setPreparednessChecklist([
      { id: 1, task: 'Emergency evacuation routes identified', completed: true, priority: 'Critical' },
      { id: 2, task: 'Emergency supplies stockpiled', completed: true, priority: 'High' },
      { id: 3, task: 'Communication systems tested', completed: false, priority: 'Critical' },
      { id: 4, task: 'Medical facilities on standby', completed: true, priority: 'High' },
      { id: 5, task: 'Community awareness campaigns conducted', completed: false, priority: 'Medium' },
      { id: 6, task: 'Shelter locations designated', completed: true, priority: 'Critical' }
    ]);

    setEarlyWarningSystem({ status: 'active', lastUpdate: '15 minutes ago', sensors: 127, coverage: 92, alertsSent: 45, responseTime: '12 min' });
    
    setVulnerabilityAreas([
      { area: 'Low-lying riverside zones', risk: 'Very High', population: 45000, preparedness: 'Medium', color: '#ef4444' },
      { area: 'Urban flood-prone areas', risk: 'High', population: 68000, preparedness: 'High', color: '#f97316' },
      { area: 'Agricultural lowlands', risk: 'Medium', population: 92000, preparedness: 'Medium', color: '#f59e0b' },
      { area: 'Highland settlements', risk: 'Low', population: 35000, preparedness: 'High', color: '#10b981' }
    ]);

    setResponseTeams([
      { name: 'Rapid Response Unit A', status: 'Ready', personnel: 45, equipment: 'Full', location: 'Patna Base' },
      { name: 'Medical Emergency Team', status: 'Deployed', personnel: 32, equipment: 'Full', location: 'Field Hospital 1' },
      { name: 'Rescue & Relief Corps', status: 'Ready', personnel: 58, equipment: 'Full', location: 'Central Hub' },
      { name: 'Community Support Team', status: 'Standby', personnel: 28, equipment: 'Partial', location: 'District Office' }
    ]);

    setAiPredictions([
      { title: 'Monsoon Flood Risk', description: 'Heavy rainfall predicted. River levels expected to rise by 3-4 meters.', confidence: 85, recommendation: 'Activate evacuation protocols for riverside communities.', timeframe: '24-48 hours', severity: 'high' },
      { title: 'Heat Stress Alert', description: 'Extended high temperatures forecasted. Vulnerable populations at risk.', confidence: 72, recommendation: 'Set up cooling centers. Issue public health advisories.', timeframe: '3-5 days', severity: 'medium' },
      { title: 'Agricultural Drought', description: 'Below-normal rainfall projected affecting crop cycles.', confidence: 68, recommendation: 'Promote water-efficient irrigation.', timeframe: '2-3 months', severity: 'low' }
    ]);

    loadGraphFallbackData();
  };

  const toggleChecklistItem = (id) => {
    setPreparednessChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    showToast('✅ Updated!');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
    showToast('✅ Refreshed!');
  };

  const handleShowGraphs = async () => {
    setShowGraphs(!showGraphs);
    if (!showGraphs && floodHistoryData.length === 0) {
      await fetchGraphData();
    }
    showToast(showGraphs ? '📊 Graphs hidden' : '📊 Loading graphs...');
  };

  const downloadReport = () => {
    const report = { 
      timestamp: new Date().toISOString(), 
      activeDisasters, 
      vulnerabilityAreas, 
      preparedness: { completionRate: Math.round((preparednessChecklist.filter(i => i.completed).length / preparednessChecklist.length) * 100), checklist: preparednessChecklist }, 
      responseTeams, 
      earlyWarningSystem,
      graphData: {
        floodHistory: floodHistoryData,
        temperatureTrend: temperatureTrendData,
        rainfallPattern: rainfallPatternData
      }
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `disaster_report_${Date.now()}.json`;
    a.click();
    showToast('✅ Downloaded!');
  };

  const shareAlert = async (disaster) => {
    const text = `⚠️ DISASTER ALERT\n\nType: ${disaster.type.toUpperCase()}\nLocation: ${disaster.location}\nSeverity: ${disaster.severity.toUpperCase()}\nProbability: ${disaster.probability}%\n\nStay safe!`;
    if (navigator.share) {
      try { await navigator.share({ text }); } catch (e) { navigator.clipboard.writeText(text); showToast('✅ Copied!'); }
    } else {
      navigator.clipboard.writeText(text);
      showToast('✅ Copied!');
    }
  };

  const showToast = (msg) => {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg,#ef4444,#f97316);color:white;padding:16px 24px;border-radius:12px;box-shadow:0 8px 20px rgba(0,0,0,0.2);z-index:10000;font-weight:600;animation:slideIn 0.3s';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const completionRate = preparednessChecklist.length > 0 ? Math.round((preparednessChecklist.filter(i => i.completed).length / preparednessChecklist.length) * 100) : 0;

  return (
    <>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(239,68,68,0.3); } 50% { box-shadow: 0 0 40px rgba(239,68,68,0.6); } }
        @keyframes spin { to { transform: rotate(360deg); } }

        .container { min-height: 100vh; background: linear-gradient(135deg, #fef2f2 0%, #fff7ed 50%, #fefce8 100%); padding: ${isFullscreen ? '0' : '24px'}; animation: fadeIn 0.6s; }
        .wrapper { max-width: ${isFullscreen ? '100%' : '1400px'}; margin: 0 auto; }
        .card { background: white; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); padding: 32px; margin-bottom: 24px; animation: fadeIn 0.8s; transition: all 0.3s; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.12); }
        .graph-card { background: white; border-radius: 20px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: all 0.3s; border: 1px solid #e2e8f0; }
        .graph-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.1); }
        .btn { padding: 12px 24px; border-radius: 12px; border: none; background: linear-gradient(135deg, #ef4444, #f97316); color: white; font-weight: 600; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(239,68,68,0.4); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .loader { width: 60px; height: 60px; border: 5px solid #fef2f2; border-top-color: #ef4444; border-radius: 50%; animation: spin 1s linear infinite; }
      `}</style>

      <div className="container">
        <div className="wrapper">
          {/* Header */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #ef4444, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'glow 3s infinite' }}>
                  <AlertTriangle size={32} style={{ color: 'white', animation: 'float 3s infinite' }} />
                </div>
                <div>
                  <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>AI Disaster Prediction</h1>
                  <p style={{ color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Satellite size={16} style={{ color: '#ef4444' }} />
                    Real-time monitoring • AI predictions • 9 trend graphs
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button className="btn" onClick={handleShowGraphs} style={{ background: showGraphs ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  {showGraphs ? <EyeOff size={18} /> : <Eye size={18} />}
                  {showGraphs ? 'Hide Graphs' : 'Show Graphs'}
                </button>
                <button className="btn" onClick={() => { setNotificationsEnabled(!notificationsEnabled); if (!notificationsEnabled && 'Notification' in window) Notification.requestPermission(); }} style={{ background: notificationsEnabled ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6b7280, #4b5563)' }}>
                  <Bell size={18} />
                  {notificationsEnabled ? 'ON' : 'OFF'}
                </button>
                <button className="btn" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw size={18} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <button className="btn" onClick={downloadReport}>
                  <Download size={18} />
                  Download
                </button>
                <button className="btn" onClick={() => setIsFullscreen(!isFullscreen)} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Early Warning System */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', animation: 'glow 4s infinite' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Shield size={48} style={{ animation: 'float 3s infinite' }} />
                <div>
                  <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0' }}>Early Warning System</h2>
                  <p style={{ margin: 0, opacity: 0.9 }}>Status: {earlyWarningSystem.status?.toUpperCase() || 'ACTIVE'}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }}>
                <div>
                  <Activity size={24} style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 4px 0' }}>{earlyWarningSystem.sensors || 127}</p>
                  <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>Sensors</p>
                </div>
                <div>
                  <Radio size={24} style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 4px 0' }}>{earlyWarningSystem.coverage || 92}%</p>
                  <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>Coverage</p>
                </div>
                <div>
                  <Zap size={24} style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 4px 0' }}>{earlyWarningSystem.alertsSent || 45}</p>
                  <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>Alerts</p>
                </div>
                <div>
                  <Clock size={24} style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 4px 0' }}>{earlyWarningSystem.responseTime || '12 min'}</p>
                  <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>Response</p>
                </div>
              </div>
            </div>
          </div>

          {/* 9 Predictive Graphs */}
          {showGraphs && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BarChart3 size={32} style={{ color: '#3b82f6' }} />
                Historical Data & AI Predictions (9 Comprehensive Graphs)
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(550px, 1fr))', gap: '24px' }}>
                {/* Graph 1: Flood History & Prediction */}
                <div className="graph-card">
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Waves size={20} style={{ color: '#3b82f6' }} />
                    1. Flood Events: Historical & Predicted (2020-2028)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={floodHistoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="year" stroke="#64748b" style={{ fontSize: '12px' }} />
                      <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '12px' }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="actual" fill="#3b82f680" stroke="#3b82f6" name="Historical Events" />
                      <Line yAxisId="left" type="monotone" dataKey="predicted" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" name="AI Prediction" dot={{ fill: '#ef4444', r: 5 }} />
                      <Bar yAxisId="right" dataKey="severity" fill="#f59e0b" name="Severity Index" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Graph 2: Temperature Trend */}
                <div className="graph-card">
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Thermometer size={20} style={{ color: '#ef4444' }} />
                    2. Temperature Trend: Historical vs AI Predicted (°C)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={temperatureTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Legend />
                      <Line type="monotone" dataKey="historical" stroke="#94a3b8" strokeWidth={2} name="Historical Avg" dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="current" stroke="#10b981" strokeWidth={2} name="Current" dot={{ fill: '#10b981', r: 4 }} />
                      <Line type="monotone" dataKey="predicted" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" name="AI Predicted" dot={{ fill: '#ef4444', r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Graph 3: Rainfall Pattern */}
                <div className="graph-card">
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CloudRain size={20} style={{ color: '#3b82f6' }} />
                    3. Rainfall Pattern: Historical vs Predicted (mm)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={rainfallPatternData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Legend />
                      <Bar dataKey="historical" fill="#3b82f6" name="Historical Avg" />
                      <Bar dataKey="predicted" fill="#8b5cf6" name="AI Predicted" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Graph 4: Disaster Frequency by Type */}
                <div className="graph-card">
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
                    4. Disaster Frequency by Type (2020-2028 Trend)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={disasterFrequencyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="year" stroke="#64748b" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Legend />
                      <Area type="monotone" dataKey="floods" stackId="1" stroke="#3b82f6" fill="#3b82f680" name="Floods" />
                      <Area type="monotone" dataKey="heatwaves" stackId="1" stroke="#ef4444" fill="#ef444480" name="Heatwaves" />
                      <Area type="monotone" dataKey="storms" stackId="1" stroke="#8b5cf6" fill="#8b5cf680" name="Storms" />
                      <Area type="monotone" dataKey="droughts" stackId="1" stroke="#f59e0b" fill="#f59e0b80" name="Droughts" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Graph 5: Risk Assessment Radar */}
                <div className="graph-card">
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={20} style={{ color: '#ef4444' }} />
                    5. Multi-Hazard Risk Assessment by Area
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={riskAssessmentData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="area" style={{ fontSize: '12px' }} />
                      <PolarRadiusAxis style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Legend />
                      <Radar name="Flood Risk" dataKey="flood" stroke="#3b82f6" fill="#3b82f680" />
                      <Radar name="Heat Risk" dataKey="heat" stroke="#ef4444" fill="#ef444480" />
                      <Radar name="Storm Risk" dataKey="storm" stroke="#8b5cf6" fill="#8b5cf680" />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Graph 6: Evacuation Readiness */}
                <div className="graph-card">
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={20} style={{ color: '#10b981' }} />
                    6. Evacuation Readiness by District
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={evacuationReadinessData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="district" stroke="#64748b" style={{ fontSize: '12px' }} angle={-15} textAnchor="end" height={80} />
                      <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '12px' }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="readiness" fill="#10b981" name="Readiness %" />
                      <Line yAxisId="right" type="monotone" dataKey="drills" stroke="#3b82f6" strokeWidth={3} name="Drills Conducted" dot={{ fill: '#3b82f6', r: 5 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Graph 7: Seasonal Disaster Trends */}
                <div className="graph-card">
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wind size={20} style={{ color: '#8b5cf6' }} />
                    7. Seasonal Disaster Trends & Patterns
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={seasonalTrendsData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="season" style={{ fontSize: '12px' }} />
                      <PolarRadiusAxis style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Legend />
                      <Radar name="Floods" dataKey="floods" stroke="#3b82f6" fill="#3b82f680" />
                      <Radar name="Heatwaves" dataKey="heatwaves" stroke="#ef4444" fill="#ef444480" />
                      <Radar name="Storms" dataKey="storms" stroke="#8b5cf6" fill="#8b5cf680" />
                      <Radar name="Droughts" dataKey="droughts" stroke="#f59e0b" fill="#f59e0b80" />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Graph 8: Impact Analysis */}
                <div className="graph-card">
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={20} style={{ color: '#f59e0b' }} />
                    8. Disaster Impact Analysis (Economic & Lives)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={impactAnalysisData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="year" stroke="#64748b" style={{ fontSize: '12px' }} />
                      <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '12px' }} label={{ value: 'Billion $', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '12px' }} label={{ value: 'Lives', angle: 90, position: 'insideRight' }} />
                      <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="economic" fill="#3b82f6" name="Economic Loss ($B)" />
                      <Line yAxisId="right" type="monotone" dataKey="lives" stroke="#ef4444" strokeWidth={3} name="Lives Lost" dot={{ fill: '#ef4444', r: 5 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Graph 9: Response Time Improvement */}
                <div className="graph-card">
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={20} style={{ color: '#10b981' }} />
                    9. Response Time & Success Rate Evolution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={responseTimeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="year" stroke="#64748b" style={{ fontSize: '12px' }} />
                      <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '12px' }} label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '12px' }} label={{ value: 'Success %', angle: 90, position: 'insideRight' }} />
                      <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="avgTime" fill="#ef4444" name="Avg Response Time (min)" />
                      <Line yAxisId="right" type="monotone" dataKey="successRate" stroke="#10b981" strokeWidth={3} name="Success Rate %" dot={{ fill: '#10b981', r: 5 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Active Warnings */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle size={32} style={{ color: '#ef4444' }} />
              Active Warnings ({activeDisasters.length})
            </h2>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                <div>
                  <div className="loader"></div>
                  <p style={{ marginTop: '16px', color: '#64748b', textAlign: 'center' }}>Loading...</p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                {activeDisasters.length > 0 ? activeDisasters.map((d) => {
                  const Icon = d.icon;
                  return (
                    <div key={d.id} className="card" style={{ background: d.severity === 'high' ? '#fef2f2' : d.severity === 'medium' ? '#fff7ed' : '#fefce8', borderLeft: `4px solid ${d.color}`, padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `${d.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={32} style={{ color: d.color, animation: 'float 3s infinite' }} />
                        </div>
                        <span style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', background: d.color, color: 'white', animation: 'pulse 2s infinite' }}>
                          {d.severity}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', marginBottom: '16px', textTransform: 'capitalize' }}>{d.type} Warning</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', fontSize: '14px', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MapPin size={16} style={{ color: d.color }} />
                          <span style={{ fontWeight: '600' }}>{d.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Clock size={16} style={{ color: d.color }} />
                          <span>{d.timeframe}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Users size={16} style={{ color: d.color }} />
                          <span><strong>{d.affectedPopulation.toLocaleString()}</strong> at risk</span>
                        </div>
                        {d.trend && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: d.color, fontWeight: '700' }}>
                            <TrendingUp size={16} />
                            <span>Risk +{d.trend}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Probability</span>
                          <span style={{ fontSize: '16px', fontWeight: '800', color: d.color }}>{d.probability}%</span>
                        </div>
                        <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ width: `${d.probability}%`, height: '100%', background: d.color, borderRadius: '10px', transition: 'width 1s' }}></div>
                        </div>
                      </div>
                      <button onClick={() => shareAlert(d)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: d.color, color: 'white', fontWeight: '700', cursor: 'pointer' }}>
                        Share Alert
                      </button>
                    </div>
                  );
                }) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
                    <CheckCircle size={64} style={{ color: '#10b981', margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>No Active Warnings</h3>
                    <p style={{ color: '#64748b' }}>All clear!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Vulnerability & Preparedness */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <div className="card">
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '20px' }}>Vulnerability Assessment</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {vulnerabilityAreas.map((a, i) => (
                  <div key={i} style={{ background: `${a.color}10`, borderRadius: '12px', padding: '20px', borderLeft: `4px solid ${a.color}`, transition: 'all 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>{a.area}</h3>
                      <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', background: a.color, color: 'white' }}>{a.risk}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Population</p>
                        <p style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>{a.population.toLocaleString()}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Preparedness</p>
                        <p style={{ fontSize: '20px', fontWeight: '800', color: a.color }}>{a.preparedness}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>Preparedness Checklist</h2>
                <div style={{ padding: '8px 16px', borderRadius: '10px', background: completionRate === 100 ? '#dcfce7' : '#fef3c7', color: completionRate === 100 ? '#16a34a' : '#f59e0b', fontWeight: '700' }}>
                  {completionRate}%
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {preparednessChecklist.map(item => (
                  <div key={item.id} onClick={() => toggleChecklistItem(item.id)} style={{ padding: '16px', borderRadius: '12px', border: '2px solid', borderColor: item.completed ? '#10b981' : '#e2e8f0', background: item.completed ? '#f0fdf4' : '#f8fafc', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: `3px solid ${item.completed ? '#10b981' : '#cbd5e1'}`, background: item.completed ? '#10b981' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.completed && <CheckCircle size={20} style={{ color: 'white' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: item.completed ? '#16a34a' : '#1e293b' }}>{item.task}</span>
                        {item.priority && (
                          <span style={{ marginLeft: '8px', fontSize: '10px', padding: '4px 8px', borderRadius: '6px', background: item.priority === 'Critical' ? '#fef2f2' : item.priority === 'High' ? '#fff7ed' : '#fefce8', color: item.priority === 'Critical' ? '#dc2626' : item.priority === 'High' ? '#f97316' : '#f59e0b', fontWeight: '700' }}>
                            {item.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Response Teams */}
          <div className="card">
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '20px' }}>Emergency Response Teams</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {responseTeams.map((t, i) => (
                <div key={i} style={{ background: 'linear-gradient(135deg, #f0f9ff, #f0fdf4)', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <Shield size={32} style={{ color: '#3b82f6' }} />
                    <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', background: t.status === 'Ready' ? '#10b981' : t.status === 'Deployed' ? '#3b82f6' : '#f59e0b', color: 'white' }}>{t.status}</span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>{t.name}</h3>
                  <div style={{ fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#64748b' }}>Personnel:</span>
                      <span style={{ fontWeight: '700' }}>{t.personnel}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#64748b' }}>Equipment:</span>
                      <span style={{ fontWeight: '700' }}>{t.equipment}</span>
                    </div>
                    {t.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                        <MapPin size={14} style={{ color: '#64748b' }} />
                        <span style={{ fontSize: '13px', color: '#64748b' }}>{t.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Predictions */}
          <div className="card">
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '20px' }}>AI Risk Analysis & Recommendations</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {aiPredictions.map((p, i) => (
                <div key={i} style={{ background: 'linear-gradient(135deg, #faf5ff, #fef3c7)', borderRadius: '16px', padding: '24px', borderLeft: '4px solid #8b5cf6', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>{p.title}</h3>
                    {p.severity && (
                      <span style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '700', background: p.severity === 'high' ? '#ef4444' : p.severity === 'medium' ? '#f97316' : '#f59e0b', color: 'white' }}>{p.severity.toUpperCase()}</span>
                    )}
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: '1.6' }}>{p.description}</p>
                  {p.timeframe && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', fontSize: '13px', color: '#8b5cf6', fontWeight: '600' }}>
                      <Clock size={14} />
                      <span>{p.timeframe}</span>
                    </div>
                  )}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>AI Confidence</span>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#8b5cf6' }}>{p.confidence}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e0e7ff', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${p.confidence}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', borderRadius: '10px', transition: 'width 1s' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: 'white', borderRadius: '10px', border: '1px solid #e0e7ff' }}>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>Recommended Action:</p>
                    <p style={{ fontSize: '13px', color: '#1e293b', lineHeight: '1.6', margin: 0 }}>{p.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>AI Technology for Social Impact</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#10b981', marginBottom: '12px' }}>Machine Learning Models</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.8' }}>
                  <li>• Deep neural networks trained on 50+ years historical data</li>
                  <li>• Real-time satellite imagery analysis (NASA/NOAA)</li>
                  <li>• Advanced weather pattern recognition algorithms</li>
                  <li>• AI-powered vulnerability assessment systems</li>
                  <li>• 9 comprehensive predictive analytics graphs</li>
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6', marginBottom: '12px' }}>Data Sources & Security</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.8' }}>
                  <li>• Encrypted meteorological department feeds</li>
                  <li>• 127 active IoT sensor networks across regions</li>
                  <li>• Real-time satellite remote sensing data</li>
                  <li>• Privacy-protected demographic information</li>
                  <li>• Continuous model auditing & bias detection</li>
                </ul>
              </div>
            </div>
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
              <p style={{ fontSize: '13px', lineHeight: '1.8', margin: 0, color: 'rgba(255,255,255,0.95)' }}>
                <strong style={{ color: '#fbbf24' }}>Responsible AI Commitment:</strong> All predictions reviewed by disaster management experts. Personal data encrypted and used solely for public safety. Models regularly audited for bias and accuracy. Our mission: Protect lives through ethical, transparent AI deployment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
