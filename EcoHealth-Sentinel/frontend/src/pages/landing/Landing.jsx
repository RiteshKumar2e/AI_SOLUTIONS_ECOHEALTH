import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Heart,
  Leaf,
  Shield,
  ArrowRight,
  Brain,
  Users,
  Zap,
  X,
  Target,
  Award,
  Globe,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Github,
  ArrowUp,
  ChevronDown,
  CheckCircle,
  Star,
  BarChart3,
  Activity,
  Database,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './landing-page.css';

// EcoHealth Sentinel Logo Component
function EcoHealthLogo() {
  return (
    <div
      className="ecohealth-logo"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #22c55e, #3b82f6 80%)',
          position: 'relative',
          boxShadow:
            '0 0 12px rgba(59,130,246,0.4), inset 0 0 10px rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="28"
          height="28"
          style={{
            fill: 'none',
            stroke: 'white',
            strokeWidth: 2,
            filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.7))',
          }}
        >
          <path
            d="M32 6C42 10 54 14 54 26C54 40 32 58 32 58S10 40 10 26C10 14 22 10 32 6Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 30C28 24 36 22 40 28C42 32 38 38 32 40C28 41 26 38 26 34"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow:
              '0 0 12px rgba(34,197,94,0.4), 0 0 20px rgba(59,130,246,0.3)',
          }}
        ></div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          lineHeight: '1.2',
        }}
      >
        <span
          style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            background: 'linear-gradient(to right, #22c55e, #3b82f6)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          EcoHealth
        </span>
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'rgba(200,220,255,0.8)',
            letterSpacing: '1px',
          }}
        >
          Sentinel
        </span>
      </div>
    </div>
  );
}

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSolution, setActiveSolution] = useState(null);
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const solutionsRef = useRef(null);
  const goalsRef = useRef(null);
  const teamRef = useRef(null);
  const contactRef = useRef(null);

  // Scroll animation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse glow movement
  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle generation
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  // Close modal on ESC key and prevent body scroll
// Close modal function
const closeModal = () => {
  setActiveSolution(null);
};

useEffect(() => {
  if (activeSolution) {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Close on ESC key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      // Cleanup: restore body scroll and remove event listener
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEscape);
    };
  }
}, [activeSolution, closeModal]); // include closeModal in deps

// Smooth scroll functions
const scrollToSection = (ref) => {
  ref.current?.scrollIntoView({ behavior: 'smooth' });
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};


  // UPDATED SOLUTIONS ARRAY WITH DETAILED INFO
  const solutions = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Healthcare AI',
      description: 'Transforming patient care with predictive diagnostics and personalized treatment recommendations',
      color: 'from-rose-500 to-pink-600',
      stats: '10K+ Patients Helped',
      domain: 'Healthcare & Medical Technology',
      fullDescription: 'Our Healthcare AI solution leverages advanced machine learning algorithms to provide early disease detection, personalized treatment plans, and real-time health monitoring. We use predictive analytics to identify health risks before they become critical, enabling healthcare providers to deliver proactive care.',
      features: [
        'AI-powered disease prediction and early detection',
        'Personalized treatment recommendations based on patient history',
        'Real-time health monitoring and alerts',
        'Integration with existing healthcare systems',
        'HIPAA-compliant data security'
      ],
      impact: 'Reduced diagnosis time by 60%, improved treatment accuracy by 45%'
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Agriculture Tech',
      description: 'Optimizing crop yields and resource management through intelligent farming solutions',
      color: 'from-green-500 to-emerald-600',
      stats: '5K+ Farms Optimized',
      domain: 'Smart Agriculture & Precision Farming',
      fullDescription: 'Our Agriculture Tech platform uses AI and IoT sensors to provide farmers with actionable insights for crop management, soil health monitoring, and weather prediction. By analyzing soil conditions, weather patterns, and crop health in real-time, we help farmers maximize yields while minimizing resource waste.',
      features: [
        'Soil health analysis and nutrient recommendations',
        'Weather prediction and crop cycle planning',
        'Pest and disease detection using computer vision',
        'Water usage optimization and irrigation scheduling',
        'Market price prediction for better crop planning'
      ],
      impact: 'Increased crop yields by 40%, reduced water usage by 30%'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Environmental AI',
      description: 'Monitoring and protecting ecosystems with advanced environmental analytics',
      color: 'from-blue-500 to-cyan-600',
      stats: '100+ Projects Active',
      domain: 'Environmental Monitoring & Conservation',
      fullDescription: 'Our Environmental AI platform monitors air quality, water pollution, deforestation, and biodiversity changes in real-time. Using satellite imagery, IoT sensors, and predictive models, we help governments and organizations make data-driven decisions for environmental protection and sustainability.',
      features: [
        'Real-time air and water quality monitoring',
        'Deforestation tracking using satellite imagery',
        'Wildlife population monitoring and habitat analysis',
        'Carbon footprint tracking and reduction strategies',
        'Early warning system for environmental hazards'
      ],
      impact: 'Monitoring 500+ ecosystems, prevented 20+ environmental disasters'
    }
  ];

  const features = [
    { icon: <Brain />, text: 'Advanced Machine Learning' },
    { icon: <Shield />, text: 'Security-First Architecture' },
    { icon: <Users />, text: 'Real Social Impact' },
    { icon: <Zap />, text: 'Efficient & Scalable' }
  ];

  const goals = [
    {
      icon: <Target />,
      title: 'Sustainable Agriculture',
      description: 'Empower 1 million farmers with AI-driven insights by 2030',
      progress: 65
    },
    {
      icon: <Heart />,
      title: 'Healthcare Access',
      description: 'Provide AI diagnostics to underserved communities',
      progress: 78
    },
    {
      icon: <Globe />,
      title: 'Environmental Protection',
      description: 'Monitor and preserve 500+ ecosystems globally',
      progress: 82
    },
    {
      icon: <Award />,
      title: 'Research Excellence',
      description: 'Publish 100+ research papers on sustainable AI',
      progress: 45
    }
  ];

  const team = [
  {
    name: 'Ritesh Kumar',
    role: 'Software Engineer | AI & ML Enthusiast',
    image: '🧑‍💻',
    linkedin: 'https://www.linkedin.com/in/ritesh-kumar-b3a654253',
    bio: 'B.Tech CSE (AI & ML) student | Experienced in React, SQL | Passionate about AI, ML, and full-stack development'
  },
  {
    name: 'Devanshu Mahato',
    role: 'Frontend Developer | Tech Enthusiast',
    image: '🧑‍💻',
    linkedin: 'linkedin.com/in/devanshu-mahato-67653b294',
    bio: 'Passionate about exploring new technologies | Skilled in Python, Java, HTML, CSS'
  }
];


  const stats = [
    { icon: <Users />, value: '10K+', label: 'Active Users' },
    { icon: <Globe />, value: '25+', label: 'Countries' },
    { icon: <TrendingUp />, value: '95%', label: 'Success Rate' },
    { icon: <Award />, value: '15+', label: 'Awards Won' }
  ];

  const testimonials = [
    {
      name: 'Ramesh Singh',
      role: 'Farmer, Bihar',
      text: 'EcoHealth Sentinel increased my crop yield by 40% using AI predictions. Life-changing!',
      rating: 5
    },
    {
      name: 'Dr. Anjali Mehta',
      role: 'Hospital Director',
      text: 'The AI diagnostics helped us identify diseases 3 weeks earlier. Saved many lives.',
      rating: 5
    },
    {
      name: 'Vikram Rao',
      role: 'Environmental Officer',
      text: 'Best environmental monitoring system. Real-time alerts prevented major disasters.',
      rating: 5
    }
  ];

  return (
    <div className="landing-container">
      {/* Particle background */}
      <div className="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Mouse Glow */}
      <div
        className="mouse-glow"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`
        }}
      />

      {/* Header */}
      <header className="landing-header">
        <EcoHealthLogo />

        <nav className="nav-links">
          <button onClick={() => scrollToSection(heroRef)}>Home</button>
          <button onClick={() => scrollToSection(aboutRef)}>About</button>
          <button onClick={() => scrollToSection(solutionsRef)}>Solutions</button>
          <button onClick={() => scrollToSection(goalsRef)}>Goals</button>
          <button onClick={() => scrollToSection(teamRef)}>Team</button>
          <button onClick={() => scrollToSection(contactRef)}>Contact</button>
        </nav>

        <div className="auth-buttons">
          {!showLoginOptions ? (
            <button
              className="btn-signin btn-primary"
              onClick={() => setShowLoginOptions(true)}
            >
              Sign In
            </button>
          ) : (
            <>
              <button className="btn-user" onClick={() => navigate('/auth/login')}>
                User
              </button>
              <button className="btn-admin" onClick={() => navigate('/admin/login')}>
                Admin
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-background">
          <div
            className="gradient-orb orb-1"
            style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)` }}
          ></div>
          <div
            className="gradient-orb orb-2"
            style={{ transform: `translate(${-scrollY * 0.08}px, ${scrollY * 0.12}px)` }}
          ></div>
          <div
            className="gradient-orb orb-3"
            style={{ transform: `translate(${scrollY * 0.05}px, ${-scrollY * 0.1}px)` }}
          ></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Innovation</span>
          </div>

          <h1 className="hero-title">
            EcoHealth Sentinel – AI for Sustainable Agriculture & Community Health
          </h1>

          <p className="hero-subtitle">
            Bridging technology and sustainability to create a healthier planet and thriving communities
          </p>

          <div className="hero-cta">
            <button
              className="btn-primary"
              onClick={() => scrollToSection(solutionsRef)}
            >
              Explore Solutions
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              className="btn-secondary"
              onClick={() => scrollToSection(aboutRef)}
            >
              Learn More
            </button>
          </div>

          <div className="features-grid-mini">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-mini">
                {feature.icon}
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="scroll-indicator" onClick={() => scrollToSection(aboutRef)}>
          <ChevronDown className="w-6 h-6" />
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section ref={aboutRef} className="about-section">
        <div className="section-header">
          <h2 className="section-title">About EcoHealth Sentinel</h2>
          <p className="section-subtitle">
            Pioneering AI solutions for sustainable development and community wellness
          </p>
        </div>

        <div className="about-content">
          <div className="about-text">
            <h3>Our Mission</h3>
            <p>
              EcoHealth Sentinel was founded with a singular vision: to harness the power of artificial 
              intelligence for the betterment of agriculture, healthcare, and environmental conservation. 
              We believe technology should serve humanity and our planet.
            </p>
            <p>
              By combining cutting-edge AI with deep domain expertise, we create solutions that are not 
              just innovative, but truly impactful. From helping farmers optimize their yields to enabling 
              early disease detection in remote areas, our work touches lives every day.
            </p>
            
            <div className="about-values">
              <div className="value-item">
                <CheckCircle className="w-6 h-6" style={{ color: '#22c55e' }} />
                <div>
                  <h4>Innovation</h4>
                  <p>Pushing boundaries with advanced AI research</p>
                </div>
              </div>
              <div className="value-item">
                <CheckCircle className="w-6 h-6" style={{ color: '#22c55e' }} />
                <div>
                  <h4>Sustainability</h4>
                  <p>Environmental responsibility in every solution</p>
                </div>
              </div>
              <div className="value-item">
                <CheckCircle className="w-6 h-6" style={{ color: '#22c55e' }} />
                <div>
                  <h4>Impact</h4>
                  <p>Measurable positive change in communities</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-image">
            <div className="about-card">
              <BarChart3 className="w-16 h-16" style={{ color: '#3b82f6' }} />
              <h4>Data-Driven Decisions</h4>
              <p>Processing millions of data points daily to provide actionable insights</p>
            </div>
            <div className="about-card">
              <Activity className="w-16 h-16" style={{ color: '#22c55e' }} />
              <h4>Real-Time Monitoring</h4>
              <p>24/7 surveillance of crops, health metrics, and environmental factors</p>
            </div>
            <div className="about-card">
              <Lock className="w-16 h-16" style={{ color: '#8b5cf6' }} />
              <h4>Privacy First</h4>
              <p>End-to-end encryption and ethical AI practices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section ref={solutionsRef} className="solutions-section">
        <div className="section-header">
          <h2 className="section-title">Our Solutions</h2>
          <p className="section-subtitle">
            Comprehensive AI applications designed to solve real-world challenges
          </p>
        </div>

        <div className="solutions-grid">
          {solutions.map((solution, idx) => (
            <div
              key={idx}
              className="solution-card"
              onMouseEnter={() => setActiveSection(idx)}
            >
              <div className={`solution-icon bg-gradient-to-br ${solution.color}`}>
                {solution.icon}
              </div>
              <h3 className="solution-title">{solution.title}</h3>
              <p className="solution-description">{solution.description}</p>
              <div className="solution-stats">{solution.stats}</div>
              <button
                className="solution-btn"
                onClick={() => setActiveSolution(solution)}
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </button>
              <div className="card-glow"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Goals Section */}
      <section ref={goalsRef} className="goals-section">
        <div className="section-header">
          <h2 className="section-title">Our Goals</h2>
          <p className="section-subtitle">
            Ambitious targets driving our mission forward
          </p>
        </div>

        <div className="goals-grid">
          {goals.map((goal, idx) => (
            <div key={idx} className="goal-card">
              <div className="goal-icon">{goal.icon}</div>
              <h3 className="goal-title">{goal.title}</h3>
              <p className="goal-description">{goal.description}</p>
              <div className="goal-progress">
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <span className="progress-label">{goal.progress}% Complete</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">What People Say</h2>
          <p className="section-subtitle">
            Real stories from real users making real impact
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="testimonial-rating">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5" style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div>
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="team-section">
        <div className="section-header">
          <h2 className="section-title">About Team</h2>
          <p className="section-subtitle">
            Brilliant minds working together to change the world
          </p>
        </div>

        <div className="team-grid">
          {team.map((member, idx) => (
            <div key={idx} className="team-card">
              <div className="team-avatar">{member.image}</div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-bio">{member.bio}</p>
              <div className="team-social">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="contact-section">
        <div className="section-header">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Have questions? We'd love to hear from you
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <Mail className="w-6 h-6" />
              <div>
                <h4>Email</h4>
                <p>riteshkumar90359@gmail.com</p>
              </div>
            </div>
            <div className="contact-item">
              <Phone className="w-6 h-6" />
              <div>
                <h4>Phone</h4>
                <p>+91 6206269895</p>
              </div>
            </div>
            <div className="contact-item">
              <MapPin className="w-6 h-6" />
              <div>
                <h4>Address</h4>
                <p>Jamshedpur, Jharkhand, India 832108</p>
              </div>
            </div>
          </div>

          <form
            className="contact-form"
            action="https://formspree.io/f/mqadrblr"
            method="POST"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="form-input"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="form-input"
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="form-input"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              className="form-input"
              required
            ></textarea>

            <button type="submit" className="btn-primary">
              Send Message
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <EcoHealthLogo />
            <p>AI-powered solutions for a sustainable future</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#">About Us</a>
            <a href="#">Solutions</a>
            <a href="#">Goals</a>
            <a href="#">Team</a>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <Linkedin className="w-5 h-5" />
              <Twitter className="w-5 h-5" />
              <Github className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 EcoHealth Sentinel. All rights reserved.</p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Sign In Popup */}
      {showSignInPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <button className="popup-close" onClick={() => setShowSignInPopup(false)}>
              <X className="w-5 h-5" />
            </button>
            <h3>Sign In Required</h3>
            <p>To explore our advanced AI solutions, please sign in first.</p>
            <div className="popup-actions">
              <button
                className="btn-primary"
                onClick={() => navigate('/auth/login')}
              >
                Sign In
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowSignInPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOLUTION DETAILS MODAL - ENHANCED & FIXED */}
      {activeSolution && (
        <div 
          className="popup-overlay" 
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className="popup-card-large" 
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <button
              className="popup-close"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              aria-label="Close modal"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className={`popup-header bg-gradient-to-br ${activeSolution.color}`}>
              <div className="popup-icon-large">{activeSolution.icon}</div>
            </div>
            
            <div className="popup-content">
              <h3 id="modal-title" className="popup-title">
                {activeSolution.title}
              </h3>
              <p className="popup-domain">{activeSolution.domain}</p>
              
              <p className="popup-full-description">
                {activeSolution.fullDescription}
              </p>
              
              <div className="popup-features">
                <h4>Key Features</h4>
                <ul>
                  {activeSolution.features.map((feature, idx) => (
                    <li key={idx}>
                      <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="popup-impact">
                <TrendingUp className="w-5 h-5" />
                <strong>Impact:</strong> {activeSolution.impact}
              </div>
              
              <div className="popup-stats-large">{activeSolution.stats}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
