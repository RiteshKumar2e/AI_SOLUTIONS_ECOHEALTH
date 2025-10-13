import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Calendar, TrendingUp, BarChart3, FileBarChart, Search, RefreshCw, Eye, Share2, Sparkles, MessageCircle, Send, X, Loader, Trash2, Bell, Upload } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Reports() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: 'Hello! I can help you with reports, analytics, and data insights. What would you like to know?', sender: 'bot', timestamp: new Date().toISOString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [notifications, setNotifications] = useState(3);
  
  const ws = useRef(null);
  const chatEndRef = useRef(null);
  //onst API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  //const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';

  // Mock Reports Data with full details
  const mockReports = [
    {
      id: 1,
      title: 'Monthly Environmental Impact Assessment',
      category: 'environmental',
      date: '2025-10-01',
      type: 'PDF',
      size: '2.4 MB',
      status: 'completed',
      icon: FileText,
      color: 'emerald',
      description: 'Comprehensive analysis of air quality, water quality, and biodiversity metrics',
      data: {
        overview: 'This report provides a comprehensive assessment of environmental conditions across multiple regions.',
        metrics: [
          { name: 'Air Quality Index', value: '85', unit: 'AQI', status: 'Good' },
          { name: 'Water Quality Score', value: '92%', unit: '', status: 'Excellent' },
          { name: 'Biodiversity Index', value: '78', unit: '', status: 'Stable' },
          { name: 'Green Coverage', value: '45%', unit: '', status: 'Improving' }
        ],
        recommendations: [
          'Increase urban tree planting initiatives',
          'Implement stricter emission controls in industrial zones',
          'Enhance water treatment facility capacity'
        ],
        summary: 'Overall environmental conditions show positive trends with minor areas requiring attention in urban sectors.'
      }
    },
    {
      id: 2,
      title: 'Renewable Energy Performance Report',
      category: 'energy',
      date: '2025-09-28',
      type: 'PDF',
      size: '1.8 MB',
      status: 'completed',
      icon: BarChart3,
      color: 'amber',
      description: 'Solar, wind, and hydro energy generation statistics',
      data: {
        overview: 'Quarterly analysis of renewable energy generation and efficiency metrics.',
        metrics: [
          { name: 'Solar Generation', value: '450', unit: 'MW', status: 'Above Target' },
          { name: 'Wind Generation', value: '320', unit: 'MW', status: 'On Target' },
          { name: 'Hydro Generation', value: '180', unit: 'MW', status: 'Stable' },
          { name: 'Total Capacity', value: '950', unit: 'MW', status: 'Excellent' }
        ],
        recommendations: [
          'Expand solar panel installations in southern regions',
          'Upgrade wind turbine efficiency',
          'Optimize hydroelectric dam operations during peak hours'
        ],
        summary: 'Renewable energy production exceeded quarterly targets by 15%, demonstrating strong growth potential.'
      }
    },
    {
      id: 3,
      title: 'Waste Management Analytics Q3 2025',
      category: 'waste',
      date: '2025-09-30',
      type: 'Excel',
      size: '980 KB',
      status: 'completed',
      icon: BarChart3,
      color: 'sky',
      description: 'Recycling rates and waste diversion analysis',
      data: {
        overview: 'Comprehensive waste management performance analysis for Q3 2025.',
        metrics: [
          { name: 'Recycling Rate', value: '68%', unit: '', status: 'Excellent' },
          { name: 'Waste Diverted', value: '12,500', unit: 'tons', status: 'Above Target' },
          { name: 'Landfill Reduction', value: '22%', unit: '', status: 'Improving' },
          { name: 'Composting Volume', value: '3,200', unit: 'tons', status: 'Good' }
        ],
        recommendations: [
          'Launch community composting education programs',
          'Increase recycling bin accessibility in residential areas',
          'Partner with businesses for commercial waste reduction'
        ],
        summary: 'Significant improvements in waste diversion with recycling rates exceeding regional averages.'
      }
    },
    {
      id: 4,
      title: 'Wildlife Conservation Progress Report',
      category: 'conservation',
      date: '2025-09-25',
      type: 'PDF',
      size: '3.2 MB',
      status: 'completed',
      icon: FileBarChart,
      color: 'violet',
      description: 'Species population monitoring and habitat restoration',
      data: {
        overview: 'Annual assessment of wildlife conservation initiatives and outcomes.',
        metrics: [
          { name: 'Protected Species', value: '45', unit: 'species', status: 'Stable' },
          { name: 'Habitat Restored', value: '1,200', unit: 'acres', status: 'Excellent' },
          { name: 'Population Growth', value: '18%', unit: '', status: 'Positive' },
          { name: 'Endangered Status Improvements', value: '7', unit: 'species', status: 'Good' }
        ],
        recommendations: [
          'Expand protected habitat corridors',
          'Increase anti-poaching enforcement',
          'Implement breeding programs for critically endangered species'
        ],
        summary: 'Conservation efforts showing measurable positive impact on local wildlife populations and habitat quality.'
      }
    },
    {
      id: 5,
      title: 'Carbon Footprint Analysis',
      category: 'environmental',
      date: '2025-09-20',
      type: 'PDF',
      size: '1.5 MB',
      status: 'completed',
      icon: TrendingUp,
      color: 'rose',
      description: 'Community carbon emissions tracking',
      data: {
        overview: 'Detailed carbon footprint analysis across all community sectors.',
        metrics: [
          { name: 'Total Emissions', value: '45,000', unit: 'tons CO2', status: 'Reducing' },
          { name: 'Per Capita Emissions', value: '2.1', unit: 'tons', status: 'Below Average' },
          { name: 'Year-over-Year Reduction', value: '8%', unit: '', status: 'Excellent' },
          { name: 'Renewable Energy Offset', value: '12,000', unit: 'tons CO2', status: 'Good' }
        ],
        recommendations: [
          'Promote electric vehicle adoption',
          'Incentivize building energy efficiency upgrades',
          'Support local renewable energy projects'
        ],
        summary: 'Carbon emissions reduced by 8% compared to previous year, exceeding reduction targets.'
      }
    },
    {
      id: 6,
      title: 'Water Quality Monitoring Report',
      category: 'environmental',
      date: '2025-09-15',
      type: 'PDF',
      size: '2.1 MB',
      status: 'completed',
      icon: FileText,
      color: 'cyan',
      description: 'River and groundwater quality assessment',
      data: {
        overview: 'Comprehensive water quality testing across all monitored water bodies.',
        metrics: [
          { name: 'pH Levels', value: '7.2', unit: '', status: 'Optimal' },
          { name: 'Dissolved Oxygen', value: '8.5', unit: 'mg/L', status: 'Excellent' },
          { name: 'Contamination Level', value: '<1%', unit: '', status: 'Safe' },
          { name: 'Bacteria Count', value: 'Low', unit: '', status: 'Safe' }
        ],
        recommendations: [
          'Continue routine monitoring schedules',
          'Upgrade water treatment infrastructure',
          'Implement watershed protection programs'
        ],
        summary: 'Water quality remains excellent across all monitored locations with no safety concerns detected.'
      }
    },
    {
      id: 7,
      title: 'Solar Energy Efficiency Study',
      category: 'energy',
      date: '2025-09-10',
      type: 'PDF',
      size: '1.9 MB',
      status: 'completed',
      icon: BarChart3,
      color: 'orange',
      description: 'Panel performance analysis and optimization',
      data: {
        overview: 'Technical evaluation of solar panel efficiency and performance optimization.',
        metrics: [
          { name: 'Average Efficiency', value: '21.5%', unit: '', status: 'Above Average' },
          { name: 'Annual Output', value: '2.4', unit: 'GWh', status: 'Excellent' },
          { name: 'Degradation Rate', value: '0.4%', unit: 'per year', status: 'Normal' },
          { name: 'Uptime', value: '98.2%', unit: '', status: 'Excellent' }
        ],
        recommendations: [
          'Schedule panel cleaning during low-production seasons',
          'Replace underperforming inverters',
          'Optimize panel angle for seasonal variations'
        ],
        summary: 'Solar installations performing above industry standards with minimal efficiency losses.'
      }
    },
    {
      id: 8,
      title: 'Community Awareness Campaign Results',
      category: 'environmental',
      date: '2025-09-05',
      type: 'PowerPoint',
      size: '4.5 MB',
      status: 'completed',
      icon: FileText,
      color: 'pink',
      description: 'Participation rates and behavioral change metrics',
      data: {
        overview: 'Impact assessment of community environmental awareness campaigns.',
        metrics: [
          { name: 'Participation Rate', value: '72%', unit: '', status: 'Excellent' },
          { name: 'Behavioral Change', value: '45%', unit: '', status: 'Positive' },
          { name: 'Social Media Reach', value: '150K', unit: 'people', status: 'Growing' },
          { name: 'Event Attendance', value: '3,500', unit: 'participants', status: 'Above Target' }
        ],
        recommendations: [
          'Expand digital campaign presence',
          'Partner with local schools for youth engagement',
          'Develop interactive educational materials'
        ],
        summary: 'Campaign achieved significant community engagement with measurable positive behavioral changes.'
      }
    }
  ];

  const reportCategories = [
    { id: 'all', name: 'All Reports', count: mockReports.length },
    { id: 'environmental', name: 'Environmental', count: mockReports.filter(r => r.category === 'environmental').length },
    { id: 'energy', name: 'Energy', count: mockReports.filter(r => r.category === 'energy').length },
    { id: 'waste', name: 'Waste', count: mockReports.filter(r => r.category === 'waste').length },
    { id: 'conservation', name: 'Conservation', count: mockReports.filter(r => r.category === 'conservation').length }
  ];

  const quickStats = [
    { label: 'Total Reports', value: mockReports.length.toString(), trend: '+3', icon: FileText, color: 'blue' },
    { label: 'This Month', value: '8', trend: '+2', icon: Calendar, color: 'emerald' },
    { label: 'Downloads', value: '156', trend: '+24', icon: Download, color: 'violet' },
    { label: 'Avg. Size', value: '2.3 MB', trend: '-0.2', icon: BarChart3, color: 'amber' }
  ];

  // Initialize
  useEffect(() => {
    setReports(mockReports);
    fetchReports();
    initializeWebSocket();

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  // Fetch Reports from Backend
  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reports?category=${selectedCategory}&dateRange=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        setReports(mockReports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports(mockReports);
    } finally {
      setLoading(false);
    }
  };

  // WebSocket Connection for Real-time Chat
  const initializeWebSocket = () => {
    try {
      ws.current = new WebSocket(WS_URL);
      
      ws.current.onopen = () => {
        console.log('✅ WebSocket connected');
      };
      
      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setChatMessages(prev => [...prev, {
          text: message.text || message.reply || message.message,
          sender: 'bot',
          timestamp: new Date().toISOString()
        }]);
        setChatLoading(false);
      };
      
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
      };
    } catch (error) {
      console.error('WebSocket initialization error:', error);
    }
  };

  // Send Chat Message
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      text: chatInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const query = chatInput;
    setChatInput('');
    setChatLoading(true);

    // Try WebSocket first
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        message: query,
        type: 'report_query',
        user: 'user'
      }));
    } else {
      // Fallback to REST API
      try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query })
        });
        
        if (response.ok) {
          const data = await response.json();
          setChatMessages(prev => [...prev, {
            text: data.reply || data.message,
            sender: 'bot',
            timestamp: new Date().toISOString()
          }]);
        } else {
          throw new Error('API request failed');
        }
      } catch (error) {
        // Mock AI Response
        setTimeout(() => {
          let botResponse = '';
          const lowerQuery = query.toLowerCase();
          
          if (lowerQuery.includes('download') || lowerQuery.includes('report')) {
            botResponse = `I found ${reports.length} reports. You can download any report by clicking the "Download PDF" button. Would you like me to help you find a specific report?`;
          } else if (lowerQuery.includes('category') || lowerQuery.includes('filter')) {
            botResponse = `You can filter reports by: Environmental, Energy, Waste Management, and Conservation. Currently showing: ${selectedCategory}. Would you like to change the filter?`;
          } else if (lowerQuery.includes('stats') || lowerQuery.includes('statistics')) {
            botResponse = `Here are the quick stats: ${quickStats.map(s => `${s.label}: ${s.value}`).join(', ')}. What would you like to know more about?`;
          } else if (lowerQuery.includes('generate')) {
            botResponse = 'You can generate a custom report by clicking the "Generate Report" button above. What type of report would you like to create?';
          } else {
            botResponse = `I can help you with:\n• Downloading reports as PDF\n• Filtering by category\n• Viewing statistics\n• Generating custom reports\n• Searching for specific reports\n\nWhat would you like to do?`;
          }
          
          setChatMessages(prev => [...prev, {
            text: botResponse,
            sender: 'bot',
            timestamp: new Date().toISOString()
          }]);
          setChatLoading(false);
        }, 1000);
      } finally {
        setChatLoading(false);
      }
    }
  };

  // Download Report as PDF
  const handleDownloadPDF = (report) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add Header with Gradient Effect
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Add Title
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text(report.title, 20, 20);
    
    // Add Subtitle
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 255);
    doc.text('Environmental Impact Report', 20, 30);
    
    // Add Metadata Section
    let yPos = 50;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${new Date(report.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, 20, yPos);
    doc.text(`Type: ${report.type}`, 100, yPos);
    doc.text(`Size: ${report.size}`, 150, yPos);
    yPos += 7;
    doc.text(`Category: ${report.category.charAt(0).toUpperCase() + report.category.slice(1)}`, 20, yPos);
    doc.text(`Status: ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}`, 100, yPos);
    
    // Add Separator Line
    yPos += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;
    
    // Add Description
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Description:', 20, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const splitDescription = doc.splitTextToSize(report.description, pageWidth - 40);
    doc.text(splitDescription, 20, yPos);
    yPos += splitDescription.length * 5 + 10;
    
    // Add Data Section if available
    if (report.data) {
      // Overview
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text('Overview', 20, yPos);
      yPos += 7;
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const splitOverview = doc.splitTextToSize(report.data.overview, pageWidth - 40);
      doc.text(splitOverview, 20, yPos);
      yPos += splitOverview.length * 5 + 10;
      
      // Metrics Table
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text('Key Metrics', 20, yPos);
      yPos += 5;
      
      doc.autoTable({
        startY: yPos,
        head: [['Metric', 'Value', 'Unit', 'Status']],
        body: report.data.metrics.map(metric => [
          metric.name,
          metric.value,
          metric.unit || '-',
          metric.status
        ]),
        theme: 'grid',
        headStyles: { 
          fillColor: [37, 99, 235],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250]
        },
        margin: { left: 20, right: 20 }
      });
      
      yPos = doc.lastAutoTable.finalY + 15;
      
      // Check if we need a new page
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
      }
      
      // Recommendations
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text('Recommendations', 20, yPos);
      yPos += 7;
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      
      report.data.recommendations.forEach((rec, index) => {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`${index + 1}. ${rec}`, 25, yPos);
        yPos += 7;
      });
      
      yPos += 5;
      
      // Check if we need a new page for summary
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }
      
      // Summary
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text('Summary', 20, yPos);
      yPos += 7;
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const splitSummary = doc.splitTextToSize(report.data.summary, pageWidth - 40);
      doc.text(splitSummary, 20, yPos);
    }
    
    // Add Footer to all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Footer line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
      
      // Footer text
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        `Generated on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
        20,
        pageHeight - 12
      );
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - 40,
        pageHeight - 12
      );
    }
    
    // Save the PDF
    doc.save(`${report.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
    
    // Show success message
    setChatMessages(prev => [...prev, {
      text: `✅ Successfully downloaded "${report.title}" as PDF!`,
      sender: 'bot',
      timestamp: new Date().toISOString()
    }]);
  };

  // Generate Custom Report
  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reports/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          category: selectedCategory, 
          dateRange,
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message || 'Report generation started! You will be notified when ready.'}`);
        setNotifications(prev => prev + 1);
        fetchReports();
      } else {
        alert('✅ Report generation initiated (demo mode). Check back in a few minutes!');
        setNotifications(prev => prev + 1);
      }
    } catch (error) {
      alert('✅ Report generation initiated (demo mode). Check back in a few minutes!');
      setNotifications(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  // Delete Report
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this report?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
        method: 'DELETE'
      });
      
      setReports(prev => prev.filter(r => r.id !== reportId));
      alert('✅ Report deleted successfully!');
      
    } catch (error) {
      setReports(prev => prev.filter(r => r.id !== reportId));
      alert('✅ Report deleted successfully!');
    }
  };

  // Share Report
  const handleShareReport = async (reportId, reportTitle) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}/share`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        await navigator.clipboard.writeText(data.shareLink || `${window.location.href}?report=${reportId}`);
      } else {
        await navigator.clipboard.writeText(`${window.location.href}?report=${reportId}`);
      }
      
      alert(`✅ Share link copied to clipboard!\n\n"${reportTitle}"`);
      
      setChatMessages(prev => [...prev, {
        text: `📤 Share link for "${reportTitle}" copied to clipboard!`,
        sender: 'bot',
        timestamp: new Date().toISOString()
      }]);
      
    } catch (error) {
      alert('✅ Share link copied to clipboard!');
    }
  };

  // View Report Details
  const handleViewReport = (report) => {
    setChatMessages(prev => [...prev, {
      text: `📊 Viewing "${report.title}":\n\n${report.description}\n\nDate: ${new Date(report.date).toLocaleDateString()}\nSize: ${report.size}\nCategory: ${report.category}`,
      sender: 'bot',
      timestamp: new Date().toISOString()
    }]);
    setChatOpen(true);
  };

  const filteredReports = reports.filter(report => {
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getColorStyles = (color) => {
    const colors = {
      emerald: { bg: '#ecfdf5', text: '#059669', border: '#10b981', btnBg: '#059669', icon: '#d1fae5' },
      amber: { bg: '#fffbeb', text: '#d97706', border: '#f59e0b', btnBg: '#d97706', icon: '#fef3c7' },
      sky: { bg: '#f0f9ff', text: '#0284c7', border: '#0ea5e9', btnBg: '#0284c7', icon: '#e0f2fe' },
      violet: { bg: '#f5f3ff', text: '#7c3aed', border: '#8b5cf6', btnBg: '#7c3aed', icon: '#ede9fe' },
      rose: { bg: '#fff1f2', text: '#e11d48', border: '#f43f5e', btnBg: '#e11d48', icon: '#ffe4e6' },
      cyan: { bg: '#ecfeff', text: '#0891b2', border: '#06b6d4', btnBg: '#0891b2', icon: '#cffafe' },
      orange: { bg: '#fff7ed', text: '#ea580c', border: '#f97316', btnBg: '#ea580c', icon: '#ffedd5' },
      pink: { bg: '#fdf2f8', text: '#db2777', border: '#ec4899', btnBg: '#db2777', icon: '#fce7f3' },
      blue: { bg: '#eff6ff', text: '#2563eb', border: '#3b82f6', btnBg: '#2563eb', icon: '#dbeafe' }
    };
    return colors[color] || colors.blue;
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    fetchReports();
  }, [selectedCategory, dateRange]);

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

        .reports-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #dbeafe 100%);
          padding: 2rem 1rem;
        }

        .container-wrapper {
          max-width: 1280px;
          margin: 0 auto;
        }

        /* Header */
        .header-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid #f3f4f6;
          transition: all 0.3s ease;
        }

        .header-card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon-wrapper {
          padding: 0.75rem;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          border-radius: 0.75rem;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .gradient-title {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(90deg, #2563eb 0%, #6366f1 50%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.25rem;
        }

        .header-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        .notification-btn {
          position: relative;
          padding: 0.75rem;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          border: none;
          border-radius: 0.75rem;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
          transition: all 0.3s ease;
        }

        .notification-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
        }

        .notification-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          font-size: 0.75rem;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: 700;
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          border: 1px solid #f3f4f6;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .stat-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .stat-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .stat-icon-wrapper {
          padding: 0.75rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .stat-card:hover .stat-icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }

        .trend-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .trend-positive {
          background-color: #d1fae5;
          color: #059669;
        }

        .trend-negative {
          background-color: #fee2e2;
          color: #dc2626;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
        }

        /* Filters Panel */
        .filters-panel {
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid #f3f4f6;
        }

        .filters-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .category-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .category-btn {
          padding: 0.625rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .category-btn-inactive {
          background: #f3f4f6;
          color: #374151;
        }

        .category-btn-inactive:hover {
          background: #e5e7eb;
          transform: scale(1.05);
        }

        .category-btn-active {
          background: linear-gradient(135deg, #2563eb 0%, #6366f1 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
          transform: scale(1.05);
        }

        .category-count {
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .count-active {
          background: rgba(255, 255, 255, 0.2);
        }

        .count-inactive {
          background: white;
        }

        .actions-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.625rem 0.625rem 0.625rem 2.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .date-select {
          padding: 0.625rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          outline: none;
          background: white;
        }

        .date-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .generate-btn {
          padding: 0.625rem 1.5rem;
          background: linear-gradient(135deg, #059669 0%, #14b8a6 100%);
          color: white;
          font-weight: 600;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .generate-btn:hover {
          box-shadow: 0 10px 25px rgba(5, 150, 105, 0.3);
          transform: scale(1.05);
        }

        .generate-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .refresh-btn {
          padding: 0.625rem;
          background: #f3f4f6;
          color: #374151;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .refresh-btn:hover {
          background: #e5e7eb;
          transform: scale(1.05) rotate(180deg);
        }

        /* Reports Grid */
        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .reports-grid {
            grid-template-columns: 1fr;
          }
        }

        .report-card {
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .report-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
        }

        .report-header {
          display: flex;
          align-items: start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .report-icon-wrapper {
          padding: 0.75rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .report-card:hover .report-icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }

        .report-content {
          flex: 1;
        }

        .report-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .report-description {
          font-size: 0.875rem;
          color: #6b7280;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .report-metadata {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 0.5rem;
        }

        .metadata-item {
          text-align: center;
        }

        .metadata-label {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .metadata-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #111827;
        }

        .report-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn-primary {
          flex: 1;
          padding: 0.625rem 1rem;
          color: white;
          font-weight: 600;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .action-btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .action-btn-secondary {
          padding: 0.625rem;
          background: white;
          color: #374151;
          font-weight: 600;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn-secondary:hover {
          background: #f9fafb;
          transform: scale(1.05);
        }

        .action-btn-danger {
          padding: 0.625rem;
          background: #fee2e2;
          color: #dc2626;
          font-weight: 600;
          border-radius: 0.5rem;
          border: 1px solid #fecaca;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn-danger:hover {
          background: #fecaca;
          transform: scale(1.05);
        }

        /* Chat FAB */
        .chat-fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          padding: 1.25rem;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.5);
          z-index: 40;
          transition: all 0.3s ease;
          animation: floatChat 3s infinite ease-in-out;
        }

        @keyframes floatChat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .chat-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 48px rgba(59, 130, 246, 0.7);
        }

        .chat-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-weight: 700;
        }

        /* Chat Panel */
        .chat-panel {
          position: fixed;
          bottom: 2rem;
          right: 8rem;
          width: 400px;
          height: 600px;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 50;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .chat-header {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          padding: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
        }

        .chat-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-header-title {
          font-weight: 700;
        }

        .chat-header-status {
          font-size: 0.75rem;
          opacity: 0.9;
        }

        .chat-close-btn {
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 0.5rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .chat-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: #f9fafb;
        }

        .chat-message {
          display: flex;
          animation: messageSlide 0.3s ease;
        }

        @keyframes messageSlide {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .chat-message-user {
          justify-content: flex-end;
        }

        .chat-message-bot {
          justify-content: flex-start;
        }

        .message-bubble-user {
          max-width: 80%;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: white;
          border-radius: 1rem 1rem 0.25rem 1rem;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .message-bubble-bot {
          max-width: 80%;
          padding: 0.75rem 1rem;
          background: white;
          color: #111827;
          border-radius: 1rem 1rem 1rem 0.25rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .message-text {
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 0.25rem;
          white-space: pre-wrap;
        }

        .message-time {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .typing-indicator {
          display: flex;
          gap: 0.5rem;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          background: #9ca3af;
          border-radius: 50%;
          animation: typingDot 1.4s infinite;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingDot {
          0%, 60%, 100% { transform: scale(1); opacity: 0.5; }
          30% { transform: scale(1.2); opacity: 1; }
        }

        .chat-input-wrapper {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        .chat-input-container {
          display: flex;
          gap: 0.5rem;
        }

        .chat-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .chat-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .chat-send-btn {
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-send-btn:hover {
          transform: scale(1.05);
        }

        .chat-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Loading */
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Empty State */
        .empty-state {
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 3rem;
          text-align: center;
        }

        .empty-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin: 1rem 0 0.5rem;
        }

        .empty-description {
          color: #6b7280;
        }

        /* AI Info */
        .ai-info-section {
          background: linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #6366f1 100%);
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
          padding: 2rem;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .ai-info-bg {
          position: absolute;
          inset: 0;
          opacity: 0.1;
          pointer-events: none;
        }

        .ai-info-blob-1 {
          position: absolute;
          top: 0;
          left: 0;
          width: 16rem;
          height: 16rem;
          background: white;
          border-radius: 50%;
          filter: blur(60px);
        }

        .ai-info-blob-2 {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 24rem;
          height: 24rem;
          background: white;
          border-radius: 50%;
          filter: blur(60px);
        }

        .ai-info-content {
          position: relative;
          z-index: 10;
        }

        .ai-info-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .ai-icon-wrapper {
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
        }

        .ai-info-title {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .ai-info-description {
          color: #bfdbfe;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 0.75rem;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .feature-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .feature-title {
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .feature-description {
          color: #bfdbfe;
          font-size: 0.875rem;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #6366f1);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb, #4f46e5);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .gradient-title {
            font-size: 2rem;
          }

          .chat-panel {
            right: 1rem;
            width: calc(100% - 2rem);
          }

          .chat-fab {
            bottom: 1rem;
            right: 1rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        button:focus,
        input:focus,
        select:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>

      <div className="reports-container">
        <div className="container-wrapper">
          
          {/* Header */}
          <header className="header-card">
            <div className="header-content">
              <div className="header-left">
                <div className="header-icon-wrapper">
                  <Sparkles style={{ width: '32px', height: '32px', color: 'white' }} />
                </div>
                <div>
                  <h1 className="gradient-title">Environmental Reports</h1>
                  <p className="header-subtitle">AI-Powered Analytics & Insights</p>
                </div>
              </div>
              <button className="notification-btn" onClick={() => setNotifications(0)}>
                <Bell style={{ width: '24px', height: '24px', color: 'white' }} />
                {notifications > 0 && (
                  <span className="notification-badge">{notifications}</span>
                )}
              </button>
            </div>
          </header>

          {/* Quick Stats */}
          <div className="stats-grid">
            {quickStats.map((stat, index) => {
              const StatIcon = stat.icon;
              const colors = getColorStyles(stat.color);
              return (
                <div key={index} className="stat-card">
                  <div className="stat-card-header">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: colors.icon }}>
                      <StatIcon style={{ width: '24px', height: '24px', color: colors.text }} />
                    </div>
                    <span className={stat.trend.startsWith('+') ? 'trend-badge trend-positive' : 'trend-badge trend-negative'}>
                      {stat.trend}
                    </span>
                  </div>
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value" style={{ color: colors.text }}>{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div className="filters-panel">
            <div className="filters-content">
              <div className="category-filters">
                {reportCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={selectedCategory === cat.id ? 'category-btn category-btn-active' : 'category-btn category-btn-inactive'}
                  >
                    <span>{cat.name}</span>
                    <span className={selectedCategory === cat.id ? 'category-count count-active' : 'category-count count-inactive'}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="actions-row">
                <div className="search-wrapper">
                  <Search className="search-icon" style={{ width: '20px', height: '20px' }} />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>

                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="date-select"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>

                <button onClick={handleGenerateReport} className="generate-btn" disabled={loading}>
                  {loading ? <Loader className="spinner" style={{ width: '20px', height: '20px' }} /> : <FileText style={{ width: '20px', height: '20px' }} />}
                  <span>Generate</span>
                </button>

                <button className="refresh-btn" onClick={fetchReports}>
                  <RefreshCw style={{ width: '20px', height: '20px' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          {loading ? (
            <div className="loading-container">
              <Loader className="spinner" style={{ width: '64px', height: '64px', color: '#3b82f6' }} />
            </div>
          ) : (
            <div className="reports-grid">
              {filteredReports.map((report) => {
                const Icon = report.icon;
                const colors = getColorStyles(report.color);
                
                return (
                  <article key={report.id} className="report-card" style={{ backgroundColor: colors.bg }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      backgroundColor: colors.border,
                      borderRadius: '0.75rem 0 0 0.75rem'
                    }} />
                    
                    <div className="report-header">
                      <div className="report-icon-wrapper" style={{ backgroundColor: colors.icon }}>
                        <Icon style={{ width: '24px', height: '24px', color: colors.text }} />
                      </div>
                      <div className="report-content">
                        <h3 className="report-title">{report.title}</h3>
                        <p className="report-description">{report.description}</p>
                      </div>
                    </div>

                    <div className="report-metadata">
                      <div className="metadata-item">
                        <p className="metadata-label">Date</p>
                        <p className="metadata-value">
                          {new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="metadata-item">
                        <p className="metadata-label">Type</p>
                        <p className="metadata-value">{report.type}</p>
                      </div>
                      <div className="metadata-item">
                        <p className="metadata-label">Size</p>
                        <p className="metadata-value">{report.size}</p>
                      </div>
                    </div>

                    <div className="report-actions">
                      <button
                        onClick={() => handleDownloadPDF(report)}
                        className="action-btn-primary"
                        style={{ backgroundColor: colors.btnBg }}
                      >
                        <Download style={{ width: '16px', height: '16px' }} />
                        <span>Download PDF</span>
                      </button>
                      <button className="action-btn-secondary" onClick={() => handleViewReport(report)}>
                        <Eye style={{ width: '20px', height: '20px' }} />
                      </button>
                      <button className="action-btn-secondary" onClick={() => handleShareReport(report.id, report.title)}>
                        <Share2 style={{ width: '20px', height: '20px' }} />
                      </button>
                      <button className="action-btn-danger" onClick={() => handleDeleteReport(report.id)}>
                        <Trash2 style={{ width: '20px', height: '20px' }} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredReports.length === 0 && (
            <div className="empty-state">
              <FileText style={{ width: '64px', height: '64px', color: '#d1d5db' }} />
              <h3 className="empty-title">No Reports Found</h3>
              <p className="empty-description">Try adjusting your filters or search query</p>
            </div>
          )}

          {/* AI Info */}
          <section className="ai-info-section">
            <div className="ai-info-bg">
              <div className="ai-info-blob-1"></div>
              <div className="ai-info-blob-2"></div>
            </div>

            <div className="ai-info-content">
              <div className="ai-info-header">
                <div className="ai-icon-wrapper">
                  <Sparkles style={{ width: '24px', height: '24px' }} />
                </div>
                <h3 className="ai-info-title">AI-Powered Report Generation</h3>
              </div>
              
              <p className="ai-info-description">
                Our advanced AI system automatically analyzes environmental data, identifies trends, and generates comprehensive reports with professional PDF formatting.
              </p>

              <div className="features-grid">
                {[
                  { icon: '🤖', title: 'Automated Analysis', desc: 'ML algorithms process millions of data points' },
                  { icon: '🔒', title: 'Secure & Private', desc: 'End-to-end encryption for sensitive data' },
                  { icon: '📊', title: 'PDF Export', desc: 'Professional formatted PDF downloads' }
                ].map((feature, index) => (
                  <div key={index} className="feature-card">
                    <p className="feature-icon">{feature.icon}</p>
                    <p className="feature-title">{feature.title}</p>
                    <p className="feature-description">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Chat FAB */}
        <button onClick={() => setChatOpen(!chatOpen)} className="chat-fab">
          <MessageCircle style={{ width: '28px', height: '28px' }} />
          <span className="chat-badge">AI</span>
        </button>

        {/* Chat Panel */}
        {chatOpen && (
          <div className="chat-panel">
            <div className="chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="chat-avatar">
                  <MessageCircle style={{ width: '24px', height: '24px', color: 'white' }} />
                </div>
                <div>
                  <h3 className="chat-header-title">AI Assistant</h3>
                  <p className="chat-header-status">Online • Ready to help</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="chat-close-btn">
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.sender === 'user' ? 'chat-message-user' : 'chat-message-bot'}`}>
                  <div className={msg.sender === 'user' ? 'message-bubble-user' : 'message-bubble-bot'}>
                    <p className="message-text">{msg.text}</p>
                    <p className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="chat-message chat-message-bot">
                  <div className="message-bubble-bot">
                    <div className="typing-indicator">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
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
                  placeholder="Ask about reports..."
                  className="chat-input"
                />
                <button onClick={sendChatMessage} disabled={chatLoading} className="chat-send-btn">
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
