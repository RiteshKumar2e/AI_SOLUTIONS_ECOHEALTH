import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Building, Phone, CheckCircle, X } from 'lucide-react';

export default function Register() {
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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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

  // MongoDB Save Function
  const saveToMongoDB = async (userData) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          email: userData.email,
          organization: userData.organization,
          phone: userData.phone,
          password: userData.password,
          role: userData.role,
          createdAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('MongoDB Error:', error);
      throw error;
    }
  };

  // Success Handler: Add user to global storage + Show Popup
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

    // Show success popup
    setShowSuccessPopup(true);

    // Auto-redirect after 3 seconds
    setTimeout(() => {
      window.location.href = '/auth/dashboard';
    }, 3000);
  };

  // Submit Handler
  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { 
      setErrors(newErrors); 
      return; 
    }
    setIsLoading(true);

    try {
      // Save to MongoDB
      await saveToMongoDB(formData);
      
      console.log('Register data:', formData);
      setIsLoading(false);

      // Call Success handler
      handleRegisterSuccess(formData);
    } catch (error) {
      setIsLoading(false);
      setErrors({ submit: 'Registration failed. Please try again.' });
    }
  };

  const closePopup = () => {
    setShowSuccessPopup(false);
    window.location.href = '/auth/dashboard';
  };

  const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' },
    card: { width: '100%', maxWidth: '800px', backgroundColor: 'rgba(30,41,59,0.9)', borderRadius: '20px', padding: '2.5rem', border: '1px solid #334155', backdropFilter: 'blur(12px)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
    label: { display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: '500' },
    input: (hasError) => ({ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: `1px solid ${hasError ? '#f87171' : '#475569'}`, backgroundColor: 'rgba(51,65,85,0.5)', color: '#fff', fontSize: '0.875rem', outline: 'none', transition: 'all 0.2s' }),
    error: { display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', color: '#f87171', fontSize: '0.75rem' },
    button: { width: '100%', padding: '0.875rem', borderRadius: '10px', backgroundColor: '#8b5cf6', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.3s' },
    checkboxLabel: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', color: '#cbd5e1', fontSize: '0.875rem' },
    select: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: 'rgba(51,65,85,0.5)', color: '#fff', fontSize: '0.875rem', outline: 'none' },
    footer: { textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.8rem' },
    gridMd: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' },
    icon: { position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
    passwordButton: { position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem', transition: 'all 0.2s' },
    
    // Popup Styles
    popupOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.3s ease-out'
    },
    popupContent: {
      backgroundColor: 'rgba(30,41,59,0.98)',
      borderRadius: '24px',
      padding: '3rem 2.5rem',
      maxWidth: '480px',
      width: '90%',
      textAlign: 'center',
      border: '1px solid #334155',
      position: 'relative',
      boxShadow: '0 25px 80px rgba(139, 92, 246, 0.3)',
      animation: 'slideUp 0.4s ease-out'
    },
    popupClose: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'rgba(148, 163, 184, 0.1)',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '8px',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    successIcon: {
      width: '80px',
      height: '80px',
      margin: '0 auto 1.5rem',
      padding: '1.5rem',
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'scaleIn 0.5s ease-out'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo/Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', padding: '1.25rem', backgroundColor: 'rgba(139,92,246,0.2)', borderRadius: '20px', marginBottom: '1rem', border: '1px solid rgba(139,92,246,0.3)' }}>
            <User style={{ width: '48px', height: '48px', color: '#c084fc' }} />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>Create Your Account</h1>
          <p style={{ color: '#94a3b8' }}>Join us in building responsible AI solutions</p>
        </div>

        {/* FORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
              <option value="user">Select Option</option>
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
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} style={{ marginTop: '0.25rem', width: '16px', height: '16px', borderRadius: '4px', border: errors.agreeToTerms ? '1px solid #f87171' : '1px solid #475569', backgroundColor: 'rgba(51,65,85,0.5)', cursor: 'pointer' }} />
              <span>I agree to the <a href="#" style={{ color: '#c084fc', textDecoration: 'none' }}>Terms of Service</a> and <a href="#" style={{ color: '#c084fc', textDecoration: 'none' }}>Privacy Policy</a></span>
            </label>
            {errors.agreeToTerms && <div style={styles.error}><AlertCircle style={{ width: '12px', height: '12px' }} />{errors.agreeToTerms}</div>}
          </div>

          {/* Submit Error */}
          {errors.submit && <div style={{ ...styles.error, justifyContent: 'center', fontSize: '0.875rem' }}><AlertCircle style={{ width: '16px', height: '16px' }} />{errors.submit}</div>}

          {/* Submit */}
          <button type="button" onClick={handleSubmit} disabled={isLoading} style={{ ...styles.button, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
            {isLoading ? (
              <> 
                <div style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div> 
                <span>Creating account...</span> 
              </>
            ) : (
              <> 
                <span>Create Account</span> 
                <ArrowRight style={{ width: '20px', height: '20px' }} /> 
              </>
            )}
          </button>
        </div>

        {/* Sign In */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
          Already have an account? <a href="/auth/login" style={{ color: '#c084fc', textDecoration: 'none', fontWeight: '500' }}>Sign in</a>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p>© 2025 AI Solutions. All rights reserved.</p>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupContent}>
            <button onClick={closePopup} style={styles.popupClose} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.2)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.1)'}>
              <X style={{ width: '24px', height: '24px' }} />
            </button>
            
            <div style={styles.successIcon}>
              <CheckCircle style={{ width: '48px', height: '48px', color: '#22c55e' }} />
            </div>

            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
              Registration Successful! 🎉
            </h2>
            
            <p style={{ color: '#94a3b8', marginBottom: '0.5rem', lineHeight: '1.6', fontSize: '1rem' }}>
              Thank you for registering,
            </p>
            <p style={{ color: '#c084fc', fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              {formData.fullName}!
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Your account has been created successfully and saved to our database.
            </p>

            <div style={{ backgroundColor: 'rgba(139,92,246,0.1)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%', animation: 'pulse 2s ease-in-out infinite' }}></div>
                <p style={{ color: '#22c55e', fontSize: '0.875rem', fontWeight: '500' }}>
                  Saved to MongoDB
                </p>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                Redirecting to dashboard in 3 seconds...
              </p>
            </div>

            <button 
              onClick={closePopup}
              style={{
                width: '100%',
                padding: '0.875rem',
                borderRadius: '10px',
                backgroundColor: '#8b5cf6',
                color: '#fff',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7c3aed';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#8b5cf6';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>Go to Dashboard Now</span>
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from { 
            transform: scale(0.8);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
        
        input:focus, select:focus {
          border-color: #8b5cf6 !important;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }
        
        button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}