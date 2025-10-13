import React, { useState, useEffect } from 'react';
import { Car, Zap, Home, Plane, ShoppingBag, Calculator, TrendingDown, Download, Save, RefreshCw, Share2, Leaf, History, Info, Award, Target, BarChart3, PieChart as PieChartIcon, ArrowUp, ArrowDown, Check } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function CarbonCalculator() {
  const [calculations, setCalculations] = useState({
    transportation: { distance: 0, vehicleType: 'car' },
    electricity: { usage: 0 },
    heating: { usage: 0, type: 'gas' },
    flights: { shortHaul: 0, longHaul: 0 },
    shopping: { amount: 0 }
  });

  const [totalEmissions, setTotalEmissions] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [comparisonMetric, setComparisonMetric] = useState('');
  const [breakdown, setBreakdown] = useState({});
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [savedHistory, setSavedHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showCharts, setShowCharts] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showTips, setShowTips] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

 // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const emissionFactors = {
    car: 0.21,
    motorcycle: 0.103,
    bus: 0.089,
    electricity: 0.82,
    naturalGas: 0.18,
    shortFlight: 0.255,
    longFlight: 0.195,
    shopping: 0.05
  };

  const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'];

  useEffect(() => {
    calculateTotalEmissions();
    loadSavedHistory();
  }, [calculations]);

  const calculateTotalEmissions = () => {
    const transportEmissions = calculations.transportation.distance * 
      emissionFactors[calculations.transportation.vehicleType] * 365;
    
    const electricityEmissions = calculations.electricity.usage * 
      emissionFactors.electricity * 12;
    
    const heatingEmissions = calculations.heating.usage * 
      emissionFactors.naturalGas * 12;
    
    const flightEmissions = 
      (calculations.flights.shortHaul * emissionFactors.shortFlight) +
      (calculations.flights.longHaul * emissionFactors.longFlight);
    
    const shoppingEmissions = calculations.shopping.amount * 
      emissionFactors.shopping * 12;

    const total = transportEmissions + electricityEmissions + heatingEmissions + 
            flightEmissions + shoppingEmissions;

    const breakdownData = {
      transportation: (transportEmissions / 1000).toFixed(2),
      electricity: (electricityEmissions / 1000).toFixed(2),
      heating: (heatingEmissions / 1000).toFixed(2),
      flights: (flightEmissions / 1000).toFixed(2),
      shopping: (shoppingEmissions / 1000).toFixed(2)
    };

    setBreakdown(breakdownData);
    setTotalEmissions(total / 1000);
    generateRecommendations(total / 1000);
    setComparisonMetric(getComparisonMetric(total / 1000));
    
    // Prepare chart data
    const pieData = [
      { name: 'Transportation', value: parseFloat(breakdownData.transportation), color: COLORS[0] },
      { name: 'Electricity', value: parseFloat(breakdownData.electricity), color: COLORS[1] },
      { name: 'Heating', value: parseFloat(breakdownData.heating), color: COLORS[2] },
      { name: 'Flights', value: parseFloat(breakdownData.flights), color: COLORS[3] },
      { name: 'Shopping', value: parseFloat(breakdownData.shopping), color: COLORS[4] }
    ];
    setChartData(pieData);

    const compData = [
      { name: 'Your Footprint', value: (total / 1000).toFixed(2) },
      { name: 'India Avg', value: 1.9 },
      { name: 'Global Avg', value: 4.7 },
      { name: 'Target', value: 2.0 }
    ];
    setComparisonData(compData);
  };

  const generateRecommendations = (emissions) => {
    const recs = [];
    
    if (calculations.transportation.vehicleType === 'car' && calculations.transportation.distance > 0) {
      recs.push({
        icon: Car,
        title: "Switch to Public Transport",
        impact: "Reduce emissions by 40%",
        savings: (emissions * 0.4).toFixed(2) + " tons CO2/year",
        color: '#3b82f6',
        priority: 'high'
      });
    }

    if (calculations.electricity.usage > 200) {
      recs.push({
        icon: Zap,
        title: "Install Solar Panels",
        impact: "Reduce emissions by 30%",
        savings: (emissions * 0.3).toFixed(2) + " tons CO2/year",
        color: '#f59e0b',
        priority: 'high'
      });
    }

    if (calculations.flights.longHaul > 2) {
      recs.push({
        icon: Plane,
        title: "Consider Virtual Meetings",
        impact: "Reduce emissions by 25%",
        savings: (emissions * 0.25).toFixed(2) + " tons CO2/year",
        color: '#8b5cf6',
        priority: 'medium'
      });
    }

    if (calculations.electricity.usage > 0) {
      recs.push({
        icon: Zap,
        title: "Switch to LED Bulbs",
        impact: "Reduce emissions by 10%",
        savings: (emissions * 0.1).toFixed(2) + " tons CO2/year",
        color: '#f59e0b',
        priority: 'low'
      });
    }

    recs.push({
      icon: Home,
      title: "Energy-Efficient Appliances",
      impact: "Reduce emissions by 15%",
      savings: (emissions * 0.15).toFixed(2) + " tons CO2/year",
      color: '#10b981',
      priority: 'medium'
    });

    if (calculations.shopping.amount > 5000) {
      recs.push({
        icon: ShoppingBag,
        title: "Buy Local Products",
        impact: "Reduce emissions by 8%",
        savings: (emissions * 0.08).toFixed(2) + " tons CO2/year",
        color: '#10b981',
        priority: 'low'
      });
    }

    setRecommendations(recs);
  };

  const getComparisonMetric = (emissions) => {
    const trees = Math.round(emissions * 45);
    const cars = Math.round(emissions / 4.6);
    return {
      trees,
      cars,
      phones: Math.round(emissions * 121000),
      text: `Equivalent to ${trees} trees needed to offset your carbon footprint annually`
    };
  };

  const handleInputChange = (category, field, value) => {
    setCalculations(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: field === 'vehicleType' ? value : (parseFloat(value) || 0)
      }
    }));
  };

  const getEmissionLevel = (emissions) => {
    if (emissions < 5) return { 
      text: 'Excellent', 
      color: 'text-green-600', 
      bg: 'bg-green-100', 
      gradient: 'from-green-500 to-emerald-600',
      message: 'Outstanding! Your carbon footprint is well below average.'
    };
    if (emissions < 10) return { 
      text: 'Good', 
      color: 'text-blue-600', 
      bg: 'bg-blue-100', 
      gradient: 'from-blue-500 to-cyan-600',
      message: 'Good job! Your footprint is below the global average.'
    };
    if (emissions < 15) return { 
      text: 'Average', 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100', 
      gradient: 'from-yellow-500 to-orange-600',
      message: 'Room for improvement. Try implementing our recommendations.'
    };
    return { 
      text: 'High', 
      color: 'text-red-600', 
      bg: 'bg-red-100', 
      gradient: 'from-red-500 to-pink-600',
      message: 'Action needed! Your footprint is above average. Follow our tips to reduce it.'
    };
  };

  const saveToBackend = async () => {
    setSaving(true);
    try {
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId') || 'guest-user';

      const dataToSave = {
        userId,
        calculations,
        totalEmissions,
        breakdown,
        timestamp: new Date().toISOString()
      };

      // Save to localStorage
      const savedData = JSON.parse(localStorage.getItem('carbonFootprintHistory') || '[]');
      savedData.unshift(dataToSave);
      // Keep only last 10 entries
      if (savedData.length > 10) savedData.pop();
      localStorage.setItem('carbonFootprintHistory', JSON.stringify(savedData));

      // Try backend save
      try {
        const response = await fetch(`${API_BASE_URL}/environment/carbon-footprint/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(dataToSave)
        });

        if (response.ok) {
          alert('✅ Carbon footprint data saved successfully!');
        }
      } catch (apiError) {
        console.log('Backend save failed, data saved locally');
      }

      loadSavedHistory();
      alert('✅ Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('⚠️ Failed to save data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const loadSavedHistory = () => {
    const history = JSON.parse(localStorage.getItem('carbonFootprintHistory') || '[]');
    setSavedHistory(history);
  };

  const loadHistoryItem = (item) => {
    setCalculations(item.calculations);
    setSelectedHistory(item);
    setShowHistory(false);
  };

  const deleteHistoryItem = (index) => {
    const history = [...savedHistory];
    history.splice(index, 1);
    localStorage.setItem('carbonFootprintHistory', JSON.stringify(history));
    loadSavedHistory();
  };

  const downloadPDF = () => {
    setDownloading(true);
    try {
      const doc = new jsPDF();
      const level = getEmissionLevel(totalEmissions);
      const comparison = getComparisonMetric(totalEmissions);

      // Header
      doc.setFillColor(34, 197, 94);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Carbon Footprint Report', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, 105, 30, { align: 'center' });

      doc.setTextColor(0, 0, 0);

      // Total Emissions Box
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Your Annual Carbon Footprint', 20, 55);
      
      doc.setFillColor(59, 130, 246);
      doc.roundedRect(20, 60, 170, 35, 5, 5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(36);
      doc.text(`${totalEmissions.toFixed(2)} tons CO2`, 105, 78, { align: 'center' });
      doc.setFontSize(14);
      doc.text(`Status: ${level.text}`, 105, 88, { align: 'center' });

      // Emissions Breakdown
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Emissions Breakdown', 20, 110);

      const breakdownTableData = [
        ['Category', 'Emissions (tons CO2)', 'Percentage'],
        ['Transportation', breakdown.transportation, `${((breakdown.transportation / totalEmissions) * 100).toFixed(1)}%`],
        ['Electricity', breakdown.electricity, `${((breakdown.electricity / totalEmissions) * 100).toFixed(1)}%`],
        ['Heating', breakdown.heating, `${((breakdown.heating / totalEmissions) * 100).toFixed(1)}%`],
        ['Flights', breakdown.flights, `${((breakdown.flights / totalEmissions) * 100).toFixed(1)}%`],
        ['Shopping', breakdown.shopping, `${((breakdown.shopping / totalEmissions) * 100).toFixed(1)}%`]
      ];

      doc.autoTable({
        startY: 115,
        head: [breakdownTableData[0]],
        body: breakdownTableData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        margin: { left: 20, right: 20 }
      });

      // Impact Comparison
      let yPos = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Environmental Impact', 20, yPos);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      yPos += 8;
      doc.text(`• ${comparison.trees} trees needed to offset your footprint`, 25, yPos);
      yPos += 7;
      doc.text(`• Equivalent to driving ${comparison.cars} cars for a year`, 25, yPos);
      yPos += 7;
      doc.text(`• Equal to charging ${comparison.phones.toLocaleString()} smartphones`, 25, yPos);
      yPos += 10;
      doc.text(`• Global average: 4.7 tons/person`, 25, yPos);
      yPos += 7;
      doc.text(`• India average: 1.9 tons/person`, 25, yPos);

      // Recommendations
      yPos += 15;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('AI-Powered Recommendations', 20, yPos);

      recommendations.forEach((rec, index) => {
        yPos += 10;
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${rec.title}`, 25, yPos);
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`   ${rec.impact} - Save: ${rec.savings}`, 25, yPos);
        yPos += 5;
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`   Priority: ${rec.priority.toUpperCase()}`, 25, yPos);
        doc.setTextColor(0, 0, 0);
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
        doc.text('Generated by EcoMonitor - Environmental Management System', 105, 285, { align: 'center' });
      }

      doc.save(`Carbon_Footprint_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      alert('✅ PDF downloaded successfully to your Downloads folder!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('⚠️ Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const shareResults = async () => {
    const level = getEmissionLevel(totalEmissions);
    const shareText = `My Carbon Footprint: ${totalEmissions.toFixed(2)} tons CO2/year\nStatus: ${level.text}\n\nCalculated using EcoMonitor's AI-powered Carbon Calculator`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Carbon Footprint',
          text: shareText
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('✅ Results copied to clipboard!');
    }
  };

  const resetCalculator = () => {
    if (window.confirm('Are you sure you want to reset all calculations?')) {
      setCalculations({
        transportation: { distance: 0, vehicleType: 'car' },
        electricity: { usage: 0 },
        heating: { usage: 0, type: 'gas' },
        flights: { shortHaul: 0, longHaul: 0 },
        shopping: { amount: 0 }
      });
      alert('✅ Calculator reset successfully!');
    }
  };

  const level = getEmissionLevel(totalEmissions);
  const comparison = typeof comparisonMetric === 'object' ? comparisonMetric : getComparisonMetric(totalEmissions);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideInRight {
          from { transform: translateX(-40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes rotate3d {
          0% { transform: perspective(1000px) rotateY(0deg); }
          100% { transform: perspective(1000px) rotateY(360deg); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .calculator-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #dbeafe 0%, #d1fae5 100%);
          padding: 24px;
          animation: fadeInUp 0.6s ease-out;
        }

        .header-card {
          background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          padding: 40px;
          margin-bottom: 32px;
          animation: fadeInUp 0.8s ease-out;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .header-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%);
          animation: rotate3d 20s linear infinite;
          pointer-events: none;
        }

        .input-card {
          background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: slideInRight 0.6s ease-out;
          animation-fill-mode: both;
          border: 1px solid #e2e8f0;
        }

        .input-card:nth-child(1) { animation-delay: 0.1s; }
        .input-card:nth-child(2) { animation-delay: 0.2s; }
        .input-card:nth-child(3) { animation-delay: 0.3s; }
        .input-card:nth-child(4) { animation-delay: 0.4s; }
        .input-card:nth-child(5) { animation-delay: 0.5s; }

        .input-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
          transition: left 0.6s ease;
        }

        .input-card:hover::before {
          left: 100%;
        }

        .input-card:hover {
          transform: translateY(-8px) rotateX(2deg);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
        }

        .result-card {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
          color: white;
          position: relative;
          overflow: hidden;
          animation: fadeInUp 1s ease-out;
        }

        .result-card::before {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          top: -100px;
          right: -100px;
          animation: pulse 4s ease-in-out infinite;
        }

        .comparison-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }

        .comparison-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
        }

        .recommendation-card {
          background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
          border-radius: 16px;
          padding: 20px;
          border-left: 4px solid;
          transition: all 0.3s ease;
          animation: slideInRight 0.6s ease-out;
          animation-fill-mode: both;
        }

        .recommendation-card:hover {
          transform: translateX(8px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .input-field {
          width: 100%;
          padding: 14px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          transition: all 0.3s ease;
          background: white;
        }

        .input-field:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          transform: scale(1.02);
        }

        .action-btn {
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }

        .action-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .action-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
        }

        .action-btn.secondary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }

        .action-btn.danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }

        .action-btn.outline {
          background: white;
          color: #3b82f6;
          border: 2px solid #3b82f6;
        }

        .floating-icon {
          animation: float 3s ease-in-out infinite;
        }

        .icon-bounce {
          animation: pulse 2s ease-in-out infinite;
        }

        .history-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeInUp 0.3s ease-out;
        }

        .history-content {
          background: white;
          border-radius: 24px;
          padding: 32px;
          max-width: 800px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideDown 0.3s ease-out;
        }

        .history-item {
          background: linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 12px;
          border-left: 4px solid #3b82f6;
          transition: all 0.3s ease;
        }

        .history-item:hover {
          transform: translateX(8px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .tip-card {
          background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
          border-radius: 12px;
          padding: 16px;
          border-left: 4px solid #f59e0b;
          margin-bottom: 12px;
        }

        @media (max-width: 768px) {
          .header-card {
            padding: 24px;
          }

          .input-card {
            padding: 20px;
          }

          .action-btn {
            padding: 12px 20px;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="calculator-container">
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div className="header-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)' }}>
                <Calculator size={32} style={{ color: 'white' }} className="floating-icon" />
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>
                  AI-Powered Carbon Calculator
                </h1>
                <p style={{ color: '#64748b', margin: 0, fontSize: '16px' }}>
                  Calculate and reduce your environmental impact with smart recommendations
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                className="action-btn primary" 
                onClick={saveToBackend}
                disabled={saving || totalEmissions === 0}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
                  {saving ? <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
                  <span>{saving ? 'Saving...' : 'Save Data'}</span>
                </div>
              </button>
              <button 
                className="action-btn secondary" 
                onClick={downloadPDF}
                disabled={downloading || totalEmissions === 0}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
                  {downloading ? <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={18} />}
                  <span>{downloading ? 'Generating...' : 'Download PDF'}</span>
                </div>
              </button>
              <button 
                className="action-btn outline" 
                onClick={() => setShowHistory(true)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
                  <History size={18} />
                  <span>History ({savedHistory.length})</span>
                </div>
              </button>
              <button 
                className="action-btn outline" 
                onClick={shareResults}
                disabled={totalEmissions === 0}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
                  <Share2 size={18} />
                  <span>Share</span>
                </div>
              </button>
              <button 
                className="action-btn danger" 
                onClick={resetCalculator}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
                  <RefreshCw size={18} />
                  <span>Reset</span>
                </div>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            {/* Input Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Transportation */}
              <div className="input-card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <Car size={24} style={{ color: '#3b82f6', marginRight: '12px' }} className="icon-bounce" />
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Daily Transportation</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                      Vehicle Type
                    </label>
                    <select
                      value={calculations.transportation.vehicleType}
                      onChange={(e) => handleInputChange('transportation', 'vehicleType', e.target.value)}
                      className="input-field"
                    >
                      <option value="car">🚗 Car (0.21 kg CO2/km)</option>
                      <option value="motorcycle">🏍️ Motorcycle (0.103 kg CO2/km)</option>
                      <option value="bus">🚌 Bus (0.089 kg CO2/km)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                      Daily Distance (km)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={calculations.transportation.distance}
                      onChange={(e) => handleInputChange('transportation', 'distance', e.target.value)}
                      className="input-field"
                      placeholder="Enter distance"
                    />
                  </div>
                </div>
                {calculations.transportation.distance > 0 && (
                  <div style={{ marginTop: '12px', padding: '12px', background: '#eff6ff', borderRadius: '8px', fontSize: '13px', color: '#1e40af' }}>
                    💡 Annual emissions: {(calculations.transportation.distance * emissionFactors[calculations.transportation.vehicleType] * 365 / 1000).toFixed(2)} tons CO2
                  </div>
                )}
              </div>

              {/* Energy Usage */}
              <div className="input-card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <Zap size={24} style={{ color: '#f59e0b', marginRight: '12px' }} className="icon-bounce" />
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Energy Consumption</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                      Monthly Electricity (kWh)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={calculations.electricity.usage}
                      onChange={(e) => handleInputChange('electricity', 'usage', e.target.value)}
                      className="input-field"
                      placeholder="Enter kWh"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                      Monthly Heating (m³ gas)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={calculations.heating.usage}
                      onChange={(e) => handleInputChange('heating', 'usage', e.target.value)}
                      className="input-field"
                      placeholder="Enter m³"
                    />
                  </div>
                </div>
              </div>

              {/* Air Travel */}
              <div className="input-card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <Plane size={24} style={{ color: '#8b5cf6', marginRight: '12px' }} className="icon-bounce" />
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Annual Air Travel</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                      Short-haul Flights (&lt;1500km)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={calculations.flights.shortHaul}
                      onChange={(e) => handleInputChange('flights', 'shortHaul', e.target.value)}
                      className="input-field"
                      placeholder="Number of flights"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                      Long-haul Flights (&gt;1500km)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={calculations.flights.longHaul}
                      onChange={(e) => handleInputChange('flights', 'longHaul', e.target.value)}
                      className="input-field"
                      placeholder="Number of flights"
                    />
                  </div>
                </div>
              </div>

              {/* Shopping */}
              <div className="input-card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <ShoppingBag size={24} style={{ color: '#10b981', marginRight: '12px' }} className="icon-bounce" />
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Shopping & Consumption</h2>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                    Monthly Spending (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={calculations.shopping.amount}
                    onChange={(e) => handleInputChange('shopping', 'amount', e.target.value)}
                    className="input-field"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Total Emissions */}
              <div className="result-card">
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Leaf size={32} className="floating-icon" />
                    <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Your Annual Carbon Footprint</h2>
                  </div>
                  <div style={{ fontSize: '56px', fontWeight: '800', marginBottom: '8px' }}>{totalEmissions.toFixed(2)}</div>
                  <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '16px' }}>tons CO2 equivalent</p>
                  <div style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', fontWeight: '700', fontSize: '16px', marginBottom: '12px' }}>
                    Status: {level.text}
                  </div>
                  <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '8px' }}>{level.message}</p>
                </div>
              </div>

              {/* Charts */}
              {showCharts && totalEmissions > 0 && (
                <div className="comparison-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Emissions Breakdown</h3>
                    <PieChartIcon size={20} style={{ color: '#3b82f6' }} />
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Comparison */}
              <div className="comparison-card">
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Impact Comparison</h3>
                {totalEmissions > 0 ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#16a34a', marginBottom: '4px' }}>{comparison.trees}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Trees Needed</div>
                      </div>
                      <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#f59e0b', marginBottom: '4px' }}>{comparison.cars}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Car Years</div>
                      </div>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #dbeafe 100%)', borderLeft: '4px solid #10b981', borderRadius: '8px', padding: '16px' }}>
                      <p style={{ fontSize: '14px', color: '#1e293b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong>Global average:</strong> 4.7 tons/person
                        {totalEmissions > 4.7 ? <ArrowUp size={16} style={{ color: '#ef4444' }} /> : <ArrowDown size={16} style={{ color: '#10b981' }} />}
                      </p>
                      <p style={{ fontSize: '14px', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong>India average:</strong> 1.9 tons/person
                        {totalEmissions > 1.9 ? <ArrowUp size={16} style={{ color: '#ef4444' }} /> : <ArrowDown size={16} style={{ color: '#10b981' }} />}
                      </p>
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', padding: '20px' }}>
                    Enter your data to see impact comparison
                  </p>
                )}
              </div>

              {/* AI Recommendations */}
              <div className="comparison-card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <TrendingDown size={24} style={{ color: '#10b981', marginRight: '12px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>AI-Powered Recommendations</h3>
                </div>
                {recommendations.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recommendations.map((rec, index) => {
                      const Icon = rec.icon;
                      return (
                        <div key={index} className="recommendation-card" style={{ borderColor: rec.color, animationDelay: `${0.1 * (index + 1)}s` }}>
                          <div style={{ display: 'flex', alignItems: 'start' }}>
                            <Icon size={20} style={{ color: rec.color, marginRight: '12px', flexShrink: 0, marginTop: '2px' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <h4 style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px', margin: 0 }}>{rec.title}</h4>
                                <span style={{ 
                                  fontSize: '10px', 
                                  padding: '4px 8px', 
                                  borderRadius: '6px', 
                                  background: rec.priority === 'high' ? '#fef2f2' : rec.priority === 'medium' ? '#fef3c7' : '#f0fdf4',
                                  color: rec.priority === 'high' ? '#dc2626' : rec.priority === 'medium' ? '#f59e0b' : '#16a34a',
                                  fontWeight: '700',
                                  textTransform: 'uppercase'
                                }}>
                                  {rec.priority}
                                </span>
                              </div>
                              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{rec.impact}</p>
                              <p style={{ fontSize: '12px', fontWeight: '700', margin: 0, color: rec.color }}>💰 Save: {rec.savings}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', padding: '20px' }}>
                    Enter your data to get personalized recommendations
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="history-modal" onClick={() => setShowHistory(false)}>
          <div className="history-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <History size={28} style={{ color: '#3b82f6' }} />
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Calculation History</h2>
              </div>
              <button 
                onClick={() => setShowHistory(false)}
                style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#f1f5f9', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {savedHistory.length > 0 ? (
              <div>
                {savedHistory.map((item, index) => (
                  <div key={index} className="history-item">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                          {item.totalEmissions.toFixed(2)} tons CO2
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                          {new Date(item.timestamp).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => loadHistoryItem(item)}
                          style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                        >
                          Load
                        </button>
                        <button 
                          onClick={() => deleteHistoryItem(index)}
                          style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', fontSize: '12px' }}>
                      <div>🚗 Transport: {item.breakdown.transportation}t</div>
                      <div>⚡ Electricity: {item.breakdown.electricity}t</div>
                      <div>🔥 Heating: {item.breakdown.heating}t</div>
                      <div>✈️ Flights: {item.breakdown.flights}t</div>
                      <div>🛍️ Shopping: {item.breakdown.shopping}t</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <History size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                <p>No calculation history yet. Save your first calculation!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
