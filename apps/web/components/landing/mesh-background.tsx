'use client';

import { motion } from 'framer-motion';

export function MeshBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050816]">
      <motion.div
        className="landing-hero-glow absolute -left-[15%] top-[-8%] h-[600px] w-[600px] opacity-30 mix-blend-screen blur-[120px]"
        animate={{ opacity: [0.25, 0.4, 0.25], x: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-12%] top-[5%] h-[500px] w-[500px] rounded-full bg-[#06b6d4]/20 opacity-30 mix-blend-screen blur-[120px]"
        animate={{ opacity: [0.2, 0.35, 0.2], y: [0, 25, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[-20%] left-[25%] h-[550px] w-[550px] rounded-full bg-[#7c3aed]/15 blur-[130px]"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_45%_at_50%_-5%,rgba(124,58,237,0.14),transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <Particles />
      <BeamLines />
    </div>
  );
}

function Particles() {
  return (
    <>
      {Array.from({ length: 24 }, (_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/40"
          style={{
            left: `${(i * 19 + 5) % 100}%`,
            top: `${(i * 27 + 8) % 100}%`,
          }}
          animate={{ opacity: [0.1, 0.5, 0.1], y: [0, -12, 0] }}
          transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </>
  );
}

function BeamLines() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden>
      <motion.path
        d="M0 400 Q400 200 800 350 T1600 300"
        fill="none"
        stroke="url(#landing-beam)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1, opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <defs>
        <linearGradient id="landing-beam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop stopColor="#7c3aed" stopOpacity="0" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
