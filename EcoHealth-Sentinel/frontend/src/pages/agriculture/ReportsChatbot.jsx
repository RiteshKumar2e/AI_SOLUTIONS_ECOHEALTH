import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, FileText, Download, Bot, User, Loader, CheckCircle, AlertCircle, TrendingUp, Droplet, Sun, DollarSign, X, Trash2, RefreshCw } from 'lucide-react';

const ReportsChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I\'m your AgriBot assistant. I can help you generate reports, answer farming questions, and provide insights. What would you like to know?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [messageCount, setMessageCount] = useState(1);
  const messagesEndRef = useRef(null);

  // Backend API configuration
  const API_CONFIG = {
    baseURL: 'https://api.yourfarm.com/v1',
    endpoints: {
      chat: '/chat/message',
      reports: '/reports/generate',
      download: '/reports/download',
      weather: '/weather/forecast',
      market: '/market/prices'
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY_HERE'
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Simulate backend API call
  const callBackendAPI = async (endpoint, data) => {
    try {
      // PRODUCTION: Uncomment this for real API integration
      /*
      const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
      */
      
      // DEMO MODE: Simulated response
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(generateResponse(data.message));
        }, 1500);
      });
    } catch (error) {
      console.error('API Error:', error);
      setIsConnected(false);
      showNotification('Backend connection failed. Using offline mode.', 'error');
      throw error;
    }
  };

  // AI Response Engine - API-driven responses
  const generateResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();

    // Report generation with proper metadata
    if (lowerMsg.includes('report') || lowerMsg.includes('generate')) {
      if (lowerMsg.includes('crop') || lowerMsg.includes('yield')) {
        return {
          text: 'I\'ve generated your Crop Yield Report with the following insights:\n\nTotal Yield: 4,850 kg/hectare\nIncrease from last season: 15%\nEstimated revenue: ₹1,21,250\nTop performing crop: Wheat (32% of total)\n\nClick below to download the detailed PDF report.',
          hasReport: true,
          reportType: 'Crop Yield Analysis',
          reportData: {
            id: 'crop_' + Date.now(),
            filename: `crop_yield_report_${new Date().toISOString().split('T')[0]}.pdf`,
            size: '2.4 MB',
            generated: new Date().toLocaleString(),
            reportType: 'Crop Yield Analysis'
          }
        };
      }
      if (lowerMsg.includes('soil') || lowerMsg.includes('nutrient')) {
        return {
          text: 'Soil Health Report has been generated:\n\nNitrogen (N): 45 ppm - Needs improvement\nPhosphorus (P): 38 ppm - Adequate\nPotassium (K): 52 ppm - Good\npH Level: 6.8 - Optimal\n\nRecommendation: Add 50kg urea-based fertilizer per hectare to boost nitrogen levels.',
          hasReport: true,
          reportType: 'Soil Health Report',
          reportData: {
            id: 'soil_' + Date.now(),
            filename: `soil_health_report_${new Date().toISOString().split('T')[0]}.pdf`,
            size: '1.8 MB',
            generated: new Date().toLocaleString(),
            reportType: 'Soil Health Report'
          }
        };
      }
      if (lowerMsg.includes('water') || lowerMsg.includes('irrigation')) {
        return {
          text: 'Water Management Report generated successfully:\n\nTotal consumption: 450L this week\nReduction vs. last month: 30%\nEfficiency score: 92%\nCost savings: ₹3,200\n\nYour smart irrigation system is performing excellently! Download the full report for detailed analytics.',
          hasReport: true,
          reportType: 'Water Management Report',
          reportData: {
            id: 'water_' + Date.now(),
            filename: `water_usage_report_${new Date().toISOString().split('T')[0]}.pdf`,
            size: '1.5 MB',
            generated: new Date().toLocaleString(),
            reportType: 'Water Management Report'
          }
        };
      }
      // Generic report request
      return {
        text: 'I can generate the following reports for you:\n\n1. Crop Yield Analysis\n2. Soil Health Report\n3. Water Management Report\n4. Pest Control Summary\n5. Market Price Trends\n\nWhich report would you like me to generate?'
      };
    }

    if (lowerMsg.includes('disease') || lowerMsg.includes('pest')) {
      return {
        text: 'Based on current weather and crop conditions, here are pest management recommendations:\n\n1. Monitor for aphids in tomato and cotton crops\n2. Apply neem oil spray (5ml/L) as prevention\n3. Check leaf undersides weekly for early detection\n4. Maintain 30-45cm plant spacing\n5. Remove infected leaves immediately\n\nWould you like specific treatment recommendations or a pest control report?'
      };
    }

    if (lowerMsg.includes('fertilizer') || lowerMsg.includes('nutrient')) {
      return {
        text: 'Based on your crop stage and soil analysis, I recommend:\n\nNPK ratio: 10-26-26\nApplication method: Split in 3 doses\nSchedule: Days 0, 15, 30 after sowing\nQuantity: 150 kg/hectare\nEstimated cost: ₹850/hectare\n\nOrganic alternative: Vermicompost (5 tons/hectare) + neem cake (200kg/hectare)\n\nWould you like a detailed fertilizer schedule report?'
      };
    }

    if (lowerMsg.includes('price') || lowerMsg.includes('market')) {
      return {
        text: 'Current market prices (updated today):\n\nTomato: ₹25/kg (↑ 8% this week)\nWheat: ₹22/kg (↑ 13% forecast)\nRice: ₹28/kg (↓ 11% expected)\nCotton: ₹6,500/quintal (stable)\n\nBest selling window: Next 3-4 days for tomatoes\nNearby mandis: Check Azadpur, Ghazipur\n\nWould you like detailed 7-day price predictions?'
      };
    }

    if (lowerMsg.includes('weather') || lowerMsg.includes('forecast')) {
      return {
        text: '7-Day Weather Forecast for your location:\n\nToday: Sunny, 28°C, Humidity 65%\nTomorrow: Partly cloudy, 26°C\nDay 3-4: Light rain expected (10-15mm)\nDay 5-7: Clear skies, 25-27°C\n\nFarming recommendations:\n• Postpone irrigation till Day 5\n• Apply fertilizers after rain (Day 5)\n• Good conditions for sowing from Day 5\n\nWould you like hourly weather updates?'
      };
    }

    if (lowerMsg.includes('help') || lowerMsg.includes('what can you')) {
      return {
        text: 'I\'m your AgriBot AI assistant. Here\'s what I can help you with:\n\n📊 Generate Reports:\n• Crop yield analysis\n• Soil health assessment\n• Water usage tracking\n\n🌱 Farm Management:\n• Pest & disease identification\n• Fertilizer recommendations\n• Irrigation scheduling\n\n💰 Market Intelligence:\n• Real-time crop prices\n• Best selling windows\n• Nearby mandi information\n\n🌤️ Weather:\n• 7-day forecasts\n• Rainfall predictions\n• Farming activity suggestions\n\nJust ask me anything about your farm!'
      };
    }

    if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
      return {
        text: 'You\'re welcome! I\'m here 24/7 to help you grow better crops and make smarter farming decisions. Feel free to ask anything else or request any reports you need.'
      };
    }

    // Default intelligent response
    return {
      text: 'I understand you\'re asking about farming. I can help with:\n\n• Generate reports (yield, soil, water)\n• Crop health & disease management\n• Fertilizer & nutrient recommendations\n• Irrigation scheduling\n• Market prices & forecasts\n• Weather updates\n\nCould you please be more specific about what information you need?'
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setMessageCount(prev => prev + 1);
    const queryText = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call backend API
      const response = await callBackendAPI(API_CONFIG.endpoints.chat, {
        message: queryText,
        userId: 'demo_user_123',
        sessionId: Date.now(),
        messageCount: messageCount
      });

      const botMsg = {
        id: messages.length + 2,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString(),
        hasReport: response.hasReport,
        reportType: response.reportType,
        reportData: response.reportData
      };

      setMessages(prev => [...prev, botMsg]);
      setMessageCount(prev => prev + 1);
      
      if (response.hasReport) {
        showNotification(`Report generated: ${response.reportType}`, 'success');
      }
    } catch (error) {
      const errorMsg = {
        id: messages.length + 2,
        sender: 'bot',
        text: 'Sorry, I\'m having trouble connecting to the server. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
      showNotification('Connection error. Please check your internet.', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: 'Hello! I\'m your AgriBot assistant. I can help you generate reports, answer farming questions, and provide insights. What would you like to know?',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setMessageCount(1);
    showNotification('Chat history cleared', 'success');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDownloadReport = async (reportData) => {
    showNotification(`Preparing ${reportData.filename} for download...`, 'success');
    
    try {
      // PRODUCTION: Real API download
      /*
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.download}/${reportData.id}`, {
        method: 'GET',
        headers: API_CONFIG.headers
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = reportData.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      */
      
      // DEMO MODE: Generate sample PDF
      setTimeout(() => {
        generateAndDownloadPDF(reportData);
        showNotification(`${reportData.filename} downloaded successfully!`, 'success');
      }, 1000);
      
    } catch (error) {
      console.error('Download error:', error);
      showNotification('Download failed. Please try again.', 'error');
    }
  };

  // Generate sample PDF for demo
  const generateAndDownloadPDF = (reportData) => {
    // Create PDF content
    const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length 200
>>
stream
BT
/F1 24 Tf
50 750 Td
(${reportData.reportType || 'AgriBot Report'}) Tj
/F1 12 Tf
50 700 Td
(Generated: ${reportData.generated || new Date().toLocaleDateString()}) Tj
50 670 Td
(This is a sample report generated by AgriBot AI Assistant.) Tj
50 640 Td
(For production use, connect to your backend API.) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000000524 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
609
%%EOF`;

    // Convert to blob and download
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = reportData.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const quickActions = [
    { text: 'Generate yield report', icon: TrendingUp },
    { text: 'Soil health status', icon: FileText },
    { text: 'Water usage this month', icon: Droplet },
    { text: 'Market prices today', icon: DollarSign },
    { text: 'Weather forecast', icon: Sun }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #EFF6FF, #F0FDF4)', padding: '24px' }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .message-enter {
          animation: slideIn 0.3s ease-out;
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .typing-dot {
          animation: bounce 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        .status-pulse {
          animation: pulse 2s infinite;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #F3F4F6;
        }

        ::-webkit-scrollbar-thumb {
          background: #10B981;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>

      {/* Notification */}
      {notification && (
        <div className="fade-in" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          background: notification.type === 'success' ? '#D1FAE5' : '#FEE2E2',
          border: `2px solid ${notification.type === 'success' ? '#10B981' : '#EF4444'}`,
          borderRadius: '12px',
          padding: '14px 20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minWidth: '300px',
          maxWidth: '400px'
        }}>
          {notification.type === 'success' ? (
            <CheckCircle style={{ width: '20px', height: '20px', color: '#10B981', flexShrink: 0 }} />
          ) : (
            <AlertCircle style={{ width: '20px', height: '20px', color: '#EF4444', flexShrink: 0 }} />
          )}
          <span style={{ 
            fontSize: '14px', 
            fontWeight: '600',
            color: notification.type === 'success' ? '#065F46' : '#991B1B',
            flex: 1
          }}>
            {notification.message}
          </span>
          <button 
            onClick={() => setNotification(null)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex'
            }}
          >
            <X style={{ width: '16px', height: '16px', color: notification.type === 'success' ? '#065F46' : '#991B1B' }} />
          </button>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
          padding: '24px', 
          marginBottom: '20px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'linear-gradient(135deg, #10B981, #059669)', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <Bot style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                  AgriBot Assistant
                </h1>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>
                  AI-powered farming insights & reports
                </p>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '8px 16px', 
              background: isConnected ? '#D1FAE5' : '#FEE2E2',
              borderRadius: '20px'
            }}>
              <div className={isConnected ? 'status-pulse' : ''} style={{ 
                width: '8px', 
                height: '8px', 
                background: isConnected ? '#10B981' : '#EF4444', 
                borderRadius: '50%'
              }}></div>
              <span style={{ color: isConnected ? '#065F46' : '#991B1B', fontWeight: '600', fontSize: '13px' }}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <button
              onClick={handleClearChat}
              style={{
                padding: '8px 16px',
                background: '#F3F4F6',
                color: '#6B7280',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#E5E7EB';
                e.target.style.color = '#EF4444';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#F3F4F6';
                e.target.style.color = '#6B7280';
              }}
            >
              <Trash2 style={{ width: '14px', height: '14px' }} />
              Clear Chat
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          {/* Messages Area */}
          <div style={{ 
            height: '500px', 
            overflowY: 'auto', 
            padding: '20px', 
            background: '#F9FAFB'
          }}>
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className="message-enter"
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '12px',
                  marginBottom: '20px',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px',
                  background: msg.sender === 'bot' 
                    ? 'linear-gradient(135deg, #10B981, #059669)' 
                    : '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {msg.sender === 'bot' ? (
                    <Bot style={{ width: '22px', height: '22px', color: 'white' }} />
                  ) : (
                    <User style={{ width: '22px', height: '22px', color: 'white' }} />
                  )}
                </div>

                <div style={{ flex: 1, maxWidth: '70%', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'bot' ? '12px 12px 12px 2px' : '12px 12px 2px 12px',
                    background: msg.sender === 'bot' 
                      ? (msg.isError ? '#FEE2E2' : 'white')
                      : '#10B981',
                    border: msg.sender === 'bot' ? '1px solid #E5E7EB' : 'none',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    color: msg.sender === 'bot' ? (msg.isError ? '#991B1B' : '#111827') : 'white'
                  }}>
                    <p style={{ fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-line', margin: 0 }}>
                      {msg.text}
                    </p>
                    
                    {msg.hasReport && msg.reportData && (
                      <button 
                        onClick={() => handleDownloadReport(msg.reportData)}
                        style={{ 
                          marginTop: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 14px',
                          background: '#3B82F6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '13px',
                          cursor: 'pointer',
                          width: '100%',
                          justifyContent: 'center',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#2563EB'}
                        onMouseOut={(e) => e.target.style.background = '#3B82F6'}
                      >
                        <Download style={{ width: '16px', height: '16px' }} />
                        Download {msg.reportType}
                        <span style={{ fontSize: '11px', opacity: 0.8 }}>({msg.reportData.size})</span>
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px', fontWeight: '500' }}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-enter" style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bot style={{ width: '22px', height: '22px', color: 'white' }} />
                </div>
                <div style={{ 
                  padding: '12px 16px',
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px 12px 12px 2px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <div className="typing-dot" style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }}></div>
                    <div className="typing-dot" style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }}></div>
                    <div className="typing-dot" style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div style={{ padding: '16px 20px', background: 'white', borderTop: '1px solid #E5E7EB' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '10px' }}>
              Quick Actions:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputMessage(action.text)}
                  style={{
                    padding: '8px 14px',
                    background: '#F3F4F6',
                    color: '#374151',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#E5E7EB';
                    e.target.style.borderColor = '#10B981';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#F3F4F6';
                    e.target.style.borderColor = '#E5E7EB';
                  }}
                >
                  <action.icon style={{ width: '14px', height: '14px' }} />
                  {action.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about crops, reports, weather, market prices..."
                disabled={!isConnected}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit',
                  background: isConnected ? 'white' : '#F9FAFB'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10B981'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || !isConnected}
                style={{
                  padding: '12px 20px',
                  background: (inputMessage.trim() && isConnected) 
                    ? 'linear-gradient(135deg, #10B981, #059669)' 
                    : '#D1D5DB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: (inputMessage.trim() && isConnected) ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                {isTyping ? (
                  <Loader style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Send style={{ width: '20px', height: '20px' }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            { icon: FileText, title: 'Instant Reports', desc: 'Generate detailed farming reports on demand', color: '#3B82F6' },
            { icon: MessageSquare, title: '24/7 Support', desc: 'Get farming advice anytime, in your language', color: '#10B981' },
            { icon: Bot, title: 'AI Insights', desc: 'Data-driven recommendations for your farm', color: '#8B5CF6' }
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                borderLeft: `4px solid ${feature.color}`
              }}
            >
              <feature.icon style={{ width: '32px', height: '32px', color: feature.color, marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsChatbot;