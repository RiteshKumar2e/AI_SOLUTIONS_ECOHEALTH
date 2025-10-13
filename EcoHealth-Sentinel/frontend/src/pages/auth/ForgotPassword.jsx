import { useState } from 'react';
import { Mail, ArrowRight, AlertCircle, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    if (e.preventDefault) e.preventDefault();
    if (!email) return setError('Email is required');
    if (!validateEmail(email)) return setError('Please enter a valid email address');

    setIsLoading(true);
    setError('');

    try {
      await emailjs.send(
        'service_7cdfbpu',      // Your EmailJS Service ID
        'template_xxti9xw',     // Your EmailJS Template ID
        { user_email: email },  // Must match template variable
        'opQ62Bt4yyh7VyL4I'     // Your EmailJS Public Key
      );
      setIsLoading(false);
      setEmailSent(true);
    } catch (err) {
      console.error(err);
      setError('Failed to send reset email. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResend = () => handleSubmit({ preventDefault: () => {} });

  const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'linear-gradient(to bottom right, #0f172a, #064e3b, #0f172a)' },
    card: { width: '100%', maxWidth: '550px', backgroundColor: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '2rem', border: '1px solid #334155', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' },
    input: (hasError) => ({ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: `1px solid ${hasError ? '#f87171' : '#475569'}`, backgroundColor: 'rgba(51,65,85,0.5)', color: '#fff' }),
    label: { display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' },
    icon: { position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
    error: { display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', color: '#f87171', fontSize: '0.875rem' },
    button: { width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'linear-gradient(to right, #10b981, #059669)', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' },
    infoBox: { backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '1rem', display: 'flex', gap: '0.75rem' },
    footer: { textAlign: 'center', marginTop: '1.5rem', color: '#cbd5e1', fontSize: '0.8rem' },
    resendButton: { color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' },
    link: { color: '#cbd5e1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }
  };

  if (emailSent) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: '1rem', backgroundColor: 'rgba(5,150,105,0.2)', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <CheckCircle style={{ width: '64px', height: '64px', color: '#34d399' }} />
            </div>
            <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Check Your Email</h1>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>We've sent password reset instructions to:</p>
            <p style={{ color: '#34d399', fontWeight: '600', marginBottom: '1rem' }}>{email}</p>

            <div style={{ backgroundColor: 'rgba(51,65,85,0.5)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Didn't receive the email? Check your spam folder or</p>
              <button style={styles.resendButton} onClick={handleResend} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Resend email'}
              </button>
            </div>

            <Link to="/auth/login" style={styles.link}>
              <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to login
            </Link>
          </div>

          <div style={styles.footer}>© 2025 AI Solutions. All rights reserved.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', padding: '1rem', backgroundColor: 'rgba(5,150,105,0.2)', borderRadius: '16px', marginBottom: '1rem' }}>
            <KeyRound style={{ width: '48px', height: '48px', color: '#34d399' }} />
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Forgot Password?</h1>
          <p style={{ color: '#94a3b8' }}>No worries, we'll send you reset instructions</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={styles.icon} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com"
                style={styles.input(error)}
              />
            </div>
            {error && <div style={styles.error}><AlertCircle style={{ width: '16px', height: '16px' }} />{error}</div>}
          </div>

          <div style={styles.infoBox}>
            <Mail style={{ width: '20px', height: '20px', color: '#34d399', marginTop: '2px' }} />
            <div>
              <h3 style={{ color: '#34d399', fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Reset Link Delivery</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>We'll send you a secure link to reset your password. The link will be valid for 1 hour.</p>
            </div>
          </div>

          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? (
              <>
                <div style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                Sending...
              </>
            ) : (
              <>
                Send Reset Link
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/auth/login" style={styles.link}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to login
          </Link>
        </div>

        <div style={{ marginTop: '1.5rem', backgroundColor: 'rgba(30,41,59,0.3)', borderRadius: '8px', padding: '1rem', border: '1px solid #334155', backdropFilter: 'blur(8px)' }}>
          <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '0.875rem' }}>
            Need help? <a href="mailto:support@aisolutions.com" style={{ color: '#10b981', textDecoration: 'none' }}>Contact Support</a>
          </p>
        </div>

        <div style={styles.footer}>© 2025 AI Solutions. All rights reserved.</div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
