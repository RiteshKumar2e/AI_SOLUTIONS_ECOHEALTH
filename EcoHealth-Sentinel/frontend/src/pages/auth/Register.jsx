import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Building, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.organization.trim()) newErrors.organization = 'Organization is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    return newErrors;
  };

  // Success Handler: Add user to global storage + Navigate Dashboard
  const handleRegisterSuccess = async (userData) => {
    if (window.UserStorage) {
      window.UserStorage.addUser({
        id: Date.now(),
        name: userData.fullName,
        email: userData.email,
        role: userData.role,
        domain: userData.organization,
        phone: userData.phone || '',
        location: userData.location || '',
        projects: 0,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
      });
    }

    // Go to dashboard
    navigate('/Users');
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { 
      setErrors(newErrors); 
      return; 
    }
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Register data:', formData);
      setIsLoading(false);

      // Call Success handler
      handleRegisterSuccess(formData);
    }, 2000);
  };

  const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#1e293b' },
    card: { width: '100%', maxWidth: '800px', backgroundColor: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '2rem', border: '1px solid #334155', backdropFilter: 'blur(8px)' },
    label: { display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' },
    input: (hasError) => ({ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: `1px solid ${hasError ? '#f87171' : '#475569'}`, backgroundColor: 'rgba(51,65,85,0.5)', color: '#fff' }),
    error: { display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', color: '#f87171', fontSize: '0.75rem' },
    button: { width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#8b5cf6', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' },
    checkboxLabel: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', color: '#cbd5e1', fontSize: '0.875rem' },
    select: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #4c6947ff', backgroundColor: 'rgba(51,65,85,0.5)', color: '#fff' },
    footer: { textAlign: 'center', marginTop: '1.5rem', color: '#cbd5e1', fontSize: '0.8rem' },
    grid: { display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' },
    gridMd: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' },
    icon: { position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
    passwordButton: { position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo/Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', padding: '1rem', backgroundColor: 'rgba(139,92,246,0.2)', borderRadius: '16px', marginBottom: '1rem' }}>
            <User style={{ width: '48px', height: '48px', color: '#c084fc' }} />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>Create Your Account</h1>
          <p style={{ color: '#94a3b8' }}>Join us in building responsible AI solutions</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Full Name & Email */}
          <div style={styles.gridMd}>
            <div>
              <label htmlFor="fullName" style={styles.label}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User style={styles.icon} />
                <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter Full Name" style={styles.input(errors.fullName)} />
              </div>
              {errors.fullName && <div style={styles.error}><AlertCircle style={{ width: '12px', height: '12px' }} />{errors.fullName}</div>}
            </div>

            <div>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={styles.icon} />
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email id" style={styles.input(errors.email)} />
              </div>
              {errors.email && <div style={styles.error}><AlertCircle style={{ width: '12px', height: '12px' }} />{errors.email}</div>}
            </div>
          </div>

          {/* Organization & Phone */}
          <div style={styles.gridMd}>
            <div>
              <label htmlFor="organization" style={styles.label}>Organization</label>
              <div style={{ position: 'relative' }}>
                <Building style={styles.icon} />
                <input type="text" id="organization" name="organization" value={formData.organization} onChange={handleChange} placeholder="Your company/org" style={styles.input(errors.organization)} />
              </div>
              {errors.organization && <div style={styles.error}><AlertCircle style={{ width: '12px', height: '12px' }} />{errors.organization}</div>}
            </div>
            <div>
              <label htmlFor="phone" style={styles.label}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone style={styles.icon} />
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 xxxxxxxxx" style={styles.input(false)} />
              </div>
            </div>
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" style={styles.label}>Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} style={styles.select}>
              <option value="Select Option">Select Option</option>
              <option value="healthcare">Healthcare Specialist</option>
              <option value="agriculture">Agriculture Expert</option>
              <option value="environment">Environmental Scientist</option>
              <option value="education">Education Coordinator</option>
              <option value="researcher">Researcher</option>
            </select>
          </div>

          {/* Password & Confirm */}
          <div style={styles.gridMd}>
            <div>
              <label htmlFor="password" style={styles.label}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={styles.icon} />
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create password" style={{ ...styles.input(errors.password), paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.passwordButton}>
                  {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
                </button>
              </div>
              {errors.password && <div style={styles.error}><AlertCircle style={{ width: '12px', height: '12px' }} />{errors.password}</div>}
            </div>

            <div>
              <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={styles.icon} />
                <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" style={{ ...styles.input(errors.confirmPassword), paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.passwordButton}>
                  {showConfirmPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
                </button>
              </div>
              {errors.confirmPassword && <div style={styles.error}><AlertCircle style={{ width: '12px', height: '12px' }} />{errors.confirmPassword}</div>}
            </div>
          </div>

          {/* Terms */}
          <div>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} style={{ marginTop: '0.25rem', width: '16px', height: '16px', borderRadius: '4px', border: errors.agreeToTerms ? '1px solid #f87171' : '1px solid #475569', backgroundColor: 'rgba(51,65,85,0.5)' }} />
              <span>I agree to the <a href="#" style={{ color: '#c084fc' }}>Terms of Service</a> and <a href="#" style={{ color: '#c084fc' }}>Privacy Policy</a></span>
            </label>
            {errors.agreeToTerms && <div style={styles.error}><AlertCircle style={{ width: '12px', height: '12px' }} />{errors.agreeToTerms}</div>}
          </div>

          {/* Submit */}
          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? <> <div style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div> <span>Creating account...</span> </> : <> <span>Create Account</span> <ArrowRight style={{ width: '20px', height: '20px' }} /> </>}
          </button>
        </form>

        {/* Sign In */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/auth/login" style={{ color: '#c084fc' }}>Sign in</Link>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p>© 2025 AI Solutions. All rights reserved.</p>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
