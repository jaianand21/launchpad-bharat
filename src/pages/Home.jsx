import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Sparkles, BookOpen, CheckCircle, Calculator,
  TrendingUp, Users, FileText, Star, Zap, Shield, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ── Animated counter hook ─────────────────────────────────────────────────────
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
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
];

const Home = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Founder';

  const blueprints = useCounter(1247);
  const founders   = useCounter(3840);
  const resources  = useCounter(56);

  // Youtube Video Background Configuration
  // Edit this VIDEO ID below to supply the specific youtube background you want. 
  // It is currently set to a generic dark abstract tech video loop.
  const backgroundVideoId = "P90X9xxm1gc";

  return (
    <>
      {/* ── Background Video Layer ────────────────────────────────────────────────────────── */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none', overflow: 'hidden', opacity: 0.4 }}>
        <iframe 
          src={`https://www.youtube.com/embed/${backgroundVideoId}?autoplay=1&mute=1&loop=1&playlist=${backgroundVideoId}&controls=0&showinfo=0&rel=0`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          style={{ width: '100vw', height: '56.25vw', minHeight: '100vh', minWidth: '177.77vh', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
          title="Background Video"
        ></iframe>
      </div>

      {/* Main Home Content Container */}
      <div className="container py-20" style={{ position: 'relative', zIndex: 1 }}>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section style={{ textAlign: 'center', marginTop: '2rem' }}>
        {user?.name ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 1.15rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-coral)', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            👋 Welcome back, {firstName}! Ready to build today?
          </div>
        ) : (
          <div style={{ display: 'inline-block', padding: '0.45rem 1.15rem', background: 'rgba(34,211,238,0.1)', color: 'var(--accent-cyan)', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            🚀 Built for Bharat's Next Creators
          </div>
        )}
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', marginBottom: '1.25rem', lineHeight: 1.15 }}>
          Turn your raw idea into a{' '}
          <span className="text-accent">Thriving Business</span>
        </h1>
        <p className="text-secondary" style={{ fontSize: '1.15rem', maxWidth: '620px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          The all-in-one AI ecosystem to discover hyper-local niches, generate brand identities, and get step-by-step guides tailored for Indian founders.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/generators" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.95rem 2rem' }}>
            Start Building with AI <ArrowRight size={20} />
          </Link>
          <Link to="/resources" className="btn btn-outline" style={{ fontSize: '1.05rem', padding: '0.95rem 2rem' }}>
            Explore Free Guides
          </Link>
        </div>
      </section>

      {/* ── Live Stats ──────────────────────────────────────────────────── */}
      <section style={{ marginTop: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { icon: <FileText size={22} style={{ color: 'var(--accent-cyan)' }} />, value: blueprints.toLocaleString('en-IN') + '+', label: 'Blueprints Generated' },
            { icon: <Users size={22} style={{ color: 'var(--accent-purple)' }} />, value: founders.toLocaleString('en-IN') + '+', label: 'Founders Joined' },
            { icon: <BookOpen size={22} style={{ color: '#22c55e' }} />, value: resources + '+', label: 'Free Resources' },
          ].map((s, i) => (
            <div key={i} className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>{s.icon}</div>
              <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'white' }}>{s.value}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Launchpad Bharat (NEW: value prop section) ──────────────── */}
      <section style={{ marginTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '0.5rem' }}>Why Us?</p>
          <h2 style={{ fontSize: '2.15rem' }}>Built <span style={{ color: 'var(--accent-purple)' }}>Differently</span> for India</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {[
            { icon: '🇮🇳', title: 'India-First Logic', desc: 'GST-inclusive budgets, tier-2 city market sizing, MSME/Startup India compliance built into every blueprint.' },
            { icon: '⚡', title: 'Blueprint in 30 Seconds', desc: 'No ChatGPT prompting needed. Enter your skills + budget and get a full startup audit instantly.' },
            { icon: '💰', title: '100% Free to Use', desc: 'Every tool, resource PDF, calculator and AI blueprint is completely free. No trial. No credit card.' },
            { icon: '🎯', title: 'Skill-Aware AI', desc: 'Our AI knows if you\'re a developer or designer and adjusts cost tables — so you don\'t overpay for what you can build yourself.' },
          ].map((f, i) => (
            <div key={i} className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p className="text-secondary" style={{ fontSize: '0.88rem', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section style={{ marginTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '0.5rem' }}>Simple Process</p>
          <h2 style={{ fontSize: '2.15rem' }}>How It <span className="text-accent">Works</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {[
            { step: '01', icon: <Sparkles size={26} />, title: 'Input Your Info', desc: 'Tell our AI your skills, budget, and niche. Supports 50+ skills from Web Dev to Sales.', color: 'var(--accent-cyan)' },
            { step: '02', icon: <TrendingUp size={26} />, title: 'Get Your Blueprint', desc: 'Receive a real-world feasibility report with GST costs, tech stack, and a 6-month roadmap.', color: 'var(--accent-purple)' },
            { step: '03', icon: <CheckCircle size={26} />, title: 'Build & Launch', desc: 'Download your PDF audit, use the Founder Library, and launch your startup with confidence.', color: '#22c55e' },
          ].map((s, i) => (
            <div key={i} className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1.25rem', fontSize: '3rem', fontWeight: 900, color: 'rgba(255,255,255,0.04)', lineHeight: 1 }}>{s.step}</div>
              <div style={{ width: 50, height: 50, borderRadius: '0.85rem', background: `${s.color}20`, border: `1px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: '1rem' }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{s.title}</h3>
              <p className="text-secondary" style={{ fontSize: '0.88rem', lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ────────────────────────────────────────────────── */}
      <section style={{ marginTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.15rem' }}>All Tools, <span className="text-accent">Zero Cost</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {[
            { icon: <Sparkles size={26} />, title: 'AI Blueprint Generator', desc: 'Full startup cost & feasibility audit tailored to your skills, budget and niche.', bg: 'var(--gradient-primary)', color: 'white', link: '/generators', cta: 'Generate Blueprint' },
            { icon: <BookOpen size={26} />, title: 'Founder Resource Library', desc: '13+ legal guides, GST playbooks, govt scheme documents — downloadable as PDF.', bg: 'rgba(244,63,94,0.2)', color: 'var(--accent-coral)', link: '/resources', cta: 'Browse Resources' },
            { icon: <Calculator size={26} />, title: 'Smart Calculators', desc: 'D2C Price tool + GST Calculator to protect your margins before you scale.', bg: 'rgba(34,211,238,0.2)', color: 'var(--accent-cyan)', link: '/calculator', cta: 'Try Calculators' },
          ].map((f, i) => (
            <div key={i} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 56, height: 56, borderRadius: '1rem', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: '1.25rem' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem' }}>{f.title}</h3>
              <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.5rem', flex: 1 }}>{f.desc}</p>
              <Link to={f.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.gap = '0.7rem'}
                onMouseLeave={e => e.currentTarget.style.gap = '0.4rem'}>
                {f.cta} <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section style={{ marginTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '0.5rem' }}>Founder Stories</p>
          <h2 style={{ fontSize: '2.15rem' }}>Trusted by <span className="text-accent">Real Founders</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
      </section>

      {/* ── Web Dev Services / Pricing ────────────────────────────────────── */}
      <section style={{ marginTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#25D366', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '0.5rem' }}>💻 Web Design Services</p>
          <h2 style={{ fontSize: '2.15rem' }}>Build Your Website <span style={{ color: '#25D366' }}>Today</span></h2>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>No agencies. Direct from our dev team. Transparent pricing.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { name: 'Starter', price: '₹1,000', desc: 'Landing page for your idea or service', features: ['Single Page Design', 'Mobile Responsive', 'Contact Form', 'WhatsApp Button', 'Deploy Ready'], color: 'rgba(34,211,238,0.15)', border: 'rgba(34,211,238,0.3)', badge: null, wa: 'Starter' },
            { name: 'Business', price: '₹3,500', desc: 'Full website with 4-5 pages', features: ['Up to 5 Pages', 'Custom Branding', 'SEO Optimized', 'Payment Gateway', '3 Revisions'], color: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)', badge: '⭐ Most Popular', wa: 'Business' },
            { name: 'Startup', price: '₹7,500', desc: 'Complete web app with backend', features: ['React + Node.js', 'User Login System', 'Admin Dashboard', 'Database Setup', 'API Integration'], color: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.3)', badge: null, wa: 'Startup' },
          ].map((p, i) => (
            <div key={i} className="glass-panel" style={{ padding: '2rem', background: p.color, border: `1px solid ${p.border}`, position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {p.badge && (
                <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-purple)', color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.85rem', borderRadius: '1rem', whiteSpace: 'nowrap' }}>{p.badge}</div>
              )}
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.name}</p>
              <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', margin: '0.25rem 0' }}>{p.price}</p>
              <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>{p.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle size={14} style={{ color: '#22c55e', flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <a href={`https://wa.me/919358022343?text=Hi!%20I%20want%20the%20${encodeURIComponent(p.name)}%20package%20(${encodeURIComponent(p.price)})`}
                target="_blank" rel="noreferrer"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.85rem', background: '#25D366', color: '#000', borderRadius: '0.65rem', fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none', boxShadow: '0 4px 16px rgba(37,211,102,0.3)', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,211,102,0.5)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.3)'}>
                WhatsApp Us
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Meet the Founder ───────────────────────────────────────────── */}
      <section style={{ marginTop: '5rem', textAlign: 'center' }}>
        <div style={{ padding: '3rem', background: 'rgba(255,255,255,0.03)', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, marginBottom: '1rem' }}>Leadership</p>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Meet the <span className="text-accent">Founder</span></h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))', padding: '4px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>👨‍💻</div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', color: 'white' }}>Jai Anand</h3>
              <p style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', fontWeight: 600, margin: 0 }}>Founder, CEO & Lead Developer</p>
              <p className="text-secondary" style={{ maxWidth: '600px', margin: '1.5rem auto 0', lineHeight: 1.7 }}>
                "Launchpad Bharat was born out of a simple vision: To democratize startup building for every Indian creator. 
                Whether you're in a metro or a tier-3 city, budget should never stop a great idea. We build the tools, you build the future."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Community CTA ─────────────────────────────────────────────────── */}
      <section style={{ marginTop: '4rem', paddingBottom: '4rem' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(34,211,238,0.06))', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '1.25rem', padding: '2.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 700 }}>🤝 Free Community</p>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.75rem' }}>Join <span style={{ color: 'var(--accent-purple)' }}>1000+ Indian Founders</span> on WhatsApp</h2>
          <p className="text-secondary" style={{ fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.65 }}>
            Get blueprint feedback, share progress, access exclusive resources, and connect with mentors — all in one free community.
          </p>
          <a href="https://chat.whatsapp.com/Ey4FCxCjL9x9fH698xNnkO" target="_blank" rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 2rem', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', color: 'var(--accent-purple)', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.28)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.15)'; }}>
            Join Free — 1 Click →
          </a>
        </div>
      </section>
      </div>
    </>
  );
};

export default Home;
