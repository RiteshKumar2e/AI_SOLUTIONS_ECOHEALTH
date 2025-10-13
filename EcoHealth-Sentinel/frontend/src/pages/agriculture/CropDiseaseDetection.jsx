import React, { useState } from 'react';
import { Camera, AlertTriangle, CheckCircle, Leaf, Shield, Upload } from 'lucide-react';

const CropDiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(0);

  const diseaseDatabase = {
    healthy: {
      name: 'Healthy Crop',
      severity: 'None',
      treatment: 'Continue regular care and monitoring',
      prevention: 'Maintain current practices',
      confidence: 0.95,
      color: 'green'
    },
    blight: {
      name: 'Late Blight',
      severity: 'High',
      treatment: 'Apply copper-based fungicide immediately. Remove infected leaves.',
      prevention: 'Improve air circulation, avoid overhead watering',
      organicOption: 'Neem oil spray every 7 days',
      confidence: 0.89,
      color: 'red'
    },
    rust: {
      name: 'Leaf Rust',
      severity: 'Medium',
      treatment: 'Apply sulfur-based fungicide. Ensure proper spacing.',
      prevention: 'Remove fallen leaves, improve drainage',
      organicOption: 'Garlic-chili spray, maintain dry conditions',
      confidence: 0.87,
      color: 'orange'
    },
    mildew: {
      name: 'Powdery Mildew',
      severity: 'Medium',
      treatment: 'Apply potassium bicarbonate spray. Increase sunlight exposure.',
      prevention: 'Reduce humidity, prune for better airflow',
      organicOption: 'Milk solution (1:9 ratio with water)',
      confidence: 0.92,
      color: 'yellow'
    }
  };

  const analyzeImage = () => {
    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const diseases = Object.keys(diseaseDatabase);
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
      const detection = diseaseDatabase[randomDisease];

      let conf = 0;
      const interval = setInterval(() => {
        conf += 5;
        setConfidence(conf);
        if (conf >= detection.confidence * 100) {
          clearInterval(interval);
        }
      }, 50);

      setResult(detection);
      setAnalyzing(false);
    }, 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setResult(null);
        setConfidence(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return { text: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
      case 'Medium': return { text: '#ea580c', bg: '#fff7ed', border: '#fed7aa' };
      case 'Low': return { text: '#ca8a04', bg: '#fefce8', border: '#fef08a' };
      default: return { text: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' };
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 50%, #ecfeff 100%)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundBlob1: {
      position: 'absolute',
      top: '80px',
      left: '40px',
      width: '288px',
      height: '288px',
      background: '#bbf7d0',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(64px)',
      opacity: 0.3,
      animation: 'pulse 3s ease-in-out infinite',
      pointerEvents: 'none'
    },
    backgroundBlob2: {
      position: 'absolute',
      top: '160px',
      right: '40px',
      width: '384px',
      height: '384px',
      background: '#d1fae5',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(64px)',
      opacity: 0.3,
      animation: 'pulse 3s ease-in-out infinite 2s',
      pointerEvents: 'none'
    },
    backgroundBlob3: {
      position: 'absolute',
      bottom: '-80px',
      left: '33%',
      width: '320px',
      height: '320px',
      background: '#99f6e4',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(64px)',
      opacity: 0.3,
      animation: 'pulse 3s ease-in-out infinite 4s',
      pointerEvents: 'none'
    },
    maxWidth: {
      maxWidth: '1152px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 10
    },
    header: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(16px)',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      padding: '24px',
      marginBottom: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease',
      cursor: 'default'
    },
    headerHover: {
      transform: 'scale(1.01)'
    },
    headerFlex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    iconGlow: {
      position: 'relative'
    },
    iconGlowInner: {
      position: 'absolute',
      inset: 0,
      background: '#4ade80',
      borderRadius: '50%',
      filter: 'blur(12px)',
      opacity: 0.5,
      animation: 'pulse 2s ease-in-out infinite'
    },
    mainTitle: {
      fontSize: '30px',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #059669, #10b981)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      fontSize: '14px',
      color: '#4b5563',
      marginTop: '4px'
    },
    badge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      background: '#f0fdf4',
      padding: '8px 16px',
      borderRadius: '9999px',
      border: '1px solid #bbf7d0',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    },
    badgeText: {
      fontWeight: 600,
      color: '#15803d'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '24px'
    },
    gridMd: {
      '@media (min-width: 768px)': {
        gridTemplateColumns: 'repeat(2, 1fr)'
      }
    },
    card: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(16px)',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: 600,
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    uploadBox: {
      border: '2px dashed #6ee7b7',
      borderRadius: '12px',
      padding: '32px',
      textAlign: 'center',
      marginBottom: '16px',
      background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.5) 0%, rgba(240, 253, 250, 0.5) 100%)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    uploadBoxHover: {
      borderColor: '#34d399',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    uploadIcon: {
      width: '64px',
      height: '64px',
      margin: '0 auto 16px',
      color: '#34d399',
      transition: 'transform 0.3s ease'
    },
    uploadIconHover: {
      transform: 'scale(1.1)'
    },
    imagePreview: {
      maxHeight: '256px',
      margin: '0 auto',
      borderRadius: '8px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease'
    },
    imagePreviewHover: {
      transform: 'scale(1.05)'
    },
    button: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      fontWeight: 600,
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    buttonActive: {
      background: 'linear-gradient(to right, #059669, #10b981)',
      color: 'white'
    },
    buttonActiveHover: {
      background: 'linear-gradient(to right, #047857, #059669)',
      transform: 'scale(1.05)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
    },
    buttonDisabled: {
      background: '#d1d5db',
      cursor: 'not-allowed'
    },
    privacyNotice: {
      marginTop: '16px',
      padding: '12px',
      background: 'rgba(239, 246, 255, 0.8)',
      backdropFilter: 'blur(4px)',
      borderRadius: '12px',
      fontSize: '14px',
      color: '#1e40af',
      border: '1px solid #bfdbfe',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    },
    loader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '256px'
    },
    spinnerContainer: {
      position: 'relative',
      marginBottom: '16px'
    },
    spinnerGlow: {
      position: 'absolute',
      inset: 0,
      background: '#4ade80',
      borderRadius: '50%',
      filter: 'blur(40px)',
      opacity: 0.4,
      animation: 'pulse 2s ease-in-out infinite'
    },
    spinner: {
      width: '64px',
      height: '64px',
      border: '4px solid #d1fae5',
      borderTopColor: '#059669',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      position: 'relative',
      zIndex: 10,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    confidenceMeter: {
      marginBottom: '16px',
      transition: 'transform 0.3s ease'
    },
    confidenceMeterHover: {
      transform: 'scale(1.05)'
    },
    confidenceBar: {
      width: '100%',
      height: '16px',
      background: '#e5e7eb',
      borderRadius: '9999px',
      overflow: 'hidden',
      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)'
    },
    confidenceFill: {
      height: '100%',
      background: 'linear-gradient(to right, #4ade80, #22c55e, #059669)',
      borderRadius: '9999px',
      transition: 'width 0.5s ease-out',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      position: 'relative'
    },
    confidenceShimmer: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(255, 255, 255, 0.3)',
      animation: 'pulse 2s ease-in-out infinite'
    },
    diseaseCard: {
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      border: '2px solid'
    },
    diseaseCardHover: {
      transform: 'scale(1.05)'
    },
    treatmentBox: {
      borderLeftWidth: '4px',
      borderLeftStyle: 'solid',
      paddingLeft: '16px',
      paddingTop: '8px',
      paddingBottom: '8px',
      borderRadius: '0 8px 8px 0',
      transition: 'background-color 0.3s ease'
    },
    actionButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      paddingTop: '16px'
    },
    actionButton: {
      padding: '8px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 600,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    actionButtonOutline: {
      border: '2px solid #059669',
      background: 'transparent',
      color: '#059669'
    },
    actionButtonOutlineHover: {
      background: '#f0fdf4',
      transform: 'scale(1.05)'
    },
    actionButtonSolid: {
      border: 'none',
      background: 'linear-gradient(to right, #059669, #10b981)',
      color: 'white'
    },
    actionButtonSolidHover: {
      background: 'linear-gradient(to right, #047857, #059669)',
      transform: 'scale(1.05)'
    },
    impactSection: {
      marginTop: '24px',
      background: 'linear-gradient(to right, rgba(239, 246, 255, 0.8), rgba(240, 253, 245, 0.8))',
      backdropFilter: 'blur(16px)',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'relative',
      overflow: 'hidden'
    },
    impactGlow: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to right, rgba(191, 219, 254, 0.2), rgba(187, 247, 208, 0.2))',
      animation: 'pulse 3s ease-in-out infinite'
    },
    impactGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '16px',
      fontSize: '14px',
      position: 'relative',
      zIndex: 10
    },
    impactCard: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(4px)',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      transition: 'all 0.3s ease'
    },
    impactCardHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
    }
  };

  const [hoverStates, setHoverStates] = useState({
    header: false,
    uploadBox: false,
    uploadIcon: false,
    image: false,
    button: false,
    confidence: false,
    diseaseCard: false,
    saveButton: false,
    expertButton: false,
    impact1: false,
    impact2: false,
    impact3: false
  });

  const setHover = (key, value) => {
    setHoverStates(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (min-width: 768px) {
          .grid-md { grid-template-columns: repeat(2, 1fr); }
          .impact-grid-md { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
      
      <div style={styles.container}>
        <div style={styles.backgroundBlob1}></div>
        <div style={styles.backgroundBlob2}></div>
        <div style={styles.backgroundBlob3}></div>

        <div style={styles.maxWidth}>
          {/* Header */}
          <div 
            style={{...styles.header, ...(hoverStates.header ? styles.headerHover : {})}}
            onMouseEnter={() => setHover('header', true)}
            onMouseLeave={() => setHover('header', false)}
          >
            <div style={styles.headerFlex}>
              <div style={styles.headerLeft}>
                <div style={styles.iconGlow}>
                  <div style={styles.iconGlowInner}></div>
                  <Leaf style={{ width: '32px', height: '32px', color: '#059669', position: 'relative', zIndex: 10, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
                </div>
                <div>
                  <h1 style={styles.mainTitle}>AI Crop Disease Detection</h1>
                  <p style={styles.subtitle}>Early detection saves crops and livelihoods</p>
                </div>
              </div>
              <div style={styles.badge}>
                <Shield style={{ width: '20px', height: '20px', color: '#059669' }} />
                <span style={styles.badgeText}>95% Accuracy</span>
              </div>
            </div>
          </div>

          <div style={styles.grid} className="grid-md">
            {/* Upload Section */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                <div style={styles.iconGlow}>
                  <div style={{...styles.iconGlowInner, filter: 'blur(8px)', opacity: 0.4}}></div>
                  <Camera style={{ width: '20px', height: '20px', color: '#059669', position: 'relative', zIndex: 10 }} />
                </div>
                Upload Crop Image
              </h2>

              <div 
                style={{...styles.uploadBox, ...(hoverStates.uploadBox ? styles.uploadBoxHover : {})}}
                onMouseEnter={() => setHover('uploadBox', true)}
                onMouseLeave={() => setHover('uploadBox', false)}
              >
                {selectedImage ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div
                      onMouseEnter={() => setHover('image', true)}
                      onMouseLeave={() => setHover('image', false)}
                    >
                      <img
                        src={selectedImage}
                        alt="Uploaded crop"
                        style={{...styles.imagePreview, ...(hoverStates.image ? styles.imagePreviewHover : {})}}
                      />
                    </div>
                    <label style={{ cursor: 'pointer', color: '#059669', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <Upload style={{ width: '16px', height: '16px' }} />
                      Change Image
                    </label>
                  </div>
                ) : (
                  <label style={{ cursor: 'pointer', display: 'block' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <div style={{ position: 'absolute', inset: 0, background: '#4ade80', borderRadius: '50%', filter: 'blur(40px)', opacity: hoverStates.uploadIcon ? 0.5 : 0.3, transition: 'opacity 0.3s ease' }}></div>
                      <Upload 
                        style={{...styles.uploadIcon, ...(hoverStates.uploadIcon ? styles.uploadIconHover : {}), position: 'relative', zIndex: 10}}
                        onMouseEnter={() => setHover('uploadIcon', true)}
                        onMouseLeave={() => setHover('uploadIcon', false)}
                      />
                    </div>
                    <p style={{ color: '#374151', marginBottom: '8px', fontWeight: 500 }}>Click to upload or drag and drop</p>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Support: JPG, PNG (Max 10MB)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              {selectedImage && (
                <button
                  onClick={analyzeImage}
                  disabled={analyzing}
                  style={{
                    ...styles.button,
                    ...(analyzing ? styles.buttonDisabled : styles.buttonActive),
                    ...(hoverStates.button && !analyzing ? styles.buttonActiveHover : {})
                  }}
                  onMouseEnter={() => setHover('button', true)}
                  onMouseLeave={() => setHover('button', false)}
                >
                  {analyzing ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      Analyzing with AI...
                    </span>
                  ) : (
                    'Detect Disease'
                  )}
                </button>
              )}

              <div style={styles.privacyNotice}>
                <Shield style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px' }} />
                Your images are processed securely and never stored
              </div>
            </div>

            {/* Results Section */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Detection Results</h2>

              {analyzing && (
                <div style={styles.loader}>
                  <div style={styles.spinnerContainer}>
                    <div style={styles.spinnerGlow}></div>
                    <div style={styles.spinner}></div>
                  </div>
                  <p style={{ color: '#374151', fontWeight: 500 }}>AI analyzing image...</p>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px', animation: 'pulse 2s ease-in-out infinite' }}>Processing with deep learning model</p>
                </div>
              )}

              {!analyzing && !result && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '256px', color: '#9ca3af' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: '#d1d5db', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.2, animation: 'pulse 2s ease-in-out infinite' }}></div>
                    <Leaf style={{ width: '64px', height: '64px', marginBottom: '16px', position: 'relative', zIndex: 10 }} />
                  </div>
                  <p>Upload an image to get started</p>
                </div>
              )}

              {result && !analyzing && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Confidence Meter */}
                  <div 
                    style={{...styles.confidenceMeter, ...(hoverStates.confidence ? styles.confidenceMeterHover : {})}}
                    onMouseEnter={() => setHover('confidence', true)}
                    onMouseLeave={() => setHover('confidence', false)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Confidence Level</span>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>{confidence.toFixed(0)}%</span>
                    </div>
                    <div style={styles.confidenceBar}>
                      <div style={{...styles.confidenceFill, width: `${confidence}%`}}>
                        <div style={styles.confidenceShimmer}></div>
                      </div>
                    </div>
                  </div>

                  {/* Disease Information */}
                  <div 
                    style={{
                      ...styles.diseaseCard,
                      color: getSeverityColor(result.severity).text,
                      background: getSeverityColor(result.severity).bg,
                      borderColor: getSeverityColor(result.severity).border,
                      ...(hoverStates.diseaseCard ? styles.diseaseCardHover : {})
                    }}
                    onMouseEnter={() => setHover('diseaseCard', true)}
                    onMouseLeave={() => setHover('diseaseCard', false)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      {result.severity === 'None' ? (
                        <div style={styles.iconGlow}>
                          <div style={{...styles.iconGlowInner, background: '#4ade80', filter: 'blur(12px)'}}></div>
                          <CheckCircle style={{ width: '24px', height: '24px', position: 'relative', zIndex: 10 }} />
                        </div>
                      ) : (
                        <div style={styles.iconGlow}>
                          <div style={{...styles.iconGlowInner, background: '#f87171', filter: 'blur(12px)'}}></div>
                          <AlertTriangle style={{ width: '24px', height: '24px', position: 'relative', zIndex: 10 }} />
                        </div>
                      )}
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>{result.name}</h3>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>Severity: {result.severity}</p>
                  </div>

                  {/* Treatment Recommendations */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{...styles.treatmentBox, borderLeftColor: '#3b82f6', background: 'rgba(239, 246, 255, 0.5)'}}>
                      <h4 style={{ fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>Treatment</h4>
                      <p style={{ fontSize: '14px', color: '#374151' }}>{result.treatment}</p>
                    </div>

                    {result.organicOption && (
                      <div style={{...styles.treatmentBox, borderLeftColor: '#22c55e', background: 'rgba(240, 253, 245, 0.5)'}}>
                        <h4 style={{ fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>Organic Option</h4>
                        <p style={{ fontSize: '14px', color: '#374151' }}>{result.organicOption}</p>
                      </div>
                    )}

                    <div style={{...styles.treatmentBox, borderLeftColor: '#a855f7', background: 'rgba(250, 245, 255, 0.5)'}}>
                      <h4 style={{ fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>Prevention</h4>
                      <p style={{ fontSize: '14px', color: '#374151' }}>{result.prevention}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={styles.actionButtons}>
                    <button 
                      style={{
                        ...styles.actionButton,
                        ...styles.actionButtonOutline,
                        ...(hoverStates.saveButton ? styles.actionButtonOutlineHover : {})
                      }}
                      onMouseEnter={() => setHover('saveButton', true)}
                      onMouseLeave={() => setHover('saveButton', false)}
                    >
                      Save Report
                    </button>
                    <button 
                      style={{
                        ...styles.actionButton,
                        ...styles.actionButtonSolid,
                        ...(hoverStates.expertButton ? styles.actionButtonSolidHover : {})
                      }}
                      onMouseEnter={() => setHover('expertButton', true)}
                      onMouseLeave={() => setHover('expertButton', false)}
                    >
                      Contact Expert
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Impact Information */}
          <div style={styles.impactSection}>
            <div style={styles.impactGlow}></div>
            <h3 style={{ fontWeight: 600, color: '#1f2937', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 10 }}>
              <div style={styles.iconGlow}>
                <div style={{...styles.iconGlowInner, background: '#4ade80', filter: 'blur(12px)'}}></div>
                <Shield style={{ width: '20px', height: '20px', color: '#059669', position: 'relative', zIndex: 10 }} />
              </div>
              Responsible AI for Agriculture
            </h3>
            <div style={styles.impactGrid} className="impact-grid-md">
              <div 
                style={{
                  ...styles.impactCard,
                  ...(hoverStates.impact1 ? styles.impactCardHover : {})
                }}
                onMouseEnter={() => setHover('impact1', true)}
                onMouseLeave={() => setHover('impact1', false)}
              >
                <h4 style={{ fontWeight: 600, color: '#15803d', marginBottom: '4px' }}>Early Detection</h4>
                <p style={{ color: '#4b5563' }}>Identify diseases 5-7 days earlier than manual inspection</p>
              </div>
              <div 
                style={{
                  ...styles.impactCard,
                  ...(hoverStates.impact2 ? styles.impactCardHover : {})
                }}
                onMouseEnter={() => setHover('impact2', true)}
                onMouseLeave={() => setHover('impact2', false)}
              >
                <h4 style={{ fontWeight: 600, color: '#15803d', marginBottom: '4px' }}>Reduced Pesticide Use</h4>
                <p style={{ color: '#4b5563' }}>Targeted treatment reduces chemical usage by 40%</p>
              </div>
              <div 
                style={{
                  ...styles.impactCard,
                  ...(hoverStates.impact3 ? styles.impactCardHover : {})
                }}
                onMouseEnter={() => setHover('impact3', true)}
                onMouseLeave={() => setHover('impact3', false)}
              >
                <h4 style={{ fontWeight: 600, color: '#15803d', marginBottom: '4px' }}>Farmer Privacy</h4>
                <p style={{ color: '#4b5563' }}>No data storage, on-device processing when possible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CropDiseaseDetection;