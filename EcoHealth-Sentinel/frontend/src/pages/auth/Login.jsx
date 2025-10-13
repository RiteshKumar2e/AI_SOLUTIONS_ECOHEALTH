import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ✅ Success handler (common for email & Google login)
  const handleLoginSuccess = async (userData) => {
    if (window.UserStorage) {
      window.UserStorage.addUser({
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'Team Member',
        domain: userData.domain || 'General',
        phone: userData.phone || '',
        location: userData.location || '',
        projects: 0,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase()
      });
    }
    // ✅ Redirect to Dashboard
    navigate('/auth/dashboard');
  };

  // Validate email/password
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    return newErrors;
  };

  // Handle email/password submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      console.log('Login data:', formData);
      // Fake user data (replace with API response later)
      handleLoginSuccess({
        name: formData.email.split('@')[0],
        email: formData.email,
      });
      setIsLoading(false);
    }, 1500);
  };

  // Google login
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google login successful:', tokenResponse);
      // Replace with real user data from backend
      handleLoginSuccess({
        name: 'Google User',
        email: 'googleuser@example.com',
      });
    },
    onError: () => {
      console.log('Google login failed');
    }
  });

  // Inline styles
  const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'linear-gradient(to bottom right, #1e293b, #0f172a)' },
    card: { width: '100%', maxWidth: '600px', backgroundColor: 'rgba(50, 60, 80, 0.8)', borderRadius: '16px', padding: '2rem', border: '1px solid #334155', backdropFilter: 'blur(8px)' },
    label: { display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#cbd5e1' },
    input: (hasError) => ({ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: `1px solid ${hasError ? '#f87171' : '#475569'}`, backgroundColor: 'rgba(51, 65, 85, 0.5)', color: '#fff' }),
    error: { display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', color: '#f87171', fontSize: '0.8rem' },
    button: { width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#3b82f6', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' },
    link: { color: '#60a5fa', textDecoration: 'none' },
    dividerContainer: { display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' },
    dividerLine: { flex: 1, height: '1px', backgroundColor: '#475569' },
    socialButton: { width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#334155', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' },
    footer: { textAlign: 'center', marginTop: '1.5rem', color: '#cbd5e1', fontSize: '0.8rem' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: '16px', marginBottom: '1rem' }}>
            <Lock style={{ width: '48px', height: '48px', color: '#60a5fa' }} />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: '#94a3b8' }}>Sign in to access your AI solutions dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Email */}
          <div>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={styles.input(errors.email)}
              />
            </div>
            {errors.email && <div style={styles.error}><AlertCircle style={{ width: '16px', height: '16px' }} />{errors.email}</div>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" style={styles.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{ ...styles.input(errors.password), paddingRight: '3rem' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
              </button>
            </div>
            {errors.password && <div style={styles.error}><AlertCircle style={{ width: '16px', height: '16px' }} />{errors.password}</div>}
          </div>

          {/* Remember & Forgot */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '16px', height: '16px' }} />
              <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>Remember me</span>
            </label>
            <Link to="/auth/forgot-password" style={styles.link}>Forgot password?</Link>
          </div>

          {/* Submit */}
          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? (
              <>
                <div style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </>
            )}
          </button>
        </form>

        {/* OR Divider */}
        <div style={styles.dividerContainer}>
          <div style={styles.dividerLine}></div>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>OR</span>
          <div style={styles.dividerLine}></div>
        </div>

        {/* Google Login */}
        <button style={styles.socialButton} onClick={() => googleLogin()}>
          <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Sign up */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Don't have an account? <Link to="/auth/register" style={styles.link}>Sign up</Link>
          </p>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p>© 2025 AI Solutions. All rights reserved.</p>
        </div>
      </div>

      {/* Spinner animation */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
