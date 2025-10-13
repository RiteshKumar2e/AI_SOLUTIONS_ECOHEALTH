import { useState } from 'react';
import { 
  Sprout, 
  Cloud, 
  Droplets, 
  TrendingUp, 
  Activity,
  Leaf,
  Sun,
  Wind,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Zap,
  Shield
} from 'lucide-react';

export default function MainAgri() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const navigate = useNavigate(); // ✅ hook

  // Go to Agriculture Dashboard (FarmDashboard.jsx)
  const handleGoToDashboard = () => {
    navigate("/agriculture/dashboard"); 
  };

  // Back to Main Dashboard (auth/MainDashboard.jsx)
  const handleBackToDomains = () => {
    navigate("/auth/mainDashboard"); 
  };
  const features = [
    {
      id: 'crop-monitoring',
      icon: Activity,
      title: 'Real-time Crop Monitoring',
      description: 'AI-powered surveillance of crop health with satellite imagery and IoT sensors',
      color: '#10b981',
      stats: '95% accuracy'
    },
    {
      id: 'weather-prediction',
      icon: Cloud,
      title: 'Weather Forecasting',
      description: 'Hyperlocal weather predictions to optimize farming schedules and protect crops',
      color: '#3b82f6',
      stats: '7-day forecast'
    },
    {
      id: 'water-management',
      icon: Droplets,
      title: 'Smart Irrigation',
      description: 'Optimize water usage with AI-driven irrigation recommendations',
      color: '#06b6d4',
      stats: '40% water saved'
    },
    {
      id: 'yield-prediction',
      icon: TrendingUp,
      title: 'Yield Prediction',
      description: 'Forecast crop yields using machine learning models and historical data',
      color: '#f59e0b',
      stats: '90% precision'
    },
    {
      id: 'soil-analysis',
      icon: Leaf,
      title: 'Soil Health Analysis',
      description: 'Comprehensive soil testing and nutrient recommendations',
      color: '#8b5cf6',
      stats: '15+ parameters'
    },
    {
      id: 'pest-detection',
      icon: Shield,
      title: 'Pest & Disease Detection',
      description: 'Early detection of pests and diseases using computer vision',
      color: '#ec4899',
      stats: 'Early warning'
    }
  ];

  const benefits = [
    { icon: TrendingUp, text: 'Increase crop yield by up to 30%' },
    { icon: Droplets, text: 'Reduce water consumption by 40%' },
    { icon: Zap, text: 'Optimize resource utilization' },
    { icon: BarChart3, text: 'Data-driven decision making' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #064e3b, #065f46, #047857)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '10%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>

      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '2rem 1rem'
      }}>
        {/* Hero Section */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'center',
          marginBottom: '4rem',
          paddingTop: '2rem'
        }}>
          {/* Icon */}
          <div style={{
            display: 'inline-flex',
            padding: '1.5rem',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderRadius: '24px',
            marginBottom: '2rem',
            border: '2px solid rgba(16, 185, 129, 0.3)',
            backdropFilter: 'blur(8px)'
          }}>
            <Sprout style={{ width: '60px', height: '60px', color: '#10b981' }} />
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: '1.5rem',
            lineHeight: '1.1'
          }}>
            Smart Agriculture Solutions
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.5rem',
            color: '#d1fae5',
            maxWidth: '800px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            Revolutionize your farming with AI-powered insights, precision agriculture, and data-driven decision making for sustainable growth
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleGoToDashboard}
              style={{
                padding: '1rem 2.5rem',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.3)';
              }}
            >
              <span>Go to Dashboard</span>
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </button>

            <button
              onClick={handleBackToDomains}
              style={{
                padding: '1rem 2.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Back to Domains
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {benefits.map((benefit, idx) => (
            <div key={idx} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <benefit.icon style={{ width: '24px', height: '24px', color: '#10b981' }} />
              </div>
              <span style={{ color: '#fff', fontSize: '1rem', fontWeight: '500' }}>
                {benefit.text}
              </span>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Powerful Features for Modern Farming
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feature) => {
              const Icon = feature.icon;
              const isHovered = hoveredFeature === feature.id;

              return (
                <div
                  key={feature.id}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: `2px solid ${isHovered ? feature.color : 'rgba(255, 255, 255, 0.2)'}`,
                    backdropFilter: 'blur(8px)',
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    transition: 'all 0.3s ease',
                    boxShadow: isHovered ? `0 20px 40px ${feature.color}33` : 'none'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      padding: '1rem',
                      backgroundColor: `${feature.color}22`,
                      borderRadius: '12px',
                      border: `1px solid ${feature.color}44`
                    }}>
                      <Icon style={{ width: '32px', height: '32px', color: feature.color }} />
                    </div>
                    <div style={{
                      backgroundColor: `${feature.color}22`,
                      color: feature.color,
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {feature.stats}
                    </div>
                  </div>

                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#fff',
                    marginBottom: '0.75rem'
                  }}>
                    {feature.title}
                  </h3>

                  <p style={{
                    color: '#d1fae5',
                    fontSize: '1rem',
                    lineHeight: '1.6'
                  }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action Footer */}
        <div style={{
          maxWidth: '1000px',
          margin: '5rem auto 2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '3rem',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(8px)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: '1rem'
          }}>
            Ready to Transform Your Farm?
          </h2>
          <p style={{
            color: '#d1fae5',
            fontSize: '1.125rem',
            marginBottom: '2rem'
          }}>
            Join thousands of farmers already using our AI-powered solutions to maximize yields and minimize costs
          </p>
          <button
            onClick={handleGoToDashboard}
            style={{
              padding: '1rem 3rem',
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.3)';
            }}
          >
            <span>Get Started Now</span>
            <ArrowRight style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}