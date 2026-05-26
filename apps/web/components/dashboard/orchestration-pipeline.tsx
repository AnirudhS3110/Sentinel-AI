'use client';

import { motion } from 'framer-motion';
import type { Incident, IncidentStatus } from '@/lib/types';
import { PIPELINE_STAGES, stageIndex } from '@/lib/workflow-stages';
import { Surface, Eyebrow } from '@/components/platform/surface';
import { cn } from '@/lib/utils';

const stageLabels = PIPELINE_STAGES.map((s) => s.label);

function pickFocusIncident(incidents: Incident[]): Incident | null {
  const running = incidents.find(
    (i) => !['RESOLVED', 'FAILED', 'INCIDENT_CREATED'].includes(i.status),
  );
  return running ?? incidents[0] ?? null;
}

function nodeState(status: IncidentStatus | string, stageKey: IncidentStatus, index: number) {
  const current = stageIndex(status);
  const failed = status === 'FAILED';
  if (failed && index <= Math.max(0, current)) return 'failed';
  if (index < current) return 'done';
  if (index === current) return 'active';
  return 'pending';
}

export function OrchestrationPipeline({ incidents }: { incidents: Incident[] }) {
  const focus = pickFocusIncident(incidents);
  const status = focus?.status ?? 'INCIDENT_CREATED';
  const current = Math.max(0, stageIndex(status));
  const progress = focus ? (current / (PIPELINE_STAGES.length - 1)) * 100 : 0;

  const liveMessage =
    status === 'VALIDATION'
      ? 'Validation agent is verifying database connection pool metrics…'
      : status === 'ROOT_CAUSE_ANALYSIS'
        ? 'Analysis agent correlating logs and telemetry…'
        : status === 'PLANNING'
          ? 'Planner agent building remediation strategy…'
          : focus
            ? `${focus.title} — ${PIPELINE_STAGES[current]?.label ?? 'Orchestrating'}`
            : 'Awaiting incident — pipeline ready';

  return (
    <Surface
      variant="glass"
      className="relative overflow-hidden p-6 md:p-8"
    >
      <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-violet-600/20 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-[60px]" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <Eyebrow>Realtime orchestration</Eyebrow>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#f8fafc] md:text-2xl">
            End-to-end <span className="sentinel-gradient-text">pipeline</span>
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#94a3b8]">
            {focus
              ? `Live execution on ${focus.title}`
              : 'Create an incident to activate the orchestration flow'}
          </p>
        </div>
        {focus && (
          <div className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[#0b1020]/80 px-3 py-1.5">
            <span className="text-[11px] font-medium text-[#94a3b8]">
              {focus.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="relative mt-10">
        <div className="absolute left-0 right-0 top-[18px] h-[3px] overflow-hidden rounded-full bg-[#161f33]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#14b8a6] via-[#8b5cf6] to-[#06b6d4]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="sentinel-beam absolute inset-y-0 w-1/3 opacity-80" />
        </div>

        <div className="relative flex justify-between gap-1">
          {PIPELINE_STAGES.map((stage, i) => {
            const state = nodeState(status, stage.key, i);
            return (
              <motion.div
                key={stage.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center"
              >
                <span
                  className={cn(
                    'relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold transition-all',
                    state === 'done' &&
                      'bg-[#10b981]/20 text-[#10b981] ring-2 ring-[#050816] shadow-[0_0_16px_-2px_rgba(16,185,129,0.5)]',
                    state === 'active' &&
                      'sentinel-pulse-node bg-[#8b5cf6] text-white ring-2 ring-[#a78bfa]/50',
                    state === 'pending' && 'bg-[#111827] text-[#6b7280] ring-2 ring-[#050816]',
                    state === 'failed' && 'bg-[#ef4444]/20 text-[#ef4444] ring-2 ring-[#050816]',
                  )}
                >
                  {state === 'done' ? '✓' : i + 1}
                </span>
                <span
                  className={cn(
                    'mt-3 text-center text-[10px] font-medium sm:text-[11px]',
                    state === 'active' ? 'text-[#a78bfa]' : state === 'done' ? 'text-[#14b8a6]' : 'text-[#64748b]',
                  )}
                >
                  {stageLabels[i]}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        className="relative mt-8 flex items-center gap-3 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0b1020]/60 px-4 py-3"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400/50" />
          <span className="relative h-2 w-2 rounded-full bg-[#10b981]" />
        </span>
        <p className="text-xs font-medium text-[#94a3b8]">
          <span className="text-[#10b981]">LIVE</span>
          <span className="text-[#64748b]"> · </span>
          {liveMessage}
        </p>
      </motion.div>
    </Surface>
  );
}
