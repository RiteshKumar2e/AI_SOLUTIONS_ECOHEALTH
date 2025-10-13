import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Activity, TrendingUp, Users, Clock, 
  MapPin, Zap, Shield, MessageSquare, Send, X, Download,
  RefreshCw, Filter, Bell, ChevronDown
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, RadarChart, 
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ComposedChart
} from 'recharts';
const API_BASE_URL = 'http://localhost:3001/api';
const WS_URL = 'ws://localhost:3001';

const EmergencyPrediction = () => {
  const [predictions, setPredictions] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [emergencyMetrics, setEmergencyMetrics] = useState({});
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [wsConnected, setWsConnected] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [filterRisk, setFilterRisk] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [mainChartType, setMainChartType] = useState('area');
  const [showChartDropdown, setShowChartDropdown] = useState(false);
  const wsRef = useRef(null);
  const chatEndRef = useRef(null);
  const dropdownRef = useRef(null);

  // Chart Colors
  const COLORS = ['#1976D2', '#D32F2F', '#388E3C', '#F57C00', '#7B1FA2', '#00897B', '#C62828'];

  // Complete Styles
  const styles = {
    dashboard: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 25%, #E8EAF6 50%, #E0F2F1 75%, #F1F8E9 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    glassCard: {
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      padding: '2rem',
      transition: 'all 0.3s ease',
    },
    headerCard: {
      marginBottom: '2rem',
      background: 'rgba(255, 255, 255, 0.95)',
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '2rem',
      marginBottom: '1.5rem',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
    },
    icon3d: {
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #1976D2, #1565C0)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 30px rgba(25, 118, 210, 0.3)',
    },
    gradientText: {
      fontSize: '2.5rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #1976D2, #0D47A1)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '0.5rem',
    },
    subtitle: {
      color: '#546E7A',
      fontSize: '1.1rem',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'wrap',
    },
    toolbarButton: {
      padding: '0.75rem',
      background: 'white',
      border: '1px solid #E0E0E0',
      borderRadius: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    connectionStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: 'rgba(76, 175, 80, 0.1)',
      borderRadius: '50px',
      color: '#2E7D32',
      border: '1px solid rgba(76, 175, 80, 0.2)',
    },
    statusDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: '#4CAF50',
      boxShadow: '0 0 20px #4CAF50',
    },
    timeframeButtons: {
      display: 'flex',
      gap: '0.5rem',
    },
    timeframeBtn: {
      padding: '0.75rem 1.5rem',
      border: '2px solid #E0E0E0',
      background: '#FAFAFA',
      color: '#424242',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    timeframeBtnActive: {
      background: 'linear-gradient(135deg, #1976D2, #1565C0)',
      borderColor: 'transparent',
      boxShadow: '0 5px 20px rgba(25, 118, 210, 0.3)',
      color: 'white',
    },
    featureBadges: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
    },
    badge: {
      padding: '0.5rem 1rem',
      background: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
      borderRadius: '50px',
      color: '#1565C0',
      fontSize: '0.9rem',
      fontWeight: '600',
      border: '1px solid rgba(25, 118, 210, 0.2)',
    },
    filterSection: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    filterButton: {
      padding: '0.75rem 1.5rem',
      background: 'white',
      border: '2px solid #E0E0E0',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#424242',
    },
    filterButtonActive: {
      background: 'linear-gradient(135deg, #1976D2, #1565C0)',
      borderColor: 'transparent',
      color: 'white',
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    metricCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      cursor: 'pointer',
      background: 'white',
      position: 'relative',
    },
    metricIcon: {
      width: '48px',
      height: '48px',
    },
    metricContent: {
      flex: 1,
    },
    metricLabel: {
      color: '#757575',
      fontSize: '0.9rem',
      marginBottom: '0.5rem',
      fontWeight: '500',
    },
    metricValue: {
      fontSize: '2.5rem',
      fontWeight: '800',
      lineHeight: 1,
    },
    metricDetail: {
      color: '#9E9E9E',
      fontSize: '0.85rem',
      marginTop: '0.25rem',
    },
    metricTrend: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      padding: '0.25rem 0.5rem',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: '600',
    },
    trendUp: {
      background: '#E8F5E9',
      color: '#2E7D32',
    },
    trendDown: {
      background: '#FFEBEE',
      color: '#C62828',
    },
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '2rem',
      fontWeight: '700',
      color: '#212121',
      marginBottom: '1.5rem',
    },
    sectionTitleLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    sectionIcon: {
      width: '32px',
      height: '32px',
    },
    sectionActions: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
    },
    iconButton: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      border: '2px solid #E0E0E0',
      background: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropdownContainer: {
      position: 'relative',
    },
    dropdownButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.25rem',
      background: 'white',
      border: '2px solid #1976D2',
      borderRadius: '12px',
      color: '#1976D2',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
    },
    dropdownMenu: {
      position: 'absolute',
      top: 'calc(100% + 0.5rem)',
      right: 0,
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      border: '1px solid #E0E0E0',
      minWidth: '200px',
      zIndex: 1000,
      overflow: 'hidden',
    },
    dropdownItem: {
      padding: '0.875rem 1.25rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '0.95rem',
      fontWeight: '500',
      color: '#424242',
      borderBottom: '1px solid #F5F5F5',
    },
    dropdownItemActive: {
      background: '#E3F2FD',
      color: '#1976D2',
      fontWeight: '600',
    },
    predictionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    predictionCard: {
      position: 'relative',
      background: 'white',
      cursor: 'pointer',
    },
    predictionCardHigh: {
      borderLeft: '4px solid #D32F2F',
      boxShadow: '0 8px 32px rgba(211, 47, 47, 0.15)',
    },
    predictionCardMedium: {
      borderLeft: '4px solid #F57C00',
      boxShadow: '0 8px 32px rgba(245, 124, 0, 0.15)',
    },
    predictionCardLow: {
      borderLeft: '4px solid #388E3C',
      boxShadow: '0 8px 32px rgba(56, 142, 60, 0.15)',
    },
    predictionCardSelected: {
      transform: 'scale(1.02)',
      boxShadow: '0 15px 50px rgba(25, 118, 210, 0.3)',
    },
    predictionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1.5rem',
    },
    predictionTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#212121',
      marginBottom: '0.75rem',
    },
    predictionBadges: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
    },
    riskBadge: {
      padding: '0.4rem 0.8rem',
      borderRadius: '50px',
      fontSize: '0.85rem',
      fontWeight: '600',
    },
    riskBadgeHigh: {
      background: '#FFEBEE',
      color: '#C62828',
      border: '1px solid #FFCDD2',
    },
    riskBadgeMedium: {
      background: '#FFF3E0',
      color: '#E65100',
      border: '1px solid #FFE0B2',
    },
    riskBadgeLow: {
      background: '#E8F5E9',
      color: '#2E7D32',
      border: '1px solid #C8E6C9',
    },
    confidenceBadge: {
      background: '#F5F5F5',
      color: '#424242',
      border: '1px solid #E0E0E0',
    },
    probabilityDisplay: {
      flexShrink: 0,
    },
    probabilityCircle: {
      width: '100px',
      height: '100px',
      position: 'relative',
    },
    probabilityText: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '1.5rem',
      fontWeight: '800',
      color: '#212121',
    },
    predictionDetails: {
      display: 'grid',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    detailItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
    },
    detailIcon: {
      width: '20px',
      height: '20px',
      color: '#757575',
      flexShrink: 0,
      marginTop: '2px',
    },
    detailLabel: {
      color: '#757575',
      fontSize: '0.85rem',
      marginBottom: '0.25rem',
      fontWeight: '500',
    },
    detailValue: {
      color: '#212121',
      fontWeight: '600',
    },
    factorsSection: {
      marginBottom: '1.5rem',
    },
    factorsLabel: {
      color: '#424242',
      fontSize: '0.9rem',
      fontWeight: '600',
      marginBottom: '0.75rem',
    },
    factorsTags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    factorTag: {
      padding: '0.4rem 0.8rem',
      background: '#F5F5F5',
      borderRadius: '50px',
      color: '#424242',
      fontSize: '0.85rem',
      border: '1px solid #E0E0E0',
    },
    actionBox: {
      padding: '1rem',
      background: '#E3F2FD',
      borderRadius: '12px',
      border: '1px solid #90CAF9',
    },
    actionLabel: {
      color: '#1565C0',
      fontWeight: '600',
      fontSize: '0.9rem',
      marginBottom: '0.5rem',
    },
    actionText: {
      color: '#1976D2',
      fontSize: '0.95rem',
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem',
    },
    actionButton: {
      padding: '0.5rem 1rem',
      background: 'white',
      border: '2px solid #1976D2',
      borderRadius: '8px',
      color: '#1976D2',
      fontSize: '0.85rem',
      fontWeight: '600',
      cursor: 'pointer',
    },
    chartCard: {
      marginBottom: '2rem',
      background: 'white',
    },
    alertBox: {
      marginTop: '1.5rem',
      padding: '1rem',
      background: '#FFF3E0',
      borderRadius: '12px',
      color: '#E65100',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      border: '1px solid #FFE0B2',
    },
    alertBoxWarning: {
      background: '#FFF9C4',
      borderColor: '#FFF59D',
      color: '#F57F17',
    },
    alertIcon: {
      width: '20px',
      height: '20px',
      flexShrink: 0,
    },
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem',
    },
    resourceList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      marginBottom: '1.5rem',
    },
    resourceItem: {
      position: 'relative',
    },
    resourceHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.75rem',
    },
    resourceName: {
      color: '#212121',
      fontWeight: '600',
    },
    resourceValues: {
      display: 'flex',
      gap: '1rem',
      fontSize: '0.85rem',
    },
    currentValue: {
      color: '#1976D2',
      fontWeight: '600',
    },
    predictedValue: {
      color: '#D32F2F',
      fontWeight: '600',
    },
    resourceBar: {
      position: 'relative',
      width: '100%',
      height: '20px',
      background: '#F5F5F5',
      borderRadius: '10px',
      overflow: 'hidden',
      border: '1px solid #E0E0E0',
    },
    barCurrent: {
      position: 'absolute',
      height: '100%',
      background: 'linear-gradient(90deg, #1976D2, #42A5F5)',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(25, 118, 210, 0.3)',
      transition: 'width 1s ease',
    },
    barPredicted: {
      position: 'absolute',
      height: '100%',
      background: 'linear-gradient(90deg, #D32F2F, #EF5350)',
      borderRadius: '10px',
      opacity: 0.3,
      transition: 'width 1s ease',
    },
    alertIndicator: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    alertIconSmall: {
      width: '14px',
      height: '14px',
      color: '#D32F2F',
    },
    performanceCard: {
      marginBottom: '2rem',
      background: 'white',
    },
    performanceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    performanceStat: {
      padding: '2rem',
      borderRadius: '16px',
      textAlign: 'center',
      border: '2px solid #E0E0E0',
    },
    performanceStatGreen: {
      background: 'linear-gradient(135deg, #E8F5E9, #F1F8E9)',
      border: '2px solid #C8E6C9',
    },
    performanceStatBlue: {
      background: 'linear-gradient(135deg, #E3F2FD, #E1F5FE)',
      border: '2px solid #90CAF9',
    },
    performanceStatPurple: {
      background: 'linear-gradient(135deg, #F3E5F5, #EDE7F6)',
      border: '2px solid #CE93D8',
    },
    performanceStatOrange: {
      background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
      border: '2px solid #FFCC80',
    },
    statLabel: {
      color: '#757575',
      fontSize: '0.9rem',
      marginBottom: '0.75rem',
      fontWeight: '500',
    },
    statValue: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: '#212121',
      marginBottom: '0.5rem',
    },
    statDetail: {
      color: '#9E9E9E',
      fontSize: '0.85rem',
    },
    modelInfo: {
      padding: '1.5rem',
      background: '#F5F5F5',
      borderRadius: '12px',
      color: '#424242',
      border: '1px solid #E0E0E0',
    },
    notificationPanel: {
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      width: '350px',
      maxHeight: '400px',
      overflowY: 'auto',
      zIndex: 1001,
    },
    notificationItem: {
      padding: '1rem',
      background: 'white',
      borderRadius: '12px',
      marginBottom: '0.5rem',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      borderLeft: '4px solid #1976D2',
    },
chatbotContainer: {
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  width: '500px',        // increased width
  maxHeight: '600px',    // max height
  height: '700px',       // default height
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1000,
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  background: 'white',
  borderRadius: '1rem',  // optional: rounded corners for better UI
  overflow: 'hidden',    // ensures content fits inside
},

    chatbotHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem',
      borderBottom: '1px solid #E0E0E0',
      background: 'linear-gradient(135deg, #1976D2, #1565C0)',
    },
    chatbotTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: 'white',
      fontWeight: '600',
      fontSize: '1.1rem',
    },
    chatbotIcon: {
      width: '24px',
      height: '24px',
    },
    chatbotClose: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'white',
    },
    chatbotMessages: {
      flex: 1,
      overflowY: 'auto',
      padding: '1.5rem',
      maxHeight: '400px',
      background: '#FAFAFA',
    },
    messageUser: {
      marginBottom: '1rem',
      padding: '1rem',
      borderRadius: '12px',
      maxWidth: '80%',
      background: 'linear-gradient(135deg, #1976D2, #1565C0)',
      color: 'white',
      marginLeft: 'auto',
      borderBottomRightRadius: '4px',
      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
    },
    messageBot: {
      marginBottom: '1rem',
      padding: '1rem',
      borderRadius: '12px',
      maxWidth: '80%',
      background: 'white',
      color: '#212121',
      marginRight: 'auto',
      borderBottomLeftRadius: '4px',
      border: '1px solid #E0E0E0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    },
    messageTime: {
      display: 'block',
      fontSize: '0.75rem',
      opacity: 0.7,
      marginTop: '0.5rem',
    },
    typingIndicator: {
      display: 'flex',
      gap: '0.5rem',
      padding: '1rem',
      background: 'white',
      borderRadius: '12px',
      width: 'fit-content',
      border: '1px solid #E0E0E0',
    },
    typingDot: {
      width: '8px',
      height: '8px',
      background: '#1976D2',
      borderRadius: '50%',
      animation: 'typing 1.4s infinite',
    },
    chatbotInput: {
      display: 'flex',
      gap: '0.75rem',
      padding: '1.5rem',
      borderTop: '1px solid #E0E0E0',
      background: 'white',
    },
    chatInput: {
      flex: 1,
      padding: '0.75rem 1rem',
      background: '#F5F5F5',
      border: '1px solid #E0E0E0',
      borderRadius: '12px',
      color: '#212121',
      fontSize: '1rem',
      outline: 'none',
    },
    chatSendBtn: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #1976D2, #1565C0)',
      border: 'none',
      borderRadius: '12px',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
    },
    chatbotToggle: {
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '64px',
      height: '64px',
      background: 'linear-gradient(135deg, #1976D2, #1565C0)',
      border: 'none',
      borderRadius: '50%',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 30px rgba(25, 118, 210, 0.3)',
      zIndex: 999,
    },
    notificationDot: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: '12px',
      height: '12px',
      background: '#F44336',
      borderRadius: '50%',
      boxShadow: '0 0 15px #F44336',
    },
  };

  // Chart type options
  const chartTypes = [
    { value: 'area', label: 'Area Chart', icon: '📊' },
    { value: 'line', label: 'Line Chart', icon: '📈' },
    { value: 'bar', label: 'Bar Chart', icon: '📊' },
    { value: 'composed', label: 'Composed Chart', icon: '📉' },
    { value: 'scatter', label: 'Scatter Chart', icon: '⚫' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowChartDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time data updates
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        updateEmergencyData();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  useEffect(() => {
    runEmergencyPredictions();
    initializeHistoricalData();
  }, [selectedTimeframe]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const updateEmergencyData = () => {
    setEmergencyMetrics(prev => ({
      currentLoad: Math.max(10, Math.min(50, (prev.currentLoad || 23) + Math.floor(Math.random() * 7) - 3)),
      predictedPeak: Math.max(30, Math.min(60, (prev.predictedPeak || 45) + Math.floor(Math.random() * 5) - 2)),
      avgResponseTime: Math.max(5, Math.min(15, parseFloat(((prev.avgResponseTime || 8.5) + (Math.random() * 2 - 1)).toFixed(1)))),
      bedAvailability: Math.max(50, Math.min(95, (prev.bedAvailability || 76) + Math.floor(Math.random() * 5) - 2))
    }));
  };

  const initializeHistoricalData = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      data.push({
        hour: `${i.toString().padStart(2, '0')}:00`,
        actual: Math.floor(Math.random() * 30) + 10,
        predicted: Math.floor(Math.random() * 30) + 12,
        capacity: 50,
        x: i,
        y: Math.floor(Math.random() * 30) + 10,
      });
    }
    setHistoricalData(data);
  };

  const runEmergencyPredictions = () => {
    const aiPredictions = [
      {
        id: 1,
        type: 'Cardiac Emergency',
        riskLevel: 'High',
        probability: Math.floor(Math.random() * 20) + 70,
        timeframe: '4-6 hours',
        factors: ['Chest pain pattern', 'Age demographics', 'Historical data', 'Weather conditions'],
        recommendedAction: 'Increase cardiology staff by 2, prepare cath lab',
        confidence: 92,
        affectedArea: 'Downtown District',
        estimatedCases: '8-12 patients'
      },
      {
        id: 2,
        type: 'Respiratory Distress',
        riskLevel: 'Medium',
        probability: Math.floor(Math.random() * 20) + 55,
        timeframe: '6-12 hours',
        factors: ['Air quality index', 'Seasonal patterns', 'COVID-19 trends'],
        recommendedAction: 'Stock respiratory supplies, alert pulmonology team',
        confidence: 87,
        affectedArea: 'Industrial Zone',
        estimatedCases: '12-18 patients'
      },
      {
        id: 3,
        type: 'Trauma Cases',
        riskLevel: 'Medium',
        probability: Math.floor(Math.random() * 20) + 50,
        timeframe: '12-24 hours',
        factors: ['Traffic patterns', 'Weekend activity', 'Sports events'],
        recommendedAction: 'Ensure trauma bay readiness, orthopedic on-call',
        confidence: 84,
        affectedArea: 'Highway Corridor',
        estimatedCases: '5-8 patients'
      },
      {
        id: 4,
        type: 'Stroke Cases',
        riskLevel: 'Low',
        probability: Math.floor(Math.random() * 20) + 35,
        timeframe: '24-48 hours',
        factors: ['Temperature changes', 'Senior population distribution'],
        recommendedAction: 'Maintain standard stroke protocol readiness',
        confidence: 79,
        affectedArea: 'Residential Areas',
        estimatedCases: '3-5 patients'
      }
    ];

    setPredictions(aiPredictions);
    if (!emergencyMetrics.currentLoad) {
      setEmergencyMetrics({
        currentLoad: 23,
        predictedPeak: 45,
        avgResponseTime: 8.5,
        bedAvailability: 76
      });
    }
  };

  const addNotification = (title, message, priority) => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      priority,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 5));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        `Based on current data, ${emergencyMetrics.currentLoad} patients are in ED with ${emergencyMetrics.bedAvailability}% bed availability.`,
        `The AI model predicts peak load of ${emergencyMetrics.predictedPeak} patients in the next 12 hours.`,
        `Average response time is currently ${emergencyMetrics.avgResponseTime} minutes, which is ${emergencyMetrics.avgResponseTime < 10 ? 'within' : 'above'} target range.`,
        `High-risk cardiac emergencies are predicted with ${predictions[0]?.probability}% probability. Recommend increasing cardiology staff.`,
        `All resource utilization metrics are being monitored. Current system performance is optimal.`
      ];
      
      const botMessage = {
        id: Date.now(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'bot',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleExportData = () => {
    const data = {
      predictions,
      metrics: emergencyMetrics,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emergency-predictions-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addNotification('Export Complete', 'Data exported successfully', 'info');
  };

  const handleRefresh = () => {
    runEmergencyPredictions();
    updateEmergencyData();
    addNotification('Data Refreshed', 'All predictions and metrics updated', 'info');
  };

  const filteredPredictions = predictions.filter(p => 
    filterRisk === 'all' || p.riskLevel.toLowerCase() === filterRisk
  );

  const getRiskStyle = (level) => {
    switch(level) {
      case 'High': return styles.predictionCardHigh;
      case 'Medium': return styles.predictionCardMedium;
      case 'Low': return styles.predictionCardLow;
      default: return {};
    }
  };

  const getRiskBadgeStyle = (level) => {
    switch(level) {
      case 'High': return styles.riskBadgeHigh;
      case 'Medium': return styles.riskBadgeMedium;
      case 'Low': return styles.riskBadgeLow;
      default: return {};
    }
  };

  const getPerformanceStatStyle = (index) => {
    const statStyles = [
      styles.performanceStatGreen,
      styles.performanceStatBlue,
      styles.performanceStatPurple,
      styles.performanceStatOrange
    ];
    return statStyles[index % 4];
  };

  const emergencyTrendData = historicalData.length > 0 ? historicalData : [
    { hour: '00:00', actual: 12, predicted: 11, capacity: 50, x: 0, y: 12 },
    { hour: '03:00', actual: 8, predicted: 9, capacity: 50, x: 3, y: 8 },
    { hour: '06:00', actual: 15, predicted: 14, capacity: 50, x: 6, y: 15 },
    { hour: '09:00', actual: 25, predicted: 27, capacity: 50, x: 9, y: 25 },
    { hour: '12:00', actual: 32, predicted: 30, capacity: 50, x: 12, y: 32 },
    { hour: '15:00', actual: 28, predicted: 29, capacity: 50, x: 15, y: 28 },
    { hour: '18:00', actual: 35, predicted: 38, capacity: 50, x: 18, y: 35 },
    { hour: '21:00', actual: 22, predicted: 23, capacity: 50, x: 21, y: 22 },
  ];

  const categoryData = [
    { category: 'Cardiac', current: 8, predicted: 12 },
    { category: 'Trauma', current: 6, predicted: 8 },
    { category: 'Respiratory', current: 5, predicted: 9 },
    { category: 'Neurological', current: 3, predicted: 5 },
    { category: 'Other', current: 4, predicted: 6 }
  ];

  const pieChartData = [
    { name: 'Cardiac', value: 8 },
    { name: 'Trauma', value: 6 },
    { name: 'Respiratory', value: 5 },
    { name: 'Neurological', value: 3 },
    { name: 'Other', value: 4 }
  ];

  const radarData = [
    { subject: 'Cardiac', A: 92, B: 78, fullMark: 100 },
    { subject: 'Respiratory', A: 87, B: 65, fullMark: 100 },
    { subject: 'Trauma', A: 84, B: 58, fullMark: 100 },
    { subject: 'Neurological', A: 79, B: 42, fullMark: 100 },
    { subject: 'Other', A: 85, B: 55, fullMark: 100 },
  ];

  const resourceData = [
    { resource: 'ER Beds', current: 65, predicted: 82, capacity: 100 },
    { resource: 'ICU Beds', current: 78, predicted: 88, capacity: 100 },
    { resource: 'Ventilators', current: 45, predicted: 62, capacity: 100 },
    { resource: 'Physicians', current: 70, predicted: 85, capacity: 100 },
    { resource: 'Nurses', current: 72, predicted: 90, capacity: 100 }
  ];

  // Render chart based on selected type
  const renderMainChart = () => {
    const commonProps = {
      data: emergencyTrendData,
    };

    switch(mainChartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorCapacity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9E9E9E" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#9E9E9E" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1976D2" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#1976D2" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D32F2F" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#D32F2F" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis dataKey="hour" stroke="#757575" />
            <YAxis stroke="#757575" />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: '8px' }} />
            <Legend />
            <Area type="monotone" dataKey="capacity" stroke="#9E9E9E" fill="url(#colorCapacity)" name="Capacity" />
            <Area type="monotone" dataKey="actual" stroke="#1976D2" fill="url(#colorActual)" name="Actual" />
            <Area type="monotone" dataKey="predicted" stroke="#D32F2F" fill="url(#colorPredicted)" strokeDasharray="5 5" name="AI Predicted" />
          </AreaChart>
        );
      
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis dataKey="hour" stroke="#757575" />
            <YAxis stroke="#757575" />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="capacity" stroke="#9E9E9E" strokeWidth={2} name="Capacity" />
            <Line type="monotone" dataKey="actual" stroke="#1976D2" strokeWidth={3} name="Actual" />
            <Line type="monotone" dataKey="predicted" stroke="#D32F2F" strokeWidth={3} strokeDasharray="5 5" name="AI Predicted" />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis dataKey="hour" stroke="#757575" />
            <YAxis stroke="#757575" />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey="capacity" fill="#9E9E9E" name="Capacity" radius={[8, 8, 0, 0]} />
            <Bar dataKey="actual" fill="#1976D2" name="Actual" radius={[8, 8, 0, 0]} />
            <Bar dataKey="predicted" fill="#D32F2F" name="AI Predicted" radius={[8, 8, 0, 0]} />
          </BarChart>
        );
      
      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis dataKey="hour" stroke="#757575" />
            <YAxis stroke="#757575" />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: '8px' }} />
            <Legend />
            <Area type="monotone" dataKey="capacity" fill="#F5F5F5" stroke="#9E9E9E" name="Capacity" />
            <Bar dataKey="actual" fill="#1976D2" name="Actual" radius={[8, 8, 0, 0]} />
            <Line type="monotone" dataKey="predicted" stroke="#D32F2F" strokeWidth={3} name="AI Predicted" />
          </ComposedChart>
        );
      
      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis type="number" dataKey="x" name="Hour" stroke="#757575" />
            <YAxis type="number" dataKey="y" name="Patients" stroke="#757575" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: '8px' }} />
            <Legend />
            <Scatter name="Actual Load" data={emergencyTrendData} fill="#1976D2" />
            <Scatter name="Predicted Load" data={emergencyTrendData.map(d => ({...d, y: d.predicted}))} fill="#D32F2F" />
          </ScatterChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={styles.dashboard}>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes typing {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-10px); }
        }
        input::placeholder {
          color: #9E9E9E;
        }
      `}</style>

      {/* Notifications Panel */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <motion.div
            style={styles.notificationPanel}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
          >
            {notifications.map(notif => (
              <motion.div
                key={notif.id}
                style={styles.notificationItem}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Bell style={{ width: '20px', height: '20px', color: '#1976D2', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#212121', marginBottom: '0.25rem' }}>
                      {notif.title}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#757575' }}>
                      {notif.message}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#9E9E9E', marginTop: '0.5rem' }}>
                      {notif.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#757575' }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X style={{ width: '16px', height: '16px' }} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.container}>
        {/* Header */}
        <motion.div 
          style={{...styles.glassCard, ...styles.headerCard}}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={styles.headerContent}>
            <div style={styles.headerLeft}>
              <motion.div 
                style={styles.icon3d}
                animate={{ 
                  rotateY: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <AlertTriangle style={{width: '32px', height: '32px', color: 'white'}} />
              </motion.div>
              <div>
                <h1 style={styles.gradientText}>Emergency Prediction System</h1>
                <p style={styles.subtitle}>AI-powered forecasting for emergency department optimization</p>
              </div>
            </div>
            <div style={styles.headerRight}>
              <div style={styles.connectionStatus}>
                <motion.div 
                  style={styles.statusDot}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>Live</span>
              </div>

              <motion.button
                onClick={handleRefresh}
                style={styles.toolbarButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Refresh Data"
              >
                <RefreshCw style={{ width: '20px', height: '20px', color: '#424242' }} />
              </motion.button>

              <motion.button
                onClick={handleExportData}
                style={styles.toolbarButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Export Data"
              >
                <Download style={{ width: '20px', height: '20px', color: '#424242' }} />
              </motion.button>

              <div style={styles.timeframeButtons}>
                {['24h', '48h', '7d'].map((timeframe) => (
                  <motion.button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    style={{
                      ...styles.timeframeBtn,
                      ...(selectedTimeframe === timeframe ? styles.timeframeBtnActive : {})
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {timeframe}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
          
          <div style={styles.featureBadges}>
            {['Real-Time Forecasting', 'Resource Optimization', 'Risk Assessment', 'Pattern Recognition'].map((feature, index) => (
              <motion.span 
                key={feature}
                style={styles.badge}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                ✓ {feature}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          style={styles.filterSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Filter style={{ width: '20px', height: '20px', color: '#757575' }} />
          <span style={{ fontWeight: '600', color: '#424242' }}>Filter by Risk:</span>
          {['all', 'high', 'medium', 'low'].map((risk) => (
            <motion.button
              key={risk}
              onClick={() => setFilterRisk(risk)}
              style={{
                ...styles.filterButton,
                ...(filterRisk === risk ? styles.filterButtonActive : {})
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {risk.charAt(0).toUpperCase() + risk.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Metrics Cards */}
        <div style={styles.metricsGrid}>
          {[
            { icon: Users, label: 'Current Load', value: emergencyMetrics.currentLoad, unit: '', color: '#1976D2', detail: 'Patients in ED', trend: 'up' },
            { icon: TrendingUp, label: 'Predicted Peak', value: emergencyMetrics.predictedPeak, unit: '', color: '#D32F2F', detail: 'Next 12 hours', trend: 'up' },
            { icon: Clock, label: 'Avg Response', value: emergencyMetrics.avgResponseTime, unit: 'm', color: '#388E3C', detail: 'Response time', trend: 'down' },
            { icon: Activity, label: 'Bed Availability', value: emergencyMetrics.bedAvailability, unit: '%', color: '#7B1FA2', detail: 'Current capacity', trend: 'down' }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              style={{...styles.glassCard, ...styles.metricCard}}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                style={{
                  ...styles.metricTrend,
                  ...(metric.trend === 'up' ? styles.trendUp : styles.trendDown)
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {metric.trend === 'up' ? '↑' : '↓'}
              </motion.div>
              <div>
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <metric.icon style={{...styles.metricIcon, color: metric.color}} />
                </motion.div>
              </div>
              <div style={styles.metricContent}>
                <p style={styles.metricLabel}>{metric.label}</p>
                <motion.p 
                  style={{...styles.metricValue, color: metric.color}}
                  key={metric.value}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {metric.value}{metric.unit}
                </motion.p>
                <p style={styles.metricDetail}>{metric.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Predictions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div style={styles.sectionTitle}>
            <div style={styles.sectionTitleLeft}>
              <Zap style={{...styles.sectionIcon, color: '#F57C00'}} />
              <span>AI Emergency Predictions</span>
            </div>
            <div style={styles.sectionActions}>
              <motion.button
                onClick={handleRefresh}
                style={styles.iconButton}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw style={{ width: '18px', height: '18px', color: '#424242' }} />
              </motion.button>
            </div>
          </div>
          <div style={styles.predictionsGrid}>
            {filteredPredictions.map((prediction, index) => (
              <motion.div
                key={prediction.id}
                style={{
                  ...styles.glassCard, 
                  ...styles.predictionCard,
                  ...getRiskStyle(prediction.riskLevel),
                  ...(selectedPrediction === prediction.id ? styles.predictionCardSelected : {})
                }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPrediction(selectedPrediction === prediction.id ? null : prediction.id)}
              >
                <div style={styles.predictionHeader}>
                  <div>
                    <h3 style={styles.predictionTitle}>{prediction.type}</h3>
                    <div style={styles.predictionBadges}>
                      <span style={{...styles.riskBadge, ...getRiskBadgeStyle(prediction.riskLevel)}}>
                        {prediction.riskLevel} Risk
                      </span>
                      <span style={{...styles.riskBadge, ...styles.confidenceBadge}}>
                        Confidence: {prediction.confidence}%
                      </span>
                    </div>
                  </div>
                  <div style={styles.probabilityDisplay}>
                    <motion.div 
                      style={styles.probabilityCircle}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.15 + 0.3, type: 'spring' }}
                    >
                      <svg viewBox="0 0 100 100" style={{width: '100%', height: '100%'}}>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#E0E0E0" strokeWidth="8" />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={prediction.riskLevel === 'High' ? '#D32F2F' : prediction.riskLevel === 'Medium' ? '#F57C00' : '#388E3C'}
                          strokeWidth="8"
                          strokeDasharray={`${prediction.probability * 2.83} 283`}
                          strokeLinecap="round"
                          initial={{ strokeDasharray: '0 283' }}
                          animate={{ strokeDasharray: `${prediction.probability * 2.83} 283` }}
                          transition={{ duration: 1.5, delay: index * 0.15 + 0.5 }}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <span style={styles.probabilityText}>{prediction.probability}%</span>
                    </motion.div>
                  </div>
                </div>

                <div style={styles.predictionDetails}>
                  <div style={styles.detailItem}>
                    <Clock style={styles.detailIcon} />
                    <div>
                      <p style={styles.detailLabel}>Timeframe</p>
                      <p style={styles.detailValue}>{prediction.timeframe}</p>
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <MapPin style={styles.detailIcon} />
                    <div>
                      <p style={styles.detailLabel}>Affected Area</p>
                      <p style={styles.detailValue}>{prediction.affectedArea}</p>
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <Users style={styles.detailIcon} />
                    <div>
                      <p style={styles.detailLabel}>Estimated Cases</p>
                      <p style={styles.detailValue}>{prediction.estimatedCases}</p>
                    </div>
                  </div>
                </div>

                <div style={styles.factorsSection}>
                  <p style={styles.factorsLabel}>Key Factors</p>
                  <div style={styles.factorsTags}>
                    {prediction.factors.map((factor, idx) => (
                      <motion.span 
                        key={idx}
                        style={styles.factorTag}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.15 + 0.1 * idx }}
                      >
                        {factor}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div style={styles.actionBox}>
                  <p style={styles.actionLabel}>Recommended Action:</p>
                  <p style={styles.actionText}>{prediction.recommendedAction}</p>
                  <div style={styles.actionButtons}>
                    <motion.button
                      style={styles.actionButton}
                      whileHover={{ background: '#1976D2', color: 'white' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addNotification('Action Initiated', `Protocol activated for ${prediction.type}`, 'info');
                      }}
                    >
                      Execute
                    </motion.button>
                    <motion.button
                      style={styles.actionButton}
                      whileHover={{ background: '#1976D2', color: 'white' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addNotification('Alert Sent', `Team notified about ${prediction.type}`, 'info');
                      }}
                    >
                      Notify Team
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Chart with Dropdown */}
        <motion.div 
          style={{...styles.glassCard, ...styles.chartCard}}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div style={styles.sectionTitle}>
            <div style={styles.sectionTitleLeft}>
              <span>Emergency Department Load Forecast</span>
            </div>
            <div style={styles.sectionActions} ref={dropdownRef}>
              <div style={styles.dropdownContainer}>
                <motion.button
                  onClick={() => setShowChartDropdown(!showChartDropdown)}
                  style={styles.dropdownButton}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{chartTypes.find(ct => ct.value === mainChartType)?.icon}</span>
                  <span>{chartTypes.find(ct => ct.value === mainChartType)?.label}</span>
                  <ChevronDown style={{ width: '16px', height: '16px' }} />
                </motion.button>
                
                <AnimatePresence>
                  {showChartDropdown && (
                    <motion.div
                      style={styles.dropdownMenu}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {chartTypes.map((type) => (
                        <motion.div
                          key={type.value}
                          style={{
                            ...styles.dropdownItem,
                            ...(mainChartType === type.value ? styles.dropdownItemActive : {})
                          }}
                          onClick={() => {
                            setMainChartType(type.value);
                            setShowChartDropdown(false);
                          }}
                          whileHover={{ background: '#F5F5F5' }}
                        >
                          <span style={{ marginRight: '0.5rem' }}>{type.icon}</span>
                          {type.label}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            {renderMainChart()}
          </ResponsiveContainer>
          <div style={styles.alertBox}>
            <AlertTriangle style={styles.alertIcon} />
            <span><strong>Peak Alert:</strong> AI predicts capacity threshold (90%) will be reached at 18:00. Recommend staff augmentation.</span>
          </div>
        </motion.div>

        {/* Additional Charts Grid */}
        <div style={styles.chartsGrid}>
          {/* Pie Chart */}
          <motion.div 
            style={{...styles.glassCard, ...styles.chartCard}}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 style={{...styles.sectionTitleLeft, marginBottom: '1.5rem'}}>
              Emergency Distribution (Pie Chart)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Radar Chart */}
          <motion.div 
            style={{...styles.glassCard, ...styles.chartCard}}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 style={{...styles.sectionTitleLeft, marginBottom: '1.5rem'}}>
              Risk Assessment (Radar Chart)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E0E0E0" />
                <PolarAngleAxis dataKey="subject" stroke="#757575" />
                <PolarRadiusAxis stroke="#757575" />
                <Radar name="Confidence %" dataKey="A" stroke="#1976D2" fill="#1976D2" fillOpacity={0.6} />
                <Radar name="Probability %" dataKey="B" stroke="#D32F2F" fill="#D32F2F" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div 
            style={{...styles.glassCard, ...styles.chartCard}}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 style={{...styles.sectionTitleLeft, marginBottom: '1.5rem'}}>
              Category Distribution (Bar Chart)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="category" stroke="#757575" />
                <YAxis stroke="#757575" />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="current" fill="#1976D2" name="Current" radius={[8, 8, 0, 0]} />
                <Bar dataKey="predicted" fill="#D32F2F" name="Predicted" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Resource Utilization */}
          <motion.div 
            style={{...styles.glassCard, ...styles.chartCard}}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 style={{...styles.sectionTitleLeft, marginBottom: '1.5rem'}}>
              Resource Utilization Forecast
            </h2>
            <div style={styles.resourceList}>
              {resourceData.map((resource, index) => (
                <motion.div 
                  key={index}
                  style={styles.resourceItem}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div style={styles.resourceHeader}>
                    <span style={styles.resourceName}>{resource.resource}</span>
                    <div style={styles.resourceValues}>
                      <span style={styles.currentValue}>Now: {resource.current}%</span>
                      <span style={styles.predictedValue}>Predicted: {resource.predicted}%</span>
                    </div>
                  </div>
                  <div style={styles.resourceBar}>
                    <motion.div
                      style={{...styles.barCurrent, width: `${resource.current}%`}}
                      initial={{ width: 0 }}
                      animate={{ width: `${resource.current}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                    />
                    <motion.div
                      style={{...styles.barPredicted, width: `${resource.predicted}%`}}
                      initial={{ width: 0 }}
                      animate={{ width: `${resource.predicted}%` }}
                      transition={{ duration: 1, delay: 1 + index * 0.1 }}
                    />
                    {resource.predicted > 85 && (
                      <motion.div
                        style={styles.alertIndicator}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5 + index * 0.1 }}
                      >
                        <AlertTriangle style={styles.alertIconSmall} />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <div style={{...styles.alertBox, ...styles.alertBoxWarning}}>
              <p>⚠️ <strong>Resource Alert:</strong> ICU beds and nursing staff predicted to exceed 85% utilization.</p>
            </div>
          </motion.div>
        </div>

        {/* Performance */}
        <motion.div 
          style={{...styles.glassCard, ...styles.performanceCard}}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
            <Shield style={{...styles.sectionIcon, color: '#388E3C'}} />
            <h2 style={{fontSize: '2rem', fontWeight: '700', color: '#212121'}}>
              AI Model Performance & Accuracy
            </h2>
          </div>
          <div style={styles.performanceGrid}>
            {[
              { label: 'Overall Accuracy', value: '91.3%', detail: 'Last 30 days' },
              { label: 'Peak Prediction', value: '88.7%', detail: '±15 min accuracy' },
              { label: 'Volume Forecast', value: '93.2%', detail: '±2 patients' },
              { label: 'False Positives', value: '4.2%', detail: 'Alert rate' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                style={{...styles.performanceStat, ...getPerformanceStatStyle(index)}}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
              >
                <p style={styles.statLabel}>{stat.label}</p>
                <motion.p 
                  style={styles.statValue}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  {stat.value}
                </motion.p>
                <p style={styles.statDetail}>{stat.detail}</p>
              </motion.div>
            ))}
          </div>
          <div style={styles.modelInfo}>
            <p><strong>Model Training:</strong> Continuously learning from 500K+ historical emergency cases, weather patterns, traffic data, demographic trends, and seasonal variations. Last updated: 2 hours ago.</p>
          </div>
        </motion.div>
      </div>

      {/* Chatbot */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div 
            style={styles.chatbotContainer}
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div style={styles.chatbotHeader}>
              <div style={styles.chatbotTitle}>
                <MessageSquare style={styles.chatbotIcon} />
                <span>AI Emergency Assistant</span>
              </div>
              <motion.button 
                style={styles.chatbotClose}
                onClick={() => setChatOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X />
              </motion.button>
            </div>
            
            <div style={styles.chatbotMessages}>
              {chatMessages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#757575' }}>
                  <MessageSquare style={{ width: '48px', height: '48px', margin: '0 auto 1rem', color: '#BDBDBD' }} />
                  <p>Ask me about emergency predictions or resources!</p>
                </div>
              )}
              <AnimatePresence>
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    style={message.sender === 'user' ? styles.messageUser : styles.messageBot}
                    initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <p style={{margin: 0, lineHeight: 1.5}}>{message.text}</p>
                    <span style={styles.messageTime}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div 
                  style={styles.typingIndicator}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span style={styles.typingDot}></span>
                  <span style={{...styles.typingDot, animationDelay: '0.2s'}}></span>
                  <span style={{...styles.typingDot, animationDelay: '0.4s'}}></span>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div style={styles.chatbotInput}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about predictions, resources..."
                style={styles.chatInput}
              />
              <motion.button 
                onClick={handleSendMessage}
                style={styles.chatSendBtn}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={!inputMessage.trim()}
              >
                <Send />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!chatOpen && (
        <motion.button
          style={styles.chatbotToggle}
          onClick={() => setChatOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageSquare style={{width: '28px', height: '28px'}} />
          <motion.span 
            style={styles.notificationDot}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      )}
    </div>
  );
};

export default EmergencyPrediction;
