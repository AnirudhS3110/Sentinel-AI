'use client';

import { motion } from 'framer-motion';
import type { Incident } from '@/lib/types';
import { Surface, SectionTitle, Eyebrow } from '@/components/platform/surface';
import { cn } from '@/lib/utils';

const AGENTS = [
  { type: 'PLANNER', label: 'Planner' },
  { type: 'CLASSIFICATION', label: 'Classification' },
  { type: 'ANALYSIS', label: 'Analysis' },
  { type: 'VALIDATION', label: 'Validation' },
  { type: 'REMEDIATION', label: 'Remediation' },
  { type: 'REPORT_GENERATION', label: 'Report' },
];

function aggregateAgentStatus(incidents: Incident[], agentType: string): 'COMPLETED' | 'RUNNING' | 'PENDING' | 'FAILED' {
  let running = 0;
  let failed = 0;
  let completed = 0;
  for (const inc of incidents) {
    const wf = inc.workflowExecutions?.[0];
    const exec = wf?.agentExecutions?.filter((e) => e.agentType === agentType).sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    )[0];
    if (!exec) continue;
    if (exec.status === 'RUNNING' || exec.status === 'RETRYING') running++;
    else if (exec.status === 'FAILED') failed++;
    else if (exec.status === 'COMPLETED') completed++;
  }
  if (running) return 'RUNNING';
  if (failed) return 'FAILED';
  if (completed) return 'COMPLETED';
  return 'PENDING';
}

function Sparkline({ status }: { status: string }) {
  const running = status === 'RUNNING';
  const done = status === 'COMPLETED';
  const points = done
    ? '0,12 4,8 8,10 12,5 16,7 20,3 24,6'
    : running
      ? '0,10 3,6 6,9 9,4 12,8 15,3 18,7 21,5 24,8'
      : '0,12 12,12 24,12';
  return (
    <svg viewBox="0 0 24 14" className="mt-3 h-7 w-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={running ? '#8b5cf6' : done ? '#14b8a6' : '#374151'}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={running ? 1 : done ? 0.7 : 0.4}
      />
    </svg>
  );
}

export function FleetAgents({ incidents }: { incidents: Incident[] }) {
  return (
    <Surface variant="raised" className="p-5">
      <Eyebrow>Agent fleet</Eyebrow>
      <SectionTitle className="mt-1">Execution status</SectionTitle>
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {AGENTS.map((a, i) => {
          const status = aggregateAgentStatus(incidents, a.type);
          const running = status === 'RUNNING';
          return (
            <motion.div
              key={a.type}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -2 }}
              className={cn(
                'rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0b1020]/80 p-3 transition-shadow',
                running && 'shadow-[0_0_28px_-6px_rgba(139,92,246,0.45)]',
              )}
            >
              <div className="flex items-start justify-between gap-1">
                <p className="text-xs font-medium text-[#f8fafc]">{a.label}</p>
                <StatusPill status={status} />
              </div>
              <Sparkline status={status} />
            </motion.div>
          );
        })}
      </div>
    </Surface>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide',
        status === 'COMPLETED' && 'bg-[#10b981]/15 text-[#10b981]',
        status === 'RUNNING' && 'bg-[#8b5cf6]/20 text-[#a78bfa]',
        status === 'FAILED' && 'bg-[#ef4444]/15 text-[#ef4444]',
        status === 'PENDING' && 'bg-[#161f33] text-[#6b7280]',
      )}
    >
      {status}
    </span>
  );
}
