'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function GlassCard({
  children,
  className,
  glow = false,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl',
        glow && 'shadow-[0_0_60px_-12px_rgba(139,92,246,0.35)]',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(139,92,246,0.12),transparent_40%)]" />
      </div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export function SpotlightCard({
  children,
  className,
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: string;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30 hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.4)]',
        colSpan,
        className,
      )}
    >
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
