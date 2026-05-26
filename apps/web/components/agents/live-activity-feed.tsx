'use client';

import { ArrowRight, CheckCircle2, PlayCircle, AlertTriangle, RotateCcw, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { ActivityEvent } from '@/lib/agents-data';
import { cn } from '@/lib/utils';

const toneIcon = {
  success: { Icon: CheckCircle2, className: 'text-[#10b981] bg-[#10b981]/12', dot: '#10b981' },
  running: { Icon: PlayCircle, className: 'text-[#3b82f6] bg-[#3b82f6]/12', dot: '#3b82f6' },
  warn: { Icon: AlertTriangle, className: 'text-[#ef4444] bg-[#ef4444]/12', dot: '#ef4444' },
  retry: { Icon: RotateCcw, className: 'text-[#f59e0b] bg-[#f59e0b]/12', dot: '#f59e0b' },
  info: { Icon: FileText, className: 'text-[#8b5cf6] bg-[#8b5cf6]/12', dot: '#8b5cf6' },
};

export function LiveActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(17,24,39,0.7)] shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-[20px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[14px] font-semibold text-[#f8fafc]">Live Agent Activity</h3>
          <div className="flex items-center gap-1.5 rounded-full border border-[rgba(16,185,129,0.2)] bg-[#10b981]/8 px-2 py-0.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-[#10b981] opacity-60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[#10b981]">Live</span>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="group flex items-center gap-1 text-[11px] font-medium text-[#8b5cf6] transition-colors hover:text-[#a78bfa]"
        >
          View all activity
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Feed */}
      <div className="relative flex-1 overflow-hidden">
        <ul className="divide-y divide-[rgba(255,255,255,0.04)]">
          <AnimatePresence initial={false}>
            {events.map((e, i) => {
              const { Icon, className, dot } = toneIcon[e.tone];
              const isFirst = i === 0;
              return (
                <motion.li
                  key={e.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ delay: isFirst ? 0 : i * 0.05, duration: 0.3, ease: 'easeOut' }}
                  className={cn(
                    'group flex items-center gap-3 px-5 py-3 transition-colors duration-150',
                    isFirst ? 'bg-[rgba(255,255,255,0.02)]' : 'hover:bg-[rgba(255,255,255,0.02)]',
                  )}
                >
                  <span
                    className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', className)}
                    style={{ boxShadow: `0 0 12px ${dot}20` }}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-[#f8fafc]">{e.agentName}</p>
                    <p className="mt-0.5 truncate text-[11px] text-[#64748b]">{e.message}</p>
                  </div>
                  <span className="shrink-0 rounded-md border border-[rgba(255,255,255,0.05)] bg-[#0b1020] px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-[#64748b]">
                    {e.time}
                  </span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[rgba(17,24,39,0.8)] to-transparent" />
      </div>
    </div>
  );
}
