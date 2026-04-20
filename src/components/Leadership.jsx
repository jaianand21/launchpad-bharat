import React, { useState } from 'react';
import { motion } from 'framer-motion';

// ─── Single Founder Card ────────────────────────────────────────────────────
const FounderCard = ({ founder, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'translateY(-10px)' : 'translateY(0px)',
        transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
      }}
      className="relative"
    >
      {/* ── Outer glow when hovered ── */}
      <div
        style={{
          position: 'absolute',
          inset: '-1px',
          borderRadius: '1.5rem',
          background: founder.borderGlow,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Card Body ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(160deg, rgba(18,20,38,0.98) 0%, rgba(10,12,28,0.98) 100%)',
          border: `1px solid ${hovered ? founder.accentColor + '55' : 'rgba(255,255,255,0.07)'}`,
          transition: 'border-color 0.4s ease',
          borderRadius: '1.4rem',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* ── Left Edge Light ── */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '15%',
            bottom: '15%',
            width: '2px',
            borderRadius: '999px',
            background: `linear-gradient(to bottom, transparent, ${founder.accentColor}, transparent)`,
            boxShadow: `0 0 12px ${founder.accentColor}, 0 0 28px ${founder.accentColor}88`,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.35s ease',
            pointerEvents: 'none',
          }}
        />

        {/* ── Right Edge Light ── */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '15%',
            bottom: '15%',
            width: '2px',
            borderRadius: '999px',
            background: `linear-gradient(to bottom, transparent, ${founder.accentColor}, transparent)`,
            boxShadow: `0 0 12px ${founder.accentColor}, 0 0 28px ${founder.accentColor}88`,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.35s ease',
            pointerEvents: 'none',
          }}
        />

        {/* ── Top center subtle glow on hover ── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${founder.accentColor}, transparent)`,
            opacity: hovered ? 0.8 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        />

        {/* ── Avatar ── */}
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: founder.avatarBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            marginBottom: '1.5rem',
            border: `2px solid ${founder.accentColor}44`,
            boxShadow: hovered
              ? `0 0 0 4px ${founder.accentColor}22, 0 8px 32px ${founder.accentColor}33`
              : `0 0 0 0px transparent, 0 4px 16px rgba(0,0,0,0.4)`,
            transition: 'box-shadow 0.4s ease',
            flexShrink: 0,
          }}
        >
          {founder.emoji}
        </div>

        {/* ── Name ── */}
        <h3
          style={{
            fontSize: '1.45rem',
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: '0.5rem',
            letterSpacing: '-0.01em',
            textAlign: 'center',
          }}
        >
          {founder.name}
        </h3>

        {/* ── Role Badge ── */}
        <span
          style={{
            display: 'inline-block',
            padding: '0.3rem 1rem',
            borderRadius: '999px',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: founder.accentColor,
            background: founder.badgeBg,
            border: `1px solid ${founder.accentColor}33`,
            marginBottom: '1.5rem',
          }}
        >
          {founder.role}
        </span>

        {/* ── Divider ── */}
        <div
          style={{
            width: '48px',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${founder.accentColor}88, transparent)`,
            marginBottom: '1.5rem',
          }}
        />

        {/* ── Quote ── */}
        <p
          style={{
            color: '#94a3b8',
            fontSize: '0.875rem',
            lineHeight: '1.75',
            textAlign: 'center',
            fontStyle: 'italic',
            maxWidth: '300px',
          }}
        >
          "{founder.quote}"
        </p>
      </div>
    </motion.div>
  );
};

// ─── Leadership Section ─────────────────────────────────────────────────────
const Leadership = () => {
  const founders = [
    {
      emoji: '👨‍💻',
      name: 'Jai Anand',
      role: 'Founder, CEO & Lead Developer',
      quote:
        "Launchpad Bharat was born out of a simple vision: To democratize startup building for every Indian creator. Whether you're in a metro or a tier-3 city, budget should never stop a great idea. We build the tools, you build the future.",
      accentColor: '#22d3ee',
      avatarBg: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.1))',
      badgeBg: 'rgba(6,182,212,0.08)',
      borderGlow: 'linear-gradient(135deg, #06b6d422, #3b82f611)',
    },
    {
      emoji: '🚀',
      name: 'Abhay Bansal',
      role: 'Co-Founder & Head of Strategy',
      quote:
        "We combine technical excellence with strategic vision to empower India's next generation of entrepreneurs. Together, we make success accessible to every dreamer.",
      accentColor: '#c084fc',
      avatarBg: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.1))',
      badgeBg: 'rgba(168,85,247,0.08)',
      borderGlow: 'linear-gradient(135deg, #a855f722, #ec489911)',
    },
  ];

  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '7rem 1.5rem' }}>
      {/* Background ambient */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '20%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.06), transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '20%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.06), transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              color: '#22d3ee',
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            LEADERSHIP
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              color: '#f1f5f9',
              lineHeight: 1.15,
              marginBottom: '1rem',
            }}
          >
            Meet the{' '}
            <span
              style={{
                backgroundImage: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 50%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Founders
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ color: '#64748b', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}
          >
            The visionaries building India's most powerful startup platform
          </motion.p>
        </div>

        {/* ── Cards — always side by side on md+ ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.75rem',
            maxWidth: '860px',
            margin: '0 auto',
          }}
          className="leadership-grid"
        >
          {founders.map((founder, index) => (
            <FounderCard key={founder.name} founder={founder} index={index} />
          ))}
        </div>
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 640px) {
          .leadership-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Leadership;
