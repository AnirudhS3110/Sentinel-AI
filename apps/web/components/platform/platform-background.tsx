'use client';

import { motion } from 'framer-motion';

export function PlatformBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050816]">
      <motion.div
        className="absolute -left-[10%] top-[-5%] h-[520px] w-[520px] rounded-full opacity-60"
        style={{ background: 'var(--sentinel-glow-radial)' }}
        animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.04, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-8%] top-[25%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[100px]"
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 16, repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.12),transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  );
}
