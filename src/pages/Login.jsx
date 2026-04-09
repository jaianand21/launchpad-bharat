import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, Mail, Lock, User, AlertCircle, Loader, Eye, EyeOff, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const API = 'http://localhost:5000/api/auth';

const Login = () => {
  // mode: 'login' | 'signup' | 'forgot' | 'reset'
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { login, signup, loginWithGoogle } = useAuth();

  // ── Google OAuth ────────────────────────────────────────────────────────
  const handleGoogleSuccess = async (credentialResponse) => {
    setError(''); setLoading(true);
    const result = await loginWithGoogle(credentialResponse);
    setLoading(false);
    if (result.success) navigate(result.isNewUser ? '/onboarding' : '/');
    else setError(result.error || 'Google sign-in failed. Try again.');
  };

  // ── Email / Password Submit ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (mode === 'signup') {
      if (!name.trim()) { setError('Please enter your full name.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    }

    setLoading(true);
    let result;

    if (mode === 'signup') {
      result = await signup({ name, emailOrPhone: email, password });
    } else {
      result = await login({ email, password });
    }

    setLoading(false);

    if (result?.success) {
      navigate(result.isNewUser ? '/onboarding' : '/');
    } else {
      setError(result?.error || 'Something went wrong. Please try again.');
    }
  };

  // ── Forgot Password — Request Reset Code ────────────────────────────────
  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message || 'Reset code sent! Check your email (or look in the terminal for now).');
        setMode('reset');
      } else {
        setError(data.error || 'Could not process request.');
      }
    } catch {
      setError('Network Error: Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  // ── Reset Password ──────────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!resetCode || !newPassword) { setError('Enter the reset code and new password.'); return; }
    if (newPassword.length < 6) { setError('New password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: resetCode, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Password reset successfully! You can now sign in.');
        setTimeout(() => { setMode('login'); setSuccess(''); setResetCode(''); setNewPassword(''); }, 2000);
      } else {
        setError(data.error || 'Invalid or expired reset code.');
      }
    } catch {
      setError('Network Error: Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setError(''); setSuccess(''); setPassword('');
  };

  const inputStyle = {
    width: '100%', padding: '0.78rem 1rem 0.78rem 2.75rem',
    background: 'rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)',
    borderRadius: '0.5rem', color: 'white', outline: 'none', fontSize: '1rem',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  };
  const iconStyle = { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '3rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px rgba(139,92,246,0.15)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Rocket size={44} style={{ color: 'var(--accent-coral)', margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '1.9rem', marginBottom: '0.4rem' }}>
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Forgot Password' : 'Reset Password'}
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
            {mode === 'login' ? 'Sign in to your Founder portal.' : mode === 'signup' ? 'Join Launchpad Bharat today.' : mode === 'forgot' ? 'Enter your email to receive a reset code.' : `Enter the code sent to ${email}`}
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.4)', color: '#f43f5e', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} /> {error}
          </div>
        )}

        {/* Success Banner */}
        {success && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
            <CheckCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} /> {success}
          </div>
        )}

        {/* ── FORGOT PASSWORD FORM ── */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="text-secondary" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>Your Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={iconStyle} />
                <input type="email" placeholder="you@startup.com" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              {loading ? <Loader size={18} className="animate-spin" /> : <><KeyRound size={18} /> Send Reset Code</>}
            </button>
            <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
              <ArrowLeft size={15} /> Back to Sign In
            </button>
          </form>
        )}

        {/* ── RESET PASSWORD FORM ── */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="text-secondary" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>Reset Code</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={iconStyle} />
                <input type="text" placeholder="Enter 6-digit code" value={resetCode} onChange={e => setResetCode(e.target.value)} required style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="text-secondary" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={iconStyle} />
                <input type={showPassword ? 'text' : 'password'} placeholder="New password (min. 6 chars)" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ ...inputStyle, paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              {loading ? <Loader size={18} className="animate-spin" /> : 'Reset Password'}
            </button>
            <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
              <ArrowLeft size={15} /> Back
            </button>
          </form>
        )}

        {/* ── LOGIN / SIGNUP FORM ── */}
        {(mode === 'login' || mode === 'signup') && (
          <>
            {/* Google Login */}
            <div style={{ marginBottom: '1.25rem' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google widget failed. Please try the email option below.')}
                width="390"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
              <span className="text-secondary" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>or use email</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mode === 'signup' && (
                <div>
                  <label className="text-secondary" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={iconStyle} />
                    <input type="text" placeholder="Rohit Sharma" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
                  </div>
                </div>
              )}

              <div>
                <label className="text-secondary" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={iconStyle} />
                  <input type="email" placeholder="you@startup.com" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="text-secondary" style={{ fontSize: '0.85rem' }}>
                    Password {mode === 'signup' && <span style={{ fontSize: '0.78rem', opacity: 0.6 }}>(min. 6 chars)</span>}
                  </label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={iconStyle} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                    value={password} onChange={e => setPassword(e.target.value)}
                    required minLength={6}
                    style={{ ...inputStyle, paddingRight: '3rem' }}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                {loading ? <Loader size={18} className="animate-spin" /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <p className="text-secondary" style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={switchMode} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
