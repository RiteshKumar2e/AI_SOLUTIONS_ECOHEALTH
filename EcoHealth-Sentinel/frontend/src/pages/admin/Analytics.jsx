import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Activity, Zap, Target, RefreshCw, Download, Users, Sparkles, Heart, Sprout, Leaf, AlertTriangle, CheckCircle, TrendingDown, DollarSign, Globe } from 'lucide-react';

export default function Analytics() {
  // Backend API Configuration (commented for now)
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  // State Management with comprehensive multi-domain data
  const [metrics, setMetrics] = useState({
    totalDeployments: 1240,
    overallAccuracy: 92.8,
    totalLivesImpacted: 3.2,
    totalCostSavings: 45.7,
    deploymentsChange: 15.3,
    accuracyChange: 2.8,
    livesChange: 850,
    savingsChange: 22.5
  });

  // Domain-wise detailed metrics
  const [domainMetrics, setDomainMetrics] = useState({
    healthcare: {
      deployments: 450,
      accuracy: 95.2,
      livesImpacted: 1.5,
      costSavings: 22.3,
      activeProjects: 12,
      users: 98760,
      alerts: 18
    },
    agriculture: {
      deployments: 380,
      accuracy: 92.1,
      livesImpacted: 0.8,
      costSavings: 15.2,
      activeProjects: 10,
      users: 65430,
      alerts: 12
    },
    environment: {
      deployments: 410,
      accuracy: 91.2,
      livesImpacted: 0.9,
      costSavings: 8.2,
      activeProjects: 8,
      users: 47210,
      alerts: 23
    }
  });

  const [domainData, setDomainData] = useState([
    { name: 'Healthcare', value: 450, color: '#ef4444', percentage: 36.3 },
    { name: 'Agriculture', value: 380, color: '#10b981', percentage: 30.6 },
    { name: 'Environment', value: 410, color: '#14b8a6', percentage: 33.1 }
  ]);

  const [timelineData, setTimelineData] = useState([
    { month: 'Jan', healthcare: 65, agriculture: 48, environment: 52 },
    { month: 'Feb', healthcare: 72, agriculture: 55, environment: 58 },
    { month: 'Mar', healthcare: 78, agriculture: 62, environment: 65 },
    { month: 'Apr', healthcare: 85, agriculture: 68, environment: 72 },
    { month: 'May', healthcare: 92, agriculture: 75, environment: 78 },
    { month: 'Jun', healthcare: 98, agriculture: 82, environment: 85 }
  ]);

  const [impactMetrics, setImpactMetrics] = useState([
    { category: 'Patient Care', improvement: 95, baseline: 68, domain: 'Healthcare' },
    { category: 'Crop Yield', improvement: 88, baseline: 62, domain: 'Agriculture' },
    { category: 'Carbon Reduction', improvement: 92, baseline: 70, domain: 'Environment' },
    { category: 'Disease Prevention', improvement: 90, baseline: 65, domain: 'Healthcare' },
    { category: 'Water Conservation', improvement: 85, baseline: 58, domain: 'Agriculture' },
    { category: 'Air Quality', improvement: 87, baseline: 61, domain: 'Environment' }
  ]);

  const [aiModelPerformance, setAiModelPerformance] = useState([
    // Healthcare Models
    { model: 'Disease Detection', accuracy: 96, speed: 92, reliability: 98, domain: 'Healthcare' },
    { model: 'Patient Risk Assessment', accuracy: 94, speed: 88, reliability: 96, domain: 'Healthcare' },
    { model: 'Medical Image Analysis', accuracy: 97, speed: 85, reliability: 97, domain: 'Healthcare' },
    
    // Agriculture Models
    { model: 'Crop Disease Prediction', accuracy: 93, speed: 90, reliability: 94, domain: 'Agriculture' },
    { model: 'Yield Optimization', accuracy: 91, speed: 94, reliability: 92, domain: 'Agriculture' },
    { model: 'Pest Detection', accuracy: 90, speed: 93, reliability: 91, domain: 'Agriculture' },
    
    // Environment Models
    { model: 'Climate Prediction', accuracy: 92, speed: 87, reliability: 93, domain: 'Environment' },
    { model: 'Pollution Monitoring', accuracy: 89, speed: 91, reliability: 90, domain: 'Environment' },
    { model: 'Disaster Forecasting', accuracy: 91, speed: 85, reliability: 92, domain: 'Environment' }
  ]);

  const [domainComparison, setDomainComparison] = useState([
    {
      domain: 'Healthcare',
      accuracy: 95.2,
      efficiency: 92,
      impact: 94,
      reliability: 96,
      speed: 88
    },
    {
      domain: 'Agriculture',
      accuracy: 92.1,
      efficiency: 90,
      impact: 87,
      reliability: 91,
      speed: 93
    },
    {
      domain: 'Environment',
      accuracy: 91.2,
      efficiency: 88,
      impact: 89,
      reliability: 90,
      speed: 85
    }
  ]);

  const [userGrowth, setUserGrowth] = useState([
    { month: 'Jan', healthcare: 85000, agriculture: 55000, environment: 38000 },
    { month: 'Feb', healthcare: 88500, agriculture: 57200, environment: 40100 },
    { month: 'Mar', healthcare: 92300, agriculture: 60100, environment: 42500 },
    { month: 'Apr', healthcare: 95100, agriculture: 62800, environment: 44200 },
    { month: 'May', healthcare: 97200, agriculture: 64500, environment: 45800 },
    { month: 'Jun', healthcare: 98760, agriculture: 65430, environment: 47210 }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [dateRange, setDateRange] = useState('30days');
  const [selectedDomain, setSelectedDomain] = useState('all');

  // Fetch comprehensive analytics data
  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // ============ API CALLS (COMMENTED - Uncomment when backend ready) ============
      /*
      const token = localStorage.getItem('adminToken');
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

      const [metricsRes, domainMetricsRes, timelineRes, impactRes, modelsRes, comparisonRes, growthRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/analytics/metrics?range=${dateRange}`, { headers }),
        fetch(`${API_BASE_URL}/admin/analytics/domains`, { headers }),
        fetch(`${API_BASE_URL}/admin/analytics/timeline?range=${dateRange}`, { headers }),
        fetch(`${API_BASE_URL}/admin/analytics/impact`, { headers }),
        fetch(`${API_BASE_URL}/admin/analytics/models`, { headers }),
        fetch(`${API_BASE_URL}/admin/analytics/comparison`, { headers }),
        fetch(`${API_BASE_URL}/admin/analytics/user-growth`, { headers })
      ]);

      const metricsData = await metricsRes.json();
      const domainMetricsData = await domainMetricsRes.json();
      // ... set all data from API
      */

      // Simulate data update
      setMetrics(prev => ({
        ...prev,
        totalDeployments: Math.floor(1200 + Math.random() * 100),
        overallAccuracy: Number((91 + Math.random() * 3).toFixed(1))
      }));

      setLastUpdate(new Date());

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, [fetchAnalyticsData]);

  // CSV Export Function
  const handleExportCSV = () => {
    try {
      const csvData = [
        ['Admin Analytics Report - All Domains'],
        ['Generated:', new Date().toLocaleString()],
        ['Date Range:', dateRange],
        [],
        ['OVERALL METRICS'],
        ['Metric', 'Value', 'Change'],
        ['Total Deployments', metrics.totalDeployments, `${metrics.deploymentsChange}%`],
        ['Overall Accuracy', `${metrics.overallAccuracy}%`, `${metrics.accuracyChange}%`],
        ['Total Lives Impacted', `${metrics.totalLivesImpacted}M`, `${metrics.livesChange}K`],
        ['Total Cost Savings', `$${metrics.totalCostSavings}M`, `${metrics.savingsChange}%`],
        [],
        ['DOMAIN-WISE METRICS'],
        ['Domain', 'Deployments', 'Accuracy', 'Lives Impacted', 'Cost Savings', 'Active Projects', 'Users', 'Alerts'],
        ['Healthcare', domainMetrics.healthcare.deployments, `${domainMetrics.healthcare.accuracy}%`, `${domainMetrics.healthcare.livesImpacted}M`, `$${domainMetrics.healthcare.costSavings}M`, domainMetrics.healthcare.activeProjects, domainMetrics.healthcare.users, domainMetrics.healthcare.alerts],
        ['Agriculture', domainMetrics.agriculture.deployments, `${domainMetrics.agriculture.accuracy}%`, `${domainMetrics.agriculture.livesImpacted}M`, `$${domainMetrics.agriculture.costSavings}M`, domainMetrics.agriculture.activeProjects, domainMetrics.agriculture.users, domainMetrics.agriculture.alerts],
        ['Environment', domainMetrics.environment.deployments, `${domainMetrics.environment.accuracy}%`, `${domainMetrics.environment.livesImpacted}M`, `$${domainMetrics.environment.costSavings}M`, domainMetrics.environment.activeProjects, domainMetrics.environment.users, domainMetrics.environment.alerts],
        [],
        ['AI MODEL PERFORMANCE'],
        ['Model', 'Domain', 'Accuracy', 'Speed', 'Reliability'],
        ...aiModelPerformance.map(m => [m.model, m.domain, `${m.accuracy}%`, `${m.speed}%`, `${m.reliability}%`])
      ];

      const csvContent = csvData.map(row => 
        row.map(cell => String(cell).includes(',') ? `"${cell}"` : cell).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `admin-analytics-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('✅ CSV downloaded successfully!');
    } catch (error) {
      console.error('CSV Export Error:', error);
      alert('❌ Error downloading CSV');
    }
  };

  // PDF Export Function
  const handleExportPDF = () => {
    try {
      const pdfHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Admin Analytics Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
    h1 { color: #3b82f6; font-size: 36px; margin-bottom: 10px; border-bottom: 4px solid #3b82f6; padding-bottom: 10px; }
    h2 { color: #64748b; font-size: 24px; margin: 30px 0 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
    .meta { color: #64748b; margin-bottom: 30px; font-size: 14px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
    .metric-box { padding: 20px; background: linear-gradient(135deg, #f8fafc, #e0e7ff); border: 2px solid #e2e8f0; border-radius: 12px; text-align: center; }
    .metric-label { font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 10px; font-weight: bold; }
    .metric-value { font-size: 32px; font-weight: bold; color: #1e293b; margin-bottom: 5px; }
    .metric-change { font-size: 14px; color: #10b981; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #e2e8f0; padding: 14px; text-align: left; }
    th { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; font-weight: bold; font-size: 13px; }
    tr:nth-child(even) { background-color: #f8fafc; }
    .domain-label { font-weight: bold; padding: 4px 10px; border-radius: 6px; display: inline-block; font-size: 12px; }
    .healthcare { background: #fee2e2; color: #dc2626; }
    .agriculture { background: #d1fae5; color: #059669; }
    .environment { background: #ccfbf1; color: #0d9488; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 3px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <h1>🎯 Admin Analytics Dashboard - Comprehensive Report</h1>
  <div class="meta">
    <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
    <strong>Date Range:</strong> ${dateRange}<br>
    <strong>Report Type:</strong> Multi-Domain Analysis (Healthcare, Agriculture, Environment)
  </div>

  <h2>📊 Overall Performance Metrics</h2>
  <div class="metrics-grid">
    <div class="metric-box">
      <div class="metric-label">Total Deployments</div>
      <div class="metric-value">${metrics.totalDeployments}</div>
      <div class="metric-change">↑ ${metrics.deploymentsChange}%</div>
    </div>
    <div class="metric-box">
      <div class="metric-label">Overall Accuracy</div>
      <div class="metric-value">${metrics.overallAccuracy}%</div>
      <div class="metric-change">↑ ${metrics.accuracyChange}%</div>
    </div>
    <div class="metric-box">
      <div class="metric-label">Lives Impacted</div>
      <div class="metric-value">${metrics.totalLivesImpacted}M</div>
      <div class="metric-change">↑ ${metrics.livesChange}K</div>
    </div>
    <div class="metric-box">
      <div class="metric-label">Cost Savings</div>
      <div class="metric-value">$${metrics.totalCostSavings}M</div>
      <div class="metric-change">↑ ${metrics.savingsChange}%</div>
    </div>
  </div>

  <h2>🏥 Healthcare Domain Metrics</h2>
  <table>
    <tr>
      <th>Metric</th>
      <th>Value</th>
    </tr>
    <tr>
      <td><strong>Deployments</strong></td>
      <td>${domainMetrics.healthcare.deployments}</td>
    </tr>
    <tr>
      <td><strong>Accuracy</strong></td>
      <td>${domainMetrics.healthcare.accuracy}%</td>
    </tr>
    <tr>
      <td><strong>Lives Impacted</strong></td>
      <td>${domainMetrics.healthcare.livesImpacted}M</td>
    </tr>
    <tr>
      <td><strong>Cost Savings</strong></td>
      <td>$${domainMetrics.healthcare.costSavings}M</td>
    </tr>
    <tr>
      <td><strong>Active Users</strong></td>
      <td>${domainMetrics.healthcare.users.toLocaleString()}</td>
    </tr>
  </table>

  <h2>🌾 Agriculture Domain Metrics</h2>
  <table>
    <tr>
      <th>Metric</th>
      <th>Value</th>
    </tr>
    <tr>
      <td><strong>Deployments</strong></td>
      <td>${domainMetrics.agriculture.deployments}</td>
    </tr>
    <tr>
      <td><strong>Accuracy</strong></td>
      <td>${domainMetrics.agriculture.accuracy}%</td>
    </tr>
    <tr>
      <td><strong>Lives Impacted</strong></td>
      <td>${domainMetrics.agriculture.livesImpacted}M</td>
    </tr>
    <tr>
      <td><strong>Cost Savings</strong></td>
      <td>$${domainMetrics.agriculture.costSavings}M</td>
    </tr>
    <tr>
      <td><strong>Active Users</strong></td>
      <td>${domainMetrics.agriculture.users.toLocaleString()}</td>
    </tr>
  </table>

  <h2>🌿 Environment Domain Metrics</h2>
  <table>
    <tr>
      <th>Metric</th>
      <th>Value</th>
    </tr>
    <tr>
      <td><strong>Deployments</strong></td>
      <td>${domainMetrics.environment.deployments}</td>
    </tr>
    <tr>
      <td><strong>Accuracy</strong></td>
      <td>${domainMetrics.environment.accuracy}%</td>
    </tr>
    <tr>
      <td><strong>Lives Impacted</strong></td>
      <td>${domainMetrics.environment.livesImpacted}M</td>
    </tr>
    <tr>
      <td><strong>Cost Savings</strong></td>
      <td>$${domainMetrics.environment.costSavings}M</td>
    </tr>
    <tr>
      <td><strong>Active Users</strong></td>
      <td>${domainMetrics.environment.users.toLocaleString()}</td>
    </tr>
  </table>

  <h2>🤖 AI Model Performance - All Domains</h2>
  <table>
    <thead>
      <tr>
        <th>Model Name</th>
        <th>Domain</th>
        <th>Accuracy</th>
        <th>Speed</th>
        <th>Reliability</th>
      </tr>
    </thead>
    <tbody>
      ${aiModelPerformance.map(m => `
        <tr>
          <td>${m.model}</td>
          <td><span class="domain-label ${m.domain.toLowerCase()}">${m.domain}</span></td>
          <td><strong>${m.accuracy}%</strong></td>
          <td>${m.speed}%</td>
          <td>${m.reliability}%</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p><strong>AI Platform Admin Analytics</strong> - Confidential Multi-Domain Report</p>
    <p>Healthcare • Agriculture • Environment</p>
    <p style="margin-top: 10px;">Generated: ${new Date().toLocaleString()}</p>
    <p class="no-print" style="margin-top: 20px;">Press <strong>Ctrl+P</strong> (Windows) or <strong>Cmd+P</strong> (Mac) → Select "Save as PDF"</p>
  </div>

  <script>
    window.onload = function() {
      setTimeout(() => window.print(), 500);
    };
  </script>
</body>
</html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(pdfHTML);
      printWindow.document.close();

      alert('✅ PDF ready! Use Ctrl+P and select "Save as PDF"');
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('❌ Error generating PDF');
    }
  };

  return (
    <div className="analytics-wrapper">
      <style>{`
        .analytics-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 25%, #dbeafe 50%, #e0e7ff 75%, #f8fafc 100%);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          padding: 2rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85) rotateX(10deg); }
          to { opacity: 1; transform: scale(1) rotateX(0deg); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px) rotateY(-5deg); }
          to { opacity: 1; transform: translateX(0) rotateY(0deg); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px) rotateY(5deg); }
          to { opacity: 1; transform: translateX(0) rotateY(0deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.9; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(2deg); }
          66% { transform: translateY(-6px) rotate(-2deg); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.4); }
        }

        .dashboard-container {
          max-width: 1800px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 2.5rem;
          animation: fadeInUp 0.6s ease-out;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 1.5rem;
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
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
          animation: float 6s ease-in-out infinite, glow 3s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        .header-title {
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(135deg, #1e293b, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          line-height: 1.2;
          text-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
        }

        .header-subtitle {
          font-size: 1.125rem;
          color: #64748b;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
          box-shadow: 0 0 10px #10b981;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .action-button {
          padding: 1rem 1.75rem;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          color: #1e293b;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transform-style: preserve-3d;
        }

        .action-button:hover {
          background: #f8fafc;
          border-color: #3b82f6;
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.25);
        }

        .action-button.primary {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
        }

        .action-button.primary:hover {
          box-shadow: 0 12px 35px rgba(59, 130, 246, 0.5);
          transform: translateY(-4px) scale(1.05);
        }

        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .refresh-icon {
          animation: ${isLoading ? 'spin 1s linear infinite' : 'none'};
        }

        .last-update {
          font-size: 0.9rem;
          color: #64748b;
          margin-top: 0.5rem;
          font-weight: 600;
        }

        .filter-select {
          padding: 0.875rem 1.25rem;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          color: #1e293b;
          font-weight: 700;
          cursor: pointer;
          outline: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .filter-select:hover {
          border-color: #3b82f6;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.75rem;
          margin-bottom: 3rem;
        }

        .metric-card {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 24px;
          padding: 2rem;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: scaleIn 0.7s ease-out backwards;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          transform-style: preserve-3d;
          position: relative;
          overflow: hidden;
        }

        .metric-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transform: scaleX(0);
          transition: transform 0.5s ease;
        }

        .metric-card:hover::before {
          transform: scaleX(1);
        }

        .metric-card:nth-child(1) { animation-delay: 0.1s; }
        .metric-card:nth-child(2) { animation-delay: 0.2s; }
        .metric-card:nth-child(3) { animation-delay: 0.3s; }
        .metric-card:nth-child(4) { animation-delay: 0.4s; }

        .metric-card:hover {
          border-color: #3b82f6;
          transform: translateY(-10px) scale(1.03) rotateX(2deg);
          box-shadow: 0 20px 50px rgba(59, 130, 246, 0.25);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .metric-label {
          font-size: 0.875rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-icon {
          padding: 0.875rem;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: float 4s ease-in-out infinite;
        }

        .metric-icon.blue { background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.25)); }
        .metric-icon.yellow { background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.25)); }
        .metric-icon.green { background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.25)); }
        .metric-icon.purple { background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.25)); }

        .metric-value {
          font-size: 3rem;
          font-weight: 900;
          color: #1e293b;
          margin: 0 0 1rem 0;
          line-height: 1;
        }

        .metric-change {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
        }

        .metric-change-value {
          color: #10b981;
          font-weight: 800;
        }

        .metric-change-label {
          color: #64748b;
          font-weight: 600;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .chart-card {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 24px;
          padding: 2.5rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          transform-style: preserve-3d;
        }

        .chart-card:hover {
          border-color: #3b82f6;
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(59, 130, 246, 0.2);
        }

        .chart-card:nth-child(1) { animation: slideInLeft 0.9s ease-out 0.5s backwards; }
        .chart-card:nth-child(2) { animation: slideInRight 0.9s ease-out 0.6s backwards; }
        .chart-card:nth-child(3) { animation: slideInLeft 0.9s ease-out 0.7s backwards; }
        .chart-card:nth-child(4) { animation: slideInRight 0.9s ease-out 0.8s backwards; }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .chart-title {
          font-size: 1.75rem;
          font-weight: 900;
          color: #1e293b;
          margin: 0;
        }

        .chart-badge {
          width: 50px;
          height: 5px;
          border-radius: 3px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          animation: pulse 3s ease-in-out infinite;
        }

        .domain-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.75rem;
          margin-bottom: 2rem;
        }

        .domain-card {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 24px;
          padding: 2rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          animation: scaleIn 0.7s ease-out backwards;
        }

        .domain-card:nth-child(1) { animation-delay: 0.2s; }
        .domain-card:nth-child(2) { animation-delay: 0.3s; }
        .domain-card:nth-child(3) { animation-delay: 0.4s; }

        .domain-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
        }

        .domain-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 3px solid;
        }

        .domain-icon {
          padding: 1rem;
          border-radius: 16px;
          animation: float 5s ease-in-out infinite;
        }

        .domain-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
        }

        .domain-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .domain-stat-label {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 600;
        }

        .domain-stat-value {
          font-size: 1.125rem;
          font-weight: 800;
          color: #1e293b;
        }

        @media (max-width: 1024px) {
          .charts-grid, .domain-metrics-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .header-title { font-size: 2rem; }
          .metrics-grid { grid-template-columns: 1fr; }
          .header-content { flex-direction: column; align-items: flex-start; }
          .metric-value { font-size: 2.5rem; }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">
                <Sparkles className="w-14 h-14 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="header-title">Admin Analytics Dashboard</h1>
                <p className="header-subtitle">
                  <span className="status-dot"></span>
                  Multi-Domain AI Performance Insights
                </p>
                <p className="last-update">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="header-actions">
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="filter-select"
              >
                <option value="24hours">Last 24 Hours</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
              
              <button className="action-button" onClick={handleExportCSV}>
                <Download className="w-5 h-5" />
                Export CSV
              </button>
              
              <button className="action-button" onClick={handleExportPDF}>
                <Download className="w-5 h-5" />
                Export PDF
              </button>
              
              <button 
                className="action-button primary" 
                onClick={fetchAnalyticsData}
                disabled={isLoading}
              >
                <RefreshCw className={`w-5 h-5 refresh-icon`} />
                {isLoading ? 'Updating...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Overall Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Total Deployments</span>
              <div className="metric-icon blue">
                <Target className="w-7 h-7 text-blue-600" strokeWidth={2.5} />
              </div>
            </div>
            <p className="metric-value">{metrics.totalDeployments.toLocaleString()}</p>
            <div className="metric-change">
              <span className="metric-change-value">↑ {metrics.deploymentsChange}%</span>
              <span className="metric-change-label">across all domains</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Overall Accuracy</span>
              <div className="metric-icon yellow">
                <Zap className="w-7 h-7 text-yellow-600" strokeWidth={2.5} />
              </div>
            </div>
            <p className="metric-value">{metrics.overallAccuracy}%</p>
            <div className="metric-change">
              <span className="metric-change-value">↑ {metrics.accuracyChange}%</span>
              <span className="metric-change-label">improvement</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Lives Impacted</span>
              <div className="metric-icon green">
                <TrendingUp className="w-7 h-7 text-green-600" strokeWidth={2.5} />
              </div>
            </div>
            <p className="metric-value">{metrics.totalLivesImpacted}M</p>
            <div className="metric-change">
              <span className="metric-change-value">↑ {metrics.livesChange}K</span>
              <span className="metric-change-label">this quarter</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Total Savings</span>
              <div className="metric-icon purple">
                <DollarSign className="w-7 h-7 text-purple-600" strokeWidth={2.5} />
              </div>
            </div>
            <p className="metric-value">${metrics.totalCostSavings}M</p>
            <div className="metric-change">
              <span className="metric-change-value">↑ {metrics.savingsChange}%</span>
              <span className="metric-change-label">increase</span>
            </div>
          </div>
        </div>

        {/* Domain-wise Metrics */}
        <h2 style={{fontSize: '2rem', fontWeight: '900', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
          <Globe size={32} />
          Domain-wise Performance
        </h2>
        <div className="domain-metrics-grid">
          {/* Healthcare Domain */}
          <div className="domain-card">
            <div className="domain-header" style={{borderColor: '#ef4444'}}>
              <div className="domain-icon" style={{background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.25))'}}>
                <Heart className="w-8 h-8 text-red-500" strokeWidth={2.5} />
              </div>
              <h3 className="domain-title" style={{color: '#ef4444'}}>Healthcare</h3>
            </div>
            <div className="domain-stat">
              <span className="domain-stat-label">Deployments</span>
              <span className="domain-stat-value">{domainMetrics.healthcare.deployments}</span>
            </div>
            <div className="domain-stat">
              <span className="domain-stat-label">Accuracy</span>
              <span className="domain-stat-value" style={{color: '#10b981'}}>{domainMetrics.healthcare.accuracy}%</span>
            </div>
            <div className="domain-stat">
              <span className="domain-stat-label">Lives Impacted</span>
              <span className="domain-stat-value">{domainMetrics.healthcare.livesImpacted}M</span>
            </div>
            <div className="domain-stat">
              <span className="domain-stat-label">Cost Savings</span>
              <span className="domain-stat-value">${domainMetrics.healthcare.costSavings}M</span>
            </div>
            <div className="domain-stat" style={{borderBottom: 'none'}}>
              <span className="domain-stat-label">Active Users</span>
              <span className="domain-stat-value">{domainMetrics.healthcare.users.toLocaleString()}</span>
            </div>
          </div>

          {/* Agriculture Domain */}
          <div className="domain-card">
            <div className="domain-header" style={{borderColor: '#10b981'}}>
              <div className="domain-icon" style={{background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.25))'}}>
                <Sprout className="w-8 h-8 text-green-500" strokeWidth={2.5} />
              </div>
              <h3 className="domain-title" style={{color: '#10b981'}}>Agriculture</h3>
            </div>
            <div className="domain-stat">
              <span className="domain-stat-label">Deployments</span>
              <span className="domain-stat-value">{domainMetrics.agriculture.deployments}</span>
            </div>
            <div className="domain-stat">
              <span className="domain-stat-label">Accuracy</span>
              <span className="domain-stat-value" style={{color: '#10b981'}}>{domainMetrics.agriculture.accuracy}%</span>
            </div>
            <div className="domain-stat">
              <span className="domain-stat-label">Lives Impacted</span>
              <span className="domain-stat-value">{domainMetrics.agriculture.livesImpacted}M</span>
            </div>
            <div className="domain-stat">
              <span className="domain-stat-label">Cost Savings</span>
              <span className="domain-stat-value">${domainMetrics.agriculture.costSavings}M</span>
            </div>
            <div className="domain-stat" style={{borderBottom: 'none'}}>
              <span className="domain-stat-label">Active Users</span>
              <span className="domain-stat-value">{domainMetrics.agriculture.users.toLocaleString()}</span>
            </div>
          </div>

          {/* Environment Domain */}
          <div className="domain-card">
            <div className="domain-header" style={{borderColor: '#14b8a6'}}>
              <div className="domain-icon" style={{background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(20, 184, 166, 0.25))'}}>
                <Leaf className="w-8 h-8 text-teal-500" strokeWidth={2.5} />
              </div>
              <h3 className="domain-title" style={{color: '#14b8a6'}}>Environment</h3>
            </div>
            <div className="domain-stat">
              <span className="domain-stat-label">Deployments</span>
              <span className="domain-stat-value">{domainMetrics.environment.deployments}</span>
            </div>
            <div className="domain-stat">
              <span className="domain-stat-label">Accuracy</span>
              <span className="domain-stat-value" style={{color: '#10b981'}}>{domainMetrics.environment.accuracy}%</span>
            </div>
            <div className="domain-stat">
              <span className="domain-stat-label">Lives Impacted</span>
              <span className="domain-stat-value">{domainMetrics.environment.livesImpacted}M</span>
            </div>
            <div className="domain-stat">
              <span className="domain-stat-label">Cost Savings</span>
              <span className="domain-stat-value">${domainMetrics.environment.costSavings}M</span>
            </div>
            <div className="domain-stat" style={{borderBottom: 'none'}}>
              <span className="domain-stat-label">Active Users</span>
              <span className="domain-stat-value">{domainMetrics.environment.users.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Domain Distribution Pie Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h2 className="chart-title">Domain Distribution</h2>
              <div className="chart-badge"></div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={domainData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}\n${percentage}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1000}
                >
                  {domainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  fontWeight: 'bold'
                }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Timeline Trends */}
          <div className="chart-card">
            <div className="chart-header">
              <h2 className="chart-title">Monthly Growth Trends</h2>
              <div className="chart-badge"></div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="healthcareGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="agricultureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="environmentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '13px', fontWeight: '700' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '13px', fontWeight: '700' }} />
                <Tooltip contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  fontWeight: 'bold'
                }} />
                <Legend wrapperStyle={{ fontSize: '13px', fontWeight: '700' }} />
                <Area type="monotone" dataKey="healthcare" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#healthcareGradient)" />
                <Area type="monotone" dataKey="agriculture" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#agricultureGradient)" />
                <Area type="monotone" dataKey="environment" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#environmentGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Impact Metrics Bar Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h2 className="chart-title">Social Impact Metrics</h2>
              <div className="chart-badge"></div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={impactMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" stroke="#64748b" angle={-15} textAnchor="end" height={100} style={{ fontSize: '11px', fontWeight: '700' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '13px', fontWeight: '700' }} />
                <Tooltip contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  fontWeight: 'bold'
                }} />
                <Legend wrapperStyle={{ fontSize: '13px', fontWeight: '700' }} />
                <Bar dataKey="baseline" fill="#cbd5e1" name="Baseline" radius={[10, 10, 0, 0]} animationDuration={1200} />
                <Bar dataKey="improvement" fill="#10b981" name="Current" radius={[10, 10, 0, 0]} animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Domain Comparison Radar */}
          <div className="chart-card">
            <div className="chart-header">
              <h2 className="chart-title">Multi-Domain Comparison</h2>
              <div className="chart-badge"></div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={domainComparison}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="domain" style={{ fontSize: '13px', fontWeight: '700' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Accuracy" dataKey="accuracy" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} strokeWidth={3} />
                <Radar name="Efficiency" dataKey="efficiency" stroke="#10b981" fill="#10b981" fillOpacity={0.3} strokeWidth={3} />
                <Radar name="Impact" dataKey="impact" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} strokeWidth={3} />
                <Legend wrapperStyle={{ fontSize: '13px', fontWeight: '700' }} />
                <Tooltip contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontWeight: 'bold'
                }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Model Performance */}
        <h2 style={{fontSize: '2rem', fontWeight: '900', color: '#1e293b', marginBottom: '1.5rem', marginTop: '2rem'}}>
          🤖 AI Model Performance - All Domains
        </h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem'}}>
          {aiModelPerformance.map((model, idx) => {
            const domainColors = {
              Healthcare: { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444' },
              Agriculture: { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981' },
              Environment: { bg: 'rgba(20, 184, 166, 0.1)', border: '#14b8a6' }
            };
            const colors = domainColors[model.domain];
            
            return (
              <div key={idx} style={{
                background: '#ffffff',
                border: `2px solid ${colors.border}`,
                borderRadius: '20px',
                padding: '1.75rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = `0 12px 30px ${colors.border}40`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem'}}>
                  <h3 style={{fontSize: '1.125rem', fontWeight: '800', color: '#1e293b', margin: 0}}>{model.model}</h3>
                  <span style={{
                    padding: '0.375rem 0.875rem',
                    background: colors.bg,
                    color: colors.border,
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: '700'
                  }}>{model.domain}</span>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <span style={{fontSize: '0.875rem', color: '#64748b', fontWeight: '700'}}>Accuracy</span>
                      <strong style={{color: '#1e293b'}}>{model.accuracy}%</strong>
                    </div>
                    <div style={{width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden'}}>
                      <div style={{width: `${model.accuracy}%`, height: '100%', background: `linear-gradient(90deg, ${colors.border}, ${colors.border}dd)`, borderRadius: '5px', transition: 'width 1s ease'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <span style={{fontSize: '0.875rem', color: '#64748b', fontWeight: '700'}}>Speed</span>
                      <strong style={{color: '#1e293b'}}>{model.speed}%</strong>
                    </div>
                    <div style={{width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden'}}>
                      <div style={{width: `${model.speed}%`, height: '100%', background: '#10b981', borderRadius: '5px', transition: 'width 1s ease'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <span style={{fontSize: '0.875rem', color: '#64748b', fontWeight: '700'}}>Reliability</span>
                      <strong style={{color: '#1e293b'}}>{model.reliability}%</strong>
                    </div>
                    <div style={{width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden'}}>
                      <div style={{width: `${model.reliability}%`, height: '100%', background: '#8b5cf6', borderRadius: '5px', transition: 'width 1s ease'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
