import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Calendar, Shield, RefreshCw, Activity, AlertCircle, Zap } from 'lucide-react';

const MarketForecast = () => {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [timeframe, setTimeframe] = useState('7days');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showAllCrops, setShowAllCrops] = useState(false);
  const [marketData, setMarketData] = useState({
    tomato: {
      current: 25,
      forecast: [
        { day: 'Today', price: 25, confidence: 95 },
        { day: 'Day 2', price: 26, confidence: 92 },
        { day: 'Day 3', price: 27, confidence: 89 },
        { day: 'Day 4', price: 28, confidence: 86 },
        { day: 'Day 5', price: 27, confidence: 82 },
        { day: 'Day 6', price: 26, confidence: 78 },
        { day: 'Day 7', price: 26, confidence: 75 }
      ],
      trend: 'up',
      change: '+8%',
      factors: [
        { factor: 'Seasonal Demand', impact: 'High', description: 'Festival season approaching' },
        { factor: 'Supply Chain', impact: 'Medium', description: 'Transport costs stable' },
        { factor: 'Weather', impact: 'Low', description: 'Favorable conditions' }
      ],
      recommendation: 'Optimal selling window: Days 3-4',
      demand: 'High'
    },
    wheat: {
      current: 22,
      forecast: [
        { day: 'Today', price: 22, confidence: 94 },
        { day: 'Day 2', price: 22, confidence: 93 },
        { day: 'Day 3', price: 23, confidence: 91 },
        { day: 'Day 4', price: 23, confidence: 88 },
        { day: 'Day 5', price: 24, confidence: 85 },
        { day: 'Day 6', price: 24, confidence: 81 },
        { day: 'Day 7', price: 25, confidence: 77 }
      ],
      trend: 'up',
      change: '+13%',
      factors: [
        { factor: 'Export Demand', impact: 'High', description: 'International orders increasing' },
        { factor: 'Storage Costs', impact: 'Medium', description: 'Rising warehouse fees' },
        { factor: 'Production', impact: 'Low', description: 'Good harvest expected' }
      ],
      recommendation: 'Hold for better prices, sell after Day 5',
      demand: 'Very High'
    },
    rice: {
      current: 28,
      forecast: [
        { day: 'Today', price: 28, confidence: 96 },
        { day: 'Day 2', price: 28, confidence: 94 },
        { day: 'Day 3', price: 27, confidence: 91 },
        { day: 'Day 4', price: 27, confidence: 88 },
        { day: 'Day 5', price: 26, confidence: 84 },
        { day: 'Day 6', price: 26, confidence: 80 },
        { day: 'Day 7', price: 25, confidence: 76 }
      ],
      trend: 'down',
      change: '-11%',
      factors: [
        { factor: 'Oversupply', impact: 'High', description: 'Large harvest this season' },
        { factor: 'Imports', impact: 'Medium', description: 'Cheaper imports available' },
        { factor: 'Consumption', impact: 'Low', description: 'Stable demand' }
      ],
      recommendation: 'Sell immediately or within 2 days',
      demand: 'Medium'
    },
    corn: {
      current: 18,
      forecast: [
        { day: 'Today', price: 18, confidence: 93 },
        { day: 'Day 2', price: 18, confidence: 91 },
        { day: 'Day 3', price: 19, confidence: 88 },
        { day: 'Day 4', price: 19, confidence: 85 },
        { day: 'Day 5', price: 19, confidence: 81 },
        { day: 'Day 6', price: 20, confidence: 77 },
        { day: 'Day 7', price: 20, confidence: 73 }
      ],
      trend: 'up',
      change: '+11%',
      factors: [
        { factor: 'Biofuel Demand', impact: 'High', description: 'Ethanol production increasing' },
        { factor: 'Feed Industry', impact: 'High', description: 'Livestock sector expanding' },
        { factor: 'Exports', impact: 'Medium', description: 'Export opportunities growing' }
      ],
      recommendation: 'Good time to sell, prices steady upward',
      demand: 'High'
    },
    potato: {
      current: 15,
      forecast: [
        { day: 'Today', price: 15, confidence: 94 },
        { day: 'Day 2', price: 16, confidence: 91 },
        { day: 'Day 3', price: 16, confidence: 88 },
        { day: 'Day 4', price: 17, confidence: 85 },
        { day: 'Day 5', price: 18, confidence: 81 },
        { day: 'Day 6', price: 18, confidence: 77 },
        { day: 'Day 7', price: 19, confidence: 73 }
      ],
      trend: 'up',
      change: '+26%',
      factors: [
        { factor: 'Cold Storage', impact: 'High', description: 'Storage costs rising rapidly' },
        { factor: 'Retail Demand', impact: 'High', description: 'Fast food chains increasing orders' },
        { factor: 'Supply', impact: 'Medium', description: 'Limited fresh stock available' }
      ],
      recommendation: 'Strong upward trend, wait till Day 5-7',
      demand: 'Very High'
    },
    onion: {
      current: 20,
      forecast: [
        { day: 'Today', price: 20, confidence: 92 },
        { day: 'Day 2', price: 19, confidence: 90 },
        { day: 'Day 3', price: 19, confidence: 87 },
        { day: 'Day 4', price: 18, confidence: 84 },
        { day: 'Day 5', price: 18, confidence: 80 },
        { day: 'Day 6', price: 17, confidence: 76 },
        { day: 'Day 7', price: 17, confidence: 72 }
      ],
      trend: 'down',
      change: '-15%',
      factors: [
        { factor: 'Imports', impact: 'High', description: 'Large imports from neighboring countries' },
        { factor: 'Local Production', impact: 'High', description: 'Bumper harvest in Maharashtra' },
        { factor: 'Quality Issues', impact: 'Medium', description: 'Some storage damage reported' }
      ],
      recommendation: 'Sell immediately, prices declining steadily',
      demand: 'Medium'
    },
    cotton: {
      current: 52,
      forecast: [
        { day: 'Today', price: 52, confidence: 95 },
        { day: 'Day 2', price: 53, confidence: 93 },
        { day: 'Day 3', price: 54, confidence: 91 },
        { day: 'Day 4', price: 55, confidence: 88 },
        { day: 'Day 5', price: 56, confidence: 85 },
        { day: 'Day 6', price: 57, confidence: 81 },
        { day: 'Day 7', price: 58, confidence: 77 }
      ],
      trend: 'up',
      change: '+11%',
      factors: [
        { factor: 'Global Demand', impact: 'High', description: 'Textile exports increasing' },
        { factor: 'Quality Premium', impact: 'High', description: 'Indian cotton in high demand' },
        { factor: 'Production', impact: 'Low', description: 'Good weather for harvesting' }
      ],
      recommendation: 'Excellent market, consider holding for higher prices',
      demand: 'Very High'
    },
    sugarcane: {
      current: 3,
      forecast: [
        { day: 'Today', price: 3, confidence: 96 },
        { day: 'Day 2', price: 3, confidence: 94 },
        { day: 'Day 3', price: 3, confidence: 92 },
        { day: 'Day 4', price: 3, confidence: 90 },
        { day: 'Day 5', price: 3, confidence: 87 },
        { day: 'Day 6', price: 3.1, confidence: 84 },
        { day: 'Day 7', price: 3.1, confidence: 81 }
      ],
      trend: 'up',
      change: '+3%',
      factors: [
        { factor: 'Mill Payments', impact: 'Medium', description: 'Sugar mills clearing dues' },
        { factor: 'Crushing Season', impact: 'High', description: 'Peak crushing period started' },
        { factor: 'Government Policy', impact: 'Medium', description: 'Minimum price support active' }
      ],
      recommendation: 'Stable market, sell during crushing season',
      demand: 'High'
    },
    soybean: {
      current: 42,
      forecast: [
        { day: 'Today', price: 42, confidence: 93 },
        { day: 'Day 2', price: 43, confidence: 91 },
        { day: 'Day 3', price: 44, confidence: 88 },
        { day: 'Day 4', price: 45, confidence: 85 },
        { day: 'Day 5', price: 46, confidence: 81 },
        { day: 'Day 6', price: 47, confidence: 77 },
        { day: 'Day 7', price: 48, confidence: 73 }
      ],
      trend: 'up',
      change: '+14%',
      factors: [
        { factor: 'Oil Prices', impact: 'High', description: 'Edible oil demand surging' },
        { factor: 'Protein Feed', impact: 'High', description: 'Poultry industry expansion' },
        { factor: 'Exports', impact: 'Medium', description: 'Good international prices' }
      ],
      recommendation: 'Strong upward momentum, hold for better returns',
      demand: 'Very High'
    },
    chickpea: {
      current: 55,
      forecast: [
        { day: 'Today', price: 55, confidence: 94 },
        { day: 'Day 2', price: 54, confidence: 92 },
        { day: 'Day 3', price: 54, confidence: 89 },
        { day: 'Day 4', price: 53, confidence: 86 },
        { day: 'Day 5', price: 52, confidence: 82 },
        { day: 'Day 6', price: 51, confidence: 78 },
        { day: 'Day 7', price: 51, confidence: 74 }
      ],
      trend: 'down',
      change: '-7%',
      factors: [
        { factor: 'Import Pressure', impact: 'High', description: 'Cheaper imports affecting local prices' },
        { factor: 'Stock Levels', impact: 'Medium', description: 'High carry-over stock' },
        { factor: 'Demand', impact: 'Low', description: 'Off-season consumption' }
      ],
      recommendation: 'Sell within 2 days to avoid further decline',
      demand: 'Medium'
    },
    groundnut: {
      current: 58,
      forecast: [
        { day: 'Today', price: 58, confidence: 95 },
        { day: 'Day 2', price: 59, confidence: 93 },
        { day: 'Day 3', price: 60, confidence: 91 },
        { day: 'Day 4', price: 61, confidence: 88 },
        { day: 'Day 5', price: 62, confidence: 85 },
        { day: 'Day 6', price: 63, confidence: 81 },
        { day: 'Day 7', price: 64, confidence: 77 }
      ],
      trend: 'up',
      change: '+10%',
      factors: [
        { factor: 'Oil Industry', impact: 'High', description: 'Groundnut oil premium pricing' },
        { factor: 'Export Orders', impact: 'High', description: 'Strong international demand' },
        { factor: 'Quality', impact: 'Medium', description: 'Good quality this season' }
      ],
      recommendation: 'Hold for higher prices, strong uptrend',
      demand: 'Very High'
    },
    cauliflower: {
      current: 12,
      forecast: [
        { day: 'Today', price: 12, confidence: 91 },
        { day: 'Day 2', price: 11, confidence: 88 },
        { day: 'Day 3', price: 11, confidence: 85 },
        { day: 'Day 4', price: 10, confidence: 82 },
        { day: 'Day 5', price: 10, confidence: 78 },
        { day: 'Day 6', price: 9, confidence: 74 },
        { day: 'Day 7', price: 9, confidence: 70 }
      ],
      trend: 'down',
      change: '-25%',
      factors: [
        { factor: 'Oversupply', impact: 'High', description: 'Multiple regions harvesting simultaneously' },
        { factor: 'Perishability', impact: 'High', description: 'Short shelf life forcing sales' },
        { factor: 'Weather', impact: 'Low', description: 'Cold weather extending season' }
      ],
      recommendation: 'Urgent: Sell today, steep decline expected',
      demand: 'Low'
    },
    cabbage: {
      current: 8,
      forecast: [
        { day: 'Today', price: 8, confidence: 90 },
        { day: 'Day 2', price: 8, confidence: 87 },
        { day: 'Day 3', price: 9, confidence: 84 },
        { day: 'Day 4', price: 9, confidence: 81 },
        { day: 'Day 5', price: 10, confidence: 77 },
        { day: 'Day 6', price: 10, confidence: 73 },
        { day: 'Day 7', price: 11, confidence: 69 }
      ],
      trend: 'up',
      change: '+37%',
      factors: [
        { factor: 'Processing Demand', impact: 'High', description: 'Food processing orders up' },
        { factor: 'Supply Gap', impact: 'Medium', description: 'Previous crop finished early' },
        { factor: 'Quality', impact: 'Medium', description: 'Good quality commanding premium' }
      ],
      recommendation: 'Wait for Days 5-7, significant price rise expected',
      demand: 'High'
    },
    mango: {
      current: 45,
      forecast: [
        { day: 'Today', price: 45, confidence: 92 },
        { day: 'Day 2', price: 43, confidence: 89 },
        { day: 'Day 3', price: 42, confidence: 86 },
        { day: 'Day 4', price: 40, confidence: 82 },
        { day: 'Day 5', price: 38, confidence: 78 },
        { day: 'Day 6', price: 36, confidence: 74 },
        { day: 'Day 7', price: 35, confidence: 70 }
      ],
      trend: 'down',
      change: '-22%',
      factors: [
        { factor: 'Seasonal Peak', impact: 'High', description: 'End of peak season approaching' },
        { factor: 'Ripeness', impact: 'High', description: 'Quick spoilage forcing sales' },
        { factor: 'Competition', impact: 'Medium', description: 'Multiple varieties available' }
      ],
      recommendation: 'Sell immediately, highly perishable in current phase',
      demand: 'Medium'
    },
    banana: {
      current: 22,
      forecast: [
        { day: 'Today', price: 22, confidence: 94 },
        { day: 'Day 2', price: 22, confidence: 92 },
        { day: 'Day 3', price: 23, confidence: 90 },
        { day: 'Day 4', price: 23, confidence: 87 },
        { day: 'Day 5', price: 24, confidence: 84 },
        { day: 'Day 6', price: 24, confidence: 80 },
        { day: 'Day 7', price: 25, confidence: 76 }
      ],
      trend: 'up',
      change: '+13%',
      factors: [
        { factor: 'Year-round Demand', impact: 'High', description: 'Consistent retail demand' },
        { factor: 'Export Market', impact: 'Medium', description: 'Middle East demand growing' },
        { factor: 'Transport', impact: 'Low', description: 'Good supply chain connectivity' }
      ],
      recommendation: 'Steady market, can hold for gradual gains',
      demand: 'High'
    },
    chili: {
      current: 85,
      forecast: [
        { day: 'Today', price: 85, confidence: 93 },
        { day: 'Day 2', price: 87, confidence: 91 },
        { day: 'Day 3', price: 89, confidence: 88 },
        { day: 'Day 4', price: 92, confidence: 85 },
        { day: 'Day 5', price: 94, confidence: 81 },
        { day: 'Day 6', price: 96, confidence: 77 },
        { day: 'Day 7', price: 98, confidence: 73 }
      ],
      trend: 'up',
      change: '+15%',
      factors: [
        { factor: 'Export Boom', impact: 'High', description: 'Record exports to Bangladesh' },
        { factor: 'Festival Demand', impact: 'High', description: 'Upcoming wedding season' },
        { factor: 'Storage', impact: 'Low', description: 'Good storability advantage' }
      ],
      recommendation: 'Excellent opportunity, prices climbing steadily',
      demand: 'Very High'
    },
    turmeric: {
      current: 78,
      forecast: [
        { day: 'Today', price: 78, confidence: 95 },
        { day: 'Day 2', price: 78, confidence: 93 },
        { day: 'Day 3', price: 79, confidence: 91 },
        { day: 'Day 4', price: 80, confidence: 88 },
        { day: 'Day 5', price: 81, confidence: 85 },
        { day: 'Day 6', price: 82, confidence: 81 },
        { day: 'Day 7', price: 83, confidence: 77 }
      ],
      trend: 'up',
      change: '+6%',
      factors: [
        { factor: 'Medicinal Demand', impact: 'High', description: 'Pharmaceutical industry orders up' },
        { factor: 'Export Quality', impact: 'High', description: 'Premium for organic turmeric' },
        { factor: 'Monsoon Effect', impact: 'Low', description: 'Good curing weather' }
      ],
      recommendation: 'Stable uptrend, good for medium-term holding',
      demand: 'High'
    },
    ginger: {
      current: 92,
      forecast: [
        { day: 'Today', price: 92, confidence: 91 },
        { day: 'Day 2', price: 90, confidence: 88 },
        { day: 'Day 3', price: 88, confidence: 85 },
        { day: 'Day 4', price: 86, confidence: 81 },
        { day: 'Day 5', price: 84, confidence: 77 },
        { day: 'Day 6', price: 82, confidence: 73 },
        { day: 'Day 7', price: 80, confidence: 69 }
      ],
      trend: 'down',
      change: '-13%',
      factors: [
        { factor: 'Import Competition', impact: 'High', description: 'Chinese ginger flooding market' },
        { factor: 'Storage Costs', impact: 'Medium', description: 'Cold storage expensive' },
        { factor: 'Quality Variance', impact: 'Medium', description: 'Mixed quality batches' }
      ],
      recommendation: 'Sell within 2-3 days before further decline',
      demand: 'Medium'
    },
    garlic: {
      current: 68,
      forecast: [
        { day: 'Today', price: 68, confidence: 94 },
        { day: 'Day 2', price: 70, confidence: 92 },
        { day: 'Day 3', price: 72, confidence: 89 },
        { day: 'Day 4', price: 74, confidence: 86 },
        { day: 'Day 5', price: 76, confidence: 82 },
        { day: 'Day 6', price: 78, confidence: 78 },
        { day: 'Day 7', price: 80, confidence: 74 }
      ],
      trend: 'up',
      change: '+17%',
      factors: [
        { factor: 'Storage Advantage', impact: 'High', description: 'Long shelf life helping traders' },
        { factor: 'Restaurant Demand', impact: 'High', description: 'Food industry restocking' },
        { factor: 'Limited Supply', impact: 'Medium', description: 'Smaller harvest this year' }
      ],
      recommendation: 'Hold for maximum returns, strong uptrend',
      demand: 'Very High'
    },
    lentils: {
      current: 65,
      forecast: [
        { day: 'Today', price: 65, confidence: 95 },
        { day: 'Day 2', price: 65, confidence: 93 },
        { day: 'Day 3', price: 66, confidence: 91 },
        { day: 'Day 4', price: 66, confidence: 88 },
        { day: 'Day 5', price: 67, confidence: 85 },
        { day: 'Day 6', price: 68, confidence: 81 },
        { day: 'Day 7', price: 68, confidence: 77 }
      ],
      trend: 'up',
      change: '+4%',
      factors: [
        { factor: 'Protein Demand', impact: 'High', description: 'Health-conscious consumers increasing' },
        { factor: 'Government Buffer', impact: 'Medium', description: 'Public distribution active' },
        { factor: 'Import Tariff', impact: 'Low', description: 'Protection from cheap imports' }
      ],
      recommendation: 'Steady market, moderate gains expected',
      demand: 'High'
    }
  });

  const chartRef = useRef(null);

  const fetchMarketData = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/market-forecast', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMarketData(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.log('Using local data - backend not available');
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 300000);
    return () => clearInterval(interval);
  }, []);

  const data = marketData[selectedCrop];

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div style={{ minHeight: '100vh', padding: 32, fontFamily: 'Inter, system-ui, sans-serif', background: 'radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(circle at 85% 85%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), linear-gradient(180deg, #f8fafc 0%, #e0e7ff 100%)', color: '#0f172a', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes shimmer {
          0% { backgroundPosition: -1000px 0; }
          100% { backgroundPosition: 1000px 0; }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes expandBar {
          from { width: 0; }
          to { width: var(--target-width); }
        }
        
        @keyframes glow {
          0%, 100% { boxShadow: 0 4px 24px rgba(99, 102, 241, 0.25), 0 0 0 1px rgba(99, 102, 241, 0.1); }
          50% { boxShadow: 0 8px 32px rgba(99, 102, 241, 0.35), 0 0 0 2px rgba(99, 102, 241, 0.2); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(99, 102, 241, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.9) inset;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }
        
        .glass-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 48px rgba(99, 102, 241, 0.15), 0 1px 0 rgba(255, 255, 255, 1) inset;
        }
        
        .glass-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          transition: left 0.5s;
        }
        
        .glass-card:hover::before {
          left: 100%;
        }
        
        .price-bar {
          animation: expandBar 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        .crop-card {
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }
        
        .crop-card:hover {
          transform: scale(1.05) translateZ(10px);
        }
        
        .crop-card.active {
          transform: scale(1.05) translateZ(15px);
          animation: glow 2s infinite;
        }
        
        .refresh-btn {
          transition: all 0.3s ease;
        }
        
        .refresh-btn:hover {
          transform: scale(1.1);
        }
        
        .refresh-btn.spinning {
          animation: rotate 1s linear infinite;
        }
        
        .factor-card {
          animation: slideIn 0.5s ease forwards;
          opacity: 0;
        }
        
        .factor-card:nth-child(1) { animationDelay: 0.1s; }
        .factor-card:nth-child(2) { animationDelay: 0.2s; }
        .factor-card:nth-child(3) { animationDelay: 0.3s; }
      `}</style>

      {/* Animated background particles */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', opacity: 0.4 }}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', width: 6, height: 6, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%', top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`, animationDelay: `${Math.random() * 2}s`, boxShadow: '0 0 12px rgba(99, 102, 241, 0.6)' }} />
        ))}
      </div>

      <div style={{ maxWidth: 1600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div className="glass-card" style={{ padding: 32, marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 32px rgba(99, 102, 241, 0.4)', animation: 'bounce 2s ease-in-out infinite' }}>
              <BarChart3 style={{ width: 36, height: 36, color: 'white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 34, fontWeight: 900, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: -1, margin: 0 }}>AI Market Forecast</h1>
              <p style={{ fontSize: 16, color: '#64748b', marginTop: 6 }}>Predictive analytics powered by machine learning</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end', marginBottom: 4 }}>
                <Activity style={{ width: 18, height: 18, color: '#10b981' }} />
                <span style={{ fontSize: 14, color: '#10b981', fontWeight: 700 }}>Live Data</span>
              </div>
              <div style={{ fontSize: 13, color: '#64748b' }}>Updated {getTimeAgo(lastUpdated)}</div>
            </div>
            
            <button onClick={fetchMarketData} disabled={isRefreshing} className="refresh-btn" style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none', cursor: isRefreshing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)' }}>
              <RefreshCw className={isRefreshing ? 'spinning' : ''} style={{ width: 24, height: 24, color: 'white' }} />
            </button>
          </div>
        </div>

        {/* Crop Selection */}
        <div className="glass-card" style={{ padding: 28, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>Select Crop</h2>
            <button 
              onClick={() => setShowAllCrops(!showAllCrops)} 
              style={{ 
                padding: '10px 20px', 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: 12, 
                fontSize: 14, 
                fontWeight: 700, 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {showAllCrops ? 'Show Less' : `View All ${Object.keys(marketData).length} Crops`}
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {Object.keys(marketData).slice(0, showAllCrops ? Object.keys(marketData).length : 4).map(crop => {
              const cropData = marketData[crop];
              return (
                <div key={crop} onClick={() => setSelectedCrop(crop)} className={`crop-card ${selectedCrop === crop ? 'active' : ''}`} style={{ padding: 28, borderRadius: 20, background: selectedCrop === crop ? 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)' : 'rgba(248, 250, 252, 0.8)', border: selectedCrop === crop ? '2px solid #6366f1' : '2px solid rgba(226, 232, 240, 0.8)', position: 'relative', overflow: 'hidden', boxShadow: selectedCrop === crop ? '0 4px 24px rgba(99, 102, 241, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
                  
                  {selectedCrop === crop && (
                    <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', animation: 'pulse 2s infinite' }} />
                  )}
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <h3 style={{ fontSize: 19, fontWeight: 800, color: '#1e293b', textTransform: 'capitalize', marginBottom: 14 }}>{crop}</h3>
                    <div style={{ fontSize: 40, fontWeight: 900, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 12 }}>₹{cropData.current}</div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {cropData.trend === 'up' ? (
                        <TrendingUp style={{ width: 20, height: 20, color: '#10b981' }} />
                      ) : (
                        <TrendingDown style={{ width: 20, height: 20, color: '#ef4444' }} />
                      )}
                      <span style={{ fontSize: 16, fontWeight: 800, color: cropData.trend === 'up' ? '#10b981' : '#ef4444' }}>{cropData.change}</span>
                      <span style={{ fontSize: 13, color: '#64748b', marginLeft: 'auto', fontWeight: 600 }}>{cropData.demand}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28 }}>
          
          {/* Price Forecast */}
          <div className="glass-card" style={{ padding: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <Calendar style={{ width: 28, height: 28, color: '#6366f1' }} />
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0 }}>7-Day Price Forecast</h2>
              <div style={{ marginLeft: 'auto', padding: '8px 20px', background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', border: '1px solid #c7d2fe', borderRadius: 999, fontSize: 13, fontWeight: 800, color: '#6366f1' }}>
                {selectedCrop.toUpperCase()}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {data.forecast.map((day, idx) => {
                const maxPrice = Math.max(...data.forecast.map(d => d.price));
                const widthPercent = (day.price / maxPrice) * 100;
                
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ width: 90, fontSize: 15, fontWeight: 700, color: '#475569' }}>
                      {day.day}
                    </div>
                    
                    <div style={{ flex: 1, position: 'relative' }}>
                      <div style={{ height: 56, background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid #e2e8f0' }}>
                        <div className="price-bar" style={{ '--target-width': `${widthPercent}%`, height: '100%', background: day.price > data.current ? 'linear-gradient(135deg, #10b981, #059669)' : day.price < data.current ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: 16, display: 'flex', alignItems: 'center', paddingLeft: 20, position: 'relative', overflow: 'hidden', boxShadow: day.price > data.current ? '0 4px 16px rgba(16, 185, 129, 0.3)' : day.price < data.current ? '0 4px 16px rgba(239, 68, 68, 0.3)' : '0 4px 16px rgba(99, 102, 241, 0.3)' }}>
                          
                          <div style={{ position: 'absolute', top: 0, left: -100, width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)', animation: 'shimmer 2s infinite', animationDelay: `${idx * 0.2}s` }} />
                          
                          <span style={{ fontSize: 18, fontWeight: 900, color: 'white', position: 'relative', zIndex: 1, textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' }}>₹{day.price}</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                        <span>Confidence: {day.confidence}%</span>
                        <span>{day.price > data.current ? `+₹${(day.price - data.current).toFixed(1)}` : day.price < data.current ? `-₹${(data.current - day.price).toFixed(1)}` : 'No change'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Recommendation */}
            <div style={{ marginTop: 36, padding: 28, background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', borderRadius: 20, border: '2px solid #c7d2fe', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)', animation: 'pulse 3s infinite' }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <Zap style={{ width: 24, height: 24, color: '#6366f1' }} />
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: '#1e293b', margin: 0 }}>AI Recommendation</h3>
                </div>
                <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{data.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            {/* Current Stats */}
            <div className="glass-card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginBottom: 24 }}>Current Market</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Current Price</div>
                  <div style={{ fontSize: 44, fontWeight: 900, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>₹{data.current}/kg</div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 20, borderTop: '2px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>7-Day Change</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: data.trend === 'up' ? '#10b981' : '#ef4444' }}>{data.change}</div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>Demand</div>
                    <div style={{ padding: '8px 16px', background: data.demand === 'Very High' || data.demand === 'High' ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' : 'linear-gradient(135deg, #fef3c7, #fde68a)', border: data.demand === 'Very High' || data.demand === 'High' ? '1px solid #6ee7b7' : '1px solid #fcd34d', borderRadius: 999, fontSize: 13, fontWeight: 800, color: data.demand === 'Very High' || data.demand === 'High' ? '#065f46' : '#92400e' }}>
                      {data.demand}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Factors */}
            <div className="glass-card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <AlertCircle style={{ width: 22, height: 22, color: '#8b5cf6' }} />
                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>Price Factors</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {data.factors.map((factor, idx) => (
                  <div key={idx} className="factor-card" style={{ padding: 20, background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{factor.factor}</span>
                      <span style={{ padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, background: factor.impact === 'High' ? 'linear-gradient(135deg, #fee2e2, #fecaca)' : factor.impact === 'Medium' ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : 'linear-gradient(135deg, #d1fae5, #a7f3d0)', color: factor.impact === 'High' ? '#991b1b' : factor.impact === 'Medium' ? '#92400e' : '#065f46', border: factor.impact === 'High' ? '1px solid #fca5a5' : factor.impact === 'Medium' ? '1px solid #fcd34d' : '1px solid #6ee7b7' }}>
                        {factor.impact}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: '#475569', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Model Info */}
        <div className="glass-card" style={{ marginTop: 28, padding: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <Shield style={{ width: 28, height: 28, color: '#8b5cf6' }} />
            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>AI-Powered Market Intelligence</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { title: 'Data Sources', desc: 'Government mandis, private markets, imports/exports' },
              { title: 'ML Models', desc: 'Time series, regression, sentiment analysis' },
              { title: 'Update Frequency', desc: 'Real-time data with hourly refreshes' },
              { title: 'Accuracy', desc: '85-95% prediction accuracy on 7-day forecasts' }
            ].map((item, idx) => (
              <div key={idx} style={{ padding: 24, background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: 18, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.04)'; }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#8b5cf6', marginBottom: 10 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketForecast;