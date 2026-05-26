'use client';

import { motion } from 'framer-motion';
import { Activity, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const EVENTS = [
  { icon: CheckCircle2, msg: 'Classification completed — severity HIGH', time: '2s ago', tone: 'success' },
  { icon: Activity, msg: 'Analysis agent correlating Redis timeout patterns', time: '8s ago', tone: 'running' },
  { icon: AlertTriangle, msg: 'Connection pool exhaustion detected in logs', time: '14s ago', tone: 'warn' },
  { icon: Clock, msg: 'Planner generated 4-step remediation strategy', time: '22s ago', tone: 'muted' },
];

export function ActivitySection() {
  return (
    <section id="activity" className="px-6 py-24 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748b]">Observability</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#f8fafc] md:text-[2.5rem]">
              Realtime activity,{' '}
              <span className="landing-gradient-text">command-center grade</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#94a3b8]">
              Every workflow event streams to your team in milliseconds. Timestamps, severity markers,
              and live pulses — the same operational feel as Datadog or Sentry, built for AI orchestration.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="landing-glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4">
              <span className="text-sm font-semibold text-[#f8fafc]">Event stream</span>
              <span className="flex items-center gap-2 text-[11px] text-[#10b981]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-[#00ffb2]/40" />
                  <span className="relative h-2 w-2 rounded-full bg-[#00ffb2]" />
                </span>
                Streaming
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {EVENTS.map((e, i) => (
                <motion.li
                  key={e.msg}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-[rgba(255,255,255,0.06)] hover:bg-[#161f33]/50"
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      e.tone === 'success' && 'bg-[#10b981]/15 text-[#10b981]',
                      e.tone === 'running' && 'bg-[#8b5cf6]/15 text-[#a78bfa]',
                      e.tone === 'warn' && 'bg-[#f59e0b]/15 text-[#f59e0b]',
                      e.tone === 'muted' && 'bg-[#111827] text-[#64748b]',
                    )}
                  >
                    <e.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#f8fafc]">{e.msg}</p>
                    <p className="mt-0.5 text-[11px] text-[#64748b]">{e.time}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
