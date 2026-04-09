import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Edit3, Save, X, Briefcase, Target, TrendingUp, CheckCircle, AlertCircle, Bookmark, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STAGE_OPTIONS = [
  { value: 'idea',       label: '💡 Idea Stage',    desc: 'Just started thinking about a business' },
  { value: 'validation', label: '🔬 Validation',     desc: 'Testing if the idea works in market' },
  { value: 'registered', label: '📋 Registered',     desc: 'Business is officially registered' },
  { value: 'scaling',    label: '🚀 Scaling',        desc: 'Growing revenue and team' },
];
const TYPE_OPTIONS = [
  { value: 'service', label: '🛠 Service Business' },
  { value: 'product', label: '📦 Product Business' },
  { value: 'tech',    label: '💻 Tech / SaaS' },
  { value: 'local',   label: '🏪 Local / Offline' },
];
const GOAL_OPTIONS = [
  { value: 'idea',    label: '💡 Validate My Idea' },
  { value: 'funding', label: '💰 Raise Funding' },
  { value: 'growth',  label: '📈 Scale & Grow' },
];

const selectStyle = {
  width: '100%', padding: '0.75rem 1rem',
  background: 'rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)',
  borderRadius: '0.5rem', color: 'white', outline: 'none',
  fontSize: '1rem', cursor: 'pointer', appearance: 'none',
};

const Profile = () => {
  const { user, saveVisitor } = useAuth();

  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({
    name:           user?.name           || '',
    business_stage: user?.business_stage || '',
    business_type:  user?.business_type  || '',
    goal:           user?.goal           || '',
  });

  const [savedBlueprints] = useState(() => {
    try { return JSON.parse(localStorage.getItem('saved_blueprints') || '[]'); }
    catch { return []; }
  });

  const handleSave = () => {
    if (!form.name.trim()) { setStatus({ type: 'error', msg: 'Name cannot be empty.' }); return; }
    const updated = { ...user, ...form };
    saveVisitor(updated);
    setEditing(false);
    setStatus({ type: 'success', msg: 'Profile updated successfully!' });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleCancel = () => {
    setForm({ name: user?.name || '', business_stage: user?.business_stage || '', business_type: user?.business_type || '', goal: user?.goal || '' });
    setEditing(false);
    setStatus(null);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  // Profile completeness
  const fields = [user?.name, user?.email, user?.mobile, user?.business_stage, user?.business_type, user?.goal];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);
  const barColor = pct === 100 ? '#22c55e' : pct >= 60 ? '#f59e0b' : 'var(--accent-cyan)';

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    background: 'rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)',
    borderRadius: '0.5rem', color: 'white', outline: 'none', fontSize: '1rem',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  return (
    <div className="container py-12" style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My <span className="text-accent">Profile</span></h1>
        <p className="text-secondary">Your identity and startup preferences — all saved locally on this device.</p>
      </div>

      {/* Status banner */}
      {status && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', background: status.type === 'success' ? 'rgba(34,211,238,0.1)' : 'rgba(244,63,94,0.1)', border: `1px solid ${status.type === 'success' ? 'rgba(34,211,238,0.4)' : 'rgba(244,63,94,0.4)'}`, color: status.type === 'success' ? 'var(--accent-cyan)' : '#f43f5e' }}>
          {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {status.msg}
        </div>
      )}

      {/* Profile Completeness */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>
            {pct === 100 ? '✅ Profile Complete!' : `Profile Completion — ${pct}%`}
          </p>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{filled}/{fields.length} fields</span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: '1rem', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: '1rem', transition: 'width 0.8s ease' }} />
        </div>
        {pct < 100 && <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fill in all fields to unlock personalized home page recommendations.</p>}
      </div>

      {/* ── Identity Card ── */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
              {getInitials(user?.name)}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{user?.name || 'Founder'}</h2>
              <p style={{ margin: '0.2rem 0 0', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{user?.email}</p>
            </div>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '0.5rem', padding: '0.5rem 1rem', color: 'var(--accent-purple)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              <Edit3 size={15} /> Edit Profile
            </button>
          )}
        </div>

        {/* Read-only info */}
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
            <Mail size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'white' }}>{user?.email || '—'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
            <Phone size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mobile</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'white' }}>{user?.mobile || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Business Profile Edit ── */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={18} /> Business Profile</h3>
          {editing && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', padding: '0.5rem 1rem', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem' }}>
                <X size={14} /> Cancel
              </button>
              <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--accent-purple)', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1rem', color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
                <Save size={14} /> Save Changes
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} disabled={!editing} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business Stage</label>
            <select value={form.business_stage} onChange={e => setForm(p => ({ ...p, business_stage: e.target.value }))} disabled={!editing} style={selectStyle}>
              <option value="">Select stage...</option>
              {STAGE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business Type</label>
            <select value={form.business_type} onChange={e => setForm(p => ({ ...p, business_type: e.target.value }))} disabled={!editing} style={selectStyle}>
              <option value="">Select type...</option>
              {TYPE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Primary Goal</label>
            <select value={form.goal} onChange={e => setForm(p => ({ ...p, goal: e.target.value }))} disabled={!editing} style={selectStyle}>
              <option value="">Select goal...</option>
              {GOAL_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Saved Blueprints ── */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bookmark size={18} /> Saved Blueprints</h3>
          <Link to="/generators" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Generate New <ArrowRight size={14} />
          </Link>
        </div>
        {savedBlueprints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <Bookmark size={32} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>No saved blueprints yet. Generate one from the AI Tools page!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {savedBlueprints.map((bp, i) => (
              <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.65rem', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{bp.niche} Blueprint</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Budget: ₹{bp.budget?.toLocaleString('en-IN')} · {new Date(bp.savedAt).toLocaleDateString('en-IN')}</p>
                </div>
                <Link to={`/generators?view=${i}`} style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textDecoration: 'none' }}>View →</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
