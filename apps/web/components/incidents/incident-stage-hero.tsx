'use client';

import { useEffect, useState } from 'react';
import type { Incident } from '@/lib/types';
import { statusLabel } from '@/lib/status';
import { Surface, Eyebrow } from '@/components/platform/surface';
import { StageStepper } from './stage-stepper';
import { SeverityBadge, StatusBadge } from './status-badge';
import { StatusIndicator, statusToTone } from '@/components/ui/status-indicator';
import { cn } from '@/lib/utils';
import { Timer, RefreshCw, Layers, HelpCircle } from 'lucide-react';

const stageCopy: Partial<Record<string, string>> = {
  PLANNING: 'Formulating multi-agent coordination plan from logs and SRE parameters.',
  CLASSIFICATION: 'Triaging severity thresholds, classifying tags, and routing signals.',
  ROOT_CAUSE_ANALYSIS: 'Analyzing patterns and parsing system traces for root causes.',
  VALIDATION: 'Performing verification checks on service health and stability.',
  REMEDIATION: 'Synthesizing mitigation patches and executing remediation steps.',
  REPORT_GENERATION: 'Compiling executive summary, timeline graphs, and runbooks.',
  RESOLVED: 'Resolution verified. All service level objectives recovered.',
  FAILED: 'Orchestrator pipeline failed. Requires operator intervention.',
};

export function IncidentStageHero({
  incident,
  workflowStartedAt,
  retryCount,
  rootCause,
  live,
}: {
  incident: Incident;
  workflowStartedAt?: string;
  retryCount: number;
  rootCause?: string | null;
  live: boolean;
}) {
  const [elapsed, setElapsed] = useState('00:00:00');
  const isRunning = !['RESOLVED', 'FAILED'].includes(incident.status);

  useEffect(() => {
    if (!workflowStartedAt) {
      setElapsed('00:00:00');
      return;
    }

    const start = new Date(workflowStartedAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, now - start);
      
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setElapsed([
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0')
      ].join(':'));
    };

    updateTimer();

    if (!isRunning) {
      const end = incident.updatedAt ? new Date(incident.updatedAt).getTime() : Date.now();
      const diff = Math.max(0, end - start);
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setElapsed([
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0')
      ].join(':'));
      return;
    }

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [workflowStartedAt, isRunning, incident.updatedAt]);

  return (
    <Surface
      variant="glass"
      className="relative overflow-hidden bg-gradient-to-br from-violet-950/20 via-[#0c0c12] to-[#0a0a0f] p-6 md:p-8 border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <Eyebrow className="text-zinc-500 font-semibold tracking-widest text-[10px]">CURRENT PIPELINE STAGE</Eyebrow>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              {statusLabel(incident.status)}
            </h2>
            {isRunning && (
              <span className="relative flex h-2 w-2 ml-1">
                <span className="absolute h-full w-full animate-ping rounded-full bg-amber-500 opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-amber-500" />
              </span>
            )}
            <span className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              isRunning ? "bg-amber-500/10 text-amber-300 border border-amber-500/20" : 
              incident.status === 'RESOLVED' ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" :
              "bg-red-500/10 text-red-300 border border-red-500/20"
            )}>
              {isRunning ? 'Running' : incident.status === 'RESOLVED' ? 'Resolved' : 'Failed'}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {stageCopy[incident.status] ?? incident.description ?? 'Autonomous SRE agent fleet is processing this incident.'}
          </p>
        </div>
      </div>

      <StageStepper status={incident.status} />

      <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/[0.06] pt-6 md:grid-cols-4">
        <Metric 
          label="PIPELINE DURATION" 
          value={elapsed} 
          icon={Timer} 
          valueClass="font-mono text-base tracking-wider text-violet-300"
        />
        <Metric 
          label="STAGE RETRIES" 
          value={String(retryCount)} 
          icon={RefreshCw} 
          valueClass="font-mono text-base"
        />
        <Metric 
          label="INCIDENT CATEGORY" 
          value={incident.category ?? 'Unassigned'} 
          icon={Layers}
        />
        <Metric 
          label="ROOT CAUSE SUMMARY" 
          value={rootCause ?? 'Calculating...'} 
          icon={HelpCircle} 
          truncate
        />
      </div>
    </Surface>
  );
}

function Metric({ 
  label, 
  value, 
  icon: Icon,
  truncate,
  valueClass 
}: { 
  label: string; 
  value: string; 
  icon: React.ComponentType<{ className?: string }>;
  truncate?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="bg-white/[0.01] border border-white/[0.03] rounded-xl p-3 backdrop-blur-[10px]">
      <div className="flex items-center gap-1.5 text-zinc-500">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className={cn(
        'mt-1.5 text-sm font-semibold text-zinc-100', 
        truncate && 'line-clamp-2 text-xs leading-relaxed text-zinc-300',
        valueClass
      )}>
        {value}
      </p>
    </div>
  );
}
