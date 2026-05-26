'use client';

import { motion } from 'framer-motion';
import type { Incident } from '@/lib/types';
import { Surface, Eyebrow } from '@/components/platform/surface';
import { cn } from '@/lib/utils';

function computeStats(incidents: Incident[]) {
  const runningStatuses = [
    'PLANNING', 'CLASSIFICATION', 'ROOT_CAUSE_ANALYSIS', 'VALIDATION',
    'REMEDIATION', 'REPORT_GENERATION', 'HUMAN_APPROVAL',
  ];
  return {
    active: incidents.filter((i) => !['RESOLVED', 'FAILED'].includes(i.status)).length,
    running: incidents.filter((i) => runningStatuses.includes(i.status)).length,
    failed: incidents.filter((i) => i.status === 'FAILED').length,
    resolved: incidents.filter((i) => i.status === 'RESOLVED').length,
    total: incidents.length,
  };
}

export function DashboardMetrics({ incidents }: { incidents: Incident[] }) {
  const s = computeStats(incidents);
  const healthPct = s.total ? Math.round((s.resolved / s.total) * 100) : 0;

  return (
    <div className="grid grid-cols-12 gap-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-12 md:col-span-5"
      >
        <Surface
          variant="glass"
          className="relative overflow-hidden p-6 md:min-h-[168px]"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-600/20 blur-3xl" />
          <Eyebrow>Needs attention</Eyebrow>
          <p className="mt-3 text-5xl font-semibold tabular-nums tracking-tight text-white md:text-6xl">
            {s.active}
          </p>
          <p className="mt-2 text-sm text-zinc-400">active incidents</p>
          <p className="mt-6 text-xs text-zinc-500">
            <span className="text-amber-300/90">{s.running}</span> workflows executing now
          </p>
        </Surface>
      </motion.div>

      <div className="col-span-12 flex flex-col gap-3 md:col-span-7">
        <div className="grid grid-cols-2 gap-3">
          <CompactStat label="Running" value={s.running} hint="In pipeline" delay={0.05} accent="amber" />
          <CompactStat label="Failed" value={s.failed} hint="Needs review" delay={0.1} accent="red" />
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Surface variant="raised" className="flex items-center justify-between gap-4 p-5">
            <div>
              <Eyebrow>Resolution rate</Eyebrow>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-white">{healthPct}%</p>
              <p className="mt-1 text-xs text-zinc-500">{s.resolved} resolved of {s.total || '—'}</p>
            </div>
            <div className="hidden h-14 w-14 shrink-0 sm:block">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="url(#ring)"
                  strokeWidth="3"
                  strokeDasharray={`${healthPct} 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#8b5cf6" />
                    <stop offset="1" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </Surface>
        </motion.div>
      </div>
    </div>
  );
}

function CompactStat({
  label,
  value,
  hint,
  delay,
  accent,
}: {
  label: string;
  value: number;
  hint: string;
  delay: number;
  accent: 'amber' | 'red';
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Surface variant="raised" className="p-4 transition-transform hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <Eyebrow>{label}</Eyebrow>
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              accent === 'amber' ? 'bg-amber-400/80' : 'bg-red-400/80',
            )}
          />
        </div>
        <p className="mt-3 text-2xl font-semibold tabular-nums text-zinc-100">{value}</p>
        <p className="mt-1 text-[11px] text-zinc-500">{hint}</p>
      </Surface>
    </motion.div>
  );
}
