'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Panel } from '@/components/platform/panel';
import type { AgentExecution } from '@/lib/types';
const AGENTS = ['PLANNER', 'CLASSIFICATION', 'ANALYSIS', 'VALIDATION', 'REMEDIATION', 'REPORT_GENERATION'];

function agentStatus(executions: AgentExecution[], type: string): AgentExecution | undefined {
  return executions
    .filter((e) => e.agentType === type)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0];
}

function statusVariant(status?: string): 'running' | 'done' | 'failed' | 'default' {
  if (status === 'COMPLETED') return 'done';
  if (status === 'FAILED') return 'failed';
  if (status === 'RUNNING' || status === 'RETRYING') return 'running';
  return 'default';
}

export function AgentGrid({
  executions,
  workflowRetryCount = 0,
}: {
  executions: AgentExecution[];
  workflowRetryCount?: number;
}) {
  return (
    <div className="space-y-3">
      {workflowRetryCount > 0 && (
        <p className="text-xs font-medium text-amber-400/90">Workflow retries: {workflowRetryCount}</p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {AGENTS.map((type) => (
          <AgentCard key={type} type={type} exec={agentStatus(executions, type)} />
        ))}
      </div>
    </div>
  );
}

function AgentCard({ type, exec }: { type: string; exec?: AgentExecution }) {
  const [open, setOpen] = useState(false);
  const label = type.replace(/_/g, ' ');

  return (
    <Panel className="p-4 transition-colors hover:border-violet-500/20">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-white">{label}</p>
        <Badge variant={statusVariant(exec?.status)}>{exec?.status ?? 'PENDING'}</Badge>
      </div>
      <div className="mt-3 space-y-1 text-xs text-zinc-500">
        {exec?.durationMs != null && <p>Duration · {exec.durationMs}ms</p>}
        {exec?.error && <p className="text-red-400">{exec.error}</p>}
      </div>
      {exec?.output != null && (
        <button
          type="button"
          className="mt-3 text-xs font-medium text-violet-400 hover:text-violet-300"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Hide output' : 'View structured output'}
        </button>
      )}
      {open && exec?.output != null && (
        <pre className="mt-2 max-h-36 overflow-auto rounded-lg border border-white/[0.06] bg-black/30 p-3 text-[11px] leading-relaxed text-zinc-300">
          {JSON.stringify(exec.output, null, 2)}
        </pre>
      )}
    </Panel>
  );
}
