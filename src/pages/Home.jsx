import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Sparkles, BookOpen, CheckCircle, Calculator,
  TrendingUp, Users, FileText, Star, ChevronDown, Check, Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ── Animated counter hook ─────────────────────────────────────────────────────
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (end === 0) return;
    let start = 0; const step = end / (duration / 16);
    const t = setInterval(() => {
      start += step; if (start >= end) { setCount(end); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [end, duration]);
  return count;
};

const TESTIMONIALS = [
  { name: 'Rahul Sharma', city: 'Jaipur', stage: '🚀 Scaling', quote: 'Got my blueprint in 2 minutes. Launched my AgriTech startup 3 months later. Best ₹0 investment ever!', stars: 5 },
  { name: 'Priya Mehta', city: 'Coimbatore', stage: '📋 Registered', quote: 'The GST calculator alone saved me from a ₹12,000 mistake. Lifesaver for solo founders.', stars: 5 },
  { name: 'Arjun Nair', city: 'Kochi', stage: '🔬 Validating', quote: 'The AI blueprint told me my ₹5,000 was too low BEFORE I blew it. Pivoted and now I\'m ready.', stars: 5 },
  { name: 'Sneha Gupta', city: 'Lucknow', stage: '💡 Idea', quote: 'Built my D2C brand strategy in an afternoon. The resources vault is the best I\'ve found online.', stars: 5 },
  { name: 'Vikram Joshi', city: 'Pune', stage: '💰 Funded', quote: 'The founder agreement template saved me ₹15k in legal fees. Incredible resource for Bharat.', stars: 5 },
  { name: 'Ayesha Khan', city: 'Bhopal', stage: '💡 Idea', quote: 'Simple, fast, and no fluff. Exactly what an early-stage founder needs.', stars: 5 },
];

const Home = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Founder';

  const [stats, setStats] = useState({ blueprints: 0, founders: 0, resources: 0 });
  const [expandedService, setExpandedService] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  const [reviewForm, setReviewForm] = useState({ name: '', age: '', location: '', description: '' });
  const [reviewStatus, setReviewStatus] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiBase}/api/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          setStats({ blueprints: 1247, founders: 3840, resources: 56 });
        }
      } catch (err) {
        setStats({ blueprints: 1247, founders: 3840, resources: 56 });
      }
    };
    fetchStats();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewStatus('submitting');
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });
      if (res.ok) {
        setReviewStatus('success');
        setReviewForm({ name: '', age: '', location: '', description: '' });
        setTimeout(() => setReviewStatus(null), 4000);
      } else {
        setReviewStatus('error');
      }
    } catch {
      setReviewStatus('error');
    }
  };

  const blueprintsCount = useCounter(stats.blueprints);
  const foundersCount = useCounter(stats.founders);
  const resourcesCount = useCounter(stats.resources);

  const displayedTestimonials = showAllReviews ? TESTIMONIALS : TESTIMONIALS.slice(0, 4);

  return (
    <div className="container py-20">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section style={{ textAlign: 'center', marginTop: '1rem' }}>
        {user?.name ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 1.15rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-coral)', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            👋 Welcome back, {firstName}! Ready to build today?
          </div>
        ) : (
          <div style={{ display: 'inline-block', padding: '0.45rem 1.15rem', background: 'rgba(34,211,238,0.1)', color: 'var(--accent-cyan)', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            🚀 Built for Bharat's Next Creators
          </div>
        )}
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: '1.25rem', lineHeight: 1.15 }}>
          Turn your raw idea into a{' '}
          <span className="text-accent">Thriving Business</span>
        </h1>
        <p className="text-secondary" style={{ fontSize: '1.15rem', maxWidth: '620px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          The all-in-one AI ecosystem to discover hyper-local niches, generate brand identities, and get step-by-step guides tailored for Indian founders.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/generators" className="btn btn-primary interactive-card" style={{ fontSize: '1.05rem', padding: '0.95rem 2rem' }}>
            Start Building with AI <ArrowRight className="icon-micro-ani" size={20} />
          </Link>
          <Link to="/resources" className="btn btn-outline interactive-card" style={{ fontSize: '1.05rem', padding: '0.95rem 2rem' }}>
            Explore Free Guides
          </Link>
        </div>
      </section>

      {/* ── Indian Founder Community (Pinned) ─────────────────────────────── */}
      <section style={{ marginTop: '4rem' }}>
        <div className="interactive-card animate-pulse-glow" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(34,211,238,0.06))', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '1.25rem', padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', background: 'rgba(139,92,246,0.2)', padding: '0.35rem 1rem', borderRadius: '2rem' }}>
            <span style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e', animation: 'pulse-glow 2s infinite' }}></span>
            <p style={{ fontSize: '0.82rem', color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, margin: 0 }}>Indian Founder Community</p>
          </div>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.75rem' }}>Join <span style={{ color: 'var(--accent-purple)' }}>{foundersCount.toLocaleString('en-IN')}+ Live Founders</span> on WhatsApp</h2>
          <p className="text-secondary" style={{ fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.65 }}>
            Get blueprint feedback, share progress, access exclusive resources, and connect with mentors — all in one free community.
          </p>
          <a href="https://chat.whatsapp.com/Ey4FCxCjL9x9fH698xNnkO" target="_blank" rel="noreferrer"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 2rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.95rem' }}>
            Join Free — 1 Click <ArrowRight size={18} className="icon-micro-ani" />
          </a>
        </div>
      </section>

      {/* ── Live Stats (Dynamic Data) ─────────────────────────────────────── */}
      <section style={{ marginTop: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {[
            { icon: <FileText size={24} style={{ color: 'var(--accent-cyan)' }} />, value: blueprintsCount.toLocaleString('en-IN') + '+', label: 'Blueprints Generated' },
            { icon: <Users size={24} style={{ color: 'var(--accent-purple)' }} />, value: foundersCount.toLocaleString('en-IN') + '+', label: 'Founders Joined' },
            { icon: <BookOpen size={24} style={{ color: '#22c55e' }} />, value: resourcesCount.toLocaleString('en-IN') + '+', label: 'Free Resources' },
          ].map((s, i) => (
            <div key={i} className="glass-panel interactive-card" style={{ textAlign: 'center', padding: '2rem 1.5rem', borderTop: `2px solid ${s.icon.props.style.color}40` }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }} className="icon-micro-ani">{s.icon}</div>
              <p style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'white', lineHeight: 1.1 }}>{s.value}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0 0', fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ────────────────────────────────────────────────── */}
      <section style={{ marginTop: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.15rem' }}>All Tools, <span className="text-accent">Zero Cost</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: <Sparkles size={26} />, title: 'AI Blueprint Generator', desc: 'Full startup cost & feasibility audit tailored to your skills, budget and niche.', bg: 'var(--gradient-primary)', color: 'white', link: '/generators', cta: 'Generate Blueprint' },
            { icon: <BookOpen size={26} />, title: 'Founder Resource Library', desc: '13+ legal guides, GST playbooks, govt scheme documents — downloadable as PDF.', bg: 'rgba(244,63,94,0.15)', color: 'var(--accent-coral)', link: '/resources', cta: 'Browse Resources' },
            { icon: <Calculator size={26} />, title: 'Smart Calculators', desc: 'D2C Price tool + GST Calculator to protect your margins before you scale.', bg: 'rgba(34,211,238,0.15)', color: 'var(--accent-cyan)', link: '/calculator', cta: 'Try Calculators' },
          ].map((f, i) => (
            <div key={i} className="glass-panel interactive-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div className="icon-micro-ani" style={{ width: 56, height: 56, borderRadius: '1rem', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: '1.25rem' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem' }}>{f.title}</h3>
              <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.5rem', flex: 1 }}>{f.desc}</p>
              <Link to={f.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                {f.cta} <ArrowRight className="icon-micro-ani text-accent" size={15} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Web Dev Services / Accordion Flow ────────────────────────────── */}
      <section style={{ marginTop: '7rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#25D366', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '0.5rem' }}>💻 Web Design Services</p>
          <h2 style={{ fontSize: '2.15rem' }}>Build Your Website <span style={{ color: '#25D366' }}>Today</span></h2>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Direct from our dev team. Transparent pricing. Select a plan to expand.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
          {[
            { id: 'starter', name: 'Starter Package', price: '₹1,000', desc: 'Perfect for landing pages and validating your fast idea.', features: ['Single Page Design', 'Mobile Responsive', 'Contact Form', 'WhatsApp Integrated'], color: 'rgba(34,211,238,0.15)', border: 'rgba(34,211,238,0.4)', icon: '⚡' },
            { id: 'business', name: 'Business Package', price: '₹3,500', desc: 'Full-suite presence tailored for growing services.', features: ['Up to 5 Pages', 'Custom Branding', 'SEO Ready', 'Payment Integrations', '3 Revisions'], color: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.5)', icon: '🚀', badge: '⭐ Bestseller' },
            { id: 'startup', name: 'Startup SaaS', price: '₹7,500', desc: 'Robust web application with backend capabilities.', features: ['React + Node.js', 'Auth & Login', 'Admin Panel', 'Database System', 'Custom API'], color: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.4)', icon: '🔥' },
          ].map((svc) => (
            <div key={svc.id} 
              className={`glass-panel interactive-card`} 
              style={{ padding: '1.5rem', cursor: 'pointer', border: expandedService === svc.id ? `1px solid ${svc.border}` : '1px solid var(--glass-border)' }}
              onClick={() => setExpandedService(expandedService === svc.id ? null : svc.id)}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', background: svc.color, padding: '0.75rem', borderRadius: '0.75rem' }}>{svc.icon}</div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      {svc.name}
                      {svc.badge && <span style={{ fontSize: '0.7rem', background: 'var(--accent-purple)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '1rem' }}>{svc.badge}</span>}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{svc.price}</p>
                  </div>
                </div>
                <div style={{ transform: expandedService === svc.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                  <ChevronDown color="var(--text-secondary)" />
                </div>
              </div>

              <div className={`accordion-content ${expandedService === svc.id ? 'expanded' : ''}`}>
                <div className="accordion-inner">
                  <div style={{ padding: '1.5rem 0 0.5rem' }}>
                    <p className="text-secondary" style={{ fontSize: '0.95rem', marginBottom: '1.25rem' }}>{svc.desc}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {svc.features.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                          <CheckCircle size={15} style={{ color: '#22c55e' }} /> {f}
                        </div>
                      ))}
                    </div>
                    <a href={`https://wa.me/919358022343?text=Hi!%20I%20want%20the%20${encodeURIComponent(svc.name)}%20(${encodeURIComponent(svc.price)})`}
                      target="_blank" rel="noreferrer"
                      className="btn interactive-card"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#25D366', color: '#000', fontWeight: 700 }}>
                      WhatsApp Us <ArrowRight className="icon-micro-ani" size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials & Community Feedback ────────────────────────────── */}
      <section style={{ marginTop: '7rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '0.5rem' }}>Community Voices</p>
          <h2 style={{ fontSize: '2.15rem' }}>Trusted by <span className="text-accent">Real Founders</span></h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {displayedTestimonials.map((t, i) => (
            <div key={i} className="glass-panel interactive-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                {[...Array(t.stars)].map((_, j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic', flex: 1 }}>"{t.quote}"</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: 'white', fontSize: '0.92rem' }}>{t.name}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.city}</p>
                </div>
                <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', background: 'rgba(139,92,246,0.15)', color: 'var(--accent-purple)', borderRadius: '1rem', border: '1px solid rgba(139,92,246,0.25)' }}>{t.stage}</span>
              </div>
            </div>
          ))}
        </div>

        {!showAllReviews && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              onClick={() => setShowAllReviews(true)}
              className="btn btn-outline interactive-card" style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem', borderRadius: '2rem' }}>
              View More Reviews <ChevronDown size={16} />
            </button>
          </div>
        )}

        {/* ── Submit Review Form ── */}
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '4rem auto 0', padding: '2.5rem', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <MessageSquare size={32} style={{ color: 'var(--accent-cyan)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Add Your Journey</h3>
            <p className="text-secondary" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Share your experience and inspire other upcoming Indian creators.</p>
          </div>

          {reviewStatus === 'success' ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(34,197,94,0.1)', borderRadius: '1rem', border: '1px solid rgba(34,197,94,0.3)' }}>
              <CheckCircle size={40} style={{ color: '#22c55e', margin: '0 auto 1rem' }} />
              <h4 style={{ color: '#22c55e', margin: '0 0 0.5rem 0' }}>Thank You!</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Your founder journey has been successfully submitted to the community.</p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div className="input-group" style={{ flex: '1 1 200px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Full Name *</label>
                  <input type="text" placeholder="Rahul Sharma" required
                    className="input-field"
                    value={reviewForm.name} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                  />
                </div>
                <div className="input-group" style={{ flex: '0 1 100px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Age</label>
                  <input type="number" placeholder="24"
                    className="input-field"
                    value={reviewForm.age} onChange={e => setReviewForm({ ...reviewForm, age: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="input-group">
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Location (City / State) *</label>
                <input type="text" placeholder="Jaipur, Rajasthan" required
                  className="input-field"
                  value={reviewForm.location} onChange={e => setReviewForm({ ...reviewForm, location: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Your Experience / Journey *</label>
                <textarea rows="4" placeholder="How did Launchpad Bharat help you..." required
                  className="input-field" style={{ padding: '0.75rem', minHeight: '100px', resize: 'vertical' }}
                  value={reviewForm.description} onChange={e => setReviewForm({ ...reviewForm, description: e.target.value })}
                />
              </div>

              {reviewStatus === 'error' && (
                <p style={{ color: 'var(--accent-coral)', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>Oops! Something went wrong. Please try again.</p>
              )}

              <button type="submit" disabled={reviewStatus === 'submitting'} className="btn btn-primary interactive-card" style={{ padding: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
                {reviewStatus === 'submitting' ? 'Submitting...' : <>Submit Your Review <Send size={16} className="icon-micro-ani" /></>}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── Meet the Founder (Redesigned Split Layout) ───────────────────── */}
      <section style={{ marginTop: '7rem', paddingBottom: '3rem' }}>
        <div style={{ padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          
          <div className="interactive-card" style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-10px', background: 'var(--gradient-primary)', borderRadius: '50%', filter: 'blur(20px)', opacity: 0.5 }}></div>
              <div style={{ width: '280px', height: '280px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(139,92,246,0.2))', border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem', position: 'relative', zIndex: 2, overflow: 'hidden' }}>
                 <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '80%', background: 'linear-gradient(wrap)', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '1rem' }}>
                   👨‍💻
                 </div>
              </div>
            </div>
          </div>
          
          <div style={{ flex: '2 1 400px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(139,92,246,0.15)', color: 'var(--accent-purple)', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              Leadership
            </div>
            <h2 style={{ fontSize: '3rem', margin: '0 0 0.5rem 0', lineHeight: 1.1 }}>Abhay Bansal</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)', fontWeight: 600, margin: '0 0 1.5rem 0' }}>Co-Founder & Lead Engineer</p>
            
            <p className="text-secondary" style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              "Launchpad Bharat was born out of a simple vision: To democratize startup building for every Indian creator. 
              Whether you're in a metro or a tier-3 city, budget should never stop a great idea."
            </p>
            <p className="text-secondary" style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
              "We believe that real innovation happens when barriers are removed. We build the tools, you build the future."
            </p>
          </div>
          
        </div>
      </section>

    </div>
  );
};

export default Home;
