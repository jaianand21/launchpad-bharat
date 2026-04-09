import React, { useState } from 'react';
import { Rocket, User, Mail, Phone, ArrowRight, CheckCircle, Loader } from 'lucide-react';

const STORAGE_KEY = 'lb_visitor';

const WelcomeModal = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const validateMobile = (m) => /^[6-9]\d{9}$/.test(m.replace(/\s/g, ''));
  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
    if (!validateMobile(mobile)) { setError('Please enter a valid 10-digit Indian mobile number.'); return; }

    setLoading(true);
    const visitorData = { name: name.trim(), email: email.trim(), mobile: mobile.trim(), joinedAt: new Date().toISOString() };

    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitorData),
      });
    } catch {
      // Fail silently — still save locally so user isn't blocked
      console.warn('Could not reach server, saving locally only.');
    }

    // Always save to localStorage regardless of server response
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitorData));
    setDone(true);
    setLoading(false);

    // Brief success state, then dismiss
    setTimeout(() => onComplete(visitorData), 1200);
  };

  const inputStyle = {
    width: '100%', padding: '0.85rem 1rem 0.85rem 2.85rem',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '0.65rem', color: 'white', outline: 'none',
    fontSize: '1rem', transition: 'border-color 0.2s', boxSizing: 'border-box',
  };
  const iconStyle = {
    position: 'absolute', left: '0.9rem', top: '50%',
    transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5, 5, 20, 0.92)', backdropFilter: 'blur(12px)',
      padding: '1rem', animation: 'fadeIn 0.4s ease',
    }}>
      <div style={{
        width: '100%', maxWidth: 460,
        background: 'linear-gradient(145deg, rgba(15,15,40,0.98), rgba(10,10,30,0.98))',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: '1.5rem', padding: '2.5rem',
        boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(139,92,246,0.12)',
        animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>

        {done ? (
          /* ── Success State ── */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle size={56} style={{ color: '#22c55e', margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>You're all set! 🚀</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Welcome to Launchpad Bharat, {name.split(' ')[0]}!</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #f43f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(139,92,246,0.4)' }}>
                  <Rocket size={32} color="white" />
                </div>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.2 }}>
                Welcome to <span style={{ color: 'var(--accent-coral)' }}>Launchpad Bharat</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: 340, margin: '0 auto' }}>
                India's #1 AI Startup Builder. Quick intro before you explore — takes 10 seconds.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: '#f87171', padding: '0.65rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.88rem' }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={iconStyle} />
                  <input
                    type="text" placeholder="Rohit Sharma" value={name}
                    onChange={e => setName(e.target.value)} required autoFocus
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={iconStyle} />
                  <input
                    type="email" placeholder="you@startup.com" value={email}
                    onChange={e => setEmail(e.target.value)} required
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={iconStyle} />
                  <input
                    type="tel" placeholder="9876543210" value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} required
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                style={{
                  marginTop: '0.5rem', width: '100%', padding: '0.95rem',
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  border: 'none', borderRadius: '0.75rem', color: 'white',
                  fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  boxShadow: '0 4px 20px rgba(139,92,246,0.4)', opacity: loading ? 0.8 : 1,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 30px rgba(139,92,246,0.6)'; }}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(139,92,246,0.4)'}
              >
                {loading
                  ? <Loader size={19} style={{ animation: 'spin 1s linear infinite' }} />
                  : <><span>Explore Launchpad Bharat</span> <ArrowRight size={19} /></>}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
              🔒 We never share your data. Used only for startup resources & updates.
            </p>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export { STORAGE_KEY };
export default WelcomeModal;
