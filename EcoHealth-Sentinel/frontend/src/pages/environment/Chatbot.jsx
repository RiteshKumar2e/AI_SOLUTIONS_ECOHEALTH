import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Leaf, Droplets, Wind, Sun, Trash2, Download, Copy, Volume2, VolumeX, RefreshCw, Settings, Sparkles, CheckCircle, TrendingUp, Share2, Search, Minimize2, Maximize2, Clock, Star, ThumbsUp, ThumbsDown, BookOpen } from 'lucide-react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! 👋 I\'m your AI Environmental Assistant. I can help you with:\n\n🌍 Climate change & global warming\n💧 Water conservation\n⚡ Renewable energy\n♻️ Waste management\n🌱 Sustainable agriculture\n🦋 Wildlife conservation\n\nHow can I assist you today?',
      timestamp: new Date(),
      suggestions: ['Climate Tips', 'Water Conservation', 'Renewable Energy', 'Sustainable Living'],
      helpful: null
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    autoScroll: true,
    showTimestamp: true,
    fontSize: 'medium',
    notifications: true,
    autoSave: true
  });
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  //const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const knowledgeBase = {
    climate: {
      keywords: ['climate', 'global warming', 'temperature', 'greenhouse', 'carbon', 'co2'],
      responses: [
        '🌡️ **Climate Change Overview:**\n\nClimate change is real and urgent. Key facts:\n• Global temperature +1.1°C since pre-industrial times\n• CO2 levels: 420 ppm (highest in 3 million years)\n• Sea levels rising 3.3mm/year\n\n**Actions you can take:**\n✅ Reduce energy use by 30%\n✅ Use public transport\n✅ Support renewable energy\n✅ Plant trees (1 tree = 48 lbs CO2/year)\n✅ Reduce meat consumption',
        '📊 **India\'s Climate Commitment:**\n\n✅ 500 GW renewable target by 2030\n✅ 45% emission intensity reduction\n✅ Net-zero by 2070\n✅ World\'s 4th largest renewable market\n\n**Progress:**\n• Renewable capacity: 175 GW achieved\n• Solar grew 20x in 8 years\n• On track to meet Paris goals'
      ]
    },
    water: {
      keywords: ['water', 'conservation', 'save water', 'drought'],
      responses: [
        '💧 **Water Conservation Tips:**\n\n**Daily Actions:**\n✅ Fix leaks - Save 30L/day\n✅ 5-min showers - Save 50L\n✅ Turn off tap while brushing\n✅ Use bucket instead of running water\n\n**Impact:**\nIndia has only 4% freshwater but 18% population. Every drop counts!',
        '🌊 **Water Pollution Solutions:**\n\n**Main sources:**\n• Industrial waste (40%)\n• Agricultural runoff (30%)\n• Sewage (25%)\n\n**What you can do:**\n✅ Use eco-friendly products\n✅ Proper waste disposal\n✅ Support wastewater treatment\n✅ Report pollution'
      ]
    },
    energy: {
      keywords: ['energy', 'solar', 'renewable', 'electricity'],
      responses: [
        '⚡ **Renewable Energy Benefits:**\n\n**Why switch?**\n✅ Zero emissions\n✅ Lower bills long-term\n✅ Energy independence\n✅ Creates jobs\n\n**India Progress:**\n• 175 GW renewable capacity\n• 500 GW target by 2030\n• 40% govt subsidy for solar',
        '☀️ **Solar Energy Guide:**\n\n**System Sizing:**\n• 1 kW = 4-5 units/day\n• 3-5 kW for average home\n• Cost: ₹50,000-60,000/kW\n\n**Benefits:**\n• 5-7 year payback\n• 25-year lifespan\n• Net metering available'
      ]
    },
    waste: {
      keywords: ['waste', 'plastic', 'recycle', 'garbage'],
      responses: [
        '♻️ **3R Hierarchy:**\n\n**1. REDUCE** (Most important)\n• Buy only what you need\n• Avoid single-use items\n\n**2. REUSE**\n• Repair instead of replace\n• Donate unwanted items\n\n**3. RECYCLE**\n• Segregate: Wet, Dry, Hazardous\n• Use recycling facilities',
        '🌊 **Plastic Crisis:**\n\n**Facts:**\n• 8M tons enter oceans yearly\n• 500+ years to decompose\n\n**Solutions:**\n✅ Reusable bags & bottles\n✅ Refuse straws & cutlery\n✅ Choose glass/steel\n✅ Join beach cleanups'
      ]
    },
    general: {
      keywords: ['help', 'what', 'tips', 'sustainable'],
      responses: [
        '🌟 **I can help with:**\n\n🌍 Climate change strategies\n💧 Water conservation tips\n⚡ Renewable energy options\n♻️ Waste management\n🌱 Sustainable agriculture\n🦋 Wildlife conservation\n\nWhat would you like to know?',
        '✨ **Quick Eco-Actions:**\n\n**Daily:**\n✅ LED bulbs (80% less energy)\n✅ Fix water leaks\n✅ Reusable bags\n✅ 5-min showers\n\n**Weekly:**\n✅ Meatless Monday\n✅ Bulk shopping\n✅ Composting\n\n**Impact: Save ₹15,000-30,000/year!**'
      ]
    }
  };

  const scrollToBottom = () => {
    if (settings.autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) setChatHistory(JSON.parse(saved));
    const savedFavorites = localStorage.getItem('chatFavorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    const savedSettings = localStorage.getItem('chatSettings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  const saveChatHistory = (newMessages) => {
    if (settings.autoSave) {
      const history = {
        id: Date.now(),
        messages: newMessages,
        timestamp: new Date().toISOString(),
        title: newMessages[1]?.text.slice(0, 50) + '...' || 'New Chat'
      };
      const updated = [history, ...chatHistory].slice(0, 20);
      setChatHistory(updated);
      localStorage.setItem('chatHistory', JSON.stringify(updated));
    }
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('chatSettings', JSON.stringify(newSettings));
  };

  const getAIResponse = async (userInput) => {
    try {
      const response = await fetch(`${API_BASE_URL}/environment/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          message: userInput,
          context: messages.slice(-5)
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.response;
      }
    } catch (error) {
      console.log('Using local knowledge base');
    }
    return null;
  };

  const findBestResponse = (userInput) => {
    const input = userInput.toLowerCase();
    let bestMatch = { category: 'general', score: 0 };

    for (const [category, data] of Object.entries(knowledgeBase)) {
      const matchCount = data.keywords.filter(k => input.includes(k)).length;
      if (matchCount > bestMatch.score) {
        bestMatch = { category, score: matchCount };
      }
    }

    const responses = knowledgeBase[bestMatch.category].responses;
    const response = responses[Math.floor(Math.random() * responses.length)];

    const suggestions = bestMatch.category === 'climate' 
      ? ['Carbon Calculator', 'Renewable Energy', 'Climate Action']
      : bestMatch.category === 'water'
      ? ['Rainwater Harvesting', 'Pollution Control', 'Conservation']
      : ['Energy Efficiency', 'Solar Guide', 'Green Schemes'];

    return { text: response, suggestions };
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    const aiResponse = await getAIResponse(currentInput);
    
    setTimeout(() => {
      const response = aiResponse || findBestResponse(currentInput);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: typeof response === 'string' ? response : response.text,
        timestamp: new Date(),
        suggestions: typeof response === 'object' ? response.suggestions : [],
        helpful: null
      };

      const newMessages = [...messages, userMessage, botMessage];
      setMessages(newMessages);
      setIsTyping(false);

      if (settings.voiceEnabled) speakText(botMessage.text);
      saveChatHistory(newMessages);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { icon: Leaf, text: 'Climate', query: 'Climate change tips', color: '#10b981' },
    { icon: Droplets, text: 'Water', query: 'Water conservation', color: '#3b82f6' },
    { icon: Sun, text: 'Solar', query: 'Solar energy guide', color: '#f59e0b' },
    { icon: Trash2, text: 'Waste', query: 'Waste management tips', color: '#ef4444' },
    { icon: Wind, text: 'Energy', query: 'Renewable energy', color: '#8b5cf6' },
    { icon: TrendingUp, text: 'Carbon', query: 'Reduce carbon footprint', color: '#06b6d4' }
  ];

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const cleanText = text.replace(/[*#•✓✅❌⚠️🌍💧⚡♻️🌱]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    showToast('✅ Copied!');
  };

  const shareChat = async (message) => {
    const text = `AI Environmental Insight:\n\n${message.text}`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        copyMessage(text);
      }
    } else {
      copyMessage(text);
    }
  };

  const markHelpful = (id, isHelpful) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, helpful: isHelpful } : m));
    showToast(isHelpful ? '👍 Thanks!' : '👎 We\'ll improve!');
  };

  const addToFavorites = (message) => {
    const newFavorites = [...favorites, message];
    setFavorites(newFavorites);
    localStorage.setItem('chatFavorites', JSON.stringify(newFavorites));
    showToast('⭐ Added to favorites!');
  };

  const downloadChat = () => {
    const text = messages.map(m => 
      `[${m.timestamp.toLocaleTimeString()}] ${m.type === 'user' ? 'You' : 'AI'}:\n${m.text}\n\n`
    ).join('');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    showToast('✅ Downloaded!');
  };

  const clearChat = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([messages[0]]);
      showToast('✅ Cleared!');
    }
  };

  const showToast = (msg) => {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #10b981, #3b82f6);
      color: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.2);
      z-index: 10000; font-weight: 600; animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  return (
    <>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        
        .chat-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #d1fae5 0%, #dbeafe 50%, #e0e7ff 100%);
          padding: ${isFullscreen ? '0' : '24px'};
          animation: fadeIn 0.6s;
        }

        .chat-wrapper {
          max-width: ${isFullscreen ? '100%' : '1200px'};
          height: ${isFullscreen ? '100vh' : 'calc(100vh - 48px)'};
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: ${isFullscreen ? '0' : '24px'};
          overflow: hidden;
          box-shadow: ${isFullscreen ? 'none' : '0 20px 60px rgba(0,0,0,0.1)'};
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .messages-area::-webkit-scrollbar { width: 8px; }
        .messages-area::-webkit-scrollbar-track { background: #f1f5f9; }
        .messages-area::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

        .message-bubble {
          border-radius: 20px;
          padding: 16px 20px;
          max-width: 80%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: all 0.3s;
        }

        .message-bubble:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        }

        .input-field {
          width: 100%;
          resize: none;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 14px 18px;
          font-size: 15px;
          transition: all 0.3s;
          background: #f8fafc;
          font-family: inherit;
        }

        .input-field:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
          background: white;
        }

        .action-btn {
          padding: 10px;
          border-radius: 10px;
          border: none;
          background: #f1f5f9;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s;
        }

        .action-btn:hover {
          background: #e2e8f0;
          color: #1e293b;
          transform: scale(1.1);
        }

        .quick-btn {
          padding: 10px 16px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .quick-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: white;
          border-radius: 24px;
          padding: 32px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        @media (max-width: 768px) {
          .chat-container { padding: 0; }
          .message-bubble { max-width: 90%; }
        }
      `}</style>

      <div className="chat-container">
        <div className="chat-wrapper">
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #fff 0%, #f0fdf4 100%)', padding: '20px 24px', borderBottom: '2px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', borderRadius: '50%', padding: '12px', animation: 'pulse 3s infinite' }}>
                  <Bot size={28} style={{ color: 'white' }} />
                </div>
                <div>
                  <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' }}>
                    AI Environmental Assistant
                  </h1>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={12} style={{ color: '#10b981' }} />
                    Powered by AI • {messages.length - 1} messages
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {isSpeaking && (
                  <button className="action-btn" onClick={stopSpeaking} title="Stop">
                    <VolumeX size={18} />
                  </button>
                )}
                <button className="action-btn" onClick={() => setShowSearch(!showSearch)} title="Search">
                  <Search size={18} />
                </button>
                <button className="action-btn" onClick={downloadChat} title="Download">
                  <Download size={18} />
                </button>
                <button className="action-btn" onClick={() => setShowHistory(!showHistory)} title="History">
                  <Clock size={18} />
                </button>
                <button className="action-btn" onClick={clearChat} title="Clear">
                  <Trash2 size={18} />
                </button>
                <button className="action-btn" onClick={() => setShowSettings(!showSettings)} title="Settings">
                  <Settings size={18} />
                </button>
                <button className="action-btn" onClick={() => setIsFullscreen(!isFullscreen)} title="Fullscreen">
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </div>
            </div>

            {showSearch && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search messages..."
                style={{ width: '100%', padding: '10px 16px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', marginTop: '12px' }}
              />
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    onClick={() => { setInputText(action.query); setTimeout(handleSend, 100); }}
                    className="quick-btn"
                    style={{ background: `${action.color}20`, color: action.color, border: `1px solid ${action.color}40` }}
                  >
                    <Icon size={16} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />
                    {action.text}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          <div className="messages-area">
            {messages.filter(m => !searchQuery || m.text.toLowerCase().includes(searchQuery.toLowerCase())).map((msg) => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px', flexDirection: msg.type === 'user' ? 'row-reverse' : 'row', maxWidth: '85%' }}>
                  <div style={{ flexShrink: 0 }}>
                    {msg.type === 'bot' ? (
                      <div style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', borderRadius: '50%', padding: '10px' }}>
                        <Bot size={20} style={{ color: 'white' }} />
                      </div>
                    ) : (
                      <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: '50%', padding: '10px' }}>
                        <User size={20} style={{ color: 'white' }} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="message-bubble" style={{ 
                      background: msg.type === 'user' ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'linear-gradient(135deg, #f0fdf4, #dbeafe)',
                      color: msg.type === 'user' ? 'white' : '#1e293b',
                      border: msg.type === 'bot' ? '1px solid #d1fae5' : 'none'
                    }}>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{msg.text}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', fontSize: '12px', color: '#94a3b8', flexWrap: 'wrap' }}>
                      {settings.showTimestamp && <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                      {msg.type === 'bot' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => copyMessage(msg.text)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                            <Copy size={14} />
                          </button>
                          {settings.voiceEnabled && (
                            <button onClick={() => speakText(msg.text)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                              <Volume2 size={14} />
                            </button>
                          )}
                          <button onClick={() => shareChat(msg)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                            <Share2 size={14} />
                          </button>
                          <button onClick={() => addToFavorites(msg)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                            <Star size={14} />
                          </button>
                          <button onClick={() => markHelpful(msg.id, true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: msg.helpful === true ? '#10b981' : '#64748b', padding: '4px' }}>
                            <ThumbsUp size={14} />
                          </button>
                          <button onClick={() => markHelpful(msg.id, false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: msg.helpful === false ? '#ef4444' : '#64748b', padding: '4px' }}>
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        {msg.suggestions.map((s, i) => (
                          <span
                            key={i}
                            onClick={() => { setInputText(s); setTimeout(handleSend, 100); }}
                            style={{
                              display: 'inline-block',
                              padding: '8px 16px',
                              margin: '4px',
                              background: 'linear-gradient(135deg, #f0fdf4, #dbeafe)',
                              border: '1px solid #10b981',
                              borderRadius: '20px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#059669',
                              cursor: 'pointer',
                              transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'linear-gradient(135deg, #10b981, #3b82f6)';
                              e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'linear-gradient(135deg, #f0fdf4, #dbeafe)';
                              e.target.style.color = '#059669';
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <div style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', borderRadius: '50%', padding: '10px' }}>
                    <Bot size={20} style={{ color: 'white' }} />
                  </div>
                  <div className="message-bubble" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dbeafe)', border: '1px solid #d1fae5' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: `pulse 1.4s infinite ${i * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ background: 'white', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', padding: '20px 24px', borderTop: '2px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about environment, sustainability, climate..."
                className="input-field"
                rows="2"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                  background: inputText.trim() ? 'linear-gradient(135deg, #10b981, #3b82f6)' : '#e2e8f0',
                  color: inputText.trim() ? 'white' : '#94a3b8',
                  transition: 'all 0.3s'
                }}
              >
                <Send size={20} />
              </button>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '12px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <CheckCircle size={12} style={{ color: '#10b981' }} />
              AI-powered • Verified data • {chatHistory.length} saved chats
            </p>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>⚙️ Settings</h2>
              <button onClick={() => setShowSettings(false)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#f1f5f9', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(settings).map(([key, value]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => saveSettings({ ...settings, [key]: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '15px', color: '#1e293b', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="modal" onClick={() => setShowHistory(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>📜 Chat History</h2>
              <button onClick={() => setShowHistory(false)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#f1f5f9', cursor: 'pointer' }}>✕</button>
            </div>
            {chatHistory.length > 0 ? (
              chatHistory.map(chat => (
                <div key={chat.id} style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '12px', cursor: 'pointer', border: '1px solid #e2e8f0' }}
                  onClick={() => { setMessages(chat.messages); setShowHistory(false); showToast('✅ Chat loaded!'); }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{chat.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{new Date(chat.timestamp).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No saved chats yet</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
