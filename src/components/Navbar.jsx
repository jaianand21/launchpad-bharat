import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Rocket, Sparkles, BookOpen, User, ChevronDown, ShoppingCart, Calculator, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const update = () => {
      try { setSavedCount(JSON.parse(localStorage.getItem('saved_blueprints') || '[]').length); } catch {}
    };
    update();
    window.addEventListener('storage', update);
    const interval = setInterval(update, 2000);
    return () => { window.removeEventListener('storage', update); clearInterval(interval); };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
    color: isActive(path) ? 'var(--accent-cyan)' : 'var(--text-secondary)',
    fontWeight: isActive(path) ? 600 : 400,
    textDecoration: 'none', transition: 'all 0.15s',
    background: isActive(path) ? 'rgba(34,211,238,0.08)' : 'transparent',
  });

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <nav className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '0.85rem 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <img src="/favicon.png" alt="Rocket" style={{ width: 30, height: 30 }} onError={e => e.currentTarget.style.display = 'none'} />
            <span className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white' }}>
              Launchpad<span style={{ color: 'var(--accent-coral)' }}>Bharat</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="flex gap-2 items-center hidden-mobile">
            <Link to="/generators" style={navLinkStyle('/generators')}
              onMouseEnter={e => { if (!isActive('/generators')) { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}}
              onMouseLeave={e => { if (!isActive('/generators')) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}}>
              <Sparkles size={17} /> AI Tools
            </Link>
            <Link to="/resources" style={navLinkStyle('/resources')}
              onMouseEnter={e => { if (!isActive('/resources')) { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}}
              onMouseLeave={e => { if (!isActive('/resources')) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}}>
              <BookOpen size={17} /> Resources
            </Link>
            <Link to="/calculator" style={navLinkStyle('/calculator')}
              onMouseEnter={e => { if (!isActive('/calculator')) { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}}
              onMouseLeave={e => { if (!isActive('/calculator')) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}}>
              <Calculator size={17} /> Calculators
            </Link>

            {/* Saved Blueprints Cart */}
            {savedCount > 0 && (
              <button onClick={() => navigate('/generators?saved=true')} title="Saved Blueprints"
                style={{ position: 'relative', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '0.5rem', padding: '0.45rem 0.65rem', cursor: 'pointer', color: 'var(--accent-cyan)', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,211,238,0.16)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,211,238,0.08)'}>
                <ShoppingCart size={18} />
                <span style={{ position: 'absolute', top: -6, right: -6, background: '#f43f5e', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{savedCount}</span>
              </button>
            )}

            {/* Visitor badge */}
            {user && (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button onClick={() => setDropdownOpen(prev => !prev)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', borderRadius: '2rem', padding: '0.4rem 0.85rem 0.4rem 0.4rem', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                >
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>
                    {getInitials(user.name)}
                  </div>
                  <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 500, maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name?.split(' ')[0] || 'Founder'}
                  </span>
                  <ChevronDown size={14} style={{ color: 'var(--text-secondary)', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {dropdownOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0, background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', padding: '0.5rem', minWidth: 190, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 200 }}>
                    <div style={{ padding: '0.5rem 0.75rem 0.75rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '0.25rem' }}>
                      <p style={{ margin: 0, fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>{user.name}</p>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{user.email}</p>
                    </div>
                    <button onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem 0.75rem', background: 'none', border: 'none', color: 'var(--text-secondary)', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                      <User size={16} /> My Profile
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile: Hamburger */}
          <button
            className="show-mobile"
            onClick={() => setMobileOpen(v => !v)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer', color: 'white', display: 'none' }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'absolute', top: 0, right: 0, width: '280px', height: '100%', background: 'var(--bg-secondary)', borderLeft: '1px solid var(--glass-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '-20px 0 60px rgba(0,0,0,0.5)', animation: 'slideIn 0.25s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>Menu</span>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', marginBottom: '0.75rem' }}>
                {user.picture ? (
                  <img src={user.picture} alt={user.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>{getInitials(user.name)}</div>
                )}
                <div>
                  <p style={{ margin: 0, color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>{user.name?.split(' ')[0] || 'Founder'}</p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{user.email || user.mobile_number || ''}</p>
                </div>
              </div>
            )}

            {[
              { path: '/generators', icon: <Sparkles size={18} />, label: 'AI Tools' },
              { path: '/resources', icon: <BookOpen size={18} />, label: 'Resources' },
              { path: '/calculator', icon: <Calculator size={18} />, label: 'Calculators' },
              { path: '/profile', icon: <User size={18} />, label: 'My Profile' },
            ].map(({ path, icon, label }) => (
              <Link key={path} to={path}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', borderRadius: '0.75rem', color: isActive(path) ? 'var(--accent-cyan)' : 'var(--text-secondary)', background: isActive(path) ? 'rgba(34,211,238,0.08)' : 'transparent', fontWeight: isActive(path) ? 600 : 400, textDecoration: 'none', fontSize: '1rem', transition: 'all 0.15s' }}>
                {icon} {label}
              </Link>
            ))}

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Made with ❤️ for Indian Founders</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
