'use client';

import { motion } from 'framer-motion';

export function AnimatedBeam({ className }: { className?: string }) {
  return (
    <svg className={className} width="120" height="24" viewBox="0 0 120 24" fill="none">
      <motion.path
        d="M0 12 H120"
        stroke="url(#beam-gradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0.3 }}
        animate={{ pathLength: 1, opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        r="3"
        fill="#a78bfa"
        initial={{ cx: 0, cy: 12 }}
        animate={{ cx: [0, 120, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <defs>
        <linearGradient id="beam-gradient" x1="0" y1="0" x2="120" y2="0">
          <stop stopColor="#8b5cf6" stopOpacity="0" />
          <stop offset="0.5" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
