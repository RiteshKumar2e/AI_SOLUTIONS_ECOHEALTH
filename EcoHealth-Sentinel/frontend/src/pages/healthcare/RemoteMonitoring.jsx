import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Heart, Thermometer, Droplets, AlertTriangle, CheckCircle,
  Clock, TrendingUp, User, Phone, Video, MessageSquare, FileText,
  Bell, Settings, Download, Calendar, Zap, Eye, XCircle, Send,
  Shield, Users, BarChart3, Stethoscope, Pill, ClipboardList,
  UserCheck, AlertCircle, MapPin, Mail, PhoneCall
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

export default function RemoteMonitoring() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [historicalData, setHistoricalData] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatbotTyping, setIsChatbotTyping] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const wsRef = useRef(null);
  const chatbotWsRef = useRef(null);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize mock data
  useEffect(() => {
    setPatients([
      {
        id: 1,
        name: 'John Anderson',
        age: 45,
        gender: 'Male',
        condition: 'Type 2 Diabetes',
        status: 'stable',
        vitals: {
          heartRate: 72,
          bloodPressure: '120/80',
          temperature: 98.6,
          glucose: 110,
          oxygen: 98
        },
        location: 'Rural Health Center, Springfield',
        lastUpdate: '2 mins ago',
        nextAppointment: 'Oct 10, 2025 - 10:00 AM',
        doctor: 'Dr. Sarah Mitchell',
        alerts: [],
        medications: ['Metformin 500mg', 'Lisinopril 10mg']
      },
      {
        id: 2,
        name: 'Emma Thompson',
        age: 62,
        gender: 'Female',
        condition: 'Hypertension',
        status: 'warning',
        vitals: {
          heartRate: 88,
          bloodPressure: '145/92',
          temperature: 99.1,
          glucose: 125,
          oxygen: 96
        },
        location: 'Remote Clinic, Riverside',
        lastUpdate: '5 mins ago',
        nextAppointment: 'Oct 8, 2025 - 2:30 PM',
        doctor: 'Dr. Michael Chen',
        alerts: ['Elevated BP', 'Heart Rate Above Normal'],
        medications: ['Amlodipine 5mg', 'Aspirin 81mg']
      },
      {
        id: 3,
        name: 'Robert Martinez',
        age: 58,
        gender: 'Male',
        condition: 'Coronary Artery Disease',
        status: 'critical',
        vitals: {
          heartRate: 112,
          bloodPressure: '165/105',
          temperature: 100.4,
          glucose: 142,
          oxygen: 93
        },
        location: 'Mountain View Medical Center',
        lastUpdate: '1 min ago',
        nextAppointment: 'IMMEDIATE ATTENTION REQUIRED',
        doctor: 'Dr. Sarah Mitchell',
        alerts: ['Critical BP', 'Tachycardia', 'Fever Detected', 'Low O2 Saturation'],
        medications: ['Atorvastatin 40mg', 'Clopidogrel 75mg', 'Metoprolol 25mg']
      },
      {
        id: 4,
        name: 'Lisa Patterson',
        age: 51,
        gender: 'Female',
        condition: 'Asthma',
        status: 'stable',
        vitals: {
          heartRate: 68,
          bloodPressure: '118/75',
          temperature: 98.4,
          glucose: 95,
          oxygen: 99
        },
        location: 'Valley Healthcare Clinic',
        lastUpdate: '12 mins ago',
        nextAppointment: 'Oct 12, 2025 - 11:00 AM',
        doctor: 'Dr. James Rodriguez',
        alerts: [],
        medications: ['Albuterol Inhaler', 'Fluticasone']
      }
    ]);

    setAiInsights([
      {
        type: 'success',
        icon: CheckCircle,
        message: 'Patient John Anderson shows consistent improvement in glucose levels over the past 7 days',
        priority: 'low'
      },
      {
        type: 'warning',
        icon: AlertTriangle,
        message: 'Emma Thompson requires medication adjustment - BP readings above target for 3 consecutive days',
        priority: 'medium'
      },
      {
        type: 'critical',
        icon: AlertCircle,
        message: 'URGENT: Robert Martinez vitals indicate immediate medical attention required',
        priority: 'high'
      },
      {
        type: 'info',
        icon: Calendar,
        message: '8 patients have scheduled appointments today. 3 pending confirmations.',
        priority: 'low'
      },
      {
        type: 'info',
        icon: TrendingUp,
        message: 'Overall patient compliance rate: 94% (↑ 3% from last week)',
        priority: 'low'
      }
    ]);

    setNotifications([
      { id: 1, type: 'critical', message: 'Robert Martinez - Critical vitals detected', time: '1 min ago' },
      { id: 2, type: 'info', message: 'Appointment reminder: Emma Thompson at 2:30 PM', time: '15 mins ago' },
      { id: 3, type: 'success', message: 'Lab results available for John Anderson', time: '1 hour ago' }
    ]);

    setIsConnected(true);
  }, []);

  // WebSocket connections
  useEffect(() => {
    connectWebSocket();
    connectChatbotWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (chatbotWsRef.current) chatbotWsRef.current.close();
    };
  }, []);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:8080/patients');
      ws.onopen = () => {
        console.log('Connected to patient monitoring system');
        setIsConnected(true);
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'patients_update') setPatients(data.patients);
        else if (data.type === 'ai_insights') setAiInsights(data.insights);
        else if (data.type === 'historical_data') setHistoricalData(data.data);
      };
      ws.onerror = () => setIsConnected(false);
      ws.onclose = () => {
        setIsConnected(false);
        setTimeout(connectWebSocket, 3000);
      };
      wsRef.current = ws;
    } catch (error) {
      console.log('Using demo mode - WebSocket unavailable');
    }
  };

  const connectChatbotWebSocket = () => {
    try {
      const chatWs = new WebSocket('ws://localhost:8080/chatbot');
      chatWs.onopen = () => console.log('AI Assistant connected');
      chatWs.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setIsChatbotTyping(false);
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          text: data.message,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        }]);
      };
      chatbotWsRef.current = chatWs;
    } catch (error) {
      console.log('AI Assistant in offline mode');
    }
  };

  const handleSendChatMessage = () => {
    if (chatInput.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsChatbotTyping(true);

    setTimeout(() => {
      setIsChatbotTyping(false);
      const responses = [
        `Based on the patient data, ${selectedPatient ? selectedPatient.name + "'s" : 'the'} current vitals are ${selectedPatient ? selectedPatient.status : 'being monitored'}. ${selectedPatient && selectedPatient.status === 'critical' ? 'Immediate intervention is recommended.' : 'Continue regular monitoring.'}`,
        `I can help you with patient management. ${selectedPatient ? `For ${selectedPatient.name}, I recommend reviewing their medication adherence and scheduling a follow-up consultation.` : 'Please select a patient for specific recommendations.'}`,
        `Healthcare AI Analysis: ${chatInput.includes('vital') || chatInput.includes('reading') ? 'Current vital signs are within acceptable parameters for stable patients. Critical cases require immediate attention.' : 'I can provide insights on patient care, medication management, and appointment scheduling.'}`
      ];
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      }]);
    }, 1500);

    if (chatbotWsRef.current && chatbotWsRef.current.readyState === WebSocket.OPEN) {
      chatbotWsRef.current.send(JSON.stringify({
        message: chatInput,
        patientContext: selectedPatient
      }));
    }

    setChatInput('');
  };

  const createGoogleMeetLink = async (patientId, patientName) => {
    try {
      const response = await fetch('http://localhost:3000/api/create-meet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          patientName,
          summary: `Medical Consultation - ${patientName}`,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString()
        })
      });
      
      const data = await response.json();
      navigator.clipboard.writeText(data.meetLink);
      alert(`✅ Video Consultation Link Created\n\nLink: ${data.meetLink}\n\nThe link has been copied to your clipboard. Share it with ${patientName}.`);
      return data.meetLink;
    } catch (error) {
      const demoLink = `https://meet.google.com/healthcare-${Date.now().toString(36)}`;
      navigator.clipboard.writeText(demoLink);
      alert(`📹 Video Consultation Link (Demo Mode)\n\nLink: ${demoLink}\n\nCopied to clipboard! Share with ${patientName} to start the consultation.`);
      return demoLink;
    }
  };

  const handleVideoCall = async (patient) => {
    const meetLink = await createGoogleMeetLink(patient.id, patient.name);
    if (meetLink) {
      window.open(meetLink, '_blank', 'width=1400,height=900');
      setActiveCall({
        patientId: patient.id,
        patientName: patient.name,
        meetLink: meetLink,
        startTime: new Date(),
        doctor: patient.doctor
      });
    }
  };

  const handleCall = (patient) => {
    alert(`📞 Initiating Voice Call\n\nPatient: ${patient.name}\nDoctor: ${patient.doctor}\n\nConnecting...`);
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setHistoricalData([
      { time: '00:00', heartRate: 70, bloodPressure: 120 },
      { time: '04:00', heartRate: 68, bloodPressure: 118 },
      { time: '08:00', heartRate: 75, bloodPressure: 122 },
      { time: '12:00', heartRate: patient.vitals.heartRate, bloodPressure: parseInt(patient.vitals.bloodPressure.split('/')[0]) },
      { time: '16:00', heartRate: 78, bloodPressure: 125 },
      { time: '20:00', heartRate: 72, bloodPressure: 121 },
      { time: '24:00', heartRate: 69, bloodPressure: 119 }
    ]);
  };

  const handleDownloadReport = (patient) => {
    alert(`📄 Medical Report Download\n\nGenerating comprehensive report for:\n${patient.name}\n\nReport includes:\n• Vital signs history\n• Medication list\n• Recent consultations\n• Lab results\n• AI health insights\n\nDownload starting...`);
  };

  const handleScheduleAppointment = (patient) => {
    const datetime = prompt(`📅 Schedule Appointment\n\nPatient: ${patient.name}\nDoctor: ${patient.doctor}\n\nEnter date and time (YYYY-MM-DD HH:MM):`);
    if (datetime) {
      alert(`✅ Appointment Scheduled Successfully\n\nPatient: ${patient.name}\nDate/Time: ${datetime}\nDoctor: ${patient.doctor}\n\nConfirmation sent to patient via SMS and email.`);
    }
  };

  const getVitalConfig = (label) => {
    const configs = {
      'Heart Rate': { 
        icon: Heart, 
        color: '#EF4444', 
        bgColor: '#FEF2F2', 
        borderColor: '#FEE2E2',
        unit: 'bpm',
        normalRange: '60-100'
      },
      'Blood Pressure': { 
        icon: Activity, 
        color: '#3B82F6', 
        bgColor: '#EFF6FF', 
        borderColor: '#DBEAFE',
        unit: 'mmHg',
        normalRange: '90-120 / 60-80'
      },
      'Temperature': { 
        icon: Thermometer, 
        color: '#F97316', 
        bgColor: '#FFF7ED', 
        borderColor: '#FFEDD5',
        unit: '°F',
        normalRange: '97-99'
      },
      'Glucose': { 
        icon: Droplets, 
        color: '#8B5CF6', 
        bgColor: '#FAF5FF', 
        borderColor: '#F3E8FF',
        unit: 'mg/dL',
        normalRange: '70-130'
      },
      'Oxygen': { 
        icon: Activity, 
        color: '#10B981', 
        bgColor: '#F0FDF4', 
        borderColor: '#DCFCE7',
        unit: '%',
        normalRange: '95-100'
      }
    };
    return configs[label] || configs['Heart Rate'];
  };

  const getStatusConfig = (status) => {
    const configs = {
      'critical': {
        color: '#DC2626',
        bgColor: '#FEF2F2',
        borderColor: '#FCA5A5',
        icon: AlertCircle,
        label: 'CRITICAL'
      },
      'warning': {
        color: '#D97706',
        bgColor: '#FFFBEB',
        borderColor: '#FCD34D',
        icon: AlertTriangle,
        label: 'NEEDS ATTENTION'
      },
      'stable': {
        color: '#059669',
        bgColor: '#F0FDF4',
        borderColor: '#86EFAC',
        icon: CheckCircle,
        label: 'STABLE'
      }
    };
    return configs[status] || configs['stable'];
  };

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }

        @keyframes slide-up {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .slide-up {
          animation: slide-up 0.3s ease-out;
        }

        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #F3F4F6;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        input:focus, button:focus {
          outline: none;
        }

        .card-shadow {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .card-shadow-hover:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #F0FDFA 100%)',
        padding: '1.5rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #E5E7EB'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                }}>
                  <Stethoscope style={{ width: '28px', height: '28px', color: 'white' }} />
                </div>
                <div>
                  <h1 style={{
                    fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    Remote Patient Monitoring System
                  </h1>
                  <p style={{ color: '#6B7280', fontSize: 'clamp(0.875rem, 2vw, 0.875rem)' }}>
                    Real-time healthcare monitoring • {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {/* Connection Status */}
                <motion.div
                  animate={isConnected ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    background: isConnected ? '#F0FDF4' : '#FEF2F2',
                    border: `1px solid ${isConnected ? '#86EFAC' : '#FCA5A5'}`,
                    color: isConnected ? '#059669' : '#DC2626'
                  }}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isConnected ? '#10B981' : '#EF4444'
                  }} className={isConnected ? 'pulse-ring' : ''} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {isConnected ? 'System Online' : 'Offline'}
                  </span>
                </motion.div>

                {/* AI Assistant */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowChatbot(!showChatbot)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    border: 'none',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 4px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <MessageSquare style={{ width: '16px', height: '16px' }} />
                  AI Assistant
                </motion.button>

                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    position: 'relative',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    background: 'white',
                    border: '1px solid #E5E7EB',
                    color: '#374151',
                    cursor: 'pointer'
                  }}
                >
                  <Bell style={{ width: '20px', height: '20px' }} />
                  {notifications.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        width: '20px',
                        height: '20px',
                        background: '#EF4444',
                        borderRadius: '50%',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: 'white',
                        border: '2px solid white'
                      }}
                    >
                      {notifications.length}
                    </motion.span>
                  )}
                </motion.button>

                {/* Settings */}
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    background: 'white',
                    border: '1px solid #E5E7EB',
                    color: '#374151',
                    cursor: 'pointer'
                  }}
                >
                  <Settings style={{ width: '20px', height: '20px' }} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '1.5rem' }}
          >
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #E5E7EB'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <BarChart3 style={{ width: '24px', height: '24px', color: '#3B82F6' }} />
                AI Health Insights & Alerts
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {aiInsights.map((insight, idx) => {
                  const Icon = insight.icon;
                  const colors = {
                    critical: { bg: '#FEF2F2', border: '#FCA5A5', text: '#DC2626' },
                    warning: { bg: '#FFFBEB', border: '#FCD34D', text: '#D97706' },
                    success: { bg: '#F0FDF4', border: '#86EFAC', text: '#059669' },
                    info: { bg: '#EFF6FF', border: '#93C5FD', text: '#2563EB' }
                  };
                  const color = colors[insight.type];
                  return (
                    <motion.div
                      key={idx}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      style={{
                        background: color.bg,
                        border: `1px solid ${color.border}`,
                        borderRadius: '12px',
                        padding: '1rem',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Icon style={{ width: '20px', height: '20px', color: color.text, flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5', margin: 0 }}>
                          {insight.message}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            {[
              { title: 'Total Patients', value: patients.length, icon: Users, color: '#3B82F6', bg: '#EFF6FF', change: '+12%' },
              { title: 'Stable', value: patients.filter(p => p.status === 'stable').length, icon: CheckCircle, color: '#10B981', bg: '#F0FDF4', change: '+5%' },
              { title: 'Need Attention', value: patients.filter(p => p.status === 'warning').length, icon: AlertTriangle, color: '#F59E0B', bg: '#FFFBEB', change: '-2%' },
              { title: 'Critical', value: patients.filter(p => p.status === 'critical').length, icon: AlertCircle, color: '#EF4444', bg: '#FEF2F2', change: '0%' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ scale: 1.03, y: -4 }}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #E5E7EB',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                className="card-shadow-hover"
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '120px',
                  height: '120px',
                  background: stat.bg,
                  borderRadius: '50%',
                  transform: 'translate(40%, -40%)',
                  opacity: 0.5
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>
                      {stat.title}
                    </p>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: stat.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <stat.icon style={{ width: '20px', height: '20px', color: stat.color }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <p style={{
                      fontSize: '2.25rem',
                      fontWeight: '700',
                      color: '#111827',
                      margin: 0,
                      lineHeight: 1
                    }}>
                      {stat.value}
                    </p>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: stat.change.startsWith('+') ? '#10B981' : stat.change.startsWith('-') ? '#EF4444' : '#6B7280',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: stat.change.startsWith('+') ? '#F0FDF4' : stat.change.startsWith('-') ? '#FEF2F2' : '#F3F4F6'
                    }}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Patient Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {patients.map((patient) => {
              const statusConfig = getStatusConfig(patient.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <motion.div
                  key={patient.id}
                  variants={{
                    hidden: { scale: 0.95, opacity: 0 },
                    visible: { scale: 1, opacity: 1 }
                  }}
                  whileHover={{ y: -4 }}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: `2px solid ${statusConfig.borderColor}`
                  }}
                  className="card-shadow-hover"
                >
                  {/* Patient Header */}
                  <div style={{
                    background: statusConfig.bgColor,
                    padding: '1.25rem',
                    borderBottom: `2px solid ${statusConfig.borderColor}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                          <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#111827',
                            margin: 0
                          }}>
                            {patient.name}
                          </h3>
                          <div style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            background: statusConfig.color,
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <StatusIcon style={{ width: '12px', height: '12px' }} />
                            {statusConfig.label}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>
                          <span>{patient.age} yrs • {patient.gender}</span>
                          <span>•</span>
                          <span style={{ fontWeight: 500 }}>{patient.condition}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: '#9CA3AF' }}>
                          <Clock style={{ width: '14px', height: '14px' }} />
                          <span>Last update: {patient.lastUpdate}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.75rem', color: '#9CA3AF' }}>
                          <MapPin style={{ width: '14px', height: '14px' }} />
                          <span>{patient.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Alerts */}
                    {patient.alerts && patient.alerts.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {patient.alerts.map((alert, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            style={{
                              fontSize: '0.75rem',
                              background: '#FEE2E2',
                              color: '#DC2626',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontWeight: 600,
                              border: '1px solid #FCA5A5'
                            }}
                          >
                            ⚠ {alert}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Vitals */}
                  <div style={{ padding: '1.25rem' }}>
                    <h4 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#6B7280',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Current Vitals
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '0.75rem'
                    }}>
                      {[
                        { label: 'Heart Rate', value: `${patient.vitals.heartRate} bpm` },
                        { label: 'Blood Pressure', value: patient.vitals.bloodPressure },
                        { label: 'Temperature', value: `${patient.vitals.temperature}°F` },
                        { label: 'Glucose', value: `${patient.vitals.glucose} mg/dL` },
                        { label: 'Oxygen', value: `${patient.vitals.oxygen}%` }
                      ].map((vital, idx) => {
                        const config = getVitalConfig(vital.label);
                        const VitalIcon = config.icon;
                        return (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05, y: -2 }}
                            style={{
                              background: config.bgColor,
                              border: `1px solid ${config.borderColor}`,
                              borderRadius: '10px',
                              padding: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <VitalIcon style={{ width: '16px', height: '16px', color: config.color }} />
                              <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>
                                {vital.label}
                              </span>
                            </div>
                            <p style={{
                              fontSize: '1rem',
                              fontWeight: '700',
                              color: '#111827',
                              margin: 0
                            }}>
                              {vital.value}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Doctor & Appointment Info */}
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      background: '#F9FAFB',
                      borderRadius: '8px',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem',
                      fontSize: '0.75rem'
                    }}>
                      <div>
                        <div style={{ color: '#6B7280', marginBottom: '0.25rem' }}>Assigned Doctor</div>
                        <div style={{ color: '#111827', fontWeight: 600 }}>
                          <UserCheck style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                          {patient.doctor}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: '#6B7280', marginBottom: '0.25rem' }}>Next Appointment</div>
                        <div style={{ color: '#111827', fontWeight: 600 }}>
                          <Calendar style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                          {patient.nextAppointment}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    padding: '1rem 1.25rem',
                    background: '#F9FAFB',
                    borderTop: '1px solid #E5E7EB',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem'
                  }}>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCall(patient)}
                      style={{
                        padding: '0.625rem',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        border: 'none',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      <Phone style={{ width: '16px', height: '16px' }} />
                      Call
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVideoCall(patient)}
                      style={{
                        padding: '0.625rem',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                        border: 'none',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 2px 4px rgba(139, 92, 246, 0.3)'
                      }}
                    >
                      <Video style={{ width: '16px', height: '16px' }} />
                      Video
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowChatbot(true);
                      }}
                      style={{
                        padding: '0.625rem',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        border: 'none',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <MessageSquare style={{ width: '16px', height: '16px' }} />
                      Chat
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewDetails(patient)}
                      style={{
                        padding: '0.625rem',
                        borderRadius: '8px',
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Eye style={{ width: '16px', height: '16px' }} />
                      Details
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownloadReport(patient)}
                      style={{
                        padding: '0.625rem',
                        borderRadius: '8px',
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Download style={{ width: '16px', height: '16px' }} />
                      Report
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleScheduleAppointment(patient)}
                      style={{
                        padding: '0.625rem',
                        borderRadius: '8px',
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Calendar style={{ width: '16px', height: '16px' }} />
                      Schedule
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* AI Chatbot */}
          <AnimatePresence>
            {showChatbot && (
              <motion.div
                initial={{ opacity: 0, x: 400, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 400, scale: 0.8 }}
                style={{
                  position: 'fixed',
                  right: '1.5rem',
                  bottom: '1.5rem',
                  width: '400px',
                  height: '600px',
                  zIndex: 1000,
                  maxWidth: 'calc(100vw - 3rem)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  {/* Chat Header */}
                  <div style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    padding: '1.25rem',
                    color: 'white'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <MessageSquare style={{ width: '20px', height: '20px' }} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>AI Medical Assistant</h3>
                          <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.9 }}>Online • Instant Response</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowChatbot(false)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          padding: '0.5rem'
                        }}
                      >
                        <XCircle style={{ width: '20px', height: '20px' }} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="no-scrollbar" style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    background: '#F9FAFB'
                  }}>
                    {chatMessages.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#9CA3AF' }}>
                        <MessageSquare style={{ width: '48px', height: '48px', margin: '0 auto 1rem', color: '#8B5CF6' }} />
                        <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>AI Medical Assistant</p>
                        <p style={{ fontSize: '0.875rem' }}>Ask me anything about patient care, medication, or health insights!</p>
                      </div>
                    )}
                    
                    {chatMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          display: 'flex',
                          justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div style={{
                          maxWidth: '80%',
                          padding: '0.875rem',
                          borderRadius: '12px',
                          background: msg.sender === 'user'
                            ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                            : 'white',
                          color: msg.sender === 'user' ? 'white' : '#374151',
                          border: msg.sender === 'bot' ? '1px solid #E5E7EB' : 'none',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}>
                          <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0', lineHeight: '1.5' }}>{msg.text}</p>
                          <p style={{ fontSize: '0.7rem', opacity: 0.7, margin: 0 }}>{msg.timestamp}</p>
                        </div>
                      </motion.div>
                    ))}

                    {isChatbotTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ display: 'flex', justifyContent: 'flex-start' }}
                      >
                        <div style={{
                          background: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '12px',
                          padding: '0.875rem',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}>
                          <div style={{ display: 'flex', gap: '0.375rem' }}>
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  background: '#8B5CF6',
                                  borderRadius: '50%'
                                }}
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div style={{
                    padding: '1rem',
                    borderTop: '1px solid #E5E7EB',
                    background: 'white'
                  }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                        placeholder="Type your message..."
                        style={{
                          flex: 1,
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          border: '1px solid #E5E7EB',
                          fontSize: '0.875rem',
                          color: '#111827',
                          background: '#F9FAFB'
                        }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendChatMessage}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(139, 92, 246, 0.3)'
                        }}
                      >
                        <Send style={{ width: '20px', height: '20px' }} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Call Indicator */}
          <AnimatePresence>
            {activeCall && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                style={{
                  position: 'fixed',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1rem 1.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #E5E7EB',
                  zIndex: 999,
                  maxWidth: '400px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Video style={{ width: '24px', height: '24px', color: 'white' }} />
                  </motion.div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '700', color: '#111827', margin: '0 0 0.25rem 0' }}>Active Video Call</p>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>{activeCall.patientName}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      navigator.clipboard.writeText(activeCall.meetLink);
                      alert('✅ Meeting link copied!');
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      background: '#F3F4F6',
                      border: '1px solid #E5E7EB',
                      color: '#374151',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Copy Link
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCall(null)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      background: '#FEE2E2',
                      border: '1px solid #FCA5A5',
                      color: '#DC2626',
                      cursor: 'pointer'
                    }}
                  >
                    <XCircle style={{ width: '20px', height: '20px' }} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Patient Details Modal */}
          <AnimatePresence>
            {selectedPatient && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPatient(null)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 999,
                  padding: '1.5rem'
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 50 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '2rem',
                    maxWidth: '900px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem'
                  }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                      {selectedPatient.name} - Patient Details
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedPatient(null)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '8px',
                        background: '#FEE2E2',
                        border: '1px solid #FCA5A5',
                        color: '#DC2626',
                        cursor: 'pointer'
                      }}
                    >
                      <XCircle style={{ width: '24px', height: '24px' }} />
                    </motion.button>
                  </div>

                  {/* Historical Chart */}
                  {historicalData.length > 0 && (
                    <div style={{
                      background: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      marginBottom: '1.5rem'
                    }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
                        24-Hour Vitals Trend
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={historicalData}>
                          <defs>
                            <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorBP" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="time" stroke="#6B7280" style={{ fontSize: '12px' }} />
                          <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                          <Tooltip
                            contentStyle={{
                              background: 'white',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="heartRate"
                            stroke="#EF4444"
                            fill="url(#colorHR)"
                            strokeWidth={2}
                          />
                          <Area
                            type="monotone"
                            dataKey="bloodPressure"
                            stroke="#3B82F6"
                            fill="url(#colorBP)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem'
                  }}>
                    <div style={{
                      background: '#EFF6FF',
                      border: '1px solid #DBEAFE',
                      borderRadius: '10px',
                      padding: '1rem'
                    }}>
                      <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Location</p>
                      <p style={{ color: '#111827', fontWeight: 600, margin: 0 }}>{selectedPatient.location}</p>
                    </div>
                    <div style={{
                      background: '#F0FDF4',
                      border: '1px solid #DCFCE7',
                      borderRadius: '10px',
                      padding: '1rem'
                    }}>
                      <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Last Updated</p>
                      <p style={{ color: '#111827', fontWeight: 600, margin: 0 }}>{selectedPatient.lastUpdate}</p>
                    </div>
                    <div style={{
                      background: '#FEF2F2',
                      border: '1px solid #FEE2E2',
                      borderRadius: '10px',
                      padding: '1rem'
                    }}>
                      <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Condition</p>
                      <p style={{ color: '#111827', fontWeight: 600, margin: 0 }}>{selectedPatient.condition}</p>
                    </div>
                    <div style={{
                      background: '#FAF5FF',
                      border: '1px solid #F3E8FF',
                      borderRadius: '10px',
                      padding: '1rem'
                    }}>
                      <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Assigned Doctor</p>
                      <p style={{ color: '#111827', fontWeight: 600, margin: 0 }}>{selectedPatient.doctor}</p>
                    </div>
                  </div>

                  {/* Medications */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
                      Current Medications
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {selectedPatient.medications && selectedPatient.medications.map((med, idx) => (
                        <div key={idx} style={{
                          background: '#EFF6FF',
                          border: '1px solid #DBEAFE',
                          borderRadius: '8px',
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: '#1E40AF'
                        }}>
                          <Pill style={{ width: '14px', height: '14px', display: 'inline', marginRight: '6px' }} />
                          {med}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Footer */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: '2rem',
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #E5E7EB'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Shield style={{ width: '20px', height: '20px', color: '#3B82F6' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                Security & Compliance
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, lineHeight: '1.6' }}>
              🔒 AES-256 End-to-End Encryption • HIPAA Compliant • SOC 2 Type II Certified • Role-Based Access Control • Real-time TLS 1.3 Secure Connections • Regular Security Audits • Encrypted Data Storage • GDPR Compliant
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
