// src/pages/admin/Reports.jsx
import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Search, Eye, TrendingUp, Users, Target, Send, Loader2, X, Heart, Sprout, Leaf, RefreshCw, Check, AlertCircle, Filter, BarChart3, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminReports() {
  // Backend API Configuration
  //const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [reports, setReports] = useState([]);
  const [summaryStats, setSummaryStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [domainTrends, setDomainTrends] = useState({});

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Fetch all reports from MongoDB
  const loadReportsFromAPI = async () => {
    setLoading(true);
    try {
      // ============ API CALL (Uncomment when backend ready) ============
      /*
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const [reportsRes, statsRes, trendsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/reports`, { headers }),
        fetch(`${API_BASE_URL}/admin/reports/stats`, { headers }),
        fetch(`${API_BASE_URL}/admin/reports/trends`, { headers })
      ]);

      const reportsData = await reportsRes.json();
      const statsData = await statsRes.json();
      const trendsData = await trendsRes.json();

      setReports(reportsData.reports);
      setSummaryStats(statsData.stats);
      setDomainTrends(trendsData.trends);
      */

      // ============ DUMMY DATA (Remove when API ready) ============
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const initialReports = [
        // Healthcare Reports
        {
          _id: '1',
          title: 'Q4 2025 Healthcare AI Impact Report',
          domain: 'Healthcare',
          date: '2025-10-08',
          type: 'Impact Assessment',
          status: 'completed',
          highlights: {
            accuracy: '95.2%',
            patients: '125K',
            savings: '$4.2M'
          },
          size: '2.4 MB',
          createdAt: '2025-10-08T00:00:00Z',
          description: 'Comprehensive analysis of AI diagnostic tools performance across major hospitals',
          author: 'Dr. Sarah Chen',
          downloads: 342,
          views: 1250
        },
        {
          _id: '2',
          title: 'Patient Risk Assessment Model Evaluation',
          domain: 'Healthcare',
          date: '2025-10-05',
          type: 'Performance Analysis',
          status: 'completed',
          highlights: {
            accuracy: '94.8%',
            predictions: '50K',
            reliability: '97%'
          },
          size: '1.9 MB',
          createdAt: '2025-10-05T00:00:00Z',
          description: 'Evaluation of predictive healthcare models for early disease detection',
          author: 'Medical Research Team',
          downloads: 289,
          views: 980
        },
        {
          _id: '3',
          title: 'Telemedicine Platform Usage Analytics',
          domain: 'Healthcare',
          date: '2025-10-02',
          type: 'Usage Report',
          status: 'completed',
          highlights: {
            consultations: '80K',
            satisfaction: '4.8/5',
            response: '< 5min'
          },
          size: '1.5 MB',
          createdAt: '2025-10-02T00:00:00Z',
          description: 'Analysis of telemedicine platform metrics and patient satisfaction',
          author: 'Platform Analytics',
          downloads: 456,
          views: 1450
        },
        {
          _id: '4',
          title: 'Medical Image Analysis AI Performance',
          domain: 'Healthcare',
          date: '2025-09-28',
          type: 'Technical Report',
          status: 'in-review',
          highlights: {
            accuracy: '96.5%',
            scans: '35K',
            speed: '< 2s'
          },
          size: '3.2 MB',
          createdAt: '2025-09-28T00:00:00Z',
          description: 'AI-powered medical imaging analysis performance metrics',
          author: 'Radiology AI Team',
          downloads: 178,
          views: 620
        },

        // Agriculture Reports
        {
          _id: '5',
          title: 'Crop Disease Detection Performance Review',
          domain: 'Agriculture',
          date: '2025-10-07',
          type: 'Performance Analysis',
          status: 'completed',
          highlights: {
            accuracy: '92.1%',
            coverage: '50K acres',
            detection: '15 diseases'
          },
          size: '1.8 MB',
          createdAt: '2025-10-07T00:00:00Z',
          description: 'Comprehensive evaluation of crop disease AI detection models',
          author: 'AgTech Research',
          downloads: 523,
          views: 1890
        },
        {
          _id: '6',
          title: 'Smart Irrigation Impact Assessment',
          domain: 'Agriculture',
          date: '2025-10-04',
          type: 'Impact Assessment',
          status: 'completed',
          highlights: {
            water: '-32%',
            yield: '+28%',
            farms: '35K'
          },
          size: '2.1 MB',
          createdAt: '2025-10-04T00:00:00Z',
          description: 'Analysis of irrigation optimization results across multiple farms',
          author: 'Irrigation Systems',
          downloads: 412,
          views: 1340
        },
        {
          _id: '7',
          title: 'Agricultural Market Forecast Accuracy',
          domain: 'Agriculture',
          date: '2025-10-01',
          type: 'Forecast Report',
          status: 'completed',
          highlights: {
            accuracy: '89.5%',
            crops: '20 types',
            markets: '8 regions'
          },
          size: '1.6 MB',
          createdAt: '2025-10-01T00:00:00Z',
          description: 'Market prediction model evaluation for agricultural commodities',
          author: 'Market Analytics',
          downloads: 367,
          views: 1120
        },
        {
          _id: '8',
          title: 'Pest Control AI System Evaluation',
          domain: 'Agriculture',
          date: '2025-09-27',
          type: 'Technical Report',
          status: 'draft',
          highlights: {
            detection: '94%',
            response: '< 24h',
            coverage: '45K acres'
          },
          size: '2.3 MB',
          createdAt: '2025-09-27T00:00:00Z',
          description: 'AI-powered pest detection and control system performance',
          author: 'Pest Management Team',
          downloads: 89,
          views: 320
        },

        // Environment Reports
        {
          _id: '9',
          title: 'Climate Prediction Model Assessment',
          domain: 'Environment',
          date: '2025-10-06',
          type: 'Performance Analysis',
          status: 'completed',
          highlights: {
            accuracy: '91.2%',
            predictions: '180 days',
            regions: '25'
          },
          size: '3.1 MB',
          createdAt: '2025-10-06T00:00:00Z',
          description: 'Climate forecasting model evaluation and long-term accuracy',
          author: 'Climate Science Team',
          downloads: 678,
          views: 2340
        },
        {
          _id: '10',
          title: 'Air Quality Monitoring Report',
          domain: 'Environment',
          date: '2025-10-03',
          type: 'Monitoring Report',
          status: 'completed',
          highlights: {
            cities: '15',
            sensors: '450',
            improvement: '+12%'
          },
          size: '2.5 MB',
          createdAt: '2025-10-03T00:00:00Z',
          description: 'Air quality tracking and analysis across urban areas',
          author: 'Environmental Monitoring',
          downloads: 534,
          views: 1780
        },
        {
          _id: '11',
          title: 'Carbon Footprint Reduction Analysis',
          domain: 'Environment',
          date: '2025-09-30',
          type: 'Impact Assessment',
          status: 'completed',
          highlights: {
            reduction: '-18%',
            users: '100K',
            carbon: '5K tons'
          },
          size: '1.9 MB',
          createdAt: '2025-09-30T00:00:00Z',
          description: 'Carbon tracking impact report and reduction strategies',
          author: 'Sustainability Team',
          downloads: 789,
          views: 2680
        },
        {
          _id: '12',
          title: 'Disaster Prediction System Evaluation',
          domain: 'Environment',
          date: '2025-09-26',
          type: 'Security Audit',
          status: 'in-review',
          highlights: {
            accuracy: '88.7%',
            warnings: '45',
            saved: '2K lives'
          },
          size: '2.8 MB',
          createdAt: '2025-09-26T00:00:00Z',
          description: 'Natural disaster forecasting performance and early warning system',
          author: 'Disaster Response',
          downloads: 234,
          views: 890
        }
      ];

      // Calculate statistics
      const healthcareReports = initialReports.filter(r => r.domain === 'Healthcare');
      const agricultureReports = initialReports.filter(r => r.domain === 'Agriculture');
      const environmentReports = initialReports.filter(r => r.domain === 'Environment');

      const initialStats = [
        { 
          label: 'Total Reports', 
          value: initialReports.length.toString(), 
          icon: 'FileText', 
          color: 'blue',
          change: '+12%',
          trend: 'up'
        },
        { 
          label: 'Healthcare', 
          value: healthcareReports.length.toString(), 
          icon: 'Heart', 
          color: 'red',
          change: '+8%',
          trend: 'up'
        },
        { 
          label: 'Agriculture', 
          value: agricultureReports.length.toString(), 
          icon: 'Sprout', 
          color: 'green',
          change: '+15%',
          trend: 'up'
        },
        { 
          label: 'Environment', 
          value: environmentReports.length.toString(), 
          icon: 'Leaf', 
          color: 'teal',
          change: '+10%',
          trend: 'up'
        }
      ];

      const trends = {
        Healthcare: {
          totalDownloads: healthcareReports.reduce((sum, r) => sum + r.downloads, 0),
          totalViews: healthcareReports.reduce((sum, r) => sum + r.views, 0),
          avgAccuracy: '95.1%'
        },
        Agriculture: {
          totalDownloads: agricultureReports.reduce((sum, r) => sum + r.downloads, 0),
          totalViews: agricultureReports.reduce((sum, r) => sum + r.views, 0),
          avgAccuracy: '91.8%'
        },
        Environment: {
          totalDownloads: environmentReports.reduce((sum, r) => sum + r.downloads, 0),
          totalViews: environmentReports.reduce((sum, r) => sum + r.views, 0),
          avgAccuracy: '89.9%'
        }
      };

      setReports(initialReports);
      setSummaryStats(initialStats);
      setDomainTrends(trends);
      setLastUpdate(new Date());
      showNotification('Reports loaded successfully!');

    } catch (error) {
      console.error('Error loading reports:', error);
      showNotification('Error loading reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  // AI Chatbot command processor
  const processChatCommand = (message) => {
    const lower = message.toLowerCase().trim();
    
    if (lower.includes('add report') || lower.includes('create report')) {
      let domain = 'Healthcare';
      if (lower.includes('agriculture') || lower.includes('farm') || lower.includes('crop')) domain = 'Agriculture';
      if (lower.includes('environment') || lower.includes('climate') || lower.includes('pollution')) domain = 'Environment';
      
      const newReport = {
        _id: `new-${Date.now()}`,
        title: `New ${domain} Report - AI Generated`,
        domain: domain,
        date: new Date().toISOString().split('T')[0],
        type: 'AI Generated',
        status: 'draft',
        highlights: {
          status: 'New',
          created: 'Just now',
          progress: '0%'
        },
        size: '1.0 MB',
        createdAt: new Date().toISOString(),
        description: `AI-generated ${domain} report`,
        author: 'AI Assistant',
        downloads: 0,
        views: 0
      };
      setReports([newReport, ...reports]);
      showNotification('New report created successfully!');
      return `✅ Successfully added a new ${domain} report! You can see it at the top of the list.`;
    }
    
    if (lower.includes('show') || lower.includes('filter') || lower.includes('display')) {
      if (lower.includes('healthcare') || lower.includes('health') || lower.includes('medical')) {
        setSelectedFilter('Healthcare');
        const count = reports.filter(r => r.domain === 'Healthcare').length;
        return `🏥 Filtered to show Healthcare reports. Found ${count} report(s).`;
      }
      if (lower.includes('agriculture') || lower.includes('farm') || lower.includes('crop')) {
        setSelectedFilter('Agriculture');
        const count = reports.filter(r => r.domain === 'Agriculture').length;
        return `🌾 Filtered to show Agriculture reports. Found ${count} report(s).`;
      }
      if (lower.includes('environment') || lower.includes('climate') || lower.includes('eco')) {
        setSelectedFilter('Environment');
        const count = reports.filter(r => r.domain === 'Environment').length;
        return `🌿 Filtered to show Environment reports. Found ${count} report(s).`;
      }
      if (lower.includes('all')) {
        setSelectedFilter('all');
        return `📊 Showing all ${reports.length} reports across all domains.`;
      }
    }

    if (lower.includes('status')) {
      if (lower.includes('completed')) {
        setSelectedStatus('completed');
        return '✅ Showing only completed reports.';
      }
      if (lower.includes('review')) {
        setSelectedStatus('in-review');
        return '⏳ Showing reports in review.';
      }
      if (lower.includes('draft')) {
        setSelectedStatus('draft');
        return '📝 Showing draft reports.';
      }
    }
    
    if (lower.includes('search') || lower.includes('find')) {
      const searchMatch = lower.match(/(?:search|find)\s+(?:for\s+)?["']?([^"']+?)["']?(?:\s|$)/);
      if (searchMatch && searchMatch[1]) {
        const term = searchMatch[1].trim();
        setSearchTerm(term);
        const results = reports.filter(r => 
          r.title.toLowerCase().includes(term.toLowerCase()) ||
          r.type.toLowerCase().includes(term.toLowerCase()) ||
          r.domain.toLowerCase().includes(term.toLowerCase())
        );
        return `🔍 Searching for "${term}". Found ${results.length} matching report(s).`;
      }
    }
    
    if (lower.includes('clear') || lower.includes('reset')) {
      setSearchTerm('');
      setSelectedFilter('all');
      setSelectedStatus('all');
      return '🔄 All filters cleared. Showing all reports.';
    }
    
    if (lower.includes('download') || lower.includes('export')) {
      handleExportAllCSV();
      return '📥 Exporting all reports to CSV...';
    }
    
    if (lower.includes('stats') || lower.includes('statistics') || lower.includes('summary')) {
      const healthcare = reports.filter(r => r.domain === 'Healthcare').length;
      const agriculture = reports.filter(r => r.domain === 'Agriculture').length;
      const environment = reports.filter(r => r.domain === 'Environment').length;
      const completed = reports.filter(r => r.status === 'completed').length;
      return `📊 **Report Statistics:**\n• Total Reports: ${reports.length}\n• Healthcare: ${healthcare}\n• Agriculture: ${agriculture}\n• Environment: ${environment}\n• Completed: ${completed}`;
    }
    
    if (lower.includes('trends')) {
      let response = '📈 **Domain Trends:**\n\n';
      Object.entries(domainTrends).forEach(([domain, data]) => {
        response += `**${domain}:**\n• Downloads: ${data.totalDownloads}\n• Views: ${data.totalViews}\n• Avg Accuracy: ${data.avgAccuracy}\n\n`;
      });
      return response;
    }
    
    if (lower.includes('delete') || lower.includes('remove')) {
      const idMatch = lower.match(/(?:report\s+)?["']?([a-zA-Z0-9-]+)["']?/);
      if (idMatch && idMatch[1]) {
        const id = idMatch[1];
        const reportToDelete = reports.find(r => r._id === id || r._id.includes(id));
        if (reportToDelete) {
          setReports(reports.filter(r => r._id !== reportToDelete._id));
          showNotification('Report deleted successfully!');
          return `🗑️ Successfully deleted report: "${reportToDelete.title}"`;
        }
        return `❌ Report not found. Try "delete report [report-id]"`;
      }
    }
    
    if (lower.includes('help') || lower === '?') {
      return `🤖 **AI Assistant Commands:**\n\n**Report Management:**\n• "add [domain] report" - Create new report\n• "delete report [id]" - Remove report\n\n**Filtering:**\n• "show healthcare/agriculture/environment reports"\n• "show completed/draft/review reports"\n• "show all reports"\n\n**Search:**\n• "search [term]"\n• "clear filters"\n\n**Data:**\n• "stats" - View statistics\n• "trends" - View domain trends\n• "download" - Export CSV\n\nType any command to get started!`;
    }
    
    return `❓ I didn't understand that. Try:\n• "add report"\n• "show healthcare reports"\n• "search climate"\n• "stats"\n• "trends"\n• Type "help" for all commands`;
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = { type: 'user', text: chatMessage, timestamp: Date.now() };
    const response = processChatCommand(chatMessage);
    const botMsg = { type: 'bot', text: response, timestamp: Date.now() };

    setChatHistory([...chatHistory, userMsg, botMsg]);
    setChatMessage('');

    // Auto-scroll to bottom
    setTimeout(() => {
      const messagesDiv = document.querySelector('.chat-messages');
      if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 100);
  };

  // Export all reports to CSV
  const handleExportAllCSV = () => {
    try {
      const csvData = [
        ['Admin Reports - All Domains'],
        ['Generated:', new Date().toLocaleString()],
        [],
        ['Report Details'],
        ['ID', 'Title', 'Domain', 'Type', 'Status', 'Date', 'Size', 'Author', 'Downloads', 'Views', 'Description'],
        ...reports.map(r => [
          r._id,
          r.title,
          r.domain,
          r.type,
          r.status,
          r.date,
          r.size,
          r.author,
          r.downloads,
          r.views,
          r.description || ''
        ]),
        [],
        ['STATISTICS BY DOMAIN'],
        ['Domain', 'Count', 'Total Downloads', 'Total Views'],
        ...Object.entries(domainTrends).map(([domain, data]) => [
          domain,
          reports.filter(r => r.domain === domain).length,
          data.totalDownloads,
          data.totalViews
        ]),
        [],
        ['Total Reports', reports.length]
      ];

      const csvContent = csvData.map(row => 
        row.map(cell => String(cell).includes(',') ? `"${cell}"` : cell).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `admin-reports-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification('CSV exported successfully!');
    } catch (error) {
      console.error('CSV Export Error:', error);
      showNotification('Error exporting CSV', 'error');
    }
  };

  // Download individual report
  const handleDownloadReport = (report) => {
    showNotification(`Downloading: ${report.title}`);
    // In production, trigger actual file download from backend
    console.log('Downloading report:', report);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'status-completed',
      'in-review': 'status-review',
      draft: 'status-draft'
    };
    return colors[status] || 'status-default';
  };

  const getDomainColor = (domain) => {
    const colors = {
      Healthcare: 'domain-healthcare',
      Agriculture: 'domain-agriculture',
      Environment: 'domain-environment'
    };
    return colors[domain] || 'domain-default';
  };

  const getIcon = (iconName) => {
    const icons = { FileText, Target, Users, TrendingUp, Heart, Sprout, Leaf };
    return icons[iconName] || FileText;
  };

  const filteredReports = reports.filter(report => {
    const matchesFilter = selectedFilter === 'all' || report.domain === selectedFilter;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (report.author && report.author.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesStatus && matchesSearch;
  });

  // Initial load
  useEffect(() => {
    loadReportsFromAPI();
    const interval = setInterval(loadReportsFromAPI, 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="reports-wrapper">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .reports-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 25%, #dbeafe 50%, #e0e7ff 75%, #f8fafc 100%);
          background-size: 400% 400%;
          animation: gradientShift 20s ease infinite;
          padding: 2rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          position: relative;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .reports-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .notification {
          position: fixed;
          top: 2rem;
          right: 2rem;
          padding: 1rem 1.5rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          animation: slideIn 0.3s ease-out;
          border-left: 4px solid;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .notification.success { border-left-color: #10b981; }
        .notification.error { border-left-color: #ef4444; }

        .notification-text {
          font-weight: 700;
          color: #1e293b;
        }

        .reports-container {
          max-width: 1800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .reports-header {
          margin-bottom: 3rem;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .header-icon {
          padding: 1.25rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: iconPulse 3s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        @keyframes iconPulse {
          0%, 100% { 
            transform: scale(1) rotateY(0deg);
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
          }
          50% { 
            transform: scale(1.05) rotateY(5deg);
            box-shadow: 0 15px 40px rgba(59, 130, 246, 0.5);
          }
        }

        .header-title {
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(135deg, #1e293b, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          line-height: 1.2;
          text-shadow: 0 2px 10px rgba(59, 130, 246, 0.1);
        }

        .header-subtitle {
          font-size: 1.125rem;
          color: #64748b;
          margin: 0.5rem 0 0 0;
          font-weight: 600;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 0.875rem 1.5rem;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          color: #1e293b;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform-style: preserve-3d;
        }

        .action-btn:hover {
          border-color: #3b82f6;
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.2);
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
        }

        .action-btn.primary:hover {
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.4);
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .refresh-icon {
          animation: ${loading ? 'spin 1s linear infinite' : 'none'};
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .last-update {
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 0.5rem;
          font-weight: 600;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.75rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 2px solid #e2e8f0;
          border-radius: 24px;
          padding: 2rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: scaleIn 0.6s ease-out backwards;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85) rotateX(10deg); }
          to { opacity: 1; transform: scale(1) rotateX(0deg); }
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .stat-card:hover {
          border-color: #3b82f6;
          transform: translateY(-10px) scale(1.03) rotateX(2deg);
          box-shadow: 0 20px 50px rgba(59, 130, 246, 0.2);
        }

        .stat-card:hover::before {
          transform: scaleX(1);
        }

        .stat-icon {
          width: 3.5rem;
          height: 3.5rem;
          margin-bottom: 1.25rem;
          padding: 0.875rem;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.15) rotate(8deg);
        }

        .stat-icon.icon-blue { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .stat-icon.icon-red { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
        .stat-icon.icon-green { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .stat-icon.icon-teal { background: rgba(20, 184, 166, 0.15); color: #14b8a6; }

        .stat-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 3rem;
          font-weight: 900;
          color: #1e293b;
          margin: 0;
          line-height: 1;
        }

        .stat-change {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.875rem;
          font-weight: 700;
          margin-top: 0.75rem;
        }

        .stat-change.up { color: #10b981; }
        .stat-change.down { color: #ef4444; }

        .filter-section {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 2px solid #e2e8f0;
          border-radius: 24px;
          padding: 2rem;
          margin-bottom: 2.5rem;
          animation: fadeInUp 0.8s ease-out 0.5s backwards;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .filter-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .search-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 1rem 1.25rem 1rem 3.5rem;
          color: #1e293b;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .search-input::placeholder {
          color: #94a3b8;
        }

        .search-input:focus {
          outline: none;
          background: white;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          transform: translateY(-2px);
        }

        .filter-row {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          flex: 1;
        }

        .filter-btn {
          padding: 0.875rem 1.5rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.875rem;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
          transform: translateY(-2px);
        }

        .filter-btn.inactive {
          background: #f8fafc;
          border-color: #e2e8f0;
          color: #64748b;
        }

        .filter-btn.inactive:hover {
          background: white;
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
          gap: 1.75rem;
          animation: fadeInUp 0.8s ease-out 0.6s backwards;
        }

        .report-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 2px solid #e2e8f0;
          border-radius: 24px;
          padding: 2rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
        }

        .report-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .report-card:hover {
          border-color: #3b82f6;
          transform: translateY(-10px) scale(1.02) rotateX(2deg);
          box-shadow: 0 20px 50px rgba(59, 130, 246, 0.2);
        }

        .report-card:hover::before {
          transform: scaleX(1);
        }

        .report-badges {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .badge-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .domain-badge {
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          animation: scaleIn 0.3s ease-out;
        }

        .domain-healthcare { background: rgba(239, 68, 68, 0.15); color: #dc2626; border: 2px solid #fca5a5; }
        .domain-agriculture { background: rgba(16, 185, 129, 0.15); color: #059669; border: 2px solid #6ee7b7; }
        .domain-environment { background: rgba(20, 184, 166, 0.15); color: #0d9488; border: 2px solid #5eead4; }

        .status-indicator {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          animation: statusPulse 2s ease-in-out infinite;
        }

        @keyframes statusPulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
            box-shadow: 0 0 0 0 currentColor;
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.2);
            box-shadow: 0 0 0 4px currentColor;
          }
        }

        .status-completed { 
          background: #10b981; 
          color: rgba(16, 185, 129, 0.3);
        }
        .status-review { 
          background: #f97316; 
          color: rgba(249, 115, 22, 0.3);
        }
        .status-draft { 
          background: #6b7280; 
          color: rgba(107, 114, 128, 0.3);
        }

        .report-title {
          font-size: 1.375rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 0.75rem 0;
          line-height: 1.4;
        }

        .report-type {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .report-author {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .highlights-section {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 2px solid #e2e8f0;
          border-radius: 18px;
          padding: 1.5rem;
          margin: 1.5rem 0;
        }

        .highlights-title {
          font-size: 0.875rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 1rem 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .highlight-item {
          text-align: center;
          padding: 0.875rem;
          background: white;
          border-radius: 14px;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .highlight-item:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .highlight-label {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: capitalize;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .highlight-value {
          font-size: 1.25rem;
          font-weight: 900;
          color: #3b82f6;
        }

        .report-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.5rem;
          border-top: 2px solid #e2e8f0;
          gap: 1rem;
        }

        .report-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .report-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .report-actions {
          display: flex;
          gap: 0.75rem;
        }

        .report-action-btn {
          padding: 0.75rem;
          border-radius: 14px;
          border: 2px solid #e2e8f0;
          background: white;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .report-action-btn:hover {
          border-color: #3b82f6;
          background: #f0f9ff;
          transform: translateY(-3px) scale(1.05);
        }

        .chatbot-toggle {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 1000;
          animation: float 3s ease-in-out infinite;
        }

        .chatbot-toggle:hover {
          transform: scale(1.15) rotate(10deg);
          box-shadow: 0 15px 40px rgba(59, 130, 246, 0.5);
        }

        .chatbot-panel {
          position: fixed;
          bottom: 7rem;
          right: 2rem;
          width: 460px;
          max-width: calc(100vw - 4rem);
          height: 620px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          z-index: 999;
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .chat-header {
          padding: 1.5rem;
          border-bottom: 2px solid #e2e8f0;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 22px 22px 0 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-title {
          font-size: 1.375rem;
          font-weight: 900;
          color: white;
          margin: 0 0 0.375rem 0;
        }

        .chat-subtitle {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          font-weight: 600;
        }

        .chat-close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 10px;
          padding: 0.625rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .chat-messages {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: #f8fafc;
        }

        .chat-messages::-webkit-scrollbar {
          width: 8px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .chat-message {
          padding: 1rem 1.25rem;
          border-radius: 18px;
          max-width: 85%;
          animation: messageSlide 0.3s ease-out;
          word-wrap: break-word;
          line-height: 1.6;
          white-space: pre-line;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        @keyframes messageSlide {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chat-message.user {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          margin-left: auto;
          border-bottom-right-radius: 6px;
          font-weight: 600;
        }

        .chat-message.bot {
          background: white;
          color: #1e293b;
          margin-right: auto;
          border-bottom-left-radius: 6px;
          border: 2px solid #e2e8f0;
          font-weight: 600;
        }

        .chat-input-form {
          padding: 1rem;
          border-top: 2px solid #e2e8f0;
          display: flex;
          gap: 0.75rem;
          background: white;
          border-radius: 0 0 22px 22px;
        }

        .chat-input {
          flex: 1;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          transition: all 0.3s ease;
        }

        .chat-input::placeholder {
          color: #94a3b8;
        }

        .chat-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .chat-send-btn {
          padding: 0.875rem 1.25rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .chat-send-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        .loading-spinner {
          text-align: center;
          padding: 5rem 2rem;
        }

        .spinner-icon {
          animation: spin 1s linear infinite;
        }

        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          animation: fadeInUp 0.8s ease-out;
        }

        .empty-icon {
          width: 6rem;
          height: 6rem;
          color: #cbd5e1;
          margin: 0 auto 2rem;
        }

        .empty-text {
          font-size: 1.5rem;
          color: #64748b;
          font-weight: 700;
        }

        @media (max-width: 1200px) {
          .reports-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .reports-wrapper {
            padding: 1rem;
          }

          .header-title {
            font-size: 2rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .highlights-grid {
            grid-template-columns: 1fr;
          }

          .chatbot-panel {
            width: calc(100vw - 2rem);
            right: 1rem;
            left: 1rem;
            height: 520px;
          }

          .filter-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .filter-buttons {
            width: 100%;
            flex-direction: column;
          }

          .filter-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      <div className="reports-container">
        {/* Notification */}
        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.type === 'success' ? <Check size={20} color="#10b981" /> : <AlertCircle size={20} color="#ef4444" />}
            <span className="notification-text">{notification.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="reports-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">
                <FileText className="w-10 h-10" style={{ color: 'white' }} />
              </div>
              <div>
                <h1 className="header-title">Impact Reports & Analytics</h1>
                <p className="header-subtitle">Comprehensive multi-domain AI performance assessment</p>
                <p className="last-update">Last updated: {lastUpdate.toLocaleTimeString()}</p>
              </div>
            </div>
            <div className="header-actions">
              <button className="action-btn" onClick={handleExportAllCSV}>
                <Download size={20} />
                Export CSV
              </button>
              <button className="action-btn primary" onClick={loadReportsFromAPI} disabled={loading}>
                <RefreshCw className="refresh-icon" size={20} />
                {loading ? 'Updating...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <Loader2 className="w-14 h-14 mx-auto mb-4 spinner-icon" style={{ color: '#3b82f6' }} />
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#64748b' }}>Loading comprehensive reports...</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="stats-grid">
              {summaryStats.map((stat, idx) => {
                const Icon = getIcon(stat.icon);
                const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
                return (
                  <div key={idx} className="stat-card">
                    <div className="stat-icon icon-{stat.color}">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="stat-content">
                      <div>
                        <p className="stat-label">{stat.label}</p>
                        <p className="stat-value">{stat.value}</p>
                        <div className={`stat-change ${stat.trend}`}>
                          <TrendIcon size={16} />
                          <span>{stat.change}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filters */}
            <div className="filter-section">
              <div className="filter-container">
                <div className="search-wrapper">
                  <Search className="search-icon w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search reports by title, type, domain, or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                
                <div className="filter-row">
                  <span className="filter-label">
                    <Filter size={16} />
                    Domain:
                  </span>
                  <div className="filter-buttons">
                    <button
                      onClick={() => setSelectedFilter('all')}
                      className={`filter-btn ${selectedFilter === 'all' ? 'active' : 'inactive'}`}
                    >
                      All Reports
                    </button>
                    <button
                      onClick={() => setSelectedFilter('Healthcare')}
                      className={`filter-btn ${selectedFilter === 'Healthcare' ? 'active' : 'inactive'}`}
                    >
                      🏥 Healthcare
                    </button>
                    <button
                      onClick={() => setSelectedFilter('Agriculture')}
                      className={`filter-btn ${selectedFilter === 'Agriculture' ? 'active' : 'inactive'}`}
                    >
                      🌾 Agriculture
                    </button>
                    <button
                      onClick={() => setSelectedFilter('Environment')}
                      className={`filter-btn ${selectedFilter === 'Environment' ? 'active' : 'inactive'}`}
                    >
                      🌿 Environment
                    </button>
                  </div>
                </div>

                <div className="filter-row">
                  <span className="filter-label">Status:</span>
                  <div className="filter-buttons">
                    <button
                      onClick={() => setSelectedStatus('all')}
                      className={`filter-btn ${selectedStatus === 'all' ? 'active' : 'inactive'}`}
                    >
                      All Status
                    </button>
                    <button
                      onClick={() => setSelectedStatus('completed')}
                      className={`filter-btn ${selectedStatus === 'completed' ? 'active' : 'inactive'}`}
                    >
                      ✅ Completed
                    </button>
                    <button
                      onClick={() => setSelectedStatus('in-review')}
                      className={`filter-btn ${selectedStatus === 'in-review' ? 'active' : 'inactive'}`}
                    >
                      ⏳ In Review
                    </button>
                    <button
                      onClick={() => setSelectedStatus('draft')}
                      className={`filter-btn ${selectedStatus === 'draft' ? 'active' : 'inactive'}`}
                    >
                      📝 Draft
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reports Grid */}
            {filteredReports.length > 0 ? (
              <div className="reports-grid">
                {filteredReports.map(report => (
                  <div key={report._id} className="report-card">
                    <div className="report-badges">
                      <div className="badge-group">
                        <span className={`domain-badge ${getDomainColor(report.domain)}`}>
                          {report.domain}
                        </span>
                        <div className={`status-indicator ${getStatusColor(report.status)}`}></div>
                      </div>
                    </div>
                    
                    <h3 className="report-title">{report.title}</h3>
                    <p className="report-type">{report.type}</p>
                    <p className="report-author">👤 {report.author}</p>

                    <div className="highlights-section">
                      <h4 className="highlights-title">Key Highlights</h4>
                      <div className="highlights-grid">
                        {Object.entries(report.highlights).map(([key, value]) => (
                          <div key={key} className="highlight-item">
                            <p className="highlight-label">{key}</p>
                            <p className="highlight-value">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="report-footer">
                      <div className="report-meta">
                        <div className="meta-item">
                          <Calendar className="w-4 h-4" />
                          <span>{report.date}</span>
                        </div>
                        <span>•</span>
                        <span>{report.size}</span>
                        <div className="report-stats">
                          <div className="stat-item">
                            <Eye size={14} />
                            {report.views}
                          </div>
                          <div className="stat-item">
                            <Download size={14} />
                            {report.downloads}
                          </div>
                        </div>
                      </div>
                      <div className="report-actions">
                        <button className="report-action-btn" onClick={() => handleDownloadReport(report)} title="View Report">
                          <Eye className="w-5 h-5" style={{ color: '#3b82f6' }} />
                        </button>
                        <button className="report-action-btn" onClick={() => handleDownloadReport(report)} title="Download Report">
                          <Download className="w-5 h-5" style={{ color: '#10b981' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <AlertCircle className="empty-icon" />
                <p className="empty-text">No reports found matching your criteria</p>
                <p style={{ color: '#94a3b8', marginTop: '1rem', fontSize: '1rem', fontWeight: '600' }}>
                  Try adjusting your search or filter settings
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Chatbot */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsChatOpen(!isChatOpen)}
        title="AI Assistant"
      >
        {isChatOpen ? <X className="w-7 h-7" style={{ color: 'white' }} /> : <Send className="w-7 h-7" style={{ color: 'white' }} />}
      </button>

      {isChatOpen && (
        <div className="chatbot-panel">
          <div className="chat-header">
            <div>
              <h3 className="chat-title">🤖 AI Assistant</h3>
              <p className="chat-subtitle">Manage reports with natural language commands</p>
            </div>
            <button className="chat-close-btn" onClick={() => setIsChatOpen(false)}>
              <X className="w-5 h-5" style={{ color: 'white' }} />
            </button>
          </div>
          
          <div className="chat-messages">
            {chatHistory.length === 0 ? (
              <div className="chat-message bot">
                👋 Hi! I'm your AI assistant for managing reports across Healthcare, Agriculture, and Environment domains.

**Quick Commands:**
• "add healthcare report"
• "show agriculture reports"
• "show completed reports"
• "search climate"
• "stats" - View statistics
• "trends" - Domain trends
• "help" - All commands
              </div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div key={`${msg.timestamp}-${idx}`} className={`chat-message ${msg.type}`}>
                  {msg.text}
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleChatSubmit} className="chat-input-form">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type a command..."
              className="chat-input"
              autoFocus
            />
            <button type="submit" className="chat-send-btn">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
