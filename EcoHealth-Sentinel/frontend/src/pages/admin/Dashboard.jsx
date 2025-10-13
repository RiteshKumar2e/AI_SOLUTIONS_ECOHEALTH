import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Sprout, Leaf, Users, Activity, MessageSquare, Bell, Search, X, Send, 
  BarChart3, PieChart, Database, Shield, Settings, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle, Clock, Download, Filter, Calendar, Globe, Zap,
  DollarSign, Cpu, HardDrive, RefreshCw, Eye, UserCheck, FileText, Target,
  Award, MapPin, Package, Server, Share2, Layers
} from 'lucide-react';
import jsPDF from "jspdf";

// Utility function for CSV download
const downloadFile = (data, filename, type) => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
};

// Handle export (CSV / PDF)
const handleExportData = (format) => {
  if (format === "csv") {
    // Example CSV data (replace with real dashboard data)
    const csvData = "Name,Role,Score\nRitesh,Admin,95\nRuchi,User,88";
    downloadFile(csvData, "dashboard_report.csv", "text/csv");
  } else if (format === "pdf") {
    // Generate PDF using jsPDF
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Responsible AI Platform Report", 10, 15);
    doc.setFontSize(12);
    doc.text("Generated from Admin Dashboard", 10, 25);
    doc.text("Multi-Domain Real-Time Analytics", 10, 35);
    doc.text("Name: Ritesh | Role: Admin | Score: 95", 10, 50);
    doc.text("Name: Ruchi | Role: User | Score: 88", 10, 60);

    doc.save("dashboard_report.pdf"); // goes directly to Chrome downloads
  }
};
export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // State Management
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', message: 'Hello Admin! How can I help you today?', time: '10:30 AM' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [dateRange, setDateRange] = useState('7days');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [loading, setLoading] = useState(false);

  // Backend API Configuration
 // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Real-time Data States from MongoDB
  const [systemMetrics, setSystemMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    avgAccuracy: 0,
    totalAlerts: 0,
    revenue: 0,
    apiCalls: 0,
    successRate: 0
  });

  const [domainStats, setDomainStats] = useState({
    agriculture: { projects: 0, users: 0, accuracy: 0, alerts: 0 },
    healthcare: { projects: 0, users: 0, accuracy: 0, alerts: 0 },
    environment: { projects: 0, users: 0, accuracy: 0, alerts: 0 }
  });

  const [activeProjects, setActiveProjects] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [serverMetrics, setServerMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkTraffic: 0
  });
  const [apiHealth, setApiHealth] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [geographicData, setGeographicData] = useState([]);
  const [modelPerformance, setModelPerformance] = useState([]);

  // Fetch All Dashboard Data from MongoDB
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [dateRange, selectedDomain]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Fetch System Metrics
      const metricsRes = await fetch(`${API_BASE_URL}/admin/metrics?range=${dateRange}`, { headers });
      const metricsData = await metricsRes.json();
      setSystemMetrics(metricsData.data);

      // Fetch Projects
      const projectsRes = await fetch(`${API_BASE_URL}/admin/projects?domain=${selectedDomain}`, { headers });
      const projectsData = await projectsRes.json();
      setActiveProjects(projectsData.data);

      // Fetch Alerts
      const alertsRes = await fetch(`${API_BASE_URL}/admin/alerts?limit=50`, { headers });
      const alertsData = await alertsRes.json();
      setRecentAlerts(alertsData.data);

      // Fetch User Activity
      const activityRes = await fetch(`${API_BASE_URL}/admin/user-activity?limit=100`, { headers });
      const activityData = await activityRes.json();
      setUserActivity(activityData.data);

      // Fetch Domain Stats
      const domainRes = await fetch(`${API_BASE_URL}/admin/domain-stats`, { headers });
      const domainData = await domainRes.json();
      setDomainStats(domainData.data);

      // Fetch Server Metrics
      const serverRes = await fetch(`${API_BASE_URL}/admin/server-metrics`, { headers });
      const serverData = await serverRes.json();
      setServerMetrics(serverData.data);

      // Fetch API Health
      const apiRes = await fetch(`${API_BASE_URL}/admin/api-health`, { headers });
      const apiData = await apiRes.json();
      setApiHealth(apiData.data);

      // Fetch Top Users
      const usersRes = await fetch(`${API_BASE_URL}/admin/top-users?limit=10`, { headers });
      const usersData = await usersRes.json();
      setTopUsers(usersData.data);

      // Fetch Transactions
      const transRes = await fetch(`${API_BASE_URL}/admin/transactions?limit=20`, { headers });
      const transData = await transRes.json();
      setRecentTransactions(transData.data);

      // Fetch Geographic Data
      const geoRes = await fetch(`${API_BASE_URL}/admin/geographic-data`, { headers });
      const geoData = await geoRes.json();
      setGeographicData(geoData.data);

      // Fetch Model Performance
      const modelRes = await fetch(`${API_BASE_URL}/admin/model-performance`, { headers });
      const modelData = await modelRes.json();
      setModelPerformance(modelData.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // AI Chatbot Integration
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    
    const userMessage = { 
      sender: 'user', 
      message: chatMessage, 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setChatHistory([...chatHistory, userMessage]);
    const currentMessage = chatMessage;
    setChatMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: currentMessage,
          context: 'admin_dashboard',
          domain: selectedDomain
        })
      });

      const data = await response.json();
      
      const botResponse = {
        sender: 'bot',
        message: data.response,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      setChatHistory(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chatbot error:', error);
    }
  };

  // Export Dashboard Data
  const handleExportData = async (format = 'csv') => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/export?format=${format}&range=${dateRange}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-report-${new Date().toISOString()}.${format}`;
      a.click();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  // Utility Functions
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': case 'healthy': case 'success': return '#10b981';
      case 'warning': case 'degraded': return '#f59e0b';
      case 'error': case 'critical': case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getColorHex = (color) => {
    const colors = {
      red: { gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
      green: { gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
      teal: { gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' },
      blue: { gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
      purple: { gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
      yellow: { gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }
    };
    return colors[color] || colors.blue;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString() || '0';
  };

  // Inline Styles
  const styles = {
    adminDashboard: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f8fafc 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    topNav: {
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    navLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
    },
    navLogo: {
      fontSize: '1.75rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      background: '#f8fafc',
      padding: '0.75rem 1.25rem',
      borderRadius: '50px',
      border: '1px solid #e2e8f0',
      minWidth: '450px',
    },
    searchInput: {
      border: 'none',
      background: 'transparent',
      outline: 'none',
      fontSize: '0.95rem',
      flex: 1,
      color: '#1e293b',
    },
    navRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    navIconBtn: {
      position: 'relative',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: '0.75rem',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    badge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      background: '#ef4444',
      color: 'white',
      fontSize: '0.7rem',
      padding: '2px 6px',
      borderRadius: '50px',
      fontWeight: '600',
    },
    filterSelect: {
      padding: '0.75rem 1rem',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      background: '#ffffff',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      outline: 'none',
    },
    dashboardContainer: {
      display: 'flex',
      gap: '2rem',
      padding: '2rem',
      maxWidth: '2000px',
      margin: '0 auto',
    },
    sidebar: {
      width: '280px',
      background: '#ffffff',
      borderRadius: '20px',
      padding: '1.5rem',
      height: 'fit-content',
      position: 'sticky',
      top: '100px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    },
    sidebarSection: {
      marginBottom: '2rem',
    },
    sidebarSectionTitle: {
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      color: '#64748b',
      fontWeight: '700',
      letterSpacing: '1px',
      marginBottom: '0.75rem',
    },
    sidebarBtn: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.875rem 1rem',
      border: 'none',
      background: 'transparent',
      color: '#64748b',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      textAlign: 'left',
    },
    sidebarBtnActive: {
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    },
    mainContent: {
      flex: 1,
    },
    contentHeader: {
      marginBottom: '2rem',
    },
    pageTitle: {
      fontSize: '2.75rem',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    pageSubtitle: {
      color: '#64748b',
      fontSize: '1.1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1.5rem',
    },
    headerActions: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
    },
    btnPrimary: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.875rem 1.75rem',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none',
      fontSize: '0.95rem',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    },
    btnSecondary: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.875rem 1.75rem',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.95rem',
      background: '#ffffff',
      color: '#1e293b',
      border: '1px solid #e2e8f0',
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2.5rem',
    },
    metricCard: {
      background: '#ffffff',
      borderRadius: '20px',
      padding: '1.75rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    metricIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
      marginBottom: '1rem',
    },
    metricLabel: {
      fontSize: '0.85rem',
      color: '#64748b',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '0.5rem',
    },
    metricValue: {
      fontSize: '2.25rem',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    metricChange: {
      fontSize: '0.875rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    sectionTitle: {
      fontSize: '1.875rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    card: {
      background: '#ffffff',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0',
      marginBottom: '2rem',
    },
    domainCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    domainCard: {
      background: '#ffffff',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    domainHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      paddingBottom: '1.25rem',
      marginBottom: '1.5rem',
    },
    domainHeaderTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
    },
    domainMetrics: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.25rem',
      marginBottom: '1.5rem',
    },
    domainMetric: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    domainMetricLabel: {
      fontSize: '0.85rem',
      color: '#64748b',
      fontWeight: '600',
    },
    domainMetricValue: {
      fontSize: '1.5rem',
      fontWeight: '800',
      color: '#1e293b',
    },
    domainBtn: {
      width: '100%',
      padding: '0.875rem',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    projectsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    projectCard: {
      background: '#ffffff',
      borderRadius: '20px',
      padding: '1.75rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
    },
    projectHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    projectIcon: {
      width: '50px',
      height: '50px',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    projectInfo: {
      flex: 1,
    },
    projectName: {
      fontSize: '1.125rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.25rem',
    },
    projectDomain: {
      fontSize: '0.85rem',
      color: '#64748b',
      fontWeight: '600',
    },
    statusIndicator: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
    },
    progressBar: {
      width: '100%',
      height: '8px',
      background: '#f1f5f9',
      borderRadius: '50px',
      overflow: 'hidden',
      marginTop: '0.5rem',
    },
    progressFill: {
      height: '100%',
      borderRadius: '50px',
      transition: 'width 0.6s ease',
    },
    projectStats: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '1.25rem',
      paddingTop: '1.25rem',
      borderTop: '1px solid #e2e8f0',
    },
    statItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    },
    statItemLabel: {
      fontSize: '0.8rem',
      color: '#64748b',
      fontWeight: '600',
    },
    statItemValue: {
      fontSize: '1rem',
      fontWeight: '700',
      color: '#1e293b',
    },
    projectFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '1rem',
      borderTop: '1px solid #e2e8f0',
    },
    lastUpdate: {
      fontSize: '0.8rem',
      color: '#64748b',
    },
    viewDetailsBtn: {
      background: 'none',
      border: 'none',
      color: '#3b82f6',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 0.5rem',
    },
    th: {
      textAlign: 'left',
      fontSize: '0.85rem',
      fontWeight: '700',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      padding: '0.75rem 1rem',
      borderBottom: '2px solid #e2e8f0',
    },
    td: {
      padding: '1rem',
      fontSize: '0.95rem',
      color: '#1e293b',
      borderBottom: '1px solid #f1f5f9',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '0.375rem 0.875rem',
      borderRadius: '50px',
      fontSize: '0.8rem',
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    chatbotContainer: {
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '450px',
      height: '650px',
      background: '#ffffff',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      border: '1px solid #e2e8f0',
    },
    chatbotHeader: {
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: 'white',
      padding: '1.5rem',
      borderRadius: '24px 24px 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    chatbotTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontWeight: '700',
      fontSize: '1.125rem',
    },
    closeChatBtn: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      color: 'white',
      padding: '0.5rem',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    chatbotMessages: {
      flex: 1,
      padding: '1.5rem',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      background: '#f8fafc',
    },
    chatMessageBot: {
      maxWidth: '85%',
      padding: '1rem 1.25rem',
      borderRadius: '18px',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      alignSelf: 'flex-start',
    },
    chatMessageUser: {
      maxWidth: '85%',
      padding: '1rem 1.25rem',
      borderRadius: '18px',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: 'white',
      alignSelf: 'flex-end',
    },
    chatMessageText: {
      margin: 0,
      fontSize: '0.95rem',
      lineHeight: '1.5',
      marginBottom: '0.5rem',
    },
    messageTime: {
      fontSize: '0.75rem',
      opacity: 0.7,
    },
    chatbotInput: {
      padding: '1.5rem',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      gap: '0.75rem',
      background: '#ffffff',
      borderRadius: '0 0 24px 24px',
    },
    chatbotInputField: {
      flex: 1,
      padding: '0.875rem 1.25rem',
      border: '1px solid #e2e8f0',
      borderRadius: '50px',
      fontSize: '0.95rem',
      outline: 'none',
    },
    sendBtn: {
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: 'white',
      border: 'none',
      padding: '0.875rem',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationDropdown: {
      position: 'fixed',
      top: '80px',
      right: '2rem',
      width: '400px',
      maxHeight: '500px',
      background: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      zIndex: 1000,
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    },
    notificationHeader: {
      padding: '1.25rem',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#f8fafc',
    },
    notificationHeaderTitle: {
      fontSize: '1.125rem',
      fontWeight: '700',
    },
    notificationCloseBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#64748b',
    },
    notificationItem: {
      padding: '1rem 1.25rem',
      display: 'flex',
      gap: '1rem',
      alignItems: 'start',
      borderBottom: '1px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    alertIcon: {
      flexShrink: 0,
    },
    alertContent: {
      flex: 1,
    },
    alertHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem',
    },
    alertDomain: {
      fontSize: '0.8rem',
      fontWeight: '700',
      color: '#3b82f6',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    alertTime: {
      fontSize: '0.8rem',
      color: '#64748b',
    },
    alertMessage: {
      color: '#1e293b',
      fontSize: '0.95rem',
      lineHeight: '1.5',
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .metric-card:hover, .domain-card:hover, .project-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.12);
          }
          
          .sidebar-btn:hover {
            background: #f8fafc;
            color: #3b82f6;
            transform: translateX(5px);
          }
          
          .nav-icon-btn:hover {
            background: #3b82f6;
            color: white;
            transform: scale(1.05);
          }
          
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
          }
          
          .btn-secondary:hover {
            border-color: #3b82f6;
            transform: translateY(-2px);
          }
          
          .domain-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
          }
          
          .view-details-btn:hover {
            transform: translateX(5px);
          }
          
          .notification-item:hover {
            background: #f8fafc;
          }
          
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f8fafc;
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #3b82f6;
          }
        `}
      </style>

      <div style={styles.adminDashboard}>
        {/* Top Navigation Bar */}
        <nav style={styles.topNav}>
          <div style={styles.navLeft}>
            <h1 style={styles.navLogo}>AI Platform Admin</h1>
            <div style={styles.searchBar}>
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Search projects, users, analytics..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>
          <div style={styles.navRight}>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
            
            <button style={styles.navIconBtn} onClick={() => setNotificationOpen(!notificationOpen)}>
              <Bell size={22} />
              {recentAlerts.length > 0 && <span style={styles.badge}>{recentAlerts.length}</span>}
            </button>
            
            <button style={styles.navIconBtn} onClick={() => setChatOpen(!chatOpen)}>
              <MessageSquare size={22} />
            </button>
            
            <button style={styles.navIconBtn} onClick={fetchDashboardData}>
              <RefreshCw size={22} />
            </button>
          </div>
        </nav>

        <div style={styles.dashboardContainer}>
          {/* Sidebar Navigation */}
          <aside style={styles.sidebar}>
            <div style={styles.sidebarSection}>
              <h3 style={styles.sidebarSectionTitle}>Overview</h3>
              <button style={{...styles.sidebarBtn, ...styles.sidebarBtnActive}}>
                <BarChart3 size={20} /> Dashboard
              </button>
              <button style={styles.sidebarBtn} onClick={() => navigate('/admin/analytics')}>
                <PieChart size={20} /> Analytics
              </button>
              <button style={styles.sidebarBtn} onClick={() => navigate('/admin/users')}>
                <Users size={20} /> Users
              </button>
            </div>
            
            <div style={styles.sidebarSection}>
              <h3 style={styles.sidebarSectionTitle}>Domains</h3>
              <button style={styles.sidebarBtn} onClick={() => {setSelectedDomain('agriculture'); navigate('/agriculture/dashboard')}}>
                <Sprout size={20} /> Agriculture
              </button>
              <button style={styles.sidebarBtn} onClick={() => {setSelectedDomain('healthcare'); navigate('/healthcare/dashboard')}}>
                <Heart size={20} /> Healthcare
              </button>
              <button style={styles.sidebarBtn} onClick={() => {setSelectedDomain('environment'); navigate('/environment/dashboard')}}>
                <Leaf size={20} /> Environment
              </button>
            </div>

            <div style={styles.sidebarSection}>
              <h3 style={styles.sidebarSectionTitle}>Management</h3>
              <button style={styles.sidebarBtn} onClick={() => navigate('/admin/reports')}>
                <Database size={20} /> Reports
              </button>
              <button style={styles.sidebarBtn} onClick={() => navigate('/admin/access-control')}>
                <Shield size={20} /> Access Control
              </button>
              <button style={styles.sidebarBtn} onClick={() => navigate('/admin/settings')}>
                <Settings size={20} /> Settings
              </button>
            </div>

            <div style={styles.sidebarSection}>
              <h3 style={styles.sidebarSectionTitle}>System</h3>
              <button style={styles.sidebarBtn}>
                <Server size={20} /> Server Status
              </button>
              <button style={styles.sidebarBtn}>
                <Activity size={20} /> API Health
              </button>
              <button style={styles.sidebarBtn}>
                <FileText size={20} /> Logs
              </button>
            </div>
          </aside>

         {/* Main Content Area */}
<main style={styles.mainContent}>
  {/* Header Section */}
  <div style={styles.contentHeader}>
    <h1 style={styles.pageTitle}>Admin Dashboard</h1>
    <p style={styles.pageSubtitle}>
      <Globe size={20} />
      Responsible AI Platform - Multi-Domain Real-Time Analytics
    </p>
    <div style={styles.headerActions}>
      <button style={styles.btnSecondary} onClick={() => handleExportData('csv')}>
        <Download size={18} /> Export CSV
      </button>
      <button style={styles.btnSecondary} onClick={() => handleExportData('pdf')}>
        <Download size={18} /> Export PDF
      </button>
      <button style={styles.btnPrimary}>
        <Zap size={18} /> Generate AI Report
      </button>
    </div>
  </div>

  {/* Loader */}
  {loading && (
    <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
      Loading dashboard data...
    </div>
  )}


            {/* System-Wide Metrics - Feature 1-8 */}
            <div style={styles.metricsGrid}>
              <div className="metric-card" style={styles.metricCard}>
                <div style={{...styles.metricIcon, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}}>
                  <Users size={28} />
                </div>
                <p style={styles.metricLabel}>Total Users</p>
                <h2 style={styles.metricValue}>{formatNumber(systemMetrics.totalUsers)}</h2>
                <p style={{...styles.metricChange, color: '#10b981'}}>
                  <TrendingUp size={16} /> +12.5% from last month
                </p>
              </div>

              <div className="metric-card" style={styles.metricCard}>
                <div style={{...styles.metricIcon, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
                  <UserCheck size={28} />
                </div>
                <p style={styles.metricLabel}>Active Users</p>
                <h2 style={styles.metricValue}>{formatNumber(systemMetrics.activeUsers)}</h2>
                <p style={{...styles.metricChange, color: '#10b981'}}>
                  <TrendingUp size={16} /> +8.3% this week
                </p>
              </div>

              <div className="metric-card" style={styles.metricCard}>
                <div style={{...styles.metricIcon, background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'}}>
                  <Package size={28} />
                </div>
                <p style={styles.metricLabel}>Active Projects</p>
                <h2 style={styles.metricValue}>{systemMetrics.totalProjects || 0}</h2>
                <p style={{...styles.metricChange, color: '#10b981'}}>
                  <TrendingUp size={16} /> +3 new this week
                </p>
              </div>

              <div className="metric-card" style={styles.metricCard}>
                <div style={{...styles.metricIcon, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
                  <Target size={28} />
                </div>
                <p style={styles.metricLabel}>Avg Accuracy</p>
                <h2 style={styles.metricValue}>{systemMetrics.avgAccuracy?.toFixed(1) || 0}%</h2>
                <p style={{...styles.metricChange, color: '#10b981'}}>
                  <TrendingUp size={16} /> +2.3% improvement
                </p>
              </div>

              <div className="metric-card" style={styles.metricCard}>
                <div style={{...styles.metricIcon, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}}>
                  <AlertCircle size={28} />
                </div>
                <p style={styles.metricLabel}>Active Alerts</p>
                <h2 style={styles.metricValue}>{systemMetrics.totalAlerts || 0}</h2>
                <p style={{...styles.metricChange, color: '#ef4444'}}>
                  <TrendingUp size={16} /> {systemMetrics.criticalAlerts || 0} critical
                </p>
              </div>

              <div className="metric-card" style={styles.metricCard}>
                <div style={{...styles.metricIcon, background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'}}>
                  <DollarSign size={28} />
                </div>
                <p style={styles.metricLabel}>Revenue (MTD)</p>
                <h2 style={styles.metricValue}>${formatNumber(systemMetrics.revenue)}</h2>
                <p style={{...styles.metricChange, color: '#10b981'}}>
                  <TrendingUp size={16} /> +15.7% vs last month
                </p>
              </div>

              <div className="metric-card" style={styles.metricCard}>
                <div style={{...styles.metricIcon, background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'}}>
                  <Activity size={28} />
                </div>
                <p style={styles.metricLabel}>API Calls (24h)</p>
                <h2 style={styles.metricValue}>{formatNumber(systemMetrics.apiCalls)}</h2>
                <p style={{...styles.metricChange, color: '#10b981'}}>
                  {systemMetrics.successRate?.toFixed(1) || 0}% success rate
                </p>
              </div>

              <div className="metric-card" style={styles.metricCard}>
                <div style={{...styles.metricIcon, background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'}}>
                  <Award size={28} />
                </div>
                <p style={styles.metricLabel}>Platform Score</p>
                <h2 style={styles.metricValue}>{systemMetrics.platformScore?.toFixed(1) || 0}</h2>
                <p style={{...styles.metricChange, color: '#10b981'}}>
                  <TrendingUp size={16} /> Excellent performance
                </p>
              </div>
            </div>

            {/* Domain Performance - Feature 9 */}
            <div style={styles.sectionTitle}>
              <Layers size={28} />
              Domain Performance Overview
            </div>
            <div style={styles.domainCards}>
              <div className="domain-card" style={styles.domainCard} onClick={() => navigate('/agriculture/dashboard')}>
                <div style={{...styles.domainHeader, borderBottom: '3px solid #10b981'}}>
                  <Sprout size={36} color="#10b981" />
                  <h3 style={styles.domainHeaderTitle}>Agriculture</h3>
                </div>
                <div style={styles.domainMetrics}>
                  <div style={styles.domainMetric}>
                    <span style={styles.domainMetricLabel}>Projects</span>
                    <strong style={styles.domainMetricValue}>{domainStats.agriculture?.projects || 0}</strong>
                  </div>
                  <div style={styles.domainMetric}>
                    <span style={styles.domainMetricLabel}>Active Users</span>
                    <strong style={styles.domainMetricValue}>{formatNumber(domainStats.agriculture?.users)}</strong>
                  </div>
                  <div style={styles.domainMetric}>
                    <span style={styles.domainMetricLabel}>Accuracy</span>
                    <strong style={styles.domainMetricValue}>{domainStats.agriculture?.accuracy?.toFixed(1) || 0}%</strong>
                  </div>
                  <div style={styles.domainMetric}>
                    <span style={styles.domainMetricLabel}>Alerts</span>
                    <strong style={{...styles.domainMetricValue, color: '#f59e0b'}}>{domainStats.agriculture?.alerts || 0}</strong>
                  </div>
                </div>
                <button style={styles.domainBtn}>
                  View Agriculture Dashboard →
                </button>
              </div>

              <div className="domain-card" style={styles.domainCard} onClick={() => navigate('/healthcare/dashboard')}>
                <div style={{...styles.domainHeader, borderBottom: '3px solid #ef4444'}}>
                  <Heart size={36} color="#ef4444" />
                  <h3 style={styles.domainHeaderTitle}>Healthcare</h3>
                </div>
                <div style={styles.domainMetrics}>
                  <div style={styles.domainMetric}>
                    <span style={styles.domainMetricLabel}>Projects</span>
                    <strong style={styles.domainMetricValue}>{domainStats.healthcare?.projects || 0}</strong>
                  </div>
                  <div style={styles.domainMetric}>
                    <span style={styles.domainMetricLabel}>Active Users</span>
                    <strong style={styles.domainMetricValue}>{formatNumber(domainStats.healthcare?.users)}</strong>
                  </div>
                  <div style={styles.domainMetric}>
                    <span style={styles.domainMetricLabel}>Accuracy</span>
                    <strong style={styles.domainMetricValue}>{domainStats.healthcare?.accuracy?.toFixed(1) || 0}%</strong>
                  </div>
                  <div style={styles.domainMetric}>
                    <span style={styles.domainMetricLabel}>Alerts</span>
                    <strong style={{...styles.domainMetricValue, color: '#f59e0b'}}>{domainStats.healthcare?.alerts || 0}</strong>
                  </div>
                </div>
                <button style={styles.domainBtn}>
                  View Healthcare Dashboard →
                </button>
              </div>

              <div className="domain-card" style={styles.domainCard} onClick={() => navigate('/environment/dashboard')}>
                <div style={{...styles.domainHeader, borderBottom: '3px solid #14b8a6'}}>
                  <Leaf size={36} color="#14b8a6" />
                  <h3 style={styles.domainHeaderTitle}>Environment</h3>
                </div>
                <div style={styles.domainMetrics}>
                  <div style={styles.domainMetric}>
                    <span style={styles.domainMetricLabel}>Projects</span>
                    <strong style={styles.domainMetricValue}>{domainStats.environment?.projects || 0}</strong>
                  </div>
                  <div style={styles.domainMetric}>
                    <span style={styles.domainMetricLabel}>Active Users</span>
                    <strong style={styles.domainMetricValue}>{formatNumber(domainStats.environment?.users)}</strong>
                  </div>
                  <div style={styles.domainMetric}>
                    <span style={styles.domainMetricLabel}>Accuracy</span>
                    <strong style={styles.domainMetricValue}>{domainStats.environment?.accuracy?.toFixed(1) || 0}%</strong>
                  </div>
                  <div style={styles.domainMetric}>
                    <span style={styles.domainMetricLabel}>Alerts</span>
                    <strong style={{...styles.domainMetricValue, color: '#f59e0b'}}>{domainStats.environment?.alerts || 0}</strong>
                  </div>
                </div>
                <button style={styles.domainBtn}>
                  View Environment Dashboard →
                </button>
              </div>
            </div>

            {/* Active Projects - Feature 10 */}
            <div style={styles.sectionTitle}>
              <Package size={28} />
              Active AI Projects Across All Domains
            </div>
            <div style={styles.projectsGrid}>
              {activeProjects.map((project, index) => {
                const Icon = project.icon === 'Sprout' ? Sprout : project.icon === 'Heart' ? Heart : Leaf;
                const color = getColorHex(project.color || 'blue');
                return (
                  <div key={project._id || index} className="project-card" style={styles.projectCard}>
                    <div style={styles.projectHeader}>
                      <div style={{...styles.projectIcon, background: color.gradient}}>
                        <Icon size={24} color="#fff" />
                      </div>
                      <div style={styles.projectInfo}>
                        <h3 style={styles.projectName}>{project.name || 'Unnamed Project'}</h3>
                        <span style={styles.projectDomain}>{project.domain || 'General'}</span>
                      </div>
                      <div style={{...styles.statusIndicator, backgroundColor: getStatusColor(project.status || 'active')}}></div>
                    </div>
                    
                    <div>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                        <span style={{color: '#64748b', fontWeight: '600'}}>Progress</span>
                        <strong>{project.progress || 0}%</strong>
                      </div>
                      <div style={styles.progressBar}>
                        <div style={{...styles.progressFill, width: `${project.progress || 0}%`, background: color.gradient}}></div>
                      </div>
                    </div>

                    <div style={styles.projectStats}>
                      <div style={styles.statItem}>
                        <span style={styles.statItemLabel}>Accuracy</span>
                        <strong style={styles.statItemValue}>{project.accuracy || 'N/A'}</strong>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statItemLabel}>Impact</span>
                        <strong style={styles.statItemValue}>{project.impact || 'N/A'}</strong>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statItemLabel}>Users</span>
                        <strong style={styles.statItemValue}>{formatNumber(project.users || 0)}</strong>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statItemLabel}>Alerts</span>
                        <strong style={{...styles.statItemValue, color: '#f59e0b'}}>{project.alerts || 0}</strong>
                      </div>
                    </div>

                    <div style={styles.projectFooter}>
                      <span style={styles.lastUpdate}>Updated {project.lastUpdate || 'recently'}</span>
                      <button style={styles.viewDetailsBtn} className="view-details-btn">View Details →</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Server Metrics - Feature 11 */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>
                <Server size={28} />
                Server Performance Metrics
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '2rem'}}>
                <div>
                  <p style={styles.metricLabel}>CPU Usage</p>
                  <h3 style={{fontSize: '2rem', fontWeight: '800', color: '#1e293b'}}>{serverMetrics.cpuUsage || 0}%</h3>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: `${serverMetrics.cpuUsage || 0}%`, background: 'linear-gradient(135deg, #3b82f6, #2563eb)'}}></div>
                  </div>
                </div>
                <div>
                  <p style={styles.metricLabel}>Memory Usage</p>
                  <h3 style={{fontSize: '2rem', fontWeight: '800', color: '#1e293b'}}>{serverMetrics.memoryUsage || 0}%</h3>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: `${serverMetrics.memoryUsage || 0}%`, background: 'linear-gradient(135deg, #10b981, #059669)'}}></div>
                  </div>
                </div>
                <div>
                  <p style={styles.metricLabel}>Disk Usage</p>
                  <h3 style={{fontSize: '2rem', fontWeight: '800', color: '#1e293b'}}>{serverMetrics.diskUsage || 0}%</h3>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: `${serverMetrics.diskUsage || 0}%`, background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}></div>
                  </div>
                </div>
                <div>
                  <p style={styles.metricLabel}>Network Traffic</p>
                  <h3 style={{fontSize: '2rem', fontWeight: '800', color: '#1e293b'}}>{formatNumber(serverMetrics.networkTraffic || 0)} MB/s</h3>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: '65%', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Activity - Feature 12 */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>
                <Activity size={28} />
                Recent User Activity
              </div>
              <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>User</th>
                      <th style={styles.th}>Action</th>
                      <th style={styles.th}>Domain</th>
                      <th style={styles.th}>Time</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userActivity.map((activity, index) => (
                      <tr key={activity._id || index}>
                        <td style={styles.td}>{activity.userName || 'Anonymous'}</td>
                        <td style={styles.td}>{activity.action || 'N/A'}</td>
                        <td style={styles.td}>{activity.domain || 'General'}</td>
                        <td style={styles.td}>{activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Unknown'}</td>
                        <td style={styles.td}>
                          <span style={{...styles.statusBadge, backgroundColor: getStatusColor(activity.status || 'success'), color: 'white'}}>
                            {activity.status || 'success'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* API Health - Feature 13 */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>
                <Zap size={28} />
                API Health Status
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem'}}>
                {apiHealth.map((api, index) => (
                  <div key={api._id || index} style={{padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                      <strong style={{fontSize: '1rem'}}>{api.name || 'API'}</strong>
                      <span style={{...styles.statusBadge, backgroundColor: getStatusColor(api.status || 'healthy'), color: 'white'}}>
                        {api.status || 'healthy'}
                      </span>
                    </div>
                    <p style={{fontSize: '0.875rem', color: '#64748b'}}>
                      Response Time: <strong>{api.responseTime || 0}ms</strong>
                    </p>
                    <p style={{fontSize: '0.875rem', color: '#64748b'}}>
                      Uptime: <strong>{api.uptime || '99.9'}%</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Alerts - Feature 14 */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>
                <Bell size={28} />
                Recent System Alerts
              </div>
              {recentAlerts.slice(0, 10).map((alert, index) => (
                <div key={alert._id || index} style={{padding: '1rem', marginBottom: '0.5rem', background: '#f8fafc', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'start'}}>
                  <div style={styles.alertIcon}>
                    {alert.type === 'success' && <CheckCircle size={20} color="#10b981" />}
                    {alert.type === 'warning' && <AlertCircle size={20} color="#f59e0b" />}
                    {alert.type === 'error' && <X size={20} color="#ef4444" />}
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <span style={styles.alertDomain}>{alert.domain || 'System'}</span>
                      <span style={styles.alertTime}>{alert.time || 'Just now'}</span>
                    </div>
                    <p style={styles.alertMessage}>{alert.message || 'No message available'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Users - Feature 15 */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>
                <UserCheck size={28} />
                Top Active Users
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Rank</th>
                    <th style={styles.th}>User</th>
                    <th style={styles.th}>Domain</th>
                    <th style={styles.th}>Activities</th>
                    <th style={styles.th}>Projects</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map((user, index) => (
                    <tr key={user._id || index}>
                      <td style={styles.td}>#{index + 1}</td>
                      <td style={styles.td}>{user.name || 'Anonymous'}</td>
                      <td style={styles.td}>{user.domain || 'Multiple'}</td>
                      <td style={styles.td}>{user.activities || 0}</td>
                      <td style={styles.td}>{user.projects || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Geographic Distribution - Feature 16 */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>
                <MapPin size={28} />
                Geographic User Distribution
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                {geographicData.map((geo, index) => (
                  <div key={geo._id || index} style={{padding: '1rem', background: '#f8fafc', borderRadius: '12px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                      <MapPin size={20} color="#3b82f6" />
                      <strong>{geo.country || 'Unknown'}</strong>
                    </div>
                    <p style={{fontSize: '1.5rem', fontWeight: '800', color: '#1e293b'}}>{formatNumber(geo.users || 0)}</p>
                    <p style={{fontSize: '0.875rem', color: '#64748b'}}>Active Users</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Performance - Feature 17 */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>
                <Cpu size={28} />
                AI Model Performance
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Model Name</th>
                    <th style={styles.th}>Domain</th>
                    <th style={styles.th}>Accuracy</th>
                    <th style={styles.th}>Predictions</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {modelPerformance.map((model, index) => (
                    <tr key={model._id || index}>
                      <td style={styles.td}>{model.name || 'Unnamed Model'}</td>
                      <td style={styles.td}>{model.domain || 'General'}</td>
                      <td style={styles.td}>{model.accuracy || 0}%</td>
                      <td style={styles.td}>{formatNumber(model.predictions || 0)}</td>
                      <td style={styles.td}>
                        <span style={{...styles.statusBadge, backgroundColor: getStatusColor(model.status || 'active'), color: 'white'}}>
                          {model.status || 'active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent Transactions - Feature 18 */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>
                <DollarSign size={28} />
                Recent Transactions
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Transaction ID</th>
                    <th style={styles.th}>User</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((trans, index) => (
                    <tr key={trans._id || index}>
                      <td style={styles.td}>{trans.transactionId || 'N/A'}</td>
                      <td style={styles.td}>{trans.userName || 'Anonymous'}</td>
                      <td style={styles.td}>{trans.type || 'Purchase'}</td>
                      <td style={styles.td}>${trans.amount || 0}</td>
                      <td style={styles.td}>
                        <span style={{...styles.statusBadge, backgroundColor: getStatusColor(trans.status || 'success'), color: 'white'}}>
                          {trans.status || 'success'}
                        </span>
                      </td>
                      <td style={styles.td}>{trans.date ? new Date(trans.date).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </main>
        </div>

        {/* Floating AI Chatbot - Feature 19 */}
        {chatOpen && (
          <div style={styles.chatbotContainer}>
            <div style={styles.chatbotHeader}>
              <div style={styles.chatbotTitle}>
                <MessageSquare size={20} />
                <span>AI Admin Assistant</span>
              </div>
              <button onClick={() => setChatOpen(false)} style={styles.closeChatBtn}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.chatbotMessages}>
              {chatHistory.map((msg, idx) => (
                <div key={idx} style={msg.sender === 'bot' ? styles.chatMessageBot : styles.chatMessageUser}>
                  <p style={styles.chatMessageText}>{msg.message}</p>
                  <span style={styles.messageTime}>{msg.time}</span>
                </div>
              ))}
            </div>
            <div style={styles.chatbotInput}>
              <input 
                type="text" 
                placeholder="Ask about analytics, users, projects..." 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                style={styles.chatbotInputField}
              />
              <button onClick={handleSendMessage} style={styles.sendBtn}>
                <Send size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Notification Panel - Feature 20 */}
        {notificationOpen && (
          <div style={styles.notificationDropdown}>
            <div style={styles.notificationHeader}>
              <h3 style={styles.notificationHeaderTitle}>Notifications</h3>
              <button onClick={() => setNotificationOpen(false)} style={styles.notificationCloseBtn}>
                <X size={18} />
              </button>
            </div>
            {recentAlerts.slice(0, 10).map((alert, index) => (
              <div key={alert._id || index} style={styles.notificationItem}>
                <div style={styles.alertIcon}>
                  {alert.type === 'success' && <CheckCircle size={20} color="#10b981" />}
                  {alert.type === 'warning' && <AlertCircle size={20} color="#f59e0b" />}
                  {alert.type === 'error' && <X size={20} color="#ef4444" />}
                </div>
                <div>
                  <p style={{fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.25rem'}}>{alert.message || 'No message'}</p>
                  <span style={{fontSize: '0.8rem', color: '#64748b'}}>{alert.time || 'Just now'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
