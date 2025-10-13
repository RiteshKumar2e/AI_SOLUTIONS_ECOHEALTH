import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Send, Bot, User, AlertTriangle, CheckCircle, Info, Sparkles,
  Mic, Paperclip, Download, Calendar, Clock, FileText, Pill, Activity,
  Heart, Phone, MapPin, ChevronDown, Search, Bookmark, Share2, Image as ImageIcon
} from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: null,
    conditions: [],
    medications: [],
    allergies: []
  });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  //const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Light Theme Inline Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #fef3c7 75%, #fed7aa 100%)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    floatingOrbs: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0
    },
    orb: {
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(80px)',
      opacity: 0.2
    },
    orb1: {
      width: '500px',
      height: '500px',
      background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
      top: '-150px',
      left: '-150px'
    },
    orb2: {
      width: '400px',
      height: '400px',
      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      bottom: '-100px',
      right: '-100px'
    },
    orb3: {
      width: '350px',
      height: '350px',
      background: 'linear-gradient(135deg, #34d399, #10b981)',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    },
    maxWidth: {
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      gap: '1.5rem'
    },
    sidebar: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '1.5rem',
      height: 'fit-content',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5)',
      position: 'sticky',
      top: '2rem'
    },
    mainContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    headerCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5)',
      padding: '1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    headerIcon: {
      width: '3.5rem',
      height: '3.5rem',
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    subtitle: {
      color: '#64748b',
      fontSize: '0.9rem',
      margin: '0.25rem 0 0 0'
    },
    statusBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
      borderRadius: '9999px',
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#065f46',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
    },
    statusDot: {
      width: '8px',
      height: '8px',
      background: '#10b981',
      borderRadius: '50%',
      animation: 'pulse 2s infinite'
    },
    sidebarSection: {
      marginBottom: '1.5rem'
    },
    sectionTitle: {
      fontSize: '0.75rem',
      fontWeight: '700',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '0.75rem'
    },
    quickActionBtn: {
      width: '100%',
      padding: '0.75rem 1rem',
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      marginBottom: '0.5rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      transition: 'all 0.3s ease',
      color: '#475569',
      fontSize: '0.9rem',
      fontWeight: '500'
    },
    quickActionIcon: {
      width: '2rem',
      height: '2rem',
      background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#2563eb'
    },
    statsCard: {
      background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
      padding: '1rem',
      borderRadius: '12px',
      marginBottom: '0.75rem',
      border: '1px solid #bae6fd'
    },
    statLabel: {
      fontSize: '0.75rem',
      color: '#0369a1',
      fontWeight: '600',
      marginBottom: '0.25rem'
    },
    statValue: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#0c4a6e'
    },
    chatCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      height: '650px'
    },
    quickActionsBar: {
      padding: '1rem 1.5rem',
      background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
      borderBottom: '1px solid #fcd34d',
      display: 'flex',
      gap: '0.5rem',
      overflowX: 'auto',
      flexWrap: 'wrap'
    },
    quickChip: {
      padding: '0.5rem 1rem',
      background: 'white',
      border: '1px solid #fbbf24',
      borderRadius: '9999px',
      fontSize: '0.85rem',
      fontWeight: '500',
      color: '#92400e',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease'
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '1.5rem',
      background: 'linear-gradient(180deg, #fefce8 0%, #fef9c3 100%)',
      scrollBehavior: 'smooth'
    },
    messageFlex: {
      display: 'flex',
      marginBottom: '1rem',
      gap: '0.75rem',
      alignItems: 'flex-start'
    },
    messageFlexEnd: {
      justifyContent: 'flex-end'
    },
    messageFlexStart: {
      justifyContent: 'flex-start'
    },
    messageBubble: {
      padding: '1rem 1.25rem',
      borderRadius: '18px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.06)',
      maxWidth: '70%',
      wordWrap: 'break-word',
      position: 'relative'
    },
    userBubble: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: 'white',
      borderBottomRightRadius: '4px',
      boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
    },
    botBubble: {
      background: 'white',
      border: '1px solid #e5e7eb',
      borderTopLeftRadius: '4px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      maxWidth: '80%',
      color: '#1e293b'
    },
    messageText: {
      margin: 0,
      lineHeight: '1.6',
      fontSize: '0.95rem'
    },
    messageActions: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '0.75rem',
      paddingTop: '0.75rem',
      borderTop: '1px solid #f1f5f9'
    },
    actionBtn: {
      background: 'transparent',
      border: 'none',
      color: '#64748b',
      cursor: 'pointer',
      padding: '0.25rem',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.8rem'
    },
    avatar: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    userAvatar: {
      background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
    },
    botAvatar: {
      background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
    },
    analysisCard: {
      padding: '1rem',
      borderRadius: '12px',
      marginTop: '0.75rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },
    symptomCard: {
      background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
      border: '1px solid #93c5fd'
    },
    riskCardHigh: {
      background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
      color: '#991b1b',
      fontWeight: '600',
      border: '1px solid #fca5a5'
    },
    riskCardMedium: {
      background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
      color: '#92400e',
      fontWeight: '600',
      border: '1px solid #fcd34d'
    },
    riskCardLow: {
      background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
      color: '#065f46',
      fontWeight: '600',
      border: '1px solid #6ee7b7'
    },
    conditionCard: {
      background: 'linear-gradient(135deg, #fae8ff, #f3e8ff)',
      border: '1px solid #e9d5ff'
    },
    recommendationCard: {
      background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
      border: '1px solid #6ee7b7'
    },
    symptomTagsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '0.5rem'
    },
    symptomTag: {
      padding: '0.35rem 0.85rem',
      background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
      color: 'white',
      borderRadius: '9999px',
      fontSize: '0.8rem',
      fontWeight: '600',
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)'
    },
    cardTitle: {
      fontWeight: '700',
      fontSize: '0.9rem',
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    listItem: {
      fontSize: '0.875rem',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem',
      lineHeight: '1.5'
    },
    quickReplyContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    quickReplyBtn: {
      padding: '0.6rem 1.1rem',
      background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
      color: '#0369a1',
      border: '1px solid #7dd3fc',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(14, 165, 233, 0.15)',
      transition: 'all 0.3s ease'
    },
    typingIndicator: {
      background: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '18px',
      borderTopLeftRadius: '4px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
      border: '1px solid #e5e7eb'
    },
    typingDot: {
      width: '8px',
      height: '8px',
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      borderRadius: '50%',
      boxShadow: '0 2px 5px rgba(59, 130, 246, 0.3)'
    },
    inputContainer: {
      borderTop: '1px solid #e5e7eb',
      padding: '1.25rem 1.5rem',
      background: 'white'
    },
    filePreview: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem',
      background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
      borderRadius: '12px',
      marginBottom: '0.75rem',
      border: '1px solid #bae6fd'
    },
    inputWrapper: {
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'center'
    },
    inputFlex: {
      flex: 1,
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
      borderRadius: '9999px',
      padding: '0.5rem 0.5rem 0.5rem 1.25rem',
      border: '2px solid #e2e8f0',
      transition: 'all 0.3s ease'
    },
    messageInput: {
      flex: 1,
      border: 'none',
      background: 'transparent',
      fontSize: '0.95rem',
      outline: 'none',
      color: '#1e293b',
      padding: '0.5rem 0'
    },
    iconButton: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '50%',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#64748b'
    },
    iconButtonActive: {
      background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
      color: '#dc2626'
    },
    sendBtn: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: 'white',
      border: 'none',
      padding: '1rem',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
      minWidth: '3rem',
      minHeight: '3rem'
    },
    sendBtnDisabled: {
      opacity: 0.4,
      cursor: 'not-allowed'
    },
    disclaimer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '0.75rem',
      fontSize: '0.75rem',
      color: '#64748b',
      padding: '0.65rem 0.85rem',
      background: 'rgba(251, 191, 36, 0.1)',
      borderRadius: '8px',
      borderLeft: '3px solid #fbbf24'
    },
    confidence: {
      fontSize: '0.75rem',
      color: '#94a3b8',
      marginTop: '0.5rem',
      marginLeft: '0.5rem',
      fontStyle: 'italic'
    },
    featureButton: {
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '0.75rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#475569',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap'
    }
  };

  useEffect(() => {
    setTimeout(() => {
      addBotMessage({
        text: "👋 Hello! I'm HealthAI, your 24/7 medical assistant. I can help you with:\n\n✓ Symptom analysis & health assessment\n✓ Appointment scheduling\n✓ Medication information\n✓ Health records & history\n✓ Emergency guidance\n\nWhat can I help you with today?",
        type: 'greeting',
        timestamp: new Date()
      });
    }, 500);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addBotMessage = (messageData) => {
    const botMessage = {
      id: Date.now() + Math.random(),
      sender: 'bot',
      ...messageData
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const addUserMessage = (text) => {
    const userMessage = {
      id: Date.now() + Math.random(),
      sender: 'user',
      text,
      timestamp: new Date(),
      file: selectedFile
    };
    setMessages(prev => [...prev, userMessage]);
    setSelectedFile(null);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedFile) return;
    
    const userText = inputValue.trim();
    addUserMessage(userText);
    setInputValue('');
    setIsTyping(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          userId: 'user_' + Date.now(),
          userProfile: userProfile,
          hasFile: !!selectedFile
        }),
      });

      const data = await response.json();
      
      setIsTyping(false);
      addBotMessage({
        text: data.response,
        type: data.type || 'general',
        data: data.analysis,
        quickReplies: data.quickReplies,
        confidence: data.confidence,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
      addBotMessage({
        text: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        type: 'error',
        timestamp: new Date()
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type
      });
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputValue("Voice input simulation - I have a headache");
      }, 2000);
    }
  };

  const handleQuickAction = (action) => {
    setInputValue(action);
  };

  const exportChat = () => {
    const chatContent = messages.map(m => 
      `${m.sender === 'user' ? 'You' : 'HealthAI'}: ${m.text}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `healthai-chat-${new Date().toISOString()}.txt`;
    a.click();
  };

  const bookmarkMessage = (messageId) => {
    console.log('Bookmarked message:', messageId);
  };

  const shareMessage = (messageId) => {
    console.log('Shared message:', messageId);
  };

  const renderMessage = (message) => {
    if (message.sender === 'user') {
      return (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{...styles.messageFlex, ...styles.messageFlexEnd}}
        >
          <motion.div 
            style={{...styles.messageBubble, ...styles.userBubble}}
            whileHover={{ scale: 1.01, translateY: -2 }}
          >
            <p style={styles.messageText}>{message.text}</p>
            {message.file && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.9 }}>
                📎 {message.file.name}
              </div>
            )}
          </motion.div>
          <motion.div 
            style={{...styles.avatar, ...styles.userAvatar}}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <User style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb' }} />
          </motion.div>
        </motion.div>
      );
    }
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, x: -50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{...styles.messageFlex, ...styles.messageFlexStart}}
      >
        <motion.div 
          style={{...styles.avatar, ...styles.botAvatar}}
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Bot style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />
        </motion.div>
        <div style={{ flex: 1 }}>
          <motion.div 
            style={{...styles.messageBubble, ...styles.botBubble}}
            whileHover={{ scale: 1.005, translateY: -2 }}
          >
            {message.type === 'emergency' && (
              <motion.div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#dc2626',
                  fontWeight: 'bold',
                  marginBottom: '0.75rem',
                  padding: '0.5rem',
                  background: 'rgba(220, 38, 38, 0.1)',
                  borderRadius: '8px'
                }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertTriangle style={{ width: '1.25rem', height: '1.25rem' }} />
                EMERGENCY ALERT
              </motion.div>
            )}
            
            <p style={styles.messageText}>{message.text}</p>
            
            {message.type === 'symptom_analysis' && message.data && (
              <motion.div 
                style={{ marginTop: '1rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div 
                  style={{...styles.analysisCard, ...styles.symptomCard}}
                  whileHover={{ scale: 1.01 }}
                >
                  <p style={{...styles.cardTitle, color: '#1e40af'}}>
                    <Activity style={{ width: '1.1rem', height: '1.1rem' }} />
                    Detected Symptoms
                  </p>
                  <div style={styles.symptomTagsContainer}>
                    {message.data.symptoms?.map((s, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                        style={styles.symptomTag}
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div 
                  style={{
                    ...styles.analysisCard, 
                    ...(message.data.riskLevel === 'high' ? styles.riskCardHigh :
                        message.data.riskLevel === 'medium' ? styles.riskCardMedium :
                        styles.riskCardLow)
                  }}
                  whileHover={{ scale: 1.01 }}
                >
                  <p style={styles.cardTitle}>
                    <AlertTriangle style={{ width: '1.1rem', height: '1.1rem' }} />
                    Risk Level: {message.data.riskLevel?.toUpperCase()}
                  </p>
                </motion.div>
                
                {message.data.possibleConditions?.length > 0 && (
                  <motion.div 
                    style={{...styles.analysisCard, ...styles.conditionCard}}
                    whileHover={{ scale: 1.01 }}
                  >
                    <p style={{...styles.cardTitle, color: '#6b21a8'}}>
                      <FileText style={{ width: '1.1rem', height: '1.1rem' }} />
                      Possible Conditions
                    </p>
                    {message.data.possibleConditions.map((cond, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{...styles.listItem, color: '#7c3aed'}}
                      >
                        • {cond.name} ({(cond.probability * 100).toFixed(0)}% match)
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                
                <motion.div 
                  style={{...styles.analysisCard, ...styles.recommendationCard}}
                  whileHover={{ scale: 1.01 }}
                >
                  <p style={{...styles.cardTitle, color: '#065f46'}}>
                    <CheckCircle style={{ width: '1.1rem', height: '1.1rem' }} />
                    Recommendations
                  </p>
                  {message.data.recommendations?.map((rec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{...styles.listItem, color: '#047857'}}
                    >
                      <CheckCircle style={{ width: '1rem', height: '1rem', marginTop: '0.15rem', flexShrink: 0 }} />
                      <span>{rec}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
            
            {message.quickReplies && (
              <motion.div 
                style={styles.quickReplyContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {message.quickReplies.map((reply, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setInputValue(reply)}
                    style={styles.quickReplyBtn}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {reply}
                  </motion.button>
                ))}
              </motion.div>
            )}

            <div style={styles.messageActions}>
              <button 
                style={styles.actionBtn}
                onClick={() => bookmarkMessage(message.id)}
              >
                <Bookmark style={{ width: '0.9rem', height: '0.9rem' }} />
              </button>
              <button 
                style={styles.actionBtn}
                onClick={() => shareMessage(message.id)}
              >
                <Share2 style={{ width: '0.9rem', height: '0.9rem' }} />
              </button>
            </div>
          </motion.div>
          
          {message.confidence && (
            <motion.div 
              style={styles.confidence}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Confidence: {(message.confidence * 100).toFixed(0)}%
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.floatingOrbs}>
        <motion.div 
          style={{...styles.orb, ...styles.orb1}}
          animate={{
            y: [-30, 30, -30],
            x: [-15, 15, -15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          style={{...styles.orb, ...styles.orb2}}
          animate={{
            y: [30, -30, 30],
            x: [15, -15, 15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          style={{...styles.orb, ...styles.orb3}}
          animate={{
            y: [-20, 20, -20],
            x: [20, -20, 20],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div style={styles.maxWidth}>
        {/* Sidebar */}
        <motion.div 
          style={styles.sidebar}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={styles.sidebarSection}>
            <h3 style={styles.sectionTitle}>Quick Actions</h3>
            
            <motion.button
              style={styles.quickActionBtn}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction("Check my symptoms")}
            >
              <div style={styles.quickActionIcon}>
                <Activity style={{ width: '1.1rem', height: '1.1rem' }} />
              </div>
              <span>Symptom Checker</span>
            </motion.button>

            <motion.button
              style={styles.quickActionBtn}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction("Book an appointment")}
            >
              <div style={styles.quickActionIcon}>
                <Calendar style={{ width: '1.1rem', height: '1.1rem' }} />
              </div>
              <span>Book Appointment</span>
            </motion.button>

            <motion.button
              style={styles.quickActionBtn}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction("My medications")}
            >
              <div style={styles.quickActionIcon}>
                <Pill style={{ width: '1.1rem', height: '1.1rem' }} />
              </div>
              <span>Medications</span>
            </motion.button>

            <motion.button
              style={styles.quickActionBtn}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction("View my health records")}
            >
              <div style={styles.quickActionIcon}>
                <FileText style={{ width: '1.1rem', height: '1.1rem' }} />
              </div>
              <span>Health Records</span>
            </motion.button>

            <motion.button
              style={styles.quickActionBtn}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction("Emergency help")}
            >
              <div style={{...styles.quickActionIcon, background: 'linear-gradient(135deg, #fee2e2, #fecaca)'}}>
                <Phone style={{ width: '1.1rem', height: '1.1rem', color: '#dc2626' }} />
              </div>
              <span>Emergency</span>
            </motion.button>
          </div>

          <div style={styles.sidebarSection}>
            <h3 style={styles.sectionTitle}>Your Stats</h3>
            
            <div style={styles.statsCard}>
              <div style={styles.statLabel}>Total Consultations</div>
              <div style={styles.statValue}>24</div>
            </div>

            <div style={styles.statsCard}>
              <div style={styles.statLabel}>Last Check-up</div>
              <div style={styles.statValue}>5 days</div>
            </div>
          </div>

          <div style={styles.sidebarSection}>
            <motion.button
              style={{...styles.quickActionBtn, background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)'}}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportChat}
            >
              <Download style={{ width: '1.1rem', height: '1.1rem', color: '#2563eb' }} />
              <span style={{ color: '#1e40af' }}>Export Chat</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Header */}
          <motion.div 
            style={styles.headerCard}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div style={styles.headerContent}>
              <motion.div 
                style={styles.headerIcon}
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart style={{ width: '2rem', height: '2rem', color: 'white' }} />
              </motion.div>
              <div>
                <h1 style={styles.title}>
                  HealthAI Assistant
                  <motion.span
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ display: 'inline-block' }}
                  >
                    ⚕️
                  </motion.span>
                </h1>
                <p style={styles.subtitle}>Your 24/7 AI-Powered Medical Companion</p>
              </div>
            </div>
            <motion.div 
              style={styles.statusBadge}
              animate={{ boxShadow: [
                '0 4px 12px rgba(16, 185, 129, 0.2)',
                '0 4px 20px rgba(16, 185, 129, 0.4)',
                '0 4px 12px rgba(16, 185, 129, 0.2)'
              ]}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                style={styles.statusDot}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Online
            </motion.div>
          </motion.div>

          {/* Chat Container */}
          <motion.div 
            style={styles.chatCard}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          >
            {/* Quick Actions Bar */}
            {showQuickActions && (
              <motion.div 
                style={styles.quickActionsBar}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {['🤒 Fever', '🤕 Headache', '🤧 Cold', '💊 Medication', '📅 Appointment', '🏥 Find Clinic'].map((chip, i) => (
                  <motion.button
                    key={i}
                    style={styles.quickChip}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAction(chip.split(' ')[1])}
                  >
                    {chip}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Messages Area */}
            <div style={styles.messagesContainer}>
              <AnimatePresence>
                {messages.map(message => renderMessage(message))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{...styles.messageFlex, ...styles.messageFlexStart}}
                >
                  <div style={{...styles.avatar, ...styles.botAvatar}}>
                    <Bot style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />
                  </div>
                  <div style={styles.typingIndicator}>
                    <motion.div
                      style={styles.typingDot}
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                    <motion.div
                      style={styles.typingDot}
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      style={styles.typingDot}
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={styles.inputContainer}>
              {selectedFile && (
                <motion.div 
                  style={styles.filePreview}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FileText style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b' }}>
                      {selectedFile.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {selectedFile.size}
                    </div>
                  </div>
                  <button 
                    style={{...styles.iconButton, color: '#ef4444'}}
                    onClick={() => setSelectedFile(null)}
                  >
                    <X style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </motion.div>
              )}

              <div style={styles.inputWrapper}>
                <div style={styles.inputFlex}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your health question or symptoms..."
                    style={styles.messageInput}
                  />
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  
                  <motion.button
                    style={styles.iconButton}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip style={{ width: '1.1rem', height: '1.1rem' }} />
                  </motion.button>
                  
                  <motion.button
                    style={{
                      ...styles.iconButton,
                      ...(isRecording ? styles.iconButtonActive : {})
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleVoiceInput}
                    animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isRecording ? Infinity : 0 }}
                  >
                    <Mic style={{ width: '1.1rem', height: '1.1rem' }} />
                  </motion.button>
                </div>

                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() && !selectedFile}
                  style={{
                    ...styles.sendBtn,
                    ...(!inputValue.trim() && !selectedFile ? styles.sendBtnDisabled : {})
                  }}
                  whileHover={inputValue.trim() || selectedFile ? { scale: 1.05 } : {}}
                  whileTap={inputValue.trim() || selectedFile ? { scale: 0.95 } : {}}
                  animate={(inputValue.trim() || selectedFile) ? { 
                    boxShadow: [
                      "0 4px 15px rgba(59, 130, 246, 0.3)",
                      "0 6px 25px rgba(59, 130, 246, 0.5)",
                      "0 4px 15px rgba(59, 130, 246, 0.3)"
                    ]
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Send style={{ width: '1.25rem', height: '1.25rem' }} />
                </motion.button>
              </div>
              
              <motion.div 
                style={styles.disclaimer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <AlertTriangle style={{ width: '0.9rem', height: '0.9rem' }} />
                <span>For emergencies, call 911. This AI provides information only, not medical advice.</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
