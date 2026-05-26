'use client';

import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkflowEventPayload } from '@sentinel/shared';
import { Surface, SectionTitle, Eyebrow } from '@/components/platform/surface';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Play, Info, RotateCw, Terminal, Activity } from 'lucide-react';

function eventIcon(type: string) {
  const isFailed = type.includes('failed');
  const isDone = type.includes('completed') || type.includes('generated') || type === 'workflow.completed';
  const isStarted = type.includes('started') || type === 'retry.triggered';

  if (isFailed) {
    return {
      Icon: XCircle,
      tone: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]',
      dotColor: '#ef4444'
    };
  }
  if (isDone) {
    return {
      Icon: CheckCircle2,
      tone: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
      dotColor: '#10b981'
    };
  }
  if (isStarted) {
    return {
      Icon: Play,
      tone: 'bg-violet-500/10 text-violet-300 border-violet-500/25 shadow-[0_0_12px_rgba(139,92,246,0.15)]',
      dotColor: '#8b5cf6'
    };
  }
  return {
    Icon: Info,
    tone: 'bg-zinc-800/40 text-zinc-400 border-white/[0.04]',
    dotColor: '#64748b'
  };
}

export function WorkflowTimelineStream({ events }: { events: WorkflowEventPayload[] }) {
  return (
    <Surface variant="raised" className="flex h-full min-h-[360px] flex-col p-5 bg-[rgba(17,24,39,0.75)] border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-[20px]">
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4 mb-4">
        <div>
          <Eyebrow className="text-zinc-500 font-semibold tracking-widest text-[10px]">EVENT STREAM</Eyebrow>
          <SectionTitle className="mt-1 text-sm font-bold text-white">Live Workflow Timeline</SectionTitle>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[rgba(16,185,129,0.2)] bg-[#10b981]/8 px-2.5 py-0.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-[#10b981] opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-[#10b981]" />
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#10b981]">Streaming</span>
        </div>
      </div>

      <div className="relative mt-2 flex-1 overflow-y-auto pr-1 max-h-[300px] scrollbar-thin">
        {events.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/5 text-violet-400 border border-violet-500/10 mb-4"
            >
              <Activity className="h-5 w-5 animate-pulse" />
            </motion.div>
            <p className="text-xs font-semibold text-zinc-400">Awaiting workflow execution</p>
            <p className="mt-1 text-[11px] text-zinc-600">Events will stream here in real time.</p>
          </div>
        ) : (
          <ul className="relative space-y-0 pl-1">
            <div className="absolute bottom-2 left-[19px] top-2 w-[1.5px] bg-gradient-to-b from-[#8b5cf6]/40 via-zinc-700/30 to-transparent" />
            <AnimatePresence initial={false}>
              {[...events].reverse().map((e, i) => {
                const { Icon, tone } = eventIcon(e.type);
                const isFirst = i === 0;
                return (
                  <motion.li
                    key={`${e.timestamp}-${e.type}-${events.length - 1 - i}`}
                    initial={isFirst ? { opacity: 0, x: -10, y: 0 } : { opacity: 0 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className={cn(
                      "relative flex gap-4 pb-5 last:pb-2 pt-1 group",
                      isFirst && "bg-white/[0.015] rounded-xl p-2.5 -mx-2.5 mb-2.5 border border-white/[0.03]"
                    )}
                  >
                    <span
                      className={cn(
                        'relative z-10 flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg border text-xs transition-transform group-hover:scale-105',
                        tone,
                        e.type.includes('started') && 'animate-pulse',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-baseline justify-between gap-2.5">
                        <p className="text-xs font-semibold text-zinc-200 leading-snug group-hover:text-white transition-colors">{e.message}</p>
                        <time className="shrink-0 text-[10px] font-mono tabular-nums text-zinc-500">
                          {format(new Date(e.timestamp), 'HH:mm:ss')}
                        </time>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-[9px] font-mono px-1 rounded bg-[#0b1020] border border-white/[0.04] text-zinc-500 tracking-tight">
                          {e.type.replace(/\./g, ' · ')}
                        </span>
                        {e.retryCount != null && (
                          <span className="text-[9px] font-semibold px-1 rounded bg-amber-500/10 border border-amber-500/10 text-amber-400">
                            Retry #{e.retryCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </Surface>
  );
}
