import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// ─── Particle Orbs floating behind each card ───────────────────────────────
const FloatingOrbs = ({ color1, color2 }) => (
  <>
    <motion.div
      animate={{ y: [0, -18, 0], x: [0, 10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -top-10 -left-10 w-36 h-36 rounded-full blur-[60px] opacity-40 pointer-events-none"
      style={{ background: color1 }}
    />
    <motion.div
      animate={{ y: [0, 14, 0], x: [0, -8, 0], scale: [1, 1.15, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-[50px] opacity-35 pointer-events-none"
      style={{ background: color2 }}
    />
  </>
);

// ─── Shimmer shine overlay ──────────────────────────────────────────────────
const ShineOverlay = ({ mouseX, mouseY, hovered }) => {
  const shineX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const shineY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  return (
    <motion.div
      className="absolute inset-0 rounded-[2rem] pointer-events-none overflow-hidden"
      style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: useTransform(
            [shineX, shineY],
            ([sx, sy]) =>
              `radial-gradient(circle at ${sx} ${sy}, rgba(255,255,255,0.07) 0%, transparent 55%)`,
          ),
        }}
      />
    </motion.div>
  );
};

// ─── 3D Tilt Card ──────────────────────────────────────────────────────────
const TiltCard = ({ founder, index }) => {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg']);
  const glowBg = useTransform(
    [mouseXSpring, mouseYSpring],
    ([xv, yv]) =>
      `radial-gradient(500px circle at ${50 + xv * 100}% ${50 + yv * 100}%, ${founder.glowColor}, transparent 55%)`,
  );

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setHovered(false);
  }, [x, y]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      style={{ perspective: '1200px' }}
    >
      {/* Floating background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <FloatingOrbs color1={founder.orb1} color2={founder.orb2} />
      </div>

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative rounded-[2rem] p-[2px] cursor-default"
      >
        {/* Gradient border */}
        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none"
          style={{
            background: founder.borderGradient,
            opacity: hovered ? 1 : 0.5,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Card body */}
        <div
          className="relative rounded-[1.9rem] overflow-hidden flex flex-col items-center p-10"
          style={{
            background: 'rgba(8, 10, 22, 0.85)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* Dynamic glow following cursor */}
          {hovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: glowBg, opacity: 0.25 }}
            />
          )}

          {/* Shine */}
          <ShineOverlay mouseX={mouseXSpring} mouseY={mouseYSpring} hovered={hovered} />

          {/* ── Avatar Ring ── */}
          <div
            style={{ transform: 'translateZ(60px)', transformStyle: 'preserve-3d' }}
            className="relative mb-8"
          >
            {/* Spinning ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-2 rounded-full"
              style={{
                background: founder.ringGradient,
                opacity: 0.8,
                filter: 'blur(2px)',
              }}
            />
            {/* Pulse ping */}
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
              style={{ background: founder.pingColor }}
            />
            {/* Avatar circle */}
            <div
              className="relative w-28 h-28 rounded-full flex items-center justify-center text-6xl z-10"
              style={{
                background: 'rgba(8,10,22,0.9)',
                border: `2px solid ${founder.avatarBorder}`,
                boxShadow: `0 0 30px ${founder.avatarBorder}55`,
              }}
            >
              {founder.emoji}
            </div>
          </div>

          {/* ── Name ── */}
          <div style={{ transform: 'translateZ(40px)' }} className="text-center mb-1">
            <h3
              className="text-2xl font-extrabold tracking-tight"
              style={{
                background: founder.nameGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
                filter: `drop-shadow(0 0 12px ${founder.nameShadow})`,
              }}
            >
              {founder.name}
            </h3>
          </div>

          {/* ── Role Badge ── */}
          <div style={{ transform: 'translateZ(30px)' }} className="mb-6">
            <span
              className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{
                background: founder.badgeBg,
                color: founder.badgeColor,
                boxShadow: `0 0 16px ${founder.badgeGlow}`,
                border: `1px solid ${founder.badgeColor}44`,
              }}
            >
              {founder.role}
            </span>
          </div>

          {/* Divider */}
          <div
            className="w-16 h-px mb-6"
            style={{ background: founder.dividerGradient }}
          />

          {/* ── Quote ── */}
          <div style={{ transform: 'translateZ(20px)' }}>
            <p className="text-slate-300 text-sm leading-relaxed text-center italic opacity-90 max-w-[280px]">
              "{founder.quote}"
            </p>
          </div>

          {/* Bottom subtle inner border */}
          <div className="absolute inset-px rounded-[1.9rem] border border-white/5 pointer-events-none" />
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Section ───────────────────────────────────────────────────────────
const Leadership = () => {
  const founders = [
    {
      emoji: '👨‍💻',
      name: 'Jai Anand',
      role: 'Founder, CEO & Lead Developer',
      quote:
        "Launchpad Bharat was born out of a simple vision: To democratize startup building for every Indian creator. Whether you're in a metro or a tier-3 city, budget should never stop a great idea. We build the tools, you build the future.",
      // Cyan / blue theme
      glowColor: 'rgba(34, 211, 238, 0.35)',
      orb1: 'radial-gradient(circle, #06b6d4, transparent)',
      orb2: 'radial-gradient(circle, #3b82f6, transparent)',
      borderGradient: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
      ringGradient: 'conic-gradient(from 0deg, #06b6d4, #3b82f6, #06b6d4)',
      pingColor: 'rgba(6, 182, 212, 0.3)',
      avatarBorder: '#06b6d4',
      nameGradient: 'linear-gradient(135deg, #e0f2fe, #38bdf8, #818cf8)',
      nameShadow: '#38bdf8',
      badgeBg: 'rgba(6, 182, 212, 0.12)',
      badgeColor: '#22d3ee',
      badgeGlow: 'rgba(34, 211, 238, 0.4)',
      dividerGradient: 'linear-gradient(90deg, transparent, #22d3ee, transparent)',
    },
    {
      emoji: '🚀',
      name: 'Abhay Bansal',
      role: 'Co-Founder & Head of Strategy',
      quote:
        'We combine technical excellence with strategic vision to empower India\'s next generation of entrepreneurs. Together, we make success accessible to every dreamer.',
      // Purple / pink theme
      glowColor: 'rgba(168, 85, 247, 0.35)',
      orb1: 'radial-gradient(circle, #a855f7, transparent)',
      orb2: 'radial-gradient(circle, #ec4899, transparent)',
      borderGradient: 'linear-gradient(135deg, #a855f7, #ec4899, #f43f5e)',
      ringGradient: 'conic-gradient(from 0deg, #a855f7, #ec4899, #a855f7)',
      pingColor: 'rgba(168, 85, 247, 0.3)',
      avatarBorder: '#a855f7',
      nameGradient: 'linear-gradient(135deg, #f5d0fe, #e879f9, #fb7185)',
      nameShadow: '#e879f9',
      badgeBg: 'rgba(168, 85, 247, 0.12)',
      badgeColor: '#c084fc',
      badgeGlow: 'rgba(192, 132, 252, 0.4)',
      dividerGradient: 'linear-gradient(90deg, transparent, #c084fc, transparent)',
    },
  ];

  return (
    <section className="relative overflow-hidden py-28 px-4">
      {/* Large ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent 65%)', filter: 'blur(80px)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent 65%)', filter: 'blur(80px)' }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ── Section Header ── */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-cyan-400 text-xs tracking-[0.35em] uppercase font-bold mb-4"
          >
            ✦ LEADERSHIP ✦
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight"
          >
            Meet the{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #22d3ee, #a855f7, #f472b6)' }}
            >
              Founders
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base max-w-xl mx-auto"
          >
            The visionaries building India's most powerful startup platform
          </motion.p>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {founders.map((founder, index) => (
            <TiltCard key={founder.name} founder={founder} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leadership;
