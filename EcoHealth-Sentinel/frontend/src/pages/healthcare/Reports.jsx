import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, TrendingUp, Users, Calendar, BarChart3, PieChart, Brain, Shield, AlertCircle, RefreshCw, Activity, Mail, Printer, Filter, Search, X, ChevronDown, Bell, Settings, Eye, FileSpreadsheet, Share2, DollarSign, Clock, Heart, Zap, Target, TrendingDown, Hospital, Stethoscope, Award, Percent, MapPin, ThermometerSun } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Treemap } from 'recharts';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chartType, setChartType] = useState('line');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const autoRefreshInterval = useRef(null);
  
  const [data, setData] = useState({
    patientTrendData: [],
    diseaseDistribution: [],
    aiPerformanceData: [],
    aiInsights: [],
    metrics: {},
    departmentPerformance: [],
    patientDemographics: [],
    financialMetrics: [],
    staffPerformance: [],
    bedOccupancy: [],
    waitTimeAnalysis: [],
    treatmentOutcomes: [],
    revenueByService: [],
    patientSatisfaction: [],
    readmissionRates: [],
    geographicData: [],
    appointmentData: [],
    resourceUtilization: []
  });

 // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    const newNotification = { id, message, type };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const fetchDashboardData = async (period = selectedPeriod) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/dashboard`, {
        params: { 
          period,
          startDate: customDateRange.start,
          endDate: customDateRange.end,
          diseases: selectedDiseases.join(','),
          department: selectedDepartment
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setData(response.data);
      showToast('Data refreshed successfully', 'success');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setData(getSampleData());
      showToast('Using sample data - Backend unavailable', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = () => ({
    patientTrendData: [
      { month: 'Apr', patients: 145, consultations: 320, critical: 8, revenue: 125000 },
      { month: 'May', patients: 178, consultations: 389, critical: 5, revenue: 148000 },
      { month: 'Jun', patients: 203, consultations: 445, critical: 12, revenue: 167000 },
      { month: 'Jul', patients: 234, consultations: 512, critical: 7, revenue: 189000 },
      { month: 'Aug', patients: 267, consultations: 598, critical: 9, revenue: 212000 },
      { month: 'Sep', patients: 289, consultations: 634, critical: 4, revenue: 234000 }
    ],
    diseaseDistribution: [
      { name: 'Diabetes', value: 35, patients: 102, cost: 45000 },
      { name: 'Hypertension', value: 28, patients: 81, cost: 38000 },
      { name: 'Cardiac', value: 18, patients: 52, cost: 68000 },
      { name: 'Respiratory', value: 12, patients: 35, cost: 28000 },
      { name: 'Other', value: 7, patients: 19, cost: 15000 }
    ],
    aiPerformanceData: [
      { metric: 'Accuracy', score: 94.5, target: 95 },
      { metric: 'Early Detection', score: 89.2, target: 90 },
      { metric: 'Alert Precision', score: 91.8, target: 92 },
      { metric: 'Predictive Success', score: 87.3, target: 88 }
    ],
    departmentPerformance: [
      { department: 'Cardiology', patients: 156, revenue: 89000, satisfaction: 4.5, avgWait: 12 },
      { department: 'Orthopedics', patients: 134, revenue: 76000, satisfaction: 4.3, avgWait: 15 },
      { department: 'Pediatrics', patients: 189, revenue: 54000, satisfaction: 4.7, avgWait: 8 },
      { department: 'Emergency', patients: 267, revenue: 98000, satisfaction: 4.1, avgWait: 25 },
      { department: 'Neurology', patients: 98, revenue: 67000, satisfaction: 4.4, avgWait: 18 }
    ],
    patientDemographics: [
      { ageGroup: '0-18', male: 45, female: 38, total: 83 },
      { ageGroup: '19-35', male: 67, female: 72, total: 139 },
      { ageGroup: '36-50', male: 89, female: 94, total: 183 },
      { ageGroup: '51-65', male: 76, female: 81, total: 157 },
      { ageGroup: '65+', male: 54, female: 62, total: 116 }
    ],
    financialMetrics: [
      { category: 'Consultations', revenue: 234000, cost: 89000, profit: 145000 },
      { category: 'Surgeries', revenue: 456000, cost: 234000, profit: 222000 },
      { category: 'Diagnostics', revenue: 123000, cost: 45000, profit: 78000 },
      { category: 'Pharmacy', revenue: 189000, cost: 134000, profit: 55000 }
    ],
    staffPerformance: [
      { name: 'Dr. Smith', patients: 234, satisfaction: 4.8, avgConsult: 25 },
      { name: 'Dr. Johnson', patients: 198, satisfaction: 4.6, avgConsult: 28 },
      { name: 'Dr. Williams', patients: 267, satisfaction: 4.7, avgConsult: 22 },
      { name: 'Dr. Brown', patients: 189, satisfaction: 4.5, avgConsult: 30 },
      { name: 'Dr. Davis', patients: 223, satisfaction: 4.9, avgConsult: 24 }
    ],
    bedOccupancy: [
      { date: 'Apr 1', icu: 85, general: 72, emergency: 45 },
      { date: 'Apr 8', icu: 78, general: 68, emergency: 52 },
      { date: 'Apr 15', icu: 92, general: 75, emergency: 48 },
      { date: 'Apr 22', icu: 88, general: 71, emergency: 56 },
      { date: 'Apr 29', icu: 82, general: 69, emergency: 43 }
    ],
    waitTimeAnalysis: [
      { hour: '8 AM', emergency: 12, consultation: 8, surgery: 15 },
      { hour: '10 AM', emergency: 18, consultation: 12, surgery: 22 },
      { hour: '12 PM', emergency: 25, consultation: 15, surgery: 18 },
      { hour: '2 PM', emergency: 22, consultation: 18, surgery: 25 },
      { hour: '4 PM', emergency: 28, consultation: 20, surgery: 30 },
      { hour: '6 PM', emergency: 35, consultation: 16, surgery: 20 }
    ],
    treatmentOutcomes: [
      { treatment: 'Surgery', success: 92, complications: 5, readmission: 3 },
      { treatment: 'Medication', success: 87, complications: 8, readmission: 5 },
      { treatment: 'Therapy', success: 85, complications: 3, readmission: 12 },
      { treatment: 'Diagnostic', success: 95, complications: 2, readmission: 3 }
    ],
    revenueByService: [
      { service: 'Emergency Care', value: 234000, size: 234, growth: 12 },
      { service: 'Surgeries', value: 456000, size: 456, growth: 18 },
      { service: 'Consultations', value: 189000, size: 189, growth: 8 },
      { service: 'Diagnostics', value: 123000, size: 123, growth: 15 },
      { service: 'Pharmacy', value: 98000, size: 98, growth: 5 },
      { service: 'Rehabilitation', value: 67000, size: 67, growth: 22 }
    ],
    patientSatisfaction: [
      { aspect: 'Doctor Care', score: 9.2 },
      { aspect: 'Nursing Staff', score: 8.8 },
      { aspect: 'Facility Cleanliness', score: 9.5 },
      { aspect: 'Wait Times', score: 7.2 },
      { aspect: 'Communication', score: 8.5 },
      { aspect: 'Overall Experience', score: 8.9 }
    ],
    readmissionRates: [
      { condition: 'Heart Failure', rate: 12, benchmark: 15, improved: true },
      { condition: 'Pneumonia', rate: 8, benchmark: 10, improved: true },
      { condition: 'COPD', rate: 18, benchmark: 20, improved: true },
      { condition: 'Hip/Knee Surgery', rate: 3, benchmark: 5, improved: true },
      { condition: 'AMI', rate: 7, benchmark: 8, improved: true }
    ],
    geographicData: [
      { region: 'North District', patients: 234, revenue: 345000 },
      { region: 'South District', patients: 189, revenue: 278000 },
      { region: 'East District', patients: 267, revenue: 398000 },
      { region: 'West District', patients: 198, revenue: 289000 },
      { region: 'Central', patients: 312, revenue: 467000 }
    ],
    appointmentData: [
      { type: 'Scheduled', count: 456, completed: 398, cancelled: 34, noShow: 24 },
      { type: 'Walk-in', count: 234, completed: 212, cancelled: 12, noShow: 10 },
      { type: 'Emergency', count: 189, completed: 189, cancelled: 0, noShow: 0 },
      { type: 'Follow-up', count: 345, completed: 298, cancelled: 28, noShow: 19 }
    ],
    resourceUtilization: [
      { resource: 'Operating Rooms', utilization: 87, capacity: 100, optimal: 85 },
      { resource: 'MRI Machines', utilization: 92, capacity: 100, optimal: 90 },
      { resource: 'ICU Beds', utilization: 78, capacity: 100, optimal: 80 },
      { resource: 'Lab Equipment', utilization: 95, capacity: 100, optimal: 85 },
      { resource: 'X-Ray Machines', utilization: 82, capacity: 100, optimal: 80 }
    ],
    aiInsights: [
      {
        title: "Seasonal Pattern Detected",
        description: "AI identified 23% increase in respiratory cases during monsoon season. Preventive measures recommended.",
        impact: "high",
        date: "2 days ago"
      },
      {
        title: "Medication Adherence Analysis",
        description: "78% medication adherence rate. AI suggests SMS reminders improved compliance by 34%.",
        impact: "medium",
        date: "5 days ago"
      },
      {
        title: "High-Risk Patient Identification",
        description: "AI flagged 12 patients for preventive intervention, reducing emergency cases by 45%.",
        impact: "high",
        date: "1 week ago"
      },
      {
        title: "Resource Optimization Alert",
        description: "Operating room utilization at 87%. Consider scheduling adjustments during peak hours.",
        impact: "medium",
        date: "3 days ago"
      }
    ],
    metrics: {
      activePatients: 289,
      patientsGrowth: 12,
      consultations: 634,
      consultationsGrowth: 8,
      aiAccuracy: 94.5,
      criticalCases: 4,
      criticalReduction: 45,
      revenue: 1234000,
      revenueGrowth: 15,
      avgWaitTime: 18,
      waitTimeReduction: 22,
      bedOccupancy: 82,
      staffUtilization: 87,
      patientSatisfaction: 8.9,
      costPerPatient: 1250,
      revenuePerPatient: 4270
    }
  });

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod, customDateRange, selectedDiseases, selectedDepartment]);

  useEffect(() => {
    if (autoRefresh) {
      autoRefreshInterval.current = setInterval(() => {
        fetchDashboardData();
      }, 30000);
    } else {
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
      }
    }
    return () => {
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
      }
    };
  }, [autoRefresh]);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  const reportCategories = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'patients', name: 'Patient Analytics', icon: Users },
    { id: 'financial', name: 'Financial', icon: DollarSign },
    { id: 'operations', name: 'Operations', icon: Hospital },
    { id: 'ai-insights', name: 'AI Insights', icon: Brain },
    { id: 'quality', name: 'Quality Metrics', icon: Award }
  ];

  const departments = ['all', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Emergency', 'Neurology'];

  const exportToExcel = async () => {
    setLoading(true);
    showToast('Generating Excel file...', 'info');
    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();
      
      const patientWs = XLSX.utils.json_to_sheet(data.patientTrendData);
      XLSX.utils.book_append_sheet(wb, patientWs, "Patient Trends");
      
      const diseaseWs = XLSX.utils.json_to_sheet(data.diseaseDistribution);
      XLSX.utils.book_append_sheet(wb, diseaseWs, "Disease Distribution");
      
      const deptWs = XLSX.utils.json_to_sheet(data.departmentPerformance);
      XLSX.utils.book_append_sheet(wb, deptWs, "Department Performance");
      
      const financialWs = XLSX.utils.json_to_sheet(data.financialMetrics);
      XLSX.utils.book_append_sheet(wb, financialWs, "Financial Data");
      
      XLSX.writeFile(wb, `Healthcare_Report_${selectedPeriod}_${Date.now()}.xlsx`);
      showToast('Excel file downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      showToast('Failed to export Excel file', 'error');
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = async () => {
    setLoading(true);
    showToast('Generating PDF report...', 'info');
    try {
      const reportElement = document.getElementById('report-container');
      const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Healthcare_Report_${selectedPeriod}_${Date.now()}.pdf`);
      showToast('PDF downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Failed to generate PDF', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    setLoading(true);
    showToast('Generating CSV file...', 'info');
    try {
      let csvContent = "Category,Month,Patients,Consultations,Critical,Revenue\n";
      data.patientTrendData.forEach(row => {
        csvContent += `Patient Trends,${row.month},${row.patients},${row.consultations},${row.critical},${row.revenue}\n`;
      });
      
      csvContent += "\nDepartment,Patients,Revenue,Satisfaction,Avg Wait Time\n";
      data.departmentPerformance.forEach(row => {
        csvContent += `${row.department},${row.patients},${row.revenue},${row.satisfaction},${row.avgWait}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Healthcare_Data_${selectedPeriod}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast('CSV file downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showToast('Failed to export CSV', 'error');
    } finally {
      setLoading(false);
    }
  };

  const printReport = () => {
    showToast('Preparing print preview...', 'info');
    window.print();
  };

  const sendEmailReport = async () => {
    if (!emailAddress) {
      showToast('Please enter an email address', 'warning');
      return;
    }
    
    setLoading(true);
    showToast('Sending email...', 'info');
    try {
      await axios.post(`${API_BASE_URL}/reports/email`, {
        email: emailAddress,
        period: selectedPeriod,
        reportType: selectedReport
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      showToast(`Report sent to ${emailAddress}!`, 'success');
      setEmailModalOpen(false);
      setEmailAddress('');
    } catch (error) {
      console.error('Error sending email:', error);
      showToast('Failed to send email', 'error');
    } finally {
      setLoading(false);
    }
  };

  const shareReport = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Healthcare Analytics Report',
          text: 'Check out this healthcare analytics report',
          url: window.location.href
        });
        showToast('Report shared successfully!', 'success');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Report link copied to clipboard!', 'success');
    }
  };

  const toggleDiseaseFilter = (disease) => {
    setSelectedDiseases(prev => 
      prev.includes(disease) 
        ? prev.filter(d => d !== disease)
        : [...prev, disease]
    );
  };

  const filteredInsights = data.aiInsights.filter(insight =>
    insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    insight.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const metrics = data.metrics || {};

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes countUp {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
          padding: 2rem;
          position: relative;
        }

        .max-w-7xl {
          max-width: 90rem;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .professional-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 24px rgba(0, 0, 0, 0.05);
          padding: 1.75rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .professional-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .header-section {
          margin-bottom: 2rem;
          animation: slideInDown 0.8s ease-out;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-content { flex: 1; }

        .header-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .dashboard-title {
          font-size: 2.75rem;
          font-weight: 800;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .title-icon {
          width: 3rem;
          height: 3rem;
          color: #2563eb;
          padding: 0.5rem;
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .dashboard-subtitle {
          color: #64748b;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .icon-btn {
          width: 2.75rem;
          height: 2.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          color: #475569;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .icon-btn:hover {
          background: #f8fafc;
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-2px);
        }

        .icon-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          gap: 0.75rem;
          transition: all 0.3s ease;
          flex: 1;
          max-width: 400px;
        }

        .search-bar:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .search-bar input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 0.9375rem;
          color: #1e293b;
        }

        .controls-section {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 2rem;
          animation: slideInUp 0.8s ease-out 0.2s backwards;
        }

        .controls-left, .controls-right {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .category-btn {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.875rem 1.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          color: #475569;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .category-btn:hover {
          transform: translateY(-2px);
          border-color: #3b82f6;
          box-shadow: 0 8px 16px rgba(37, 99, 235, 0.15);
        }

        .category-btn.active {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          border-color: #2563eb;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }

        .btn-icon {
          width: 1.125rem;
          height: 1.125rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.875rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
        }

        .refresh-btn { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .csv-btn { background: linear-gradient(135deg, #10b981, #059669); }
        .pdf-btn { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .excel-btn { background: linear-gradient(135deg, #059669, #047857); }
        .email-btn { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .print-btn { background: linear-gradient(135deg, #64748b, #475569); }
        .share-btn { background: linear-gradient(135deg, #f59e0b, #d97706); }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .spinning { animation: spin 1s linear infinite; }

        .period-select {
          padding: 0.875rem 1.25rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          color: #1e293b;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .period-select:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
        }

        .toast-container {
          position: fixed;
          top: 2rem;
          right: 2rem;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .toast {
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 300px;
          animation: slideInFromRight 0.4s ease-out;
          border-left: 4px solid;
        }

        .toast.success { border-left-color: #10b981; }
        .toast.error { border-left-color: #ef4444; }
        .toast.warning { border-left-color: #f59e0b; }
        .toast.info { border-left-color: #3b82f6; }

        .toast-message {
          flex: 1;
          color: #1e293b;
          font-weight: 600;
          font-size: 0.9375rem;
        }

        .toast-close {
          cursor: pointer;
          color: #64748b;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }

        .loader-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid #e2e8f0;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .loading-overlay p {
          color: #1e293b;
          margin-top: 1.5rem;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .filter-panel {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          animation: slideInDown 0.4s ease-out;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .filter-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1e293b;
        }

        .filter-content {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .filter-group {
          flex: 1;
          min-width: 200px;
        }

        .filter-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.5rem;
        }

        .filter-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9375rem;
        }

        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .filter-chip {
          padding: 0.5rem 1rem;
          background: #f1f5f9;
          border: 2px solid #e2e8f0;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-chip.active {
          background: #dbeafe;
          border-color: #3b82f6;
          color: #2563eb;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9998;
          animation: fadeIn 0.3s ease;
        }

        .modal {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideInDown 0.3s ease-out;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .modal-close {
          cursor: pointer;
          color: #64748b;
        }

        .modal-body { margin-bottom: 1.5rem; }

        .modal-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
        }

        .modal-footer {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .modal-btn {
          padding: 0.875rem 1.75rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
        }

        .modal-btn.primary {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
        }

        .modal-btn.secondary {
          background: #f1f5f9;
          color: #475569;
        }

        .chart-switcher {
          display: flex;
          gap: 0.5rem;
          background: #f1f5f9;
          padding: 0.25rem;
          border-radius: 10px;
        }

        .chart-type-btn {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
        }

        .chart-type-btn.active {
          background: white;
          color: #2563eb;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          padding: 1.75rem;
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s ease;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .metric-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .metric-card:nth-child(1) { 
          animation: slideInLeft 0.8s ease-out 0.1s backwards;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
        }

        .metric-card:nth-child(2) { 
          animation: slideInLeft 0.8s ease-out 0.2s backwards;
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
        }

        .metric-card:nth-child(3) { 
          animation: slideInRight 0.8s ease-out 0.3s backwards;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
        }

        .metric-card:nth-child(4) { 
          animation: slideInRight 0.8s ease-out 0.4s backwards;
          background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
        }

        .metric-card:nth-child(5) { 
          animation: slideInLeft 0.8s ease-out 0.5s backwards;
          background: linear-gradient(135deg, #fce7f3, #fbcfe8);
        }

        .metric-card:nth-child(6) { 
          animation: slideInLeft 0.8s ease-out 0.6s backwards;
          background: linear-gradient(135deg, #cffafe, #a5f3fc);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .metric-icon {
          width: 2.5rem;
          height: 2.5rem;
          padding: 0.5rem;
          border-radius: 12px;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .metric-card:nth-child(1) .metric-icon { color: #2563eb; }
        .metric-card:nth-child(2) .metric-icon { color: #10b981; }
        .metric-card:nth-child(3) .metric-icon { color: #f59e0b; }
        .metric-card:nth-child(4) .metric-icon { color: #8b5cf6; }
        .metric-card:nth-child(5) .metric-icon { color: #ec4899; }
        .metric-card:nth-child(6) .metric-icon { color: #06b6d4; }

        .metric-badge {
          padding: 0.4rem 0.875rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 700;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .metric-card:nth-child(1) .metric-badge { color: #2563eb; }
        .metric-card:nth-child(2) .metric-badge { color: #10b981; }
        .metric-card:nth-child(3) .metric-badge { color: #f59e0b; }
        .metric-card:nth-child(4) .metric-badge { color: #8b5cf6; }
        .metric-card:nth-child(5) .metric-badge { color: #ec4899; }
        .metric-card:nth-child(6) .metric-badge { color: #06b6d4; }

        .metric-value {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          color: #1e293b;
          animation: countUp 1s ease-out;
        }

        .metric-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #64748b;
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .col-span-12 { grid-column: span 12; }
        .col-span-8 { grid-column: span 8; }
        .col-span-6 { grid-column: span 6; }
        .col-span-4 { grid-column: span 4; }
        .col-span-3 { grid-column: span 3; }

        .chart-card {
          animation: slideInUp 1s ease-out backwards;
        }

        .chart-card:nth-child(1) { animation-delay: 0.2s; }
        .chart-card:nth-child(2) { animation-delay: 0.3s; }
        .chart-card:nth-child(3) { animation-delay: 0.4s; }
        .chart-card:nth-child(4) { animation-delay: 0.5s; }

        .card-header {
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .activity-icon {
          width: 1.125rem;
          height: 1.125rem;
          color: #3b82f6;
          animation: pulse 2s ease-in-out infinite;
        }

        .disease-legend, .insights-list {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .legend-item, .insight-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .legend-item:hover, .insight-item:hover {
          background: white;
          transform: translateX(8px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .insight-item {
          padding: 1.5rem;
          border-left: 4px solid #3b82f6;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border: 1px solid #bfdbfe;
          border-left: 4px solid #3b82f6;
        }

        .legend-color {
          width: 14px;
          height: 14px;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .legend-name {
          flex: 1;
          color: #475569;
          font-weight: 600;
          font-size: 0.9375rem;
        }

        .legend-count {
          color: #1e293b;
          font-weight: 700;
          font-size: 0.9375rem;
          background: white;
          padding: 0.25rem 0.75rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .insight-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 0.875rem;
          gap: 1rem;
        }

        .insight-title {
          font-weight: 700;
          color: #1e293b;
          font-size: 1rem;
        }

        .insight-badge {
          padding: 0.375rem 0.875rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .insight-badge.high {
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .insight-badge.medium {
          background: #fef3c7;
          color: #d97706;
          border: 1px solid #fde68a;
        }

        .insight-description {
          color: #475569;
          font-size: 0.9375rem;
          line-height: 1.6;
          margin-bottom: 0.625rem;
        }

        .insight-date {
          color: #94a3b8;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .footer-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
          animation: slideInUp 1s ease-out 0.6s backwards;
          margin-top: 2rem;
        }

        .compliance-card {
          display: flex;
          gap: 1.25rem;
          align-items: start;
        }

        .compliance-icon {
          width: 2.75rem;
          height: 2.75rem;
          flex-shrink: 0;
          padding: 0.625rem;
          border-radius: 12px;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .compliance-icon.green {
          color: #10b981;
          background: #ecfdf5;
        }

        .compliance-icon.blue {
          color: #3b82f6;
          background: #eff6ff;
        }

        .compliance-title {
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.625rem;
          font-size: 1.125rem;
        }

        .compliance-text {
          color: #64748b;
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        @media print {
          .header-actions, .controls-section, .toast-container, .filter-panel {
            display: none !important;
          }
        }

        @media (max-width: 1280px) {
          .col-span-8, .col-span-6, .col-span-4, .col-span-3 {
            grid-column: span 12;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container { padding: 1.25rem; }
          .dashboard-title { font-size: 2rem; }
          .metrics-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="toast-container">
          {notifications.map(notif => (
            <div key={notif.id} className={`toast ${notif.type}`}>
              <span className="toast-message">{notif.message}</span>
              <X className="toast-close" size={18} onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))} />
            </div>
          ))}
        </div>

        {emailModalOpen && (
          <div className="modal-overlay" onClick={() => setEmailModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Email Report</h3>
                <X className="modal-close" size={24} onClick={() => setEmailModalOpen(false)} />
              </div>
              <div className="modal-body">
                <label className="filter-label">Email Address</label>
                <input
                  type="email"
                  className="modal-input"
                  placeholder="Enter email address"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="modal-btn secondary" onClick={() => setEmailModalOpen(false)}>Cancel</button>
                <button className="modal-btn primary" onClick={sendEmailReport}>Send Report</button>
              </div>
            </div>
          </div>
        )}

        <div id="report-container" className="max-w-7xl">
          <div className="header-section">
            <div className="header-content">
              <h1 className="dashboard-title">
                <FileText className="title-icon" />
                Healthcare Analytics & Reports
              </h1>
              <p className="dashboard-subtitle">
                Comprehensive AI-powered insights for data-driven healthcare decisions
              </p>
            </div>
            <div className="header-actions">
              <div className="search-bar">
                <Search size={20} color="#64748b" />
                <input type="text" placeholder="Search insights..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <button className={`icon-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)} title="Filters">
                <Filter size={20} />
              </button>
              <button className={`icon-btn ${autoRefresh ? 'active' : ''}`} onClick={() => {
                setAutoRefresh(!autoRefresh);
                showToast(autoRefresh ? 'Auto-refresh disabled' : 'Auto-refresh enabled', 'info');
              }} title="Auto Refresh">
                <RefreshCw size={20} />
              </button>
              <button className="icon-btn" title="Notifications">
                <Bell size={20} />
              </button>
              <button className="icon-btn" title="Settings">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="filter-panel professional-card">
              <div className="filter-header">
                <h3 className="filter-title">Advanced Filters</h3>
                <X size={20} style={{ cursor: 'pointer' }} onClick={() => setShowFilters(false)} />
              </div>
              <div className="filter-content">
                <div className="filter-group">
                  <label className="filter-label">Start Date</label>
                  <input type="date" className="filter-input" value={customDateRange.start} onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))} />
                </div>
                <div className="filter-group">
                  <label className="filter-label">End Date</label>
                  <input type="date" className="filter-input" value={customDateRange.end} onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))} />
                </div>
                <div className="filter-group">
                  <label className="filter-label">Department</label>
                  <select className="filter-input" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept === 'all' ? 'All Departments' : dept}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="filter-label">Filter by Disease</label>
                  <div className="filter-chips">
                    {data.diseaseDistribution.map((disease) => (
                      <div key={disease.name} className={`filter-chip ${selectedDiseases.includes(disease.name) ? 'active' : ''}`} onClick={() => toggleDiseaseFilter(disease.name)}>
                        {disease.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="controls-section professional-card">
            <div className="controls-left">
              {reportCategories.map(cat => (
                <button key={cat.id} onClick={() => setSelectedReport(cat.id)} className={`category-btn ${selectedReport === cat.id ? 'active' : ''}`}>
                  <cat.icon className="btn-icon" />
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
            
            <div className="controls-right">
              <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="period-select" disabled={loading}>
                <option value="weekly">Last 7 Days</option>
                <option value="monthly">Last 30 Days</option>
                <option value="quarterly">Last 3 Months</option>
                <option value="yearly">Last Year</option>
              </select>
              
              <button onClick={() => fetchDashboardData()} className="action-btn refresh-btn" disabled={loading} title="Refresh Data">
                <RefreshCw className={`btn-icon ${loading ? 'spinning' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <button onClick={exportToCSV} className="action-btn csv-btn" disabled={loading} title="Export to CSV">
                <Download className="btn-icon" />
                <span>CSV</span>
              </button>
              
              <button onClick={exportToExcel} className="action-btn excel-btn" disabled={loading} title="Export to Excel">
                <FileSpreadsheet className="btn-icon" />
                <span>Excel</span>
              </button>
              
              <button onClick={generatePDFReport} className="action-btn pdf-btn" disabled={loading} title="Export to PDF">
                <FileText className="btn-icon" />
                <span>PDF</span>
              </button>

              <button onClick={() => setEmailModalOpen(true)} className="action-btn email-btn" disabled={loading} title="Email Report">
                <Mail className="btn-icon" />
                <span>Email</span>
              </button>

              <button onClick={printReport} className="action-btn print-btn" disabled={loading} title="Print Report">
                <Printer className="btn-icon" />
                <span>Print</span>
              </button>

              <button onClick={shareReport} className="action-btn share-btn" disabled={loading} title="Share Report">
                <Share2 className="btn-icon" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {loading && (
            <div className="loading-overlay">
              <div className="loader-spinner"></div>
              <p>Processing your request...</p>
            </div>
          )}

          {/* Extended Metrics Grid - 6 KPIs */}
          <div className="metrics-grid">
            <div className="metric-card professional-card">
              <div className="metric-header">
                <Users className="metric-icon" />
                <span className="metric-badge">+{metrics.patientsGrowth || 12}%</span>
              </div>
              <h3 className="metric-value">{metrics.activePatients || 289}</h3>
              <p className="metric-label">Active Patients</p>
            </div>
            
            <div className="metric-card professional-card">
              <div className="metric-header">
                <Calendar className="metric-icon" />
                <span className="metric-badge">+{metrics.consultationsGrowth || 8}%</span>
              </div>
              <h3 className="metric-value">{metrics.consultations || 634}</h3>
              <p className="metric-label">Consultations</p>
            </div>
            
            <div className="metric-card professional-card">
              <div className="metric-header">
                <DollarSign className="metric-icon" />
                <span className="metric-badge">+{metrics.revenueGrowth || 15}%</span>
              </div>
              <h3 className="metric-value">${(metrics.revenue || 1234000) / 1000}K</h3>
              <p className="metric-label">Total Revenue</p>
            </div>
            
            <div className="metric-card professional-card">
              <div className="metric-header">
                <Clock className="metric-icon" />
                <span className="metric-badge">-{metrics.waitTimeReduction || 22}%</span>
              </div>
              <h3 className="metric-value">{metrics.avgWaitTime || 18}m</h3>
              <p className="metric-label">Avg Wait Time</p>
            </div>

            <div className="metric-card professional-card">
              <div className="metric-header">
                <Heart className="metric-icon" />
                <span className="metric-badge">{metrics.patientSatisfaction || 8.9}/10</span>
              </div>
              <h3 className="metric-value">{metrics.bedOccupancy || 82}%</h3>
              <p className="metric-label">Bed Occupancy</p>
            </div>

            <div className="metric-card professional-card">
              <div className="metric-header">
                <Brain className="metric-icon" />
                <span className="metric-badge">{metrics.aiAccuracy || 94.5}%</span>
              </div>
              <h3 className="metric-value">AI Model</h3>
              <p className="metric-label">Accuracy Rate</p>
            </div>
          </div>

          {/* Comprehensive Charts Grid */}
          <div className="content-grid">
            {/* Patient Trend Chart - Main */}
            <div className="chart-card professional-card col-span-8">
              <div className="card-header">
                <h3 className="card-title">
                  <TrendingUp style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
                  Patient & Revenue Trends
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="chart-switcher">
                    <button className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`} onClick={() => setChartType('line')}>Line</button>
                    <button className={`chart-type-btn ${chartType === 'area' ? 'active' : ''}`} onClick={() => setChartType('area')}>Area</button>
                    <button className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`} onClick={() => setChartType('bar')}>Bar</button>
                  </div>
                  <Activity className="activity-icon" />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                {chartType === 'line' ? (
                  <ComposedChart data={data.patientTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                    <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="patients" stroke="#2563eb" strokeWidth={3} name="Patients" dot={{ r: 5 }} />
                    <Line yAxisId="left" type="monotone" dataKey="consultations" stroke="#10b981" strokeWidth={3} name="Consultations" dot={{ r: 5 }} />
                    <Bar yAxisId="right" dataKey="revenue" fill="#f59e0b" name="Revenue ($)" radius={[8, 8, 0, 0]} />
                  </ComposedChart>
                ) : chartType === 'area' ? (
                  <AreaChart data={data.patientTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="patients" stroke="#2563eb" fill="#93c5fd" fillOpacity={0.6} name="Patients" />
                    <Area type="monotone" dataKey="consultations" stroke="#10b981" fill="#86efac" fillOpacity={0.6} name="Consultations" />
                  </AreaChart>
                ) : (
                  <BarChart data={data.patientTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                    <Legend />
                    <Bar dataKey="patients" fill="#2563eb" radius={[8, 8, 0, 0]} name="Patients" />
                    <Bar dataKey="consultations" fill="#10b981" radius={[8, 8, 0, 0]} name="Consultations" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Disease Distribution */}
            <div className="chart-card professional-card col-span-4">
              <div className="card-header">
                <h3 className="card-title">
                  <PieChart style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
                  Disease Distribution
                </h3>
                <Activity className="activity-icon" />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <RePieChart>
                  <Pie data={data.diseaseDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={85} fill="#8884d8" dataKey="value">
                    {data.diseaseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="disease-legend">
                {data.diseaseDistribution.map((disease, idx) => (
                  <div key={idx} className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: COLORS[idx] }}></div>
                    <span className="legend-name">{disease.name}</span>
                    <span className="legend-count">{disease.patients}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Performance */}
            <div className="chart-card professional-card col-span-6">
              <div className="card-header">
                <h3 className="card-title">
                  <Hospital style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
                  Department Performance
                </h3>
                <Activity className="activity-icon" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.departmentPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                  <YAxis dataKey="department" type="category" stroke="#64748b" style={{ fontSize: '0.875rem' }} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                  <Legend />
                  <Bar dataKey="patients" fill="#2563eb" radius={[0, 8, 8, 0]} name="Patients" />
                  <Bar dataKey="satisfaction" fill="#10b981" radius={[0, 8, 8, 0]} name="Satisfaction" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Patient Demographics */}
            <div className="chart-card professional-card col-span-6">
              <div className="card-header">
                <h3 className="card-title">
                  <Users style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
                  Patient Demographics
                </h3>
                <Activity className="activity-icon" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.patientDemographics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="ageGroup" stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                  <Legend />
                  <Bar dataKey="male" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} name="Male" />
                  <Bar dataKey="female" stackId="a" fill="#ec4899" radius={[8, 8, 0, 0]} name="Female" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Wait Time Analysis */}
            <div className="chart-card professional-card col-span-8">
              <div className="card-header">
                <h3 className="card-title">
                  <Clock style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
                  Wait Time Analysis by Hour
                </h3>
                <Activity className="activity-icon" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.waitTimeAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="emergency" stroke="#ef4444" strokeWidth={3} name="Emergency" dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="consultation" stroke="#3b82f6" strokeWidth={3} name="Consultation" dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="surgery" stroke="#10b981" strokeWidth={3} name="Surgery" dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Patient Satisfaction Radar */}
            <div className="chart-card professional-card col-span-4">
              <div className="card-header">
                <h3 className="card-title">
                  <Award style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
                  Satisfaction Scores
                </h3>
                <Activity className="activity-icon" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data.patientSatisfaction}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="aspect" stroke="#64748b" style={{ fontSize: '0.75rem' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="#64748b" />
                  <Radar name="Score" dataKey="score" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Financial Metrics */}
            <div className="chart-card professional-card col-span-6">
              <div className="card-header">
                <h3 className="card-title">
                  <DollarSign style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
                  Financial Performance
                </h3>
                <Activity className="activity-icon" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.financialMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} name="Revenue" />
                  <Bar dataKey="cost" fill="#ef4444" radius={[8, 8, 0, 0]} name="Cost" />
                  <Bar dataKey="profit" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Bed Occupancy Trends */}
            <div className="chart-card professional-card col-span-6">
              <div className="card-header">
                <h3 className="card-title">
                  <Heart style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
                  Bed Occupancy Trends
                </h3>
                <Activity className="activity-icon" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.bedOccupancy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="icu" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="ICU" />
                  <Area type="monotone" dataKey="general" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="General" />
                  <Area type="monotone" dataKey="emergency" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Emergency" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* AI Performance */}
            <div className="chart-card professional-card col-span-6">
              <div className="card-header">
                <h3 className="card-title">
                  <Brain style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
                  AI Model Performance
                </h3>
                <Activity className="activity-icon" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.aiPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="metric" stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                  <YAxis domain={[0, 100]} stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                  <Legend />
                  <Bar dataKey="target" fill="#e2e8f0" radius={[10, 10, 0, 0]} name="Target" />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[10, 10, 0, 0]} name="Actual Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Treatment Outcomes */}
            <div className="chart-card professional-card col-span-6">
              <div className="card-header">
                <h3 className="card-title">
                  <Stethoscope style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
                  Treatment Outcomes
                </h3>
                <Activity className="activity-icon" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.treatmentOutcomes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="treatment" stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                  <Legend />
                  <Bar dataKey="success" fill="#10b981" radius={[8, 8, 0, 0]} name="Success Rate (%)" />
                  <Bar dataKey="complications" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Complications (%)" />
                  <Bar dataKey="readmission" fill="#ef4444" radius={[8, 8, 0, 0]} name="Readmission (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Insights */}
            <div className="chart-card professional-card col-span-12">
              <div className="card-header">
                <h3 className="card-title">
                  <AlertCircle style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
                  Latest AI Insights & Recommendations
                </h3>
                <Activity className="activity-icon" />
              </div>
              <div className="insights-list">
                {filteredInsights.map((insight, idx) => (
                  <div key={idx} className="insight-item">
                    <div className="insight-header">
                      <h4 className="insight-title">{insight.title}</h4>
                      <span className={`insight-badge ${insight.impact}`}>
                        {insight.impact}
                      </span>
                    </div>
                    <p className="insight-description">{insight.description}</p>
                    <p className="insight-date">{insight.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer-section">
            <div className="compliance-card professional-card">
              <Shield className="compliance-icon green" />
              <div className="compliance-content">
                <h3 className="compliance-title">HIPAA Compliant</h3>
                <p className="compliance-text">
                  All reports and data analytics comply with HIPAA regulations. Patient data is anonymized in aggregated reports.
                </p>
              </div>
            </div>
            
            <div className="compliance-card professional-card">
              <Brain className="compliance-icon blue" />
              <div className="compliance-content">
                <h3 className="compliance-title">Responsible AI</h3>
                <p className="compliance-text">
                  AI models are regularly audited for bias and fairness. All predictions include confidence scores and human oversight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
