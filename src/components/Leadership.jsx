import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TiltCard = ({ founder }) => {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Mouse position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring configuration for smooth movement
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Transforms for 3D rotation
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize values to range [-0.5, 0.5]
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 hover:border-cyan-500/30 transition-colors duration-500 shadow-2xl flex flex-col items-center"
    >
      {/* Decorative Glow that follows mouse */}
      {hovered && (
        <motion.div
          className="absolute inset-0 rounded-[2.5rem] opacity-20 pointer-events-none"
          style={{
            background: useTransform(
              [mouseXSpring, mouseYSpring],
              ([xVal, yVal]) => `radial-gradient(600px circle at ${50 + xVal * 100}% ${50 + yVal * 100}%, rgba(34, 211, 238, 0.4), transparent 40%)`
            ),
          }}
        />
      )}

      {/* Avatar with 3D Pop */}
      <div 
        style={{ transform: "translateZ(50px)" }}
        className="relative p-1 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-blue-600 w-28 h-28 mb-8 shadow-glow"
      >
        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-5xl">
          {founder.emoji}
        </div>
      </div>

      <div style={{ transform: "translateZ(30px)" }} className="text-center">
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
          {founder.name}
        </h3>
        <p className="text-cyan-400 font-semibold text-xs tracking-widest uppercase mb-6">
          {founder.role}
        </p>
        
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-slate-700 to-transparent mx-auto mb-6" />

        <p className="text-slate-300 text-sm leading-relaxed italic opacity-90 max-w-[280px]">
          "{founder.quote}"
        </p>
      </div>

      {/* Subtle border shine effect */}
      <div className="absolute inset-px rounded-[2.5rem] border border-white/5 pointer-events-none" />
    </motion.div>
  );
};

const Leadership = () => {
  const founders = [
    {
      emoji: "👨‍💻",
      name: "Jai Anand",
      role: "Founder, CEO & Lead Developer",
      quote: "Launchpad Bharat was born out of a simple vision: To democratize startup building for every Indian creator. Budget should never stop a great idea."
    },
    {
      emoji: "🚀",
      name: "Abhay Bansal",
      role: "Co-Founder & Head of Strategy",
      quote: "We combine technical excellence with strategic vision to empower India's next generation of entrepreneurs. Together, we make success accessible."
    }
  ];

  return (
    <section className="relative overflow-hidden py-24 px-4">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-cyan-400 text-xs tracking-[0.3em] uppercase font-bold mb-3"
          >
            LEADERSHIP
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white"
          >
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Founders</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto w-full">
          {founders.map((founder, index) => (
            <TiltCard key={index} founder={founder} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leadership;
