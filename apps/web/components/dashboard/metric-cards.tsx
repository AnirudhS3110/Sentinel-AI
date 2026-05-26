'use client';

import { motion } from 'framer-motion';
import type { Incident } from '@/lib/types';
import { cn } from '@/lib/utils';

const configs = [
  {
    key: 'active',
    label: 'Active incidents',
    gradient: 'from-violet-500/20 to-violet-600/5',
    accent: 'text-violet-300',
    dot: 'bg-violet-400',
  },
  {
    key: 'running',
    label: 'Running workflows',
    gradient: 'from-amber-500/15 to-amber-600/5',
    accent: 'text-amber-300',
    dot: 'bg-amber-400',
  },
  {
    key: 'failed',
    label: 'Failed executions',
    gradient: 'from-red-500/15 to-red-600/5',
    accent: 'text-red-300',
    dot: 'bg-red-400',
  },
  {
    key: 'resolved',
    label: 'Resolved',
    gradient: 'from-emerald-500/15 to-emerald-600/5',
    accent: 'text-emerald-300',
    dot: 'bg-emerald-400',
  },
] as const;

export function MetricCards({ incidents }: { incidents: Incident[] }) {
  const values = {
    active: incidents.filter((i) => !['RESOLVED', 'FAILED'].includes(i.status)).length,
    running: incidents.filter((i) =>
      ['PLANNING', 'CLASSIFICATION', 'ROOT_CAUSE_ANALYSIS', 'VALIDATION', 'REMEDIATION', 'REPORT_GENERATION', 'HUMAN_APPROVAL'].includes(i.status),
    ).length,
    failed: incidents.filter((i) => i.status === 'FAILED').length,
    resolved: incidents.filter((i) => i.status === 'RESOLVED').length,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {configs.map((c, i) => (
        <motion.div
          key={c.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className={cn(
            'group relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br p-5 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:shadow-lg hover:shadow-violet-500/5',
            c.gradient,
          )}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-400">{c.label}</p>
            <span className={cn('h-2 w-2 rounded-full', c.dot)} />
          </div>
          <p className={cn('mt-3 text-3xl font-semibold tabular-nums tracking-tight', c.accent)}>
            {values[c.key]}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
