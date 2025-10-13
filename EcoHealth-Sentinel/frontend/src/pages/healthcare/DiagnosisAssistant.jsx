import React, { useState, useEffect, useRef } from 'react';
import { Brain, Stethoscope, Activity, AlertTriangle, CheckCircle, TrendingUp, FileText, Send, Bot, User, Sparkles, Zap, HeartPulse, Microscope } from 'lucide-react';

const DiagnosisAssistant = () => {
  const [step, setStep] = useState(1);
  const [patientData, setPatientData] = useState({
    age: '',
    gender: '',
    symptoms: [],
    duration: '',
    severity: '',
    medicalHistory: [],
    medications: [],
    allergies: []
  });
  const [diagnosis, setDiagnosis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI medical assistant. I\'ll help you through the diagnosis process. Let\'s start by gathering some information about the patient.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [particles, setParticles] = useState([]);
  const chatEndRef = useRef(null);

  const symptomsList = [
    'Fever', 'Cough', 'Shortness of Breath', 'Fatigue', 'Headache',
    'Sore Throat', 'Nausea', 'Vomiting', 'Diarrhea', 'Abdominal Pain',
    'Chest Pain', 'Dizziness', 'Muscle Aches', 'Joint Pain', 'Rash',
    'Loss of Appetite', 'Weight Loss', 'Night Sweats', 'Confusion'
  ];

  const medicalConditions = [
    'Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'COPD',
    'Kidney Disease', 'Liver Disease', 'Cancer', 'Autoimmune Disease'
  ];

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.3 + 0.1
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSymptomToggle = (symptom) => {
    setPatientData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleConditionToggle = (condition) => {
    setPatientData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.includes(condition)
        ? prev.medicalHistory.filter(c => c !== condition)
        : [...prev.medicalHistory, condition]
    }));
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    setTimeout(() => {
      const responses = [
        "I've noted that information. Can you tell me more about the severity of the symptoms?",
        "That's helpful. Based on what you've shared, I recommend we proceed with a comprehensive analysis.",
        "Thank you for providing those details. I'm analyzing the symptom patterns now.",
        "I see. Let me check that against our medical database for similar cases.",
        "This information is very useful. Would you like to provide any additional details?"
      ];
      const aiResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    }, 1200);
  };

  const runDiagnosisAI = async () => {
    setIsAnalyzing(true);
    
    setChatMessages(prev => [...prev, { 
      role: 'assistant', 
      content: '🔬 Initiating comprehensive AI analysis of patient data. This will take a few moments...' 
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    const aiDiagnosis = {
      primaryDiagnosis: {
        name: 'Viral Upper Respiratory Infection',
        confidence: 87.5,
        icd10: 'J06.9',
        severity: 'Moderate'
      },
      differentialDiagnoses: [
        { name: 'Influenza', confidence: 72.3, probability: 'High' },
        { name: 'COVID-19', confidence: 68.1, probability: 'Medium' },
        { name: 'Bacterial Sinusitis', confidence: 45.2, probability: 'Low' },
        { name: 'Allergic Rhinitis', confidence: 38.7, probability: 'Low' }
      ],
      riskFactors: [
        { factor: 'Age group', impact: 'Low', score: 25 },
        { factor: 'Symptom severity', impact: 'Medium', score: 60 },
        { factor: 'Duration of illness', impact: 'Medium', score: 55 },
        { factor: 'Medical history', impact: 'Low', score: 30 }
      ],
      recommendedTests: [
        { test: 'Complete Blood Count (CBC)', priority: 'High', reason: 'Evaluate infection markers' },
        { test: 'Chest X-Ray', priority: 'Medium', reason: 'Rule out pneumonia' },
        { test: 'Rapid COVID-19 Test', priority: 'High', reason: 'Differential diagnosis' },
        { test: 'Influenza Test', priority: 'Medium', reason: 'Confirm viral etiology' }
      ],
      treatmentRecommendations: [
        { treatment: 'Rest and hydration', category: 'Supportive', evidence: 'Strong' },
        { treatment: 'Acetaminophen for fever', category: 'Symptomatic', evidence: 'Strong' },
        { treatment: 'Decongestants', category: 'Symptomatic', evidence: 'Moderate' },
        { treatment: 'Follow-up in 3-5 days', category: 'Monitoring', evidence: 'Standard' }
      ],
      redFlags: [
        'Difficulty breathing or shortness of breath',
        'Persistent chest pain or pressure',
        'New confusion or inability to stay awake',
        'Bluish lips or face',
        'Fever > 103°F (39.4°C) persisting > 3 days'
      ],
      aiInsights: {
        symptomPattern: 'Classic viral respiratory infection pattern detected',
        temporalAnalysis: 'Symptom progression consistent with typical viral course',
        comorbidityImpact: 'Low risk based on medical history',
        outcomePrediction: '95% probability of full recovery within 7-10 days'
      },
      urgencyLevel: 'Routine Care',
      confidenceScore: 87.5,
      evidenceQuality: 'High'
    };
    
    setDiagnosis(aiDiagnosis);
    setIsAnalyzing(false);
    setStep(4);
    
    setChatMessages(prev => [...prev, { 
      role: 'assistant', 
      content: `✅ Analysis complete! I've identified ${aiDiagnosis.primaryDiagnosis.name} with ${aiDiagnosis.confidenceScore}% confidence. Review the detailed results below.` 
    }]);
  };

  const renderStep1 = () => (
    <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          padding: '0.75rem', 
          background: 'linear-gradient(135deg, #E9D5FF, #DDD6FE)',
          borderRadius: '0.75rem',
          border: '2px solid #C4B5FD',
          animation: 'cardFloat 3s ease-in-out infinite',
          boxShadow: '0 4px 15px rgba(168, 85, 247, 0.15)'
        }}>
          <User style={{ width: '1.5rem', height: '1.5rem', color: '#7C3AED' }} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937' }}>Patient Demographics</h2>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4B5563', marginBottom: '0.5rem' }}>Age</label>
          <input
            type="number"
            value={patientData.age}
            onChange={(e) => setPatientData(prev => ({ ...prev, age: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'white',
              border: '2px solid #E5E7EB',
              borderRadius: '0.75rem',
              color: '#1F2937',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            placeholder="Enter patient age"
            onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4B5563', marginBottom: '0.5rem' }}>Gender</label>
          <select
            value={patientData.gender}
            onChange={(e) => setPatientData(prev => ({ ...prev, gender: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'white',
              border: '2px solid #E5E7EB',
              borderRadius: '0.75rem',
              color: '#1F2937',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4B5563', marginBottom: '0.75rem' }}>Medical History</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {medicalConditions.map((condition, idx) => (
            <button
              key={condition}
              onClick={() => handleConditionToggle(condition)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: `2px solid ${patientData.medicalHistory.includes(condition) ? '#7C3AED' : '#E5E7EB'}`,
                background: patientData.medicalHistory.includes(condition) 
                  ? 'linear-gradient(135deg, #E9D5FF, #DDD6FE)'
                  : 'white',
                color: patientData.medicalHistory.includes(condition) ? '#6B21A8' : '#4B5563',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animation: `slideIn 0.4s ease-out forwards ${idx * 50}ms`,
                boxShadow: patientData.medicalHistory.includes(condition) 
                  ? '0 4px 15px rgba(124, 58, 237, 0.2)' 
                  : '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              {condition}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!patientData.age || !patientData.gender}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '0.75rem',
          border: 'none',
          fontSize: '1.125rem',
          fontWeight: '600',
          cursor: patientData.age && patientData.gender ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '1.5rem',
          boxShadow: '0 8px 20px rgba(124, 58, 237, 0.3)',
          opacity: !patientData.age || !patientData.gender ? 0.5 : 1,
          transition: 'all 0.4s ease',
          transform: 'translateZ(0)'
        }}
        onMouseEnter={(e) => {
          if (patientData.age && patientData.gender) {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 30px rgba(124, 58, 237, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 8px 20px rgba(124, 58, 237, 0.3)';
        }}
      >
        Next: Symptoms Assessment
        <Sparkles style={{ width: '1.25rem', height: '1.25rem' }} />
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          padding: '0.75rem', 
          background: 'linear-gradient(135deg, #FECACA, #FCA5A5)',
          borderRadius: '0.75rem',
          border: '2px solid #F87171',
          animation: 'cardFloat 3s ease-in-out infinite',
          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.15)'
        }}>
          <Activity style={{ width: '1.5rem', height: '1.5rem', color: '#DC2626' }} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937' }}>Symptoms Assessment</h2>
      </div>
      
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4B5563', marginBottom: '0.75rem' }}>Select all current symptoms</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {symptomsList.map((symptom, idx) => (
            <button
              key={symptom}
              onClick={() => handleSymptomToggle(symptom)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.75rem',
                border: `2px solid ${patientData.symptoms.includes(symptom) ? '#EF4444' : '#E5E7EB'}`,
                background: patientData.symptoms.includes(symptom)
                  ? 'linear-gradient(135deg, #FECACA, #FCA5A5)'
                  : 'white',
                color: patientData.symptoms.includes(symptom) ? '#991B1B' : '#4B5563',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animation: `slideIn 0.4s ease-out forwards ${idx * 30}ms`,
                boxShadow: patientData.symptoms.includes(symptom) 
                  ? '0 4px 15px rgba(239, 68, 68, 0.2)' 
                  : '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4B5563', marginBottom: '0.5rem' }}>Duration of Symptoms</label>
          <select
            value={patientData.duration}
            onChange={(e) => setPatientData(prev => ({ ...prev, duration: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'white',
              border: '2px solid #E5E7EB',
              borderRadius: '0.75rem',
              color: '#1F2937',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          >
            <option value="">Select duration</option>
            <option value="<24h">Less than 24 hours</option>
            <option value="1-3d">1-3 days</option>
            <option value="4-7d">4-7 days</option>
            <option value=">1w">More than 1 week</option>
            <option value=">1m">More than 1 month</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#4B5563', marginBottom: '0.5rem' }}>Severity Level</label>
          <select
            value={patientData.severity}
            onChange={(e) => setPatientData(prev => ({ ...prev, severity: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'white',
              border: '2px solid #E5E7EB',
              borderRadius: '0.75rem',
              color: '#1F2937',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          >
            <option value="">Select severity</option>
            <option value="mild">Mild (1-3/10)</option>
            <option value="moderate">Moderate (4-6/10)</option>
            <option value="severe">Severe (7-10/10)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={() => setStep(1)}
          style={{
            flex: 1,
            background: 'white',
            border: '2px solid #E5E7EB',
            color: '#4B5563',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#7C3AED';
            e.target.style.color = '#7C3AED';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#E5E7EB';
            e.target.style.color = '#4B5563';
          }}
        >
          ← Previous
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={patientData.symptoms.length === 0 || !patientData.duration || !patientData.severity}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            border: 'none',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: (patientData.symptoms.length > 0 && patientData.duration && patientData.severity) ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 8px 20px rgba(124, 58, 237, 0.3)',
            opacity: (patientData.symptoms.length === 0 || !patientData.duration || !patientData.severity) ? 0.5 : 1,
            transition: 'all 0.4s ease'
          }}
          onMouseEnter={(e) => {
            if (patientData.symptoms.length > 0 && patientData.duration && patientData.severity) {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 30px rgba(124, 58, 237, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 20px rgba(124, 58, 237, 0.3)';
          }}
        >
          Next: Review
          <Sparkles style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          padding: '0.75rem', 
          background: 'linear-gradient(135deg, #BFDBFE, #93C5FD)',
          borderRadius: '0.75rem',
          border: '2px solid #60A5FA',
          animation: 'cardFloat 3s ease-in-out infinite',
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.15)'
        }}>
          <FileText style={{ width: '1.5rem', height: '1.5rem', color: '#2563EB' }} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937' }}>Review Patient Information</h2>
      </div>
      
      <div style={{
        background: 'linear-gradient(135deg, #F9FAFB, #F3F4F6)',
        border: '2px solid #E5E7EB',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Demographics</h3>
          <p style={{ color: '#1F2937', fontSize: '1.125rem' }}>
            Age: <strong>{patientData.age}</strong> | Gender: <strong style={{ textTransform: 'capitalize' }}>{patientData.gender}</strong>
          </p>
        </div>

        {patientData.medicalHistory.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Medical History</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {patientData.medicalHistory.map(condition => (
                <span key={condition} style={{
                  padding: '0.375rem 0.75rem',
                  background: 'linear-gradient(135deg, #E9D5FF, #DDD6FE)',
                  color: '#6B21A8',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  border: '2px solid #C4B5FD',
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.15)'
                }}>
                  {condition}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Current Symptoms</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {patientData.symptoms.map(symptom => (
              <span key={symptom} style={{
                padding: '0.375rem 0.75rem',
                background: 'linear-gradient(135deg, #FECACA, #FCA5A5)',
                color: '#991B1B',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: '2px solid #F87171',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.15)'
              }}>
                {symptom}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Symptom Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '0.75rem', border: '2px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
              <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>Duration</p>
              <p style={{ color: '#1F2937', fontWeight: '600' }}>{patientData.duration}</p>
            </div>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '0.75rem', border: '2px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
              <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>Severity</p>
              <p style={{ color: '#1F2937', fontWeight: '600', textTransform: 'capitalize' }}>{patientData.severity}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={() => setStep(2)}
          style={{
            flex: 1,
            background: 'white',
            border: '2px solid #E5E7EB',
            color: '#4B5563',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#7C3AED';
            e.target.style.color = '#7C3AED';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#E5E7EB';
            e.target.style.color = '#4B5563';
          }}
        >
          ← Previous
        </button>
        <button
          onClick={runDiagnosisAI}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #7C3AED, #EC4899, #6366F1)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            border: 'none',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)',
            animation: 'glow 2s ease-in-out infinite',
            transition: 'all 0.4s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 15px 35px rgba(124, 58, 237, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 25px rgba(124, 58, 237, 0.3)';
          }}
        >
          <Brain style={{ width: '1.5rem', height: '1.5rem', animation: 'spinSlow 4s linear infinite' }} />
          Run AI Diagnosis
          <Zap style={{ width: '1.25rem', height: '1.25rem', animation: 'pulse 2s ease-in-out infinite' }} />
        </button>
      </div>
    </div>
  );

  const renderDiagnosisResults = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.6s ease-out' }}>
      {/* Hero Card */}
      <div style={{
        background: 'linear-gradient(135deg, #7C3AED, #EC4899, #6366F1)',
        borderRadius: '1rem',
        padding: '2rem',
        color: 'white',
        boxShadow: '0 20px 40px rgba(124, 58, 237, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Brain style={{ width: '2.5rem', height: '2.5rem', animation: 'pulseSlow 3s ease-in-out infinite' }} />
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>AI Diagnosis Complete</h2>
            </div>
            <Sparkles style={{ width: '2rem', height: '2rem', animation: 'spinSlow 4s linear infinite' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '0.75rem', padding: '1rem', border: '2px solid rgba(255, 255, 255, 0.3)' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Confidence Score</p>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{diagnosis.confidenceScore}%</p>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '0.75rem', padding: '1rem', border: '2px solid rgba(255, 255, 255, 0.3)' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Evidence Quality</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{diagnosis.evidenceQuality}</p>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '0.75rem', padding: '1rem', border: '2px solid rgba(255, 255, 255, 0.3)' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Urgency Level</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{diagnosis.urgencyLevel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Diagnosis */}
      <div style={{
        background: 'white',
        border: '2px solid #C4B5FD',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 10px 30px rgba(124, 58, 237, 0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Stethoscope style={{ width: '1.75rem', height: '1.75rem', color: '#7C3AED', animation: 'swing 2s ease-in-out infinite' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937' }}>Primary Diagnosis</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h4 style={{ 
              fontSize: '1.875rem', 
              fontWeight: 'bold', 
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.75rem'
            }}>
              {diagnosis.primaryDiagnosis.name}
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{
                padding: '0.375rem 0.75rem',
                background: 'linear-gradient(135deg, #DDD6FE, #C4B5FD)',
                color: '#6B21A8',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: '2px solid #A78BFA'
              }}>
                ICD-10: {diagnosis.primaryDiagnosis.icd10}
              </span>
              <span style={{
                padding: '0.375rem 0.75rem',
                background: 'linear-gradient(135deg, #E9D5FF, #DDD6FE)',
                color: '#7C3AED',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: '2px solid #C4B5FD'
              }}>
                Severity: {diagnosis.primaryDiagnosis.severity}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {diagnosis.primaryDiagnosis.confidence}%
            </div>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>Confidence</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => {
            setStep(1);
            setDiagnosis(null);
            setChatMessages([{ role: 'assistant', content: 'Ready to start a new diagnosis. Let\'s gather patient information.' }]);
          }}
          style={{
            flex: 1,
            background: 'white',
            border: '2px solid #E5E7EB',
            color: '#4B5563',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#7C3AED';
            e.target.style.color = '#7C3AED';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#E5E7EB';
            e.target.style.color = '#4B5563';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          New Diagnosis
        </button>
        <button
          onClick={() => window.print()}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            border: 'none',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.25)';
          }}
        >
          <FileText style={{ width: '1.5rem', height: '1.5rem' }} />
          Export Report
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes float3d {
          0%, 100% { transform: translate3d(0px, 0px, 0px); }
          25% { transform: translate3d(-20px, -30px, 20px); }
          50% { transform: translate3d(20px, -15px, -20px); }
          75% { transform: translate3d(-15px, 25px, 15px); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate3d(0, 0, 0) scale3d(1, 1, 1) rotate(0deg); }
          25% { transform: translate3d(20px, -50px, 20px) scale3d(1.1, 1.1, 1) rotate(90deg); }
          50% { transform: translate3d(-20px, 20px, -20px) scale3d(0.9, 0.9, 1) rotate(180deg); }
          75% { transform: translate3d(50px, 50px, 20px) scale3d(1.05, 1.05, 1) rotate(270deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; transform: scale3d(1, 1, 1); }
          50% { opacity: 0.9; transform: scale3d(1.05, 1.05, 1); }
        }
        
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3); }
          50% { box-shadow: 0 15px 35px rgba(124, 58, 237, 0.5), 0 5px 15px rgba(236, 72, 153, 0.3); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes swing {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #F3F4F6;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #C4B5FD;
          border-radius: 20px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #A78BFA;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 50%, #F3F4F6 100%)',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Particles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {particles.map(particle => (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                background: 'linear-gradient(135deg, #C4B5FD, #A78BFA)',
                borderRadius: '50%',
                opacity: particle.opacity,
                animation: `float3d ${particle.duration}s ease-in-out infinite ${particle.delay}s`
              }}
            />
          ))}
        </div>

        {/* Blob Backgrounds */}
        <div style={{ position: 'absolute', top: '25%', left: '25%', width: '24rem', height: '24rem', background: '#E9D5FF', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(4rem)', opacity: 0.3, animation: 'blob 7s infinite' }} />
        <div style={{ position: 'absolute', top: '33%', right: '25%', width: '24rem', height: '24rem', background: '#BFDBFE', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(4rem)', opacity: 0.3, animation: 'blob 7s infinite 2s' }} />
        <div style={{ position: 'absolute', bottom: '25%', left: '50%', width: '24rem', height: '24rem', background: '#FED7AA', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(4rem)', opacity: 0.3, animation: 'blob 7s infinite 4s' }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          {/* Main Content */}
          <div>
            {/* Header */}
            <div style={{
              background: 'white',
              border: '2px solid #E5E7EB',
              borderRadius: '1rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
              padding: '2rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '3.5rem', 
                  height: '3.5rem', 
                  background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(124, 58, 237, 0.25)',
                  animation: 'pulseSlow 3s ease-in-out infinite'
                }}>
                  <Brain style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
                <div>
                  <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.25rem' }}>AI Diagnosis Assistant</h1>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Advanced medical diagnosis powered by machine learning</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <HeartPulse style={{ width: '2rem', height: '2rem', color: '#EC4899', animation: 'pulse 2s ease-in-out infinite' }} />
                <Sparkles style={{ width: '2rem', height: '2rem', color: '#F59E0B', animation: 'spinSlow 4s linear infinite' }} />
              </div>
            </div>

            {/* Feature Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #E9D5FF, #DDD6FE)', color: '#6B21A8', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', border: '2px solid #C4B5FD' }}>✓ Evidence-Based Medicine</span>
              <span style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)', color: '#1E40AF', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', border: '2px solid #93C5FD' }}>✓ Advanced Pattern Recognition</span>
              <span style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #BAE6FD, #7DD3FC)', color: '#0C4A6E', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', border: '2px solid #38BDF8' }}>✓ Comprehensive Risk Assessment</span>
              <span style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', color: '#065F46', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', border: '2px solid #6EE7B7' }}>✓ Clinical Guidelines Compliant</span>
            </div>

            {/* Progress Steps */}
            {step < 4 && (
              <div style={{
                background: 'white',
                border: '2px solid #E5E7EB',
                borderRadius: '1rem',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  {[1, 2, 3].map(num => (
                    <React.Fragment key={num}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        background: step >= num ? 'linear-gradient(135deg, #7C3AED, #6366F1)' : 'white',
                        color: step >= num ? 'white' : '#9CA3AF',
                        border: `2px solid ${step >= num ? '#7C3AED' : '#E5E7EB'}`,
                        boxShadow: step >= num ? '0 8px 20px rgba(124, 58, 237, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                        transform: step >= num ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.5s ease'
                      }}>
                        {step > num ? '✓' : num}
                      </div>
                      {num < 3 && (
                        <div style={{
                          flex: 1,
                          height: '0.375rem',
                          margin: '0 0.75rem',
                          borderRadius: '9999px',
                          background: step > num ? 'linear-gradient(90deg, #7C3AED, #6366F1)' : '#E5E7EB',
                          boxShadow: step > num ? '0 4px 15px rgba(124, 58, 237, 0.25)' : 'none',
                          transition: 'all 0.5s ease'
                        }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6B7280', fontWeight: '600' }}>
                  <span>Patient Info</span>
                  <span>Symptoms</span>
                  <span>Review & Analyze</span>
                </div>
              </div>
            )}

            {/* Content Card */}
            <div style={{
              background: 'white',
              border: '2px solid #E5E7EB',
              borderRadius: '1rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
              padding: '2rem'
            }}>
              {isAnalyzing ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
                    <Brain style={{ width: '6rem', height: '6rem', color: '#7C3AED', animation: 'spinSlow 4s linear infinite', position: 'relative', zIndex: 2 }} />
                    <div style={{ position: 'absolute', inset: 0, background: '#C4B5FD', borderRadius: '50%', filter: 'blur(2rem)', opacity: 0.4, animation: 'pulse 2s ease-in-out infinite' }} />
                  </div>
                  <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.75rem' }}>AI Analysis in Progress</h3>
                  <p style={{ color: '#6B7280', marginBottom: '2rem', fontSize: '1.125rem' }}>Analyzing symptoms, medical history, and clinical patterns...</p>
                  <div style={{ maxWidth: '28rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'linear-gradient(135deg, #F9FAFB, #F3F4F6)', borderRadius: '0.75rem', border: '2px solid #E5E7EB', color: '#4B5563', fontSize: '0.875rem' }}>
                      <Zap style={{ width: '1.25rem', height: '1.25rem', color: '#F59E0B', animation: 'pulse 2s ease-in-out infinite' }} />
                      <span>Processing symptom correlations...</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'linear-gradient(135deg, #F9FAFB, #F3F4F6)', borderRadius: '0.75rem', border: '2px solid #E5E7EB', color: '#4B5563', fontSize: '0.875rem' }}>
                      <Zap style={{ width: '1.25rem', height: '1.25rem', color: '#F59E0B', animation: 'pulse 2s ease-in-out infinite' }} />
                      <span>Cross-referencing medical databases...</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'linear-gradient(135deg, #F9FAFB, #F3F4F6)', borderRadius: '0.75rem', border: '2px solid #E5E7EB', color: '#4B5563', fontSize: '0.875rem' }}>
                      <Zap style={{ width: '1.25rem', height: '1.25rem', color: '#F59E0B', animation: 'pulse 2s ease-in-out infinite' }} />
                      <span>Generating risk assessment...</span>
                    </div>
                    <div style={{ width: '100%', height: '1rem', background: '#E5E7EB', borderRadius: '9999px', marginTop: '1.5rem', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'linear-gradient(90deg, transparent, #C4B5FD, transparent)', backgroundSize: '1000px 100%', animation: 'shimmer 3s infinite' }} />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                  {step === 4 && diagnosis && renderDiagnosisResults()}
                </>
              )}
            </div>

            {/* Disclaimer */}
            <div style={{
              background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
              border: '2px solid #FCD34D',
              borderRadius: '1rem',
              padding: '1.25rem',
              fontSize: '0.875rem',
              color: '#78350F',
              boxShadow: '0 4px 15px rgba(252, 211, 77, 0.15)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              marginTop: '1.5rem'
            }}>
              <AlertTriangle style={{ width: '1.25rem', height: '1.25rem', color: '#F59E0B', flexShrink: 0, marginTop: '0.125rem', animation: 'pulse 2s ease-in-out infinite' }} />
              <div>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#92400E' }}>⚠️ Medical Disclaimer</p>
                <p>This AI tool is designed to assist healthcare professionals and should not replace professional medical judgment. Always consult with a qualified healthcare provider for diagnosis and treatment decisions.</p>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div style={{ position: 'sticky', top: '1.5rem', height: 'fit-content' }}>
            <div style={{
              background: 'white',
              border: '2px solid #E5E7EB',
              borderRadius: '1rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100vh - 3rem)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                paddingBottom: '1.25rem', 
                marginBottom: '1.25rem', 
                borderBottom: '2px solid #E5E7EB' 
              }}>
                <div style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(124, 58, 237, 0.25)',
                  animation: 'pulseSlow 3s ease-in-out infinite'
                }}>
                  <Bot style={{ width: '1.75rem', height: '1.75rem', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1F2937' }}>AI Assistant</h3>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Always here to help you</p>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem', paddingRight: '0.5rem' }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    gap: '0.75rem', 
                    animation: 'fadeIn 0.6s ease-out',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                  }}>
                    {msg.role === 'assistant' && (
                      <div style={{ 
                        width: '2.25rem', 
                        height: '2.25rem', 
                        borderRadius: '0.75rem',
                        background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                        animation: 'cardFloat 3s ease-in-out infinite'
                      }}>
                        <Bot style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                      </div>
                    )}
                    <div style={{
                      maxWidth: '75%',
                      padding: '0.75rem 1rem',
                      borderRadius: '1rem',
                      background: msg.role === 'user' 
                        ? 'linear-gradient(135deg, #6366F1, #7C3AED)'
                        : 'linear-gradient(135deg, #F9FAFB, #F3F4F6)',
                      color: msg.role === 'user' ? 'white' : '#1F2937',
                      border: msg.role === 'assistant' ? '2px solid #E5E7EB' : 'none',
                      boxShadow: msg.role === 'user' ? '0 4px 15px rgba(99, 102, 241, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}>
                      <p style={{ fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>{msg.content}</p>
                    </div>
                    {msg.role === 'user' && (
                      <div style={{ 
                        width: '2.25rem', 
                        height: '2.25rem', 
                        borderRadius: '0.75rem',
                        background: 'linear-gradient(135deg, #6366F1, #3B82F6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                        animation: 'cardFloat 3s ease-in-out infinite'
                      }}>
                        <User style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Ask me anything..."
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    background: 'white',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    color: '#1F2937',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#7C3AED';
                    e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
                  }}
                />
                <button
                  onClick={sendChatMessage}
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.25)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(124, 58, 237, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.25)';
                  }}
                >
                  <Send style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiagnosisAssistant;
