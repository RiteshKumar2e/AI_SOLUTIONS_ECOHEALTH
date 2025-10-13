import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, TrendingUp, Users, Target, Award, Leaf, Sparkles, ArrowRight, CheckCircle, Clock, ChevronRight, RefreshCw } from 'lucide-react';

export default function AwarenessHub() {
  const navigate = useNavigate();
  
  const [campaigns, setCampaigns] = useState([]);
  const [educationModules, setEducationModules] = useState([]);
  const [communityStats, setCommunityStats] = useState(null);
  const [selectedTab, setSelectedTab] = useState('campaigns');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // API Base URL - Replace with your actual backend URL
 // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch data from backend
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Parallel API calls for better performance
      const [campaignsRes, modulesRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/environment/campaigns`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add auth if needed
          }
        }),
        fetch(`${API_BASE_URL}/environment/education-modules`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }),
        fetch(`${API_BASE_URL}/environment/community-stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })
      ]);

      // Check if responses are OK
      if (!campaignsRes.ok || !modulesRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch data from server');
      }

      // Parse JSON responses
      const campaignsData = await campaignsRes.json();
      const modulesData = await modulesRes.json();
      const statsData = await statsRes.json();

      // Set data to state
      setCampaigns(campaignsData.data || campaignsData || []);
      setEducationModules(modulesData.data || modulesData || []);
      setCommunityStats(statsData.data || statsData || null);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data from server');
      // Fallback to dummy data for demo/development
      loadDummyData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadDummyData = () => {
    setCampaigns([
      {
        id: 1,
        title: "Plant a Tree Challenge",
        category: "Reforestation",
        participants: 1247,
        impact: "2,340 trees planted",
        progress: 78,
        status: "active",
        startDate: "2025-09-15",
        endDate: "2025-12-31",
        description: "Join our community-driven tree planting initiative"
      },
      {
        id: 2,
        title: "Plastic-Free Week",
        category: "Waste Reduction",
        participants: 892,
        impact: "15.4 tons plastic saved",
        progress: 92,
        status: "active",
        startDate: "2025-10-01",
        endDate: "2025-10-07",
        description: "Reduce single-use plastics in your daily life"
      },
      {
        id: 3,
        title: "Energy Conservation Drive",
        category: "Climate Action",
        participants: 2103,
        impact: "45,000 kWh saved",
        progress: 65,
        status: "active",
        startDate: "2025-09-01",
        endDate: "2025-11-30",
        description: "Save energy and reduce carbon footprint"
      }
    ]);

    setEducationModules([
      { 
        id: 1, 
        title: "Climate Change Basics", 
        completed: 450, 
        rating: 4.8, 
        duration: "2 hours", 
        level: "Beginner",
        description: "Understanding climate change and its impacts",
        topics: ["Global Warming", "Carbon Cycle", "Greenhouse Effect"]
      },
      { 
        id: 2, 
        title: "Sustainable Agriculture", 
        completed: 320, 
        rating: 4.6, 
        duration: "3 hours", 
        level: "Intermediate",
        description: "Learn sustainable farming practices",
        topics: ["Organic Farming", "Water Management", "Soil Health"]
      },
      { 
        id: 3, 
        title: "Water Conservation", 
        completed: 580, 
        rating: 4.9, 
        duration: "1.5 hours", 
        level: "Beginner",
        description: "Techniques to conserve water resources",
        topics: ["Rainwater Harvesting", "Drip Irrigation", "Water Recycling"]
      }
    ]);

    setCommunityStats({
      totalMembers: 12450,
      activeCampaigns: 8,
      totalImpact: "158 tons CO2 reduced",
      engagementRate: 73
    });
  };

  const handleJoinCampaign = async (campaignId) => {
    try {
      const userId = localStorage.getItem('userId') || 'guest-user';
      
      const response = await fetch(`${API_BASE_URL}/environment/campaigns/${campaignId}/join`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error('Failed to join campaign');
      }

      const result = await response.json();
      
      // Update local state optimistically
      setCampaigns(prev => prev.map(c => 
        c.id === campaignId ? { ...c, participants: c.participants + 1 } : c
      ));

      // Show success message
      alert(result.message || 'Successfully joined the campaign!');
      
      // Refresh data to get latest stats
      fetchAllData();
      
    } catch (err) {
      console.error('Error joining campaign:', err);
      alert(err.message || 'Failed to join campaign. Please try again.');
    }
  };

  const handleStartLearning = async (moduleId) => {
    try {
      const userId = localStorage.getItem('userId') || 'guest-user';
      
      // Track module enrollment
      await fetch(`${API_BASE_URL}/environment/education-modules/${moduleId}/enroll`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ userId })
      });

      // Navigate to learning module page
      navigate(`/environment/education/${moduleId}`);
      
    } catch (err) {
      console.error('Error enrolling in module:', err);
      // Still navigate even if tracking fails
      navigate(`/environment/education/${moduleId}`);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  const handleViewRecommendations = () => {
    navigate('/environment/recommendations');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '16px', color: '#64748b', fontSize: '14px', textAlign: 'center' }}>Loading awareness hub...</p>
        </div>
      </div>
    );
  }

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

        @keyframes progressFill {
          from { width: 0%; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .awareness-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
          padding: 24px;
          animation: fadeInUp 0.6s ease-out;
        }

        .header-card {
          background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
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

        .refresh-btn {
          padding: 10px 20px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover {
          background: #f8fafc;
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .refresh-btn.refreshing {
          pointer-events: none;
          opacity: 0.6;
        }

        .refresh-btn.refreshing svg {
          animation: spin 1s linear infinite;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          padding: 28px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: fadeInUp 1s ease-out;
          animation-fill-mode: both;
          border: 1px solid #e2e8f0;
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
          transition: left 0.6s ease;
        }

        .stat-card:hover::before {
          left: 100%;
        }

        .stat-card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
        }

        .stat-icon {
          animation: float 3s ease-in-out infinite;
        }

        .tab-container {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          margin-bottom: 32px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .tab-button {
          flex: 1;
          padding: 20px 24px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          position: relative;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .tab-button::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #22c55e 0%, #3b82f6 100%);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .tab-button.active::after {
          transform: scaleX(1);
        }

        .tab-button.active {
          color: #22c55e;
        }

        .tab-button:not(.active) {
          color: #64748b;
        }

        .tab-button:not(.active):hover {
          color: #22c55e;
          background: #f8fafc;
        }

        .campaign-card {
          background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
          border-radius: 20px;
          padding: 32px;
          border-left: 5px solid #22c55e;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: slideInRight 0.6s ease-out;
          animation-fill-mode: both;
          border: 1px solid #e2e8f0;
        }

        .campaign-card:nth-child(1) { animation-delay: 0.1s; }
        .campaign-card:nth-child(2) { animation-delay: 0.2s; }
        .campaign-card:nth-child(3) { animation-delay: 0.3s; }

        .campaign-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .campaign-card:hover::before {
          opacity: 1;
        }

        .campaign-card:hover {
          transform: translateY(-8px) rotateX(2deg);
          box-shadow: 0 20px 50px rgba(34, 197, 94, 0.15);
        }

        .module-card {
          background: linear-gradient(135deg, #ffffff 0%, #faf5ff 100%);
          border-radius: 20px;
          padding: 32px;
          border-left: 5px solid #a855f7;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: slideInRight 0.6s ease-out;
          animation-fill-mode: both;
          border: 1px solid #e2e8f0;
        }

        .module-card:nth-child(1) { animation-delay: 0.1s; }
        .module-card:nth-child(2) { animation-delay: 0.2s; }
        .module-card:nth-child(3) { animation-delay: 0.3s; }

        .module-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .module-card:hover::before {
          opacity: 1;
        }

        .module-card:hover {
          transform: translateY(-8px) rotateX(2deg);
          box-shadow: 0 20px 50px rgba(168, 85, 247, 0.15);
        }

        .status-badge {
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          animation: pulse 2s ease-in-out infinite;
        }

        .progress-container {
          position: relative;
          width: 100%;
          height: 12px;
          background: #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e 0%, #3b82f6 100%);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          animation: progressFill 1.5s ease-out;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: shimmer 2s infinite;
        }

        .btn-primary {
          width: 100%;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          font-weight: 600;
          padding: 14px 24px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        }

        .btn-primary::before {
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

        .btn-primary:hover::before {
          width: 300px;
          height: 300px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          width: 100%;
          background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
          color: white;
          font-weight: 600;
          padding: 14px 24px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
        }

        .btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(168, 85, 247, 0.4);
        }

        .insight-card {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
          padding: 40px;
          color: white;
          position: relative;
          overflow: hidden;
          animation: fadeInUp 1s ease-out;
        }

        .insight-card::before {
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

        .rating-stars {
          display: flex;
          gap: 2px;
        }

        .star {
          font-size: 20px;
          transition: all 0.2s ease;
        }

        .star.filled {
          color: #fbbf24;
          filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.5));
        }

        .star.empty {
          color: #d1d5db;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 5px solid #e2e8f0;
          border-top-color: #22c55e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .info-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .empty-state-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 16px;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .header-card {
            padding: 24px;
          }

          .stat-card {
            padding: 20px;
          }

          .campaign-card, .module-card {
            padding: 24px;
          }
        }
      `}</style>

      <div className="awareness-container">
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div className="header-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)' }}>
                  <Leaf size={32} style={{ color: 'white' }} />
                </div>
                <div>
                  <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>
                    Environmental Awareness Hub
                  </h1>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '16px' }}>
                    Empowering communities through education and collective action
                  </p>
                </div>
              </div>
              <button 
                className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw size={18} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Community Stats */}
          {communityStats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Total Members</p>
                    <p style={{ fontSize: '32px', fontWeight: '800', color: '#22c55e', margin: 0 }}>{communityStats.totalMembers.toLocaleString()}</p>
                  </div>
                  <Users className="stat-icon" size={48} style={{ color: '#22c55e', opacity: 0.2 }} />
                </div>
              </div>

              <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Active Campaigns</p>
                    <p style={{ fontSize: '32px', fontWeight: '800', color: '#3b82f6', margin: 0 }}>{communityStats.activeCampaigns}</p>
                  </div>
                  <Target className="stat-icon" size={48} style={{ color: '#3b82f6', opacity: 0.2 }} />
                </div>
              </div>

              <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Total Impact</p>
                    <p style={{ fontSize: '24px', fontWeight: '800', color: '#a855f7', margin: 0 }}>{communityStats.totalImpact}</p>
                  </div>
                  <TrendingUp className="stat-icon" size={48} style={{ color: '#a855f7', opacity: 0.2 }} />
                </div>
              </div>

              <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Engagement Rate</p>
                    <p style={{ fontSize: '32px', fontWeight: '800', color: '#f97316', margin: 0 }}>{communityStats.engagementRate}%</p>
                  </div>
                  <Award className="stat-icon" size={48} style={{ color: '#f97316', opacity: 0.2 }} />
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="tab-container">
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
              <button
                onClick={() => setSelectedTab('campaigns')}
                className={`tab-button ${selectedTab === 'campaigns' ? 'active' : ''}`}
              >
                Community Campaigns
              </button>
              <button
                onClick={() => setSelectedTab('education')}
                className={`tab-button ${selectedTab === 'education' ? 'active' : ''}`}
              >
                Education Modules
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              {selectedTab === 'campaigns' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {campaigns.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Target size={40} style={{ color: '#94a3b8' }} />
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>No Active Campaigns</h3>
                      <p>Check back soon for new environmental campaigns!</p>
                    </div>
                  ) : (
                    campaigns.map((campaign) => (
                      <div key={campaign.id} className="campaign-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>{campaign.title}</h3>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>{campaign.category}</span>
                              {campaign.endDate && (
                                <div className="info-badge">
                                  <Clock size={14} />
                                  <span>Ends {new Date(campaign.endDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                            {campaign.description && (
                              <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px', lineHeight: '1.5' }}>{campaign.description}</p>
                            )}
                          </div>
                          <span className="status-badge" style={{ background: campaign.status === 'active' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : '#94a3b8', color: 'white' }}>
                            {campaign.status}
                          </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                          <div style={{ background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', padding: '16px' }}>
                            <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Participants</p>
                            <p style={{ fontSize: '24px', fontWeight: '800', color: '#22c55e', margin: 0 }}>{campaign.participants.toLocaleString()}</p>
                          </div>
                          <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', padding: '16px' }}>
                            <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Impact Achieved</p>
                            <p style={{ fontSize: '20px', fontWeight: '800', color: '#3b82f6', margin: 0 }}>{campaign.impact}</p>
                          </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Campaign Progress</span>
                            <span style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>{campaign.progress}%</span>
                          </div>
                          <div className="progress-container">
                            <div
                              className="progress-fill"
                              style={{ width: `${campaign.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <button 
                          className="btn-primary"
                          onClick={() => handleJoinCampaign(campaign.id)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
                            <span>Join Campaign</span>
                            <ArrowRight size={20} />
                          </div>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {selectedTab === 'education' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {educationModules.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Sparkles size={40} style={{ color: '#94a3b8' }} />
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>No Modules Available</h3>
                      <p>New learning modules coming soon!</p>
                    </div>
                  ) : (
                    educationModules.map((module) => (
                      <div key={module.id} className="module-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 12px 0' }}>{module.title}</h3>
                            {module.description && (
                              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px', lineHeight: '1.5' }}>{module.description}</p>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                              <div className="rating-stars">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`star ${i < Math.floor(module.rating) ? 'filled' : 'empty'}`}>
                                    ★
                                  </span>
                                ))}
                                <span style={{ marginLeft: '8px', fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
                                  {module.rating} / 5.0
                                </span>
                              </div>
                              {module.duration && (
                                <div className="info-badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#1e293b' }}>
                                  <Clock size={14} />
                                  <span>{module.duration}</span>
                                </div>
                              )}
                              {module.level && (
                                <div className="info-badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#1e293b' }}>
                                  <Sparkles size={14} />
                                  <span>{module.level}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ background: 'rgba(168, 85, 247, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <CheckCircle size={24} style={{ color: '#a855f7' }} />
                            <div>
                              <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Completed by</p>
                              <p style={{ fontSize: '28px', fontWeight: '800', color: '#a855f7', margin: 0 }}>{module.completed.toLocaleString()} learners</p>
                            </div>
                          </div>
                        </div>

                        <button 
                          className="btn-secondary"
                          onClick={() => handleStartLearning(module.id)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
                            <span>Start Learning</span>
                            <ChevronRight size={20} />
                          </div>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* AI-Powered Insights */}
          <div className="insight-card">
            <div style={{ display: 'flex', alignItems: 'start', gap: '20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backdropFilter: 'blur(10px)' }}>
                <AlertCircle size={32} />
              </div>
              <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>AI-Powered Community Insights</h3>
                <p style={{ fontSize: '16px', lineHeight: '1.7', marginBottom: '24px', opacity: 0.95 }}>
                  Our AI analyzes community engagement patterns to recommend personalized campaigns and educational content. 
                  Based on your location in Darbhanga, Bihar, we've identified water conservation and sustainable agriculture 
                  as priority areas with high community interest and potential for social impact.
                </p>
                <button 
                  onClick={handleViewRecommendations}
                  style={{ background: 'white', color: '#8b5cf6', fontWeight: '700', padding: '14px 28px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  View Personalized Recommendations
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div style={{ marginTop: '24px', padding: '16px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', color: '#92400e' }}>
              <strong>⚠️ Note:</strong> {error}. Displaying sample data for demonstration.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
