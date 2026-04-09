import React, { useState } from 'react';
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

      <FloatingWhatsApp />
    </div>
  );
}

export default App;
