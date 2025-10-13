import React, { useState, useEffect, useRef } from 'react';
import { Bug, Shield, AlertTriangle, Leaf, Camera, CheckCircle, Send, Bot, X, Upload, Calendar, MapPin, Phone, Mail, Clock, XCircle, Check } from 'lucide-react';

const PestControl = () => {
  const [selectedPest, setSelectedPest] = useState(null);
  const [activeTab, setActiveTab] = useState('detection');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your AI Pest Control Assistant. Ask me anything about pest management!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    pest: '',
    treatment: '',
    date: '',
    area: '',
    notes: ''
  });
  const chatEndRef = useRef(null);

  const pestDatabase = [
    {
      id: 1,
      name: 'Aphids',
      severity: 'Medium',
      crops: ['Tomato', 'Cotton', 'Wheat'],
      symptoms: 'Curled leaves, sticky residue, stunted growth',
      organicControl: [
        'Neem oil spray (5ml per liter of water)',
        'Ladybugs (natural predators)',
        'Soap water solution (2% concentration)'
      ],
      chemicalControl: 'Imidacloprid 17.8% SL @ 0.5ml/liter',
      prevention: 'Regular monitoring, avoid over-fertilization',
      aiDetection: 92,
      image: '🐛'
    },
    {
      id: 2,
      name: 'Bollworm',
      severity: 'High',
      crops: ['Cotton', 'Tomato', 'Okra'],
      symptoms: 'Holes in fruits/bolls, larvae inside',
      organicControl: [
        'Bt (Bacillus thuringiensis) spray',
        'Pheromone traps',
        'Hand picking of larvae'
      ],
      chemicalControl: 'Chlorantraniliprole 18.5% SC @ 0.3ml/liter',
      prevention: 'Crop rotation, destroy crop residue',
      aiDetection: 89,
      image: '🐛'
    },
    {
      id: 3,
      name: 'Whitefly',
      severity: 'High',
      crops: ['Cotton', 'Tomato', 'Chili'],
      symptoms: 'Yellow leaves, sooty mold, virus transmission',
      organicControl: [
        'Yellow sticky traps',
        'Neem oil + garlic extract',
        'Reflective mulches'
      ],
      chemicalControl: 'Thiamethoxam 25% WG @ 0.2g/liter',
      prevention: 'Use resistant varieties, remove infected plants',
      aiDetection: 94,
      image: '🦟'
    },
    {
      id: 4,
      name: 'Leaf Miner',
      severity: 'Low',
      crops: ['Tomato', 'Beans', 'Citrus'],
      symptoms: 'Serpentine trails on leaves',
      organicControl: [
        'Remove and destroy affected leaves',
        'Spinosad spray',
        'Encourage parasitic wasps'
      ],
      chemicalControl: 'Abamectin 1.9% EC @ 0.5ml/liter',
      prevention: 'Use row covers, maintain field hygiene',
      aiDetection: 87,
      image: '🐜'
    }
  ];

  const [scheduledTreatments, setScheduledTreatments] = useState([
    {
      id: 1,
      pest: 'Aphids',
      treatment: 'Neem oil spray',
      date: '2025-10-06',
      status: 'scheduled',
      area: '2 hectares'
    },
    {
      id: 2,
      pest: 'Whitefly',
      treatment: 'Yellow sticky traps',
      date: '2025-10-05',
      status: 'completed',
      area: '1 hectare'
    }
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { type: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    const query = chatInput.toLowerCase();
    setChatInput('');
    setIsLoading(true);

    setTimeout(() => {
      let botResponse = {
        type: 'bot',
        text: ''
      };

      if (query.includes('neem') || query.includes('organic')) {
        botResponse.text = '🌿 Neem oil is excellent! Mix 5ml neem oil + 2ml liquid soap per liter of water. Spray in early morning or evening. Repeat every 7-10 days. Very effective against aphids, whiteflies, and mealybugs!';
      } else if (query.includes('aphid')) {
        botResponse.text = '🐛 For aphids, I recommend: 1) Neem oil spray, 2) Ladybugs (natural predators), 3) Soap water solution. Avoid chemical pesticides unless severe infestation. Want detailed instructions?';
      } else if (query.includes('schedule') || query.includes('treatment')) {
        botResponse.text = '📅 I can help you schedule treatments! Click the "Schedule Treatment" button on any pest card, or go to the Treatment Schedule tab to manage your plans.';
      } else if (query.includes('detect') || query.includes('identify')) {
        botResponse.text = '📸 Upload a clear image of the pest or affected plant in the AI Detection section. Our AI will identify it with 90%+ accuracy and suggest treatments!';
      } else if (query.includes('cost') || query.includes('price')) {
        botResponse.text = '💰 Organic solutions are cost-effective! Neem oil: ₹50-100/liter (treats large area). Ladybugs: ₹200-300/pack. Chemical pesticides cost more and harm the environment.';
      } else {
        botResponse.text = 'I can help you with: 🐛 Pest identification, 🌿 Organic treatments, 📅 Treatment scheduling, 💰 Cost comparison, and 📚 Prevention tips. What would you like to know?';
      }

      setChatMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setIsLoading(true);
      setDetectionResult(null);
      
      setTimeout(() => {
        const randomPest = pestDatabase[Math.floor(Math.random() * pestDatabase.length)];
        const confidence = Math.floor(Math.random() * 10) + 85;
        
        setDetectionResult({
          pest: randomPest,
          confidence: confidence,
          detectedAt: new Date().toLocaleTimeString()
        });
        setSelectedPest(randomPest);
        setIsLoading(false);
        showNotification(`✅ Pest detected: ${randomPest.name} (${confidence}% confidence)`, 'success');
      }, 2000);
    }
  };

  const handleScheduleTreatment = () => {
    if (selectedPest) {
      setScheduleForm({
        ...scheduleForm,
        pest: selectedPest.name,
        treatment: selectedPest.organicControl[0]
      });
    }
    setShowScheduleModal(true);
  };

  const handleSubmitSchedule = (e) => {
    e.preventDefault();
    
    if (!scheduleForm.pest || !scheduleForm.treatment || !scheduleForm.date || !scheduleForm.area) {
      showNotification('⚠️ Please fill in all required fields', 'error');
      return;
    }

    const newTreatment = {
      id: scheduledTreatments.length + 1,
      pest: scheduleForm.pest,
      treatment: scheduleForm.treatment,
      date: scheduleForm.date,
      status: 'scheduled',
      area: scheduleForm.area,
      notes: scheduleForm.notes
    };

    setScheduledTreatments(prev => [...prev, newTreatment]);
    setShowScheduleModal(false);
    setScheduleForm({ pest: '', treatment: '', date: '', area: '', notes: '' });
    showNotification('✅ Treatment scheduled successfully!', 'success');
    setActiveTab('treatments');
  };

  const handleContactExpert = () => {
    setShowExpertModal(true);
  };

  const handleDeleteTreatment = (id) => {
    setScheduledTreatments(prev => prev.filter(t => t.id !== id));
    showNotification('🗑️ Treatment deleted', 'success');
  };

  const handleCompleteTreatment = (id) => {
    setScheduledTreatments(prev => 
      prev.map(t => t.id === id ? { ...t, status: 'completed' } : t)
    );
    showNotification('✅ Treatment marked as completed!', 'success');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' };
      case 'Medium': return { bg: '#FED7AA', border: '#F97316', text: '#9A3412' };
      case 'Low': return { bg: '#FEF3C7', border: '#EAB308', text: '#854D0E' };
      default: return { bg: '#F3F4F6', border: '#9CA3AF', text: '#374151' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ECFDF5 0%, #FEF3C7 100%)', padding: '24px', position: 'relative' }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-3d {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-3d:hover {
          transform: perspective(1000px) rotateX(-3deg) translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .float { animation: float 3s ease-in-out infinite; }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        .slide-in { animation: slideIn 0.5s ease-out; }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        .spin { animation: spin 1s linear infinite; }
        .bounce { animation: bounce 2s ease-in-out infinite; }
        .slide-up { animation: slideUp 0.4s ease-out; }

        .gradient-text {
          background: linear-gradient(90deg, #10B981, #059669);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .shimmer-bg {
          background: linear-gradient(90deg, #10B981, #34D399, #10B981);
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
        }

        .chat-bubble-user {
          background: linear-gradient(135deg, #10B981, #059669);
          color: white;
          border-radius: 18px 18px 4px 18px;
          padding: 12px 16px;
          max-width: 70%;
          margin-left: auto;
        }

        .chat-bubble-bot {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 18px 18px 18px 4px;
          padding: 12px 16px;
          max-width: 70%;
        }

        .upload-zone {
          border: 3px dashed #D1D5DB;
          transition: all 0.3s ease;
        }

        .upload-zone:hover {
          border-color: #10B981;
          background: #F0FDF4;
        }

        .btn {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn:active {
          transform: translateY(0);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        @media (max-width: 768px) {
          .grid-2 { grid-template-columns: 1fr !important; }
          .chat-fab { bottom: 80px !important; right: 16px !important; }
        }
      `}</style>

      {/* Notification */}
      {notification && (
        <div className="slide-up" style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 3000,
          background: notification.type === 'success' ? '#D1FAE5' : '#FEE2E2',
          border: `2px solid ${notification.type === 'success' ? '#10B981' : '#EF4444'}`,
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minWidth: '300px',
          maxWidth: '400px'
        }}>
          <span style={{ 
            fontSize: '16px', 
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
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X style={{ width: '18px', height: '18px', color: notification.type === 'success' ? '#065F46' : '#991B1B' }} />
          </button>
        </div>
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div className="glass-card card-3d slide-in" style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="float pulse" style={{ 
                width: '64px', 
                height: '64px', 
                background: 'linear-gradient(135deg, #EF4444, #DC2626)', 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)'
              }}>
                <Bug style={{ width: '36px', height: '36px', color: 'white' }} />
              </div>
              <div>
                <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px' }}>
                  AI Pest Control
                </h1>
                <p style={{ color: '#6B7280', fontSize: '15px' }}>
                  Smart detection & eco-friendly solutions
                </p>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 20px', 
              background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
            }}>
              <Shield className="bounce" style={{ width: '20px', height: '20px', color: '#059669' }} />
              <span style={{ color: '#059669', fontWeight: '700', fontSize: '15px' }}>Organic First</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-card slide-in" style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', background: 'rgba(243, 244, 246, 0.5)', borderBottom: '2px solid #E5E7EB' }}>
            {['detection', 'treatments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="btn"
                style={{
                  flex: 1,
                  padding: '16px',
                  background: activeTab === tab ? 'white' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab ? '4px solid #10B981' : 'none',
                  color: activeTab === tab ? '#10B981' : '#6B7280',
                  fontSize: '16px',
                  fontWeight: '700',
                  textTransform: 'capitalize'
                }}
              >
                {tab === 'detection' ? '🔍 Pest Detection' : '📅 Treatment Schedule'}
              </button>
            ))}
          </div>

          {/* Detection Tab */}
          {activeTab === 'detection' && (
            <div style={{ padding: '24px' }}>
              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                {/* Upload Section */}
                <div className="card-3d" style={{ background: '#F9FAFB', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Camera style={{ width: '22px', height: '22px', color: '#10B981' }} />
                    AI Image Detection
                  </h3>
                  <div className="upload-zone" style={{ borderRadius: '12px', padding: '48px', textAlign: 'center', marginBottom: '16px', position: 'relative' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                    />
                    {uploadedImage ? (
                      <div className="fade-in">
                        <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginBottom: '16px' }} />
                        {isLoading ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10B981' }}>
                            <div className="spin" style={{ width: '20px', height: '20px', border: '3px solid #10B981', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                            <span style={{ fontWeight: '600' }}>Analyzing image...</span>
                          </div>
                        ) : detectionResult && (
                          <div style={{ padding: '12px', background: '#D1FAE5', borderRadius: '8px', border: '2px solid #10B981' }}>
                            <p style={{ fontSize: '14px', color: '#065F46', fontWeight: '700', marginBottom: '4px' }}>
                              ✅ Detection Complete!
                            </p>
                            <p style={{ fontSize: '13px', color: '#065F46' }}>
                              {detectionResult.pest.name} detected with {detectionResult.confidence}% confidence
                            </p>
                            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                              <Clock style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                              {detectionResult.detectedAt}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <Bug className="float" style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#9CA3AF' }} />
                        <p style={{ color: '#6B7280', marginBottom: '12px', fontSize: '15px' }}>Upload pest image</p>
                        <button className="btn shimmer-bg" style={{ padding: '12px 24px', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px' }}>
                          <Upload style={{ width: '18px', height: '18px', display: 'inline', marginRight: '8px' }} />
                          Choose Image
                        </button>
                      </>
                    )}
                  </div>
                  <div style={{ padding: '16px', background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield style={{ width: '20px', height: '20px', color: '#1E40AF' }} />
                    <span style={{ fontSize: '14px', color: '#1E40AF', fontWeight: '600' }}>
                      AI identifies pests with 90%+ accuracy
                    </span>
                  </div>
                </div>

                {/* Pest Database */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                    Common Pests Database
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
                    {pestDatabase.map((pest, idx) => {
                      const severityStyle = getSeverityColor(pest.severity);
                      return (
                        <div
                          key={pest.id}
                          onClick={() => setSelectedPest(pest)}
                          className="card-3d slide-in"
                          style={{
                            border: `2px solid ${selectedPest?.id === pest.id ? '#10B981' : '#E5E7EB'}`,
                            borderRadius: '12px',
                            padding: '16px',
                            cursor: 'pointer',
                            background: selectedPest?.id === pest.id ? '#F0FDF4' : 'white',
                            animationDelay: `${idx * 0.1}s`
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ fontSize: '32px' }}>{pest.image}</span>
                              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{pest.name}</h4>
                            </div>
                            <span style={{ 
                              fontSize: '12px', 
                              padding: '4px 12px', 
                              borderRadius: '12px', 
                              background: severityStyle.bg,
                              color: severityStyle.text,
                              border: `2px solid ${severityStyle.border}`,
                              fontWeight: '700'
                            }}>
                              {pest.severity}
                            </span>
                          </div>
                          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px' }}>{pest.symptoms}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280' }}>
                            <span>Affects: <strong>{pest.crops.join(', ')}</strong></span>
                            <span style={{ color: '#10B981', fontWeight: '700' }}>
                              {pest.aiDetection}% AI Accuracy
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Selected Pest Details */}
              {selectedPest && (
                <div className="fade-in" style={{ marginTop: '24px', background: 'white', border: '3px solid #10B981', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertTriangle style={{ width: '28px', height: '28px', color: '#F97316' }} />
                    {selectedPest.name} - Treatment Solutions
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {/* Organic Solutions */}
                    <div className="card-3d" style={{ background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', borderRadius: '16px', padding: '20px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#065F46', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Leaf style={{ width: '20px', height: '20px' }} />
                        Organic Solutions (Recommended)
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {selectedPest.organicControl.map((method, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'start', gap: '8px', marginBottom: '12px', fontSize: '14px', color: '#065F46' }}>
                            <CheckCircle style={{ width: '18px', height: '18px', flexShrink: 0, marginTop: '2px', color: '#10B981' }} />
                            <span>{method}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Chemical Control */}
                    <div className="card-3d" style={{ background: 'linear-gradient(135deg, #FED7AA, #FDBA74)', borderRadius: '16px', padding: '20px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#9A3412', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle style={{ width: '20px', height: '20px' }} />
                        Chemical Control (If Necessary)
                      </h4>
                      <p style={{ fontSize: '14px', color: '#9A3412', marginBottom: '16px', fontWeight: '600' }}>
                        {selectedPest.chemicalControl}
                      </p>
                      <div style={{ padding: '12px', background: '#FEE2E2', border: '2px solid #EF4444', borderRadius: '8px', fontSize: '13px', color: '#991B1B', fontWeight: '600' }}>
                        ⚠️ Use chemical pesticides only as last resort. Follow safety guidelines strictly.
                      </div>
                    </div>
                  </div>

                  {/* Prevention */}
                  <div style={{ marginTop: '20px', padding: '16px', background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)', borderRadius: '12px', borderLeft: '4px solid #3B82F6' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1E40AF', marginBottom: '8px' }}>
                      Prevention Strategy
                    </h4>
                    <p style={{ fontSize: '14px', color: '#1E40AF' }}>{selectedPest.prevention}</p>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <button onClick={handleScheduleTreatment} className="btn" style={{ padding: '14px', background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px' }}>
                      <Calendar style={{ width: '18px', height: '18px', display: 'inline', marginRight: '8px' }} />
                      Schedule Treatment
                    </button>
                    <button onClick={handleContactExpert} className="btn" style={{ padding: '14px', background: 'white', color: '#10B981', border: '3px solid #10B981', borderRadius: '12px', fontWeight: '700', fontSize: '15px' }}>
                      <Phone style={{ width: '18px', height: '18px', display: 'inline', marginRight: '8px' }} />
                      Contact Agri-Expert
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Treatments Tab */}
          {activeTab === 'treatments' && (
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {scheduledTreatments.map((treatment, idx) => (
                  <div key={treatment.id} className="card-3d slide-in" style={{ 
                    border: '2px solid #E5E7EB', 
                    borderRadius: '12px', 
                    padding: '20px', 
                    background: 'white',
                    animationDelay: `${idx * 0.1}s`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
                          {treatment.pest}
                        </h4>
                        <p style={{ fontSize: '14px', color: '#6B7280' }}>{treatment.treatment}</p>
                      </div>
                      <span style={{ 
                        padding: '8px 16px', 
                        borderRadius: '12px', 
                        fontSize: '13px', 
                        fontWeight: '700',
                        background: treatment.status === 'completed' ? '#D1FAE5' : '#DBEAFE',
                        color: treatment.status === 'completed' ? '#065F46' : '#1E40AF',
                        border: `2px solid ${treatment.status === 'completed' ? '#10B981' : '#3B82F6'}`
                      }}>
                        {treatment.status === 'completed' ? '✓ Completed' : '⏱ Scheduled'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#6B7280', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar style={{ width: '16px', height: '16px' }} />
                        {treatment.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin style={{ width: '16px', height: '16px' }} />
                        {treatment.area}
                      </span>
                    </div>
                    {treatment.status === 'scheduled' && (
                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleCompleteTreatment(treatment.id)}
                          className="btn" 
                          style={{ 
                            flex: 1,
                            padding: '10px', 
                            background: '#10B981', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            fontSize: '13px', 
                            fontWeight: '600' 
                          }}>
                          <Check style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                          Complete
                        </button>
                        <button 
                          onClick={() => handleDeleteTreatment(treatment.id)}
                          className="btn" 
                          style={{ 
                            flex: 1,
                            padding: '10px', 
                            background: '#EF4444', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            fontSize: '13px', 
                            fontWeight: '600' 
                          }}>
                          <XCircle style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={() => setShowScheduleModal(true)} className="btn" style={{ 
                width: '100%', 
                marginTop: '20px',
                padding: '16px',
                border: '3px dashed #D1D5DB',
                background: 'white',
                color: '#6B7280',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '700'
              }}>
                + Schedule New Treatment
              </button>
            </div>
          )}
        </div>

        {/* AI Impact */}
        <div className="card-3d slide-in" style={{ 
          background: 'linear-gradient(135deg, #10B981, #059669)', 
          borderRadius: '16px', 
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)', 
          padding: '32px',
          color: 'white'
        }}>
          <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield style={{ width: '32px', height: '32px' }} />
            Smart Pest Management Impact
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { value: '50%', label: 'Pesticide Reduction', icon: '🌿' },
              { value: '85%', label: 'Early Detection Rate', icon: '🎯' },
              { value: '60%', label: 'Cost Savings', icon: '💰' },
              { value: '100%', label: 'Eco-Friendly Options', icon: '♻️' }
            ].map((metric, idx) => (
              <div
                key={idx}
                className="card-3d"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>{metric.icon}</div>
                <p style={{ fontSize: '42px', fontWeight: '900', marginBottom: '8px' }}>{metric.value}</p>
                <p style={{ fontSize: '14px', fontWeight: '600', opacity: 0.95 }}>{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Chatbot Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="pulse"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            border: 'none',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <Bot style={{ width: '32px', height: '32px', color: 'white' }} />
        </button>
      )}

      {/* AI Chatbot Window */}
      {chatOpen && (
        <div 
          className="fade-in glass-card"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '380px',
            height: '550px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000
          }}
        >
          {/* Chat Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #10B981, #059669)', 
            padding: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="pulse" style={{ 
                width: '40px', 
                height: '40px', 
                background: 'rgba(255, 255, 255, 0.2)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Bot style={{ width: '24px', height: '24px' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px' }}>AI Pest Assistant</h4>
                <p style={{ fontSize: '12px', opacity: 0.9 }}>Online • Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              style={{ 
                background: 'rgba(255, 255, 255, 0.2)', 
                border: 'none', 
                borderRadius: '8px', 
                padding: '8px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X style={{ width: '20px', height: '20px', color: 'white' }} />
            </button>
          </div>

          {/* Chat Messages */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '20px', 
            background: '#F9FAFB',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className="slide-in"
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  animationDelay: `${idx * 0.1}s`
                }}
              >
                {msg.type === 'bot' && (
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    background: 'linear-gradient(135deg, #10B981, #059669)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginRight: '8px',
                    flexShrink: 0
                  }}>
                    <Bot style={{ width: '18px', height: '18px', color: 'white' }} />
                  </div>
                )}
                <div className={msg.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  background: 'linear-gradient(135deg, #10B981, #059669)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Bot style={{ width: '18px', height: '18px', color: 'white' }} />
                </div>
                <div className="chat-bubble-bot">
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span className="bounce" style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', animationDelay: '0s' }}></span>
                    <span className="bounce" style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', animationDelay: '0.2s' }}></span>
                    <span className="bounce" style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div style={{ 
            padding: '16px', 
            background: 'white', 
            borderTop: '2px solid #E5E7EB',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about pest control..."
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10B981'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
              className="btn"
              style={{
                padding: '12px 16px',
                background: chatInput.trim() ? 'linear-gradient(135deg, #10B981, #059669)' : '#D1D5DB',
                border: 'none',
                borderRadius: '12px',
                cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send style={{ width: '20px', height: '20px', color: 'white' }} />
            </button>
          </div>
        </div>
      )}

      {/* Schedule Treatment Modal */}
      {showScheduleModal && (
        <div className="fade-in" style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 2000,
          padding: '20px'
        }}>
          <div className="glass-card slide-up" style={{ 
            background: 'white', 
            borderRadius: '20px', 
            padding: '32px', 
            maxWidth: '500px', 
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>
                📅 Schedule Treatment
              </h3>
              <button onClick={() => setShowScheduleModal(false)} style={{ 
                background: '#F3F4F6', 
                border: 'none', 
                borderRadius: '8px', 
                padding: '8px', 
                cursor: 'pointer' 
              }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleSubmitSchedule}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Pest Type *
                </label>
                <input
                  type="text"
                  value={scheduleForm.pest}
                  onChange={(e) => setScheduleForm({...scheduleForm, pest: e.target.value})}
                  placeholder="e.g., Aphids, Whitefly"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #E5E7EB', 
                    borderRadius: '10px', 
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Treatment Method *
                </label>
                <select
                  value={scheduleForm.treatment}
                  onChange={(e) => setScheduleForm({...scheduleForm, treatment: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #E5E7EB', 
                    borderRadius: '10px', 
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  required
                >
                  <option value="">Select treatment...</option>
                  <option value="Neem oil spray">Neem oil spray (Organic)</option>
                  <option value="Soap water solution">Soap water solution (Organic)</option>
                  <option value="Bt spray">Bt spray (Organic)</option>
                  <option value="Pheromone traps">Pheromone traps</option>
                  <option value="Yellow sticky traps">Yellow sticky traps</option>
                  <option value="Chemical pesticide">Chemical pesticide</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Treatment Date *
                </label>
                <input
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #E5E7EB', 
                    borderRadius: '10px', 
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Area to Cover *
                </label>
                <input
                  type="text"
                  value={scheduleForm.area}
                  onChange={(e) => setScheduleForm({...scheduleForm, area: e.target.value})}
                  placeholder="e.g., 2 hectares, Field A"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #E5E7EB', 
                    borderRadius: '10px', 
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Additional Notes
                </label>
                <textarea
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                  placeholder="Any special instructions or observations..."
                  rows="3"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #E5E7EB', 
                    borderRadius: '10px', 
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowScheduleModal(false)} className="btn" style={{ 
                  flex: 1,
                  padding: '14px', 
                  background: '#F3F4F6', 
                  color: '#6B7280', 
                  border: 'none', 
                  borderRadius: '10px', 
                  fontWeight: '700',
                  fontSize: '15px'
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn" style={{ 
                  flex: 1,
                  padding: '14px', 
                  background: 'linear-gradient(135deg, #10B981, #059669)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '10px', 
                  fontWeight: '700',
                  fontSize: '15px'
                }}>
                  Schedule Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Expert Modal */}
      {showExpertModal && (
        <div className="fade-in" style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 2000,
          padding: '20px'
        }}>
          <div className="glass-card slide-up" style={{ 
            background: 'white', 
            borderRadius: '20px', 
            padding: '32px', 
            maxWidth: '500px', 
            width: '100%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>
                👨‍🌾 Contact Agri-Expert
              </h3>
              <button onClick={() => setShowExpertModal(false)} style={{ 
                background: '#F3F4F6', 
                border: 'none', 
                borderRadius: '8px', 
                padding: '8px', 
                cursor: 'pointer' 
              }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card-3d" style={{ padding: '16px', background: '#F0FDF4', border: '2px solid #10B981', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#065F46', marginBottom: '12px' }}>
                  Dr. Rajesh Kumar
                </h4>
                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>
                  Agricultural Scientist • Pest Management Specialist
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href="tel:+919876543210" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'white', borderRadius: '8px', textDecoration: 'none', color: '#111827' }}>
                    <Phone style={{ width: '18px', height: '18px', color: '#10B981' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>+91 98765 43210</span>
                  </a>
                  <a href="mailto:expert@agri.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'white', borderRadius: '8px', textDecoration: 'none', color: '#111827' }}>
                    <Mail style={{ width: '18px', height: '18px', color: '#10B981' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>expert@agri.com</span>
                  </a>
                </div>
              </div>

              <div style={{ padding: '16px', background: '#DBEAFE', border: '2px solid #3B82F6', borderRadius: '12px' }}>
                <p style={{ fontSize: '14px', color: '#1E40AF', lineHeight: '1.5' }}>
                  📞 <strong>Call Hours:</strong> Mon-Sat, 9 AM - 6 PM<br/>
                  📧 <strong>Email Response:</strong> Within 24 hours<br/>
                  🆓 <strong>Consultation:</strong> Free for first call
                </p>
              </div>

              <button 
                onClick={() => {
                  setShowExpertModal(false);
                  showNotification('✅ Expert contact information saved!', 'success');
                }}
                className="btn" 
                style={{ 
                  width: '100%',
                  padding: '14px', 
                  background: 'linear-gradient(135deg, #10B981, #059669)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '10px', 
                  fontWeight: '700',
                  fontSize: '15px'
                }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PestControl;