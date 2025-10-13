import React, { useState, useEffect } from 'react';
import { Truck, Package, MapPin, Clock, CheckCircle, AlertCircle, Shield, RefreshCw, LogOut, TrendingUp, User } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'https://api.yourbackend.com';

// JWT Token Management
const TokenManager = {
  getToken: () => localStorage.getItem('authToken'),
  setToken: (token) => localStorage.setItem('authToken', token),
  removeToken: () => localStorage.removeItem('authToken'),
  isAuthenticated: () => !!localStorage.getItem('authToken')
};

// API Service with JWT
const apiService = {
  async fetchWithAuth(endpoint, options = {}) {
    const token = TokenManager.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      if (response.status === 401) {
        TokenManager.removeToken();
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (data.token) TokenManager.setToken(data.token);
    return data;
  },

  async getShipments() {
    return this.fetchWithAuth('/shipments');
  },

  async getBuyers() {
    return this.fetchWithAuth('/buyers');
  },

  async createShipment(shipmentData) {
    return this.fetchWithAuth('/shipments', {
      method: 'POST',
      body: JSON.stringify(shipmentData)
    });
  }
};

const SupplyChain = () => {
  const [activeTab, setActiveTab] = useState('tracking');
  const [isAuthenticated, setIsAuthenticated] = useState(TokenManager.isAuthenticated());
  const [isLoading, setIsLoading] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [buyers, setBuyers] = useState([]);

  const mockShipments = [
    {
      id: 'SH001',
      product: 'Tomatoes',
      quantity: '500 kg',
      from: 'Farm - Darbhanga',
      to: 'Mandi - Patna',
      status: 'in-transit',
      progress: 65,
      estimatedArrival: '2 hours',
      currentLocation: 'Near Muzaffarpur',
      temperature: '8°C',
      quality: 'Good'
    },
    {
      id: 'SH002',
      product: 'Wheat',
      quantity: '1000 kg',
      from: 'Farm - Darbhanga',
      to: 'Warehouse - Delhi',
      status: 'delivered',
      progress: 100,
      estimatedArrival: 'Delivered',
      currentLocation: 'Delhi Warehouse',
      temperature: 'N/A',
      quality: 'Excellent'
    },
    {
      id: 'SH003',
      product: 'Rice',
      quantity: '750 kg',
      from: 'Farm - Darbhanga',
      to: 'Processing Unit - Bihar',
      status: 'scheduled',
      progress: 0,
      estimatedArrival: 'Tomorrow 9 AM',
      currentLocation: 'Farm',
      temperature: 'N/A',
      quality: 'Good'
    }
  ];

  const mockBuyers = [
    {
      id: 1,
      name: 'Patna Agri Traders',
      rating: 4.5,
      orders: 23,
      payment: 'Immediate',
      verified: true
    },
    {
      id: 2,
      name: 'Bihar Food Corp',
      rating: 4.8,
      orders: 45,
      payment: 'Within 7 days',
      verified: true
    },
    {
      id: 3,
      name: 'Delhi Wholesale Market',
      rating: 4.2,
      orders: 12,
      payment: 'Within 15 days',
      verified: false
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setShipments(mockShipments);
      setBuyers(mockBuyers);
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    TokenManager.removeToken();
    setIsAuthenticated(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-transit': return { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' };
      case 'delivered': return { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' };
      case 'scheduled': return { bg: '#FFFBEB', text: '#B45309', border: '#FED7AA' };
      case 'delayed': return { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' };
      default: return { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6', padding: '24px' }}>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        }
        
        .container {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        
        .btn {
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }
        
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .btn:active {
          transform: translateY(0);
        }
        
        .btn-primary {
          background: #7C3AED;
          color: white;
        }
        
        .btn-primary:hover {
          background: #6D28D9;
        }
        
        .btn-secondary {
          background: white;
          color: #7C3AED;
          border: 2px solid #7C3AED;
        }
        
        .btn-secondary:hover {
          background: #F5F3FF;
        }
        
        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
        }
        
        .progress-bar {
          width: 100%;
          height: 12px;
          background: #E5E7EB;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #7C3AED, #A78BFA);
          border-radius: 10px;
          transition: width 0.5s ease;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @media (max-width: 768px) {
          .grid-2 { grid-template-columns: 1fr; }
          .grid-3 { grid-template-columns: 1fr; }
          .grid-4 { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="container">
        {/* Header */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: '#7C3AED', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <Truck style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                  Supply Chain Management
                </h1>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>
                  Track deliveries & connect with verified buyers
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '8px 16px', 
                background: '#D1FAE5',
                borderRadius: '8px'
              }}>
                <Shield style={{ width: '18px', height: '18px', color: '#059669' }} />
                <span style={{ color: '#059669', fontWeight: '600', fontSize: '14px' }}>Secured</span>
              </div>
              <button 
                onClick={loadData}
                className="btn"
                style={{ 
                  padding: '10px', 
                  background: '#F3F4F6',
                  color: '#374151'
                }}
              >
                <RefreshCw className={isLoading ? 'spin' : ''} style={{ width: '20px', height: '20px' }} />
              </button>
              {isAuthenticated && (
                <button 
                  onClick={handleLogout}
                  className="btn"
                  style={{ 
                    padding: '10px', 
                    background: '#FEE2E2',
                    color: '#DC2626'
                  }}
                >
                  <LogOut style={{ width: '20px', height: '20px' }} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card" style={{ marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '2px solid #F3F4F6' }}>
            <button
              onClick={() => setActiveTab('tracking')}
              style={{
                flex: 1,
                padding: '16px',
                background: activeTab === 'tracking' ? '#FAFAFA' : 'white',
                border: 'none',
                borderBottom: activeTab === 'tracking' ? '3px solid #7C3AED' : 'none',
                color: activeTab === 'tracking' ? '#7C3AED' : '#6B7280',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Package style={{ width: '18px', height: '18px' }} />
                Shipment Tracking
              </div>
            </button>
            <button
              onClick={() => setActiveTab('buyers')}
              style={{
                flex: 1,
                padding: '16px',
                background: activeTab === 'buyers' ? '#FAFAFA' : 'white',
                border: 'none',
                borderBottom: activeTab === 'buyers' ? '3px solid #7C3AED' : 'none',
                color: activeTab === 'buyers' ? '#7C3AED' : '#6B7280',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <CheckCircle style={{ width: '18px', height: '18px' }} />
                Verified Buyers
              </div>
            </button>
          </div>

          {/* Tracking Tab */}
          {activeTab === 'tracking' && (
            <div style={{ padding: '24px' }}>
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                  <RefreshCw className="spin" style={{ width: '32px', height: '32px', color: '#7C3AED' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {shipments.map((shipment) => {
                    const statusStyle = getStatusColor(shipment.status);
                    return (
                      <div
                        key={shipment.id}
                        className="card"
                        style={{ padding: '24px', border: '1px solid #E5E7EB' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ 
                              width: '56px', 
                              height: '56px', 
                              background: '#F3F4F6', 
                              borderRadius: '10px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center'
                            }}>
                              <Package style={{ width: '28px', height: '28px', color: '#7C3AED' }} />
                            </div>
                            <div>
                              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                                {shipment.product}
                              </h3>
                              <p style={{ color: '#6B7280', fontSize: '14px' }}>ID: {shipment.id}</p>
                            </div>
                          </div>
                          <span className="badge" style={{ 
                            background: statusStyle.bg, 
                            color: statusStyle.text,
                            border: `1px solid ${statusStyle.border}`,
                            textTransform: 'capitalize'
                          }}>
                            {shipment.status.replace('-', ' ')}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <MapPin style={{ width: '16px', height: '16px' }} />
                              {shipment.from}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {shipment.to}
                              <MapPin style={{ width: '16px', height: '16px' }} />
                            </span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${shipment.progress}%`, position: 'relative' }}>
                              {shipment.progress > 0 && shipment.progress < 100 && (
                                <div style={{ 
                                  position: 'absolute', 
                                  right: '-16px', 
                                  top: '50%', 
                                  transform: 'translateY(-50%)'
                                }}>
                                  <Truck style={{ width: '24px', height: '24px', color: '#7C3AED' }} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
                          <div style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <Package style={{ width: '16px', height: '16px', color: '#6B7280' }} />
                              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>Quantity</span>
                            </div>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{shipment.quantity}</div>
                          </div>
                          <div style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <MapPin style={{ width: '16px', height: '16px', color: '#6B7280' }} />
                              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>Location</span>
                            </div>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{shipment.currentLocation}</div>
                          </div>
                          <div style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <Clock style={{ width: '16px', height: '16px', color: '#6B7280' }} />
                              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>ETA</span>
                            </div>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{shipment.estimatedArrival}</div>
                          </div>
                          <div style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <CheckCircle style={{ width: '16px', height: '16px', color: '#6B7280' }} />
                              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>Quality</span>
                            </div>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{shipment.quality}</div>
                          </div>
                        </div>

                        {/* Temperature */}
                        {shipment.temperature !== 'N/A' && (
                          <div style={{ 
                            padding: '12px 16px', 
                            background: '#EFF6FF', 
                            borderRadius: '8px',
                            border: '1px solid #BFDBFE',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <Shield style={{ width: '18px', height: '18px', color: '#1E40AF' }} />
                            <span style={{ color: '#1E40AF', fontWeight: '600', fontSize: '14px' }}>
                              IoT Temperature: {shipment.temperature} - Optimal Range
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <button 
                className="btn btn-secondary"
                style={{ 
                  width: '100%', 
                  marginTop: '16px',
                  padding: '16px',
                  border: '2px dashed #D1D5DB',
                  background: 'white',
                  color: '#374151'
                }}
              >
                + Create New Shipment
              </button>
            </div>
          )}

          {/* Buyers Tab */}
          {activeTab === 'buyers' && (
            <div style={{ padding: '24px' }}>
              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {buyers.map((buyer) => (
                  <div
                    key={buyer.id}
                    className="card"
                    style={{ padding: '24px', border: '1px solid #E5E7EB' }}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>{buyer.name}</h3>
                        {buyer.verified && (
                          <CheckCircle style={{ width: '20px', height: '20px', color: '#10B981' }} />
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '18px' }}>⭐</span>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{buyer.rating}</span>
                        <span style={{ color: '#6B7280', fontSize: '14px' }}>({buyer.orders} orders)</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ 
                        padding: '12px', 
                        background: '#F9FAFB', 
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        border: '1px solid #E5E7EB'
                      }}>
                        <span style={{ color: '#6B7280', fontWeight: '500', fontSize: '14px' }}>Payment Terms</span>
                        <span style={{ fontWeight: '700', color: '#111827', fontSize: '14px' }}>{buyer.payment}</span>
                      </div>
                      <div style={{ 
                        padding: '12px', 
                        background: buyer.verified ? '#D1FAE5' : '#F3F4F6', 
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: `1px solid ${buyer.verified ? '#A7F3D0' : '#E5E7EB'}`
                      }}>
                        <span style={{ color: buyer.verified ? '#059669' : '#6B7280', fontWeight: '500', fontSize: '14px' }}>Status</span>
                        <span style={{ fontWeight: '700', color: buyer.verified ? '#059669' : '#6B7280', fontSize: '14px' }}>
                          {buyer.verified ? '✓ Verified' : 'Unverified'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button className="btn btn-primary">Contact</button>
                      <button className="btn btn-secondary">Profile</button>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="btn btn-secondary"
                style={{ 
                  width: '100%', 
                  marginTop: '16px',
                  padding: '16px',
                  border: '2px dashed #D1D5DB',
                  background: 'white',
                  color: '#374151'
                }}
              >
                + Find More Buyers
              </button>
            </div>
          )}
        </div>

        {/* AI Features */}
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: Truck, title: 'Route Optimization', desc: 'AI finds fastest routes, reducing delivery time by 25%', color: '#7C3AED', bg: '#F5F3FF' },
            { icon: Shield, title: 'Blockchain Tracking', desc: 'Every transaction recorded for complete transparency', color: '#2563EB', bg: '#EFF6FF' },
            { icon: CheckCircle, title: 'Quality Monitoring', desc: 'IoT sensors ensure product quality throughout transit', color: '#059669', bg: '#D1FAE5' }
          ].map((feature, idx) => (
            <div key={idx} className="card" style={{ padding: '20px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                background: feature.bg, 
                borderRadius: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <feature.icon style={{ width: '24px', height: '24px', color: feature.color }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.5' }}>{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Impact Metrics */}
        <div className="card" style={{ padding: '32px', background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)' }}>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            marginBottom: '24px', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <TrendingUp style={{ width: '28px', height: '28px' }} />
            Supply Chain Impact
          </h3>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { value: '25%', label: 'Faster Delivery' },
              { value: '15%', label: 'Reduced Spoilage' },
              { value: '100%', label: 'Transparency' },
              { value: '98%', label: 'On-Time Delivery' }
            ].map((metric, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <p style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px', color: 'white' }}>{metric.value}</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'white', opacity: 0.9 }}>{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChain;