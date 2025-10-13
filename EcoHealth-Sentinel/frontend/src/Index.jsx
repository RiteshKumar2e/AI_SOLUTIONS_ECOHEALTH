import { useState, useEffect } from 'react';
import { Sparkles, Heart, Leaf, Shield, ArrowRight, Brain, Users, Zap, LogIn } from 'lucide-react';
// Import the CSS file
import './landing-page.css';

// Your Existing Landing Page Component
const Landing = ({ onNavigate }) => {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  const solutions = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Healthcare AI",
      description: "Transforming patient care with predictive diagnostics and personalized treatment recommendations",
      color: "from-rose-500 to-pink-600"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Agriculture Tech",
      description: "Optimizing crop yields and resource management through intelligent farming solutions",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Environmental AI",
      description: "Monitoring and protecting ecosystems with advanced environmental analytics",
      color: "from-blue-500 to-cyan-600"
    },
  ];

  const features = [
    { icon: <Brain />, text: "Advanced Machine Learning" },
    { icon: <Shield />, text: "Security-First Architecture" },
    { icon: <Users />, text: "Real Social Impact" },
    { icon: <Zap />, text: "Efficient & Scalable" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Particle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white opacity-20 animate-float"
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

      {/* Mouse Follower Effect */}
      <div 
        className="fixed w-96 h-96 rounded-full pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: `${mousePosition.x - 192}px`,
          top: `${mousePosition.y - 192}px`,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />

      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            EcoHealth Sentinel
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-white/80">Welcome, {user.name}!</span>
              {user.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Admin Dashboard
                </button>
              )}
              <button
                onClick={() => {
                  sessionStorage.removeItem('user');
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105"
            >
              Sign In <LogIn className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
            style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)`, top: '10%', left: '10%' }}
          />
          <div 
            className="absolute w-96 h-96 bg-pink-600/30 rounded-full blur-3xl"
            style={{ transform: `translate(${-scrollY * 0.08}px, ${scrollY * 0.12}px)`, bottom: '20%', right: '10%' }}
          />
          <div 
            className="absolute w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"
            style={{ transform: `translate(${scrollY * 0.05}px, ${-scrollY * 0.1}px)`, top: '50%', left: '50%' }}
          />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white/90 text-sm">AI-Powered Innovation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            EcoHealth Sentinel – AI for<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Sustainable Agriculture & Community Health
            </span>
          </h1>
          
          <p className="text-xl text-white/70 mb-10 max-w-3xl mx-auto">
            Empowering communities with responsible AI solutions for healthcare, agriculture, and environmental sustainability
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/50">
              Explore Solutions
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300">
              Learn More
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="text-purple-400">{feature.icon}</div>
                <span className="text-white/90 text-sm font-medium text-center">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Solutions</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Comprehensive AI applications designed to solve real-world challenges
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, idx) => (
              <div 
                key={idx} 
                className="group relative p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105"
                onMouseEnter={() => setActiveSection(idx)}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${solution.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {solution.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">{solution.title}</h3>

                <p className="text-white/60 leading-relaxed">{solution.description}</p>

                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-10 blur-xl`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

// Login Component
const Login = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    
    const user = {
      name: email.split('@')[0],
      email,
      role: isAdmin ? 'admin' : 'user',
      token: 'mock-token-' + Date.now()
    };
    sessionStorage.setItem('user', JSON.stringify(user));
    onNavigate(isAdmin ? 'admin-dashboard' : 'home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
      
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-white/60">Sign in to your account</p>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="w-4 h-4 text-purple-600 bg-white/5 border-white/10 rounded focus:ring-purple-500"
            />
            <label htmlFor="isAdmin" className="ml-2 text-sm text-white/80">Login as Admin</label>
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/50"
          >
            Sign In
          </button>
        </div>
        
        <div className="mt-6 text-center space-y-3">
          <button
            onClick={() => onNavigate('forgot-password')}
            className="text-sm text-purple-400 hover:text-purple-300 transition"
          >
            Forgot Password?
          </button>
          <div>
            <span className="text-sm text-white/60">Don't have an account? </span>
            <button
              onClick={() => onNavigate('register')}
              className="text-sm text-purple-400 hover:text-purple-300 font-medium transition"
            >
              Register
            </button>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="text-sm text-white/60 hover:text-white/80 transition block w-full"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

// Register Component
const Register = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    const user = {
      name,
      email,
      role: 'user',
      token: 'mock-token-' + Date.now()
    };
    sessionStorage.setItem('user', JSON.stringify(user));
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
      
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-white/60">Join EcoHealth Sentinel today</p>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
          
          <button
            onClick={handleRegister}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/50"
          >
            Create Account
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <span className="text-sm text-white/60">Already have an account? </span>
          <button
            onClick={() => onNavigate('login')}
            className="text-sm text-purple-400 hover:text-purple-300 font-medium transition"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

// Forgot Password Component
const ForgotPassword = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
      
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-white/60">We'll send you reset instructions</p>
        </div>
        
        {!sent ? (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
            
            <button
              onClick={handleReset}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/50"
            >
              Send Reset Link
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
              <p className="text-green-300">Reset link sent to {email}</p>
            </div>
            <button
              onClick={() => onNavigate('login')}
              className="text-purple-400 hover:text-purple-300 font-medium transition"
            >
              Back to Login
            </button>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('login')}
            className="text-sm text-white/60 hover:text-white/80 transition"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ onNavigate, currentPage }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const menuItems = [
    { name: 'Dashboard', route: 'admin-dashboard', icon: '📊' },
    { name: 'Users', route: 'admin-users', icon: '👥' },
    { name: 'Analytics', route: 'admin-analytics', icon: '📈' },
    { name: 'Reports', route: 'admin-reports', icon: '📄' },
    { name: 'Access Control', route: 'admin-access', icon: '🔐' }
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'admin-users':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap">john@example.com</td>
                    <td className="px-6 py-4 whitespace-nowrap">User</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Jane Smith</td>
                    <td className="px-6 py-4 whitespace-nowrap">jane@example.com</td>
                    <td className="px-6 py-4 whitespace-nowrap">User</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'admin-analytics':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                <div className="h-48 flex items-end space-x-2">
                  {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                    <div key={i} className="flex-1 bg-purple-500 rounded-t" style={{height: `${height}%`}}></div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Page Views</span>
                    <span className="font-bold">12,543</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sessions</span>
                    <span className="font-bold">8,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bounce Rate</span>
                    <span className="font-bold">42%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'admin-reports':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports</h2>
            <div className="space-y-4">
              {['Monthly Report - September 2025', 'Quarterly Report - Q3 2025', 'Annual Report - 2024'].map((report, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{report}</h3>
                    <p className="text-sm text-gray-500">Generated {i + 1} days ago</p>
                  </div>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Download</button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'admin-access':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Access Control</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Role Permissions</h3>
              <div className="space-y-4">
                {['Admin', 'Manager', 'User'].map((role, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{role}</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Read</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Write</span>
                      {i === 0 && <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">Delete</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-blue-900">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">1,234</p>
                <p className="text-sm text-blue-700 mt-1">↑ 12% from last month</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-green-900">Active Sessions</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">567</p>
                <p className="text-sm text-green-700 mt-1">↑ 8% from last month</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-purple-900">Reports</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">89</p>
                <p className="text-sm text-purple-700 mt-1">↓ 3% from last month</p>
              </div>
            </div>
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {['New user registered', 'Report generated', 'Settings updated', 'User role changed'].map((activity, i) => (
                  <div key={i} className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">{activity}</span>
                    <span className="text-gray-400 ml-auto">{i + 1}h ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">{user?.name}</p>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.route}
              onClick={() => onNavigate(item.route)}
              className={`w-full text-left px-6 py-3 hover:bg-white/10 flex items-center space-x-3 transition ${
                currentPage === item.route ? 'bg-white/10 border-l-4 border-purple-500' : ''
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
          <button
            onClick={() => onNavigate('home')}
            className="w-full text-left px-6 py-3 hover:bg-white/10 flex items-center space-x-3 mt-4 border-t border-white/10"
          >
            <span>🏠</span>
            <span>Back to Home</span>
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('user');
              onNavigate('login');
            }}
            className="w-full text-left px-6 py-3 hover:bg-white/10 flex items-center space-x-3 text-red-400"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

// Main App Router
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(2) || 'home';
      setCurrentPage(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    
    const adminRoutes = ['admin-dashboard', 'admin-users', 'admin-analytics', 'admin-reports', 'admin-access'];
    
    if (!user && adminRoutes.includes(currentPage)) {
      navigate('login');
    } else if (user && user.role !== 'admin' && adminRoutes.includes(currentPage)) {
      navigate('home');
    }
  }, [currentPage]);

  const navigate = (page) => {
    setCurrentPage(page);
    window.location.hash = `#/${page}`;
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={navigate} />;
      case 'register':
        return <Register onNavigate={navigate} />;
      case 'forgot-password':
        return <ForgotPassword onNavigate={navigate} />;
      case 'admin-dashboard':
      case 'admin-users':
      case 'admin-analytics':
      case 'admin-reports':
      case 'admin-access':
        return <AdminDashboard onNavigate={navigate} currentPage={currentPage} />;
      default:
        return <Landing onNavigate={navigate} />;
    }
  };

  return renderPage();
}