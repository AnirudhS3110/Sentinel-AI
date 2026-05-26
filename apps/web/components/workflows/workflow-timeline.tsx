'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  FileText,
} from 'lucide-react';
import type { TimelineItem } from '@/lib/workflows-data';
import { cn } from '@/lib/utils';

const toneMap = {
  success: { Icon: CheckCircle2, color: '#10b981', bg: '#10b981/12', dot: '#10b981' },
  running: { Icon: PlayCircle, color: '#3b82f6', bg: '#3b82f6/12', dot: '#3b82f6' },
  warn: { Icon: AlertTriangle, color: '#ef4444', bg: '#ef4444/12', dot: '#ef4444' },
  retry: { Icon: RotateCcw, color: '#f59e0b', bg: '#f59e0b/12', dot: '#f59e0b' },
  info: { Icon: FileText, color: '#8b5cf6', bg: '#8b5cf6/12', dot: '#8b5cf6' },
};

export function WorkflowTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(17,24,39,0.7)] backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-5 py-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#f8fafc]">Live Execution Timeline</h3>
          <p className="mt-0.5 text-[11px] text-[#64748b]">Real-time event stream</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[rgba(16,185,129,0.2)] bg-[#10b981]/8 px-2.5 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-[#10b981] opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-[#10b981]" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[#10b981]">Streaming</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative px-5 py-4">
        {/* Vertical connector */}
        <div className="absolute left-[34px] top-6 bottom-6 w-px bg-gradient-to-b from-[#8b5cf6]/40 via-[#06b6d4]/30 to-transparent" />

        <ul className="max-h-[260px] space-y-1 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const { Icon, color, dot } = toneMap[item.tone];
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
                  className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[rgba(255,255,255,0.03)]"
                >
                  {/* Icon with dot */}
                  <div className="relative z-10 shrink-0">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0b1020]"
                      style={{ boxShadow: `0 0 12px ${dot}20` }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color }} strokeWidth={2} />
                    </span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-[#f8fafc] leading-tight">{item.label}</p>
                    {item.detail && (
                      <p className="mt-0.5 text-[10px] text-[#64748b]">{item.detail}</p>
                    )}
                  </div>

                  {/* Time badge */}
                  <span className="shrink-0 rounded border border-[rgba(255,255,255,0.05)] bg-[#0b1020] px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-[#64748b]">
                    {item.time}
                  </span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
