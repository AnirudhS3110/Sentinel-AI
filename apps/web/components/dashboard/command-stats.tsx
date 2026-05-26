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
  const critical = incidents.filter((i) => i.severity === 'CRITICAL').length;
  return {
    active: incidents.filter((i) => !['RESOLVED', 'FAILED'].includes(i.status)).length,
    running: incidents.filter((i) => runningStatuses.includes(i.status)).length,
    failed: incidents.filter((i) => i.status === 'FAILED').length,
    resolved: incidents.filter((i) => i.status === 'RESOLVED').length,
    critical,
    total: incidents.length,
  };
}

function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.5, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {value}
    </motion.span>
  );
}

export function CommandStats({ incidents }: { incidents: Incident[] }) {
  const s = computeStats(incidents);
  const healthPct = s.total ? Math.round((s.resolved / s.total) * 100) : 0;

  return (
    <div className="grid grid-cols-12 gap-3">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-12 lg:col-span-4"
      >
        <Surface variant="glass" className="relative min-h-[180px] overflow-hidden p-6">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#7c3aed]/25 blur-2xl" />
          <Eyebrow>Operational load</Eyebrow>
          <p className="mt-4 text-5xl font-semibold tabular-nums tracking-tight text-[#f8fafc]">
            <AnimatedNumber value={s.active} />
          </p>
          <p className="mt-2 text-sm text-[#94a3b8]">active incidents</p>
          <div className="mt-6 flex gap-4 text-xs">
            <span>
              <span className="font-semibold text-[#8b5cf6]">{s.running}</span>
              <span className="text-[#64748b]"> running</span>
            </span>
            <span>
              <span className="font-semibold text-[#dc2626]">{s.critical}</span>
              <span className="text-[#64748b]"> critical</span>
            </span>
          </div>
        </Surface>
      </motion.div>

      <div className="col-span-12 grid grid-cols-2 gap-3 lg:col-span-5">
        <StatTile label="In pipeline" value={s.running} accent="purple" delay={0.06} />
        <StatTile label="Failed" value={s.failed} accent="error" delay={0.1} />
        <StatTile label="Resolved" value={s.resolved} accent="success" delay={0.14} className="col-span-2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="col-span-12 lg:col-span-3"
      >
        <Surface variant="elevated" className="flex h-full flex-col justify-between p-5">
          <div>
            <Eyebrow>Health index</Eyebrow>
            <p className="mt-3 text-3xl font-semibold tabular-nums text-[#f8fafc]">{healthPct}%</p>
            <p className="mt-1 text-xs text-[#64748b]">resolution rate</p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#161f33]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--sentinel-gradient)' }}
              initial={{ width: 0 }}
              animate={{ width: `${healthPct}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </Surface>
      </motion.div>
    </div>
  );
}

function StatTile({
  label,
  value,
  accent,
  delay,
  className,
}: {
  label: string;
  value: number;
  accent: 'purple' | 'error' | 'success';
  delay: number;
  className?: string;
}) {
  const dot =
    accent === 'purple' ? 'bg-[#8b5cf6]' : accent === 'error' ? 'bg-[#ef4444]' : 'bg-[#10b981]';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={className}
    >
      <Surface
        variant="raised"
        className="group p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(124,58,237,0.25)]"
      >
        <div className="flex items-center justify-between">
          <Eyebrow>{label}</Eyebrow>
          <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
        </div>
        <p className="mt-3 text-2xl font-semibold tabular-nums text-[#f8fafc]">
          <AnimatedNumber value={value} />
        </p>
      </Surface>
    </motion.div>
  );
}
