import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import WelcomeModal from './components/WelcomeModal';
import Home from './pages/Home';
import AIGenerators from './pages/AIGenerators';
import Resources from './pages/Resources';
import Calculator from './pages/Calculator';
import GstCalculator from './pages/GstCalculator';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';

// ── Floating WhatsApp Button ─────────────────────────────────────────────────
const FloatingWhatsApp = () => (
  <a
    href="https://wa.me/919358022343?text=Hi%20Launchpad%20Bharat!%20I%20need%20help%20with%20my%20startup."
    target="_blank" rel="noreferrer" title="Chat on WhatsApp"
    style={{
      position: 'fixed', bottom: '1.75rem', right: '1.75rem', zIndex: 998,
      width: 58, height: 58, borderRadius: '50%', background: '#25D366',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 24px rgba(37,211,102,0.5)', textDecoration: 'none',
      animation: 'wobble 3s ease-in-out infinite',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
  >
    <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.549 4.116 1.512 5.849L.057 23.454a.5.5 0 00.609.61l5.716-1.498A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.95 9.95 0 01-5.049-1.368l-.361-.214-3.742.981.998-3.648-.235-.374A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
    <span style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '2px solid rgba(37,211,102,0.4)', animation: 'pulse-ring 2s ease-out infinite' }} />
    <style>{`
      @keyframes wobble { 0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)} }
      @keyframes pulse-ring { 0%{transform:scale(1);opacity:.8}100%{transform:scale(1.5);opacity:0} }
    `}</style>
  </a>
);

// ── Mobile Community Sticky Bar ─────────────────────────────────────────────
const CommunityStickyBar = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed in this session
    if (sessionStorage.getItem('community_bar_dismissed')) {
      setDismissed(true);
      return;
    }
    const onScroll = () => {
      if (window.scrollY > 400) setVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('community_bar_dismissed', '1');
  };

  if (dismissed) return null;

  return (
    <>
      <style>{`
        .community-bar {
          display: none;
        }
        @media (max-width: 768px) {
          .community-bar {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 997;
            align-items: center;
            gap: 0.75rem;
            padding: 0.85rem 1rem;
            background: linear-gradient(135deg, rgba(15,12,35,0.97), rgba(20,15,45,0.97));
            border-top: 1px solid rgba(139,92,246,0.35);
            backdrop-filter: blur(16px);
            transform: translateY(${visible ? '0' : '100%'});
            transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
            box-shadow: 0 -4px 32px rgba(139,92,246,0.2);
          }
        }
      `}</style>
      <div className="community-bar">
        {/* WhatsApp icon */}
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.549 4.116 1.512 5.849L.057 23.454a.5.5 0 00.609.61l5.716-1.498A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.95 9.95 0 01-5.049-1.368l-.361-.214-3.742.981.998-3.648-.235-.374A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            🤝 Join 1000+ Founders on WhatsApp
          </p>
          <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>Free community — 1 click to join</p>
        </div>

        {/* CTA */}
        <a
          href="https://chat.whatsapp.com/Ey4FCxCjL9x9fH698xNnkO"
          target="_blank"
          rel="noreferrer"
          style={{ flexShrink: 0, padding: '0.5rem 1rem', background: 'rgba(139,92,246,0.9)', color: 'white', borderRadius: '0.5rem', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          Join Free →
        </a>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', padding: '0.25rem', lineHeight: 1 }}
        >
          ✕
        </button>
      </div>
    </>
  );
};

// ── Main App ──────────────────────────────────────────────────────────────────
function App() {
  const { user, saveVisitor } = useAuth();
  const [showModal, setShowModal] = useState(!user);

  const handleModalComplete = (visitorData) => {
    saveVisitor(visitorData);
    setShowModal(false);
  };

  return (
    <div className="app-container">
      {/* Welcome Modal — only on first visit */}
      {showModal && <WelcomeModal onComplete={handleModalComplete} />}

      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/generators"    element={<AIGenerators />} />
          <Route path="/resources"     element={<Resources />} />
          <Route path="/calculator"    element={<Calculator />} />
          <Route path="/gst-calculator" element={<GstCalculator />} />
          <Route path="/admin"         element={<AdminPanel />} />
          <Route path="/profile"       element={<Profile />} />
          <Route path="/dashboard"     element={<Home />} />

          {/* Legacy redirects */}
          <Route path="/login"         element={<Home />} />
          <Route path="/onboarding"    element={<Home />} />

          {/* 404 */}
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <CommunityStickyBar />
      <FloatingWhatsApp />
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ padding: '3rem 0', borderTop: '1px solid var(--glass-border)', marginTop: '4rem', textAlign: 'center' }}>
    <div className="container">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Launchpad <span className="text-accent">Bharat</span></h2>
        <p className="text-secondary" style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
          Empowering the next generation of Indian entrepreneurs with AI-powered tools and resources.
        </p>
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            © {new Date().getFullYear()} Launchpad Bharat. All rights reserved.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, marginTop: '0.5rem' }}>
            Built with ❤️ by <span style={{ color: 'white' }}>Jai Anand</span> (Founder & CEO) & <span style={{ color: 'white' }}>Abhay Bansal</span> (Co-Founder)
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default App;
