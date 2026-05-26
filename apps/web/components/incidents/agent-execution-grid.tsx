'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { AgentExecution } from '@/lib/types';
import { Surface, SectionTitle, Eyebrow } from '@/components/platform/surface';
import { cn } from '@/lib/utils';
import { MiniSparkline } from '@/components/agents/mini-sparkline';
import { 
  GitBranch, 
  Boxes, 
  SearchCode, 
  ShieldCheck, 
  Wrench, 
  FileText, 
  HelpCircle,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';

const AGENTS = [
  { type: 'PLANNER', label: 'Planner', icon: GitBranch, color: '#8b5cf6' },
  { type: 'CLASSIFICATION', label: 'Classification', icon: Boxes, color: '#3b82f6' },
  { type: 'ROOT_CAUSE_ANALYSIS', label: 'Analysis', icon: SearchCode, color: '#06b6d4' },
  { type: 'VALIDATION', label: 'Validation', icon: ShieldCheck, color: '#10b981' },
  { type: 'REMEDIATION', label: 'Remediation', icon: Wrench, color: '#f59e0b' },
  { type: 'REPORT_GENERATION', label: 'Report', icon: FileText, color: '#ef4444' },
];

function latest(executions: AgentExecution[], type: string) {
  return executions
    .filter((e) => e.agentType === type)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0];
}

export function AgentExecutionGrid({ executions }: { executions: AgentExecution[] }) {
  return (
    <Surface variant="raised" className="flex flex-col h-full p-5 bg-[rgba(17,24,39,0.75)] border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-[20px]">
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4 mb-4">
        <div>
          <Eyebrow className="text-zinc-500 font-semibold tracking-widest text-[10px]">OPERATIONAL FLEET</Eyebrow>
          <SectionTitle className="mt-1 text-sm font-bold text-white">Agent Executions</SectionTitle>
        </div>
        <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider font-mono">
          {executions.length} Total Runs
        </span>
      </div>
      
      <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((a, i) => (
          <AgentTile key={a.type} agent={a} exec={latest(executions, a.type)} index={i} />
        ))}
      </div>
    </Surface>
  );
}

function AgentTile({
  agent,
  exec,
  index,
}: {
  agent: { type: string; label: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string };
  exec?: AgentExecution;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const status = exec?.status ?? 'PENDING';
  const running = status === 'RUNNING' || status === 'RETRYING';
  const done = status === 'COMPLETED';
  const failed = status === 'FAILED';

  const Icon = agent.icon;

  // Generate sparkline values based on agent execution state
  const sparkData = done 
    ? [20, 24, 22, 28, 32, 30, 36, 38, 42] 
    : running 
    ? [10, 15, 12, 18, 22, 25, 28, 30, 32] 
    : failed 
    ? [40, 38, 32, 28, 24, 15, 8, 4, 2] 
    : [10, 10, 10, 10, 10, 10, 10, 10, 10];

  const sparkColor = done 
    ? '#10b981' 
    : running 
    ? '#f59e0b' 
    : failed 
    ? '#ef4444' 
    : '#475569';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-white/[0.01] p-4 transition-all duration-300',
        'hover:bg-white/[0.03] hover:border-white/[0.12] hover:-translate-y-0.5',
        running && 'border-amber-500/25 shadow-[0_0_24px_-4px_rgba(245,158,11,0.15)] bg-amber-500/[0.01]',
        done && 'border-emerald-500/10 hover:border-emerald-500/20 bg-emerald-500/[0.005]',
        failed && 'border-red-500/20 bg-red-500/[0.01] hover:border-red-500/35 hover:shadow-[0_0_24px_-4px_rgba(239,68,68,0.15)]',
        !exec && 'border-white/[0.05] opacity-60'
      )}
    >
      {/* Accent glow on top */}
      <div 
        className="pointer-events-none absolute inset-x-0 top-0 h-16 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06]"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${agent.color}, transparent 70%)`
        }}
      />

      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div 
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105"
            style={{
              backgroundColor: `${agent.color}12`,
              boxShadow: `0 0 12px ${agent.color}15`,
            }}
          >
            <Icon className="h-4.5 w-4.5" style={{ color: agent.color }} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#f1f5f9] tracking-tight">{agent.label}</p>
            {exec?.startedAt && (
              <p className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1 font-mono">
                <Clock className="h-3 w-3" />
                {new Date(exec.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            )}
          </div>
        </div>
        <StatusPill status={status} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="w-[60%] shrink-0">
          <MiniSparkline data={sparkData} color={sparkColor} height={28} />
        </div>
        {exec?.durationMs != null ? (
          <span className="text-[11px] font-semibold tabular-nums text-zinc-400 font-mono">
            {exec.durationMs}ms
          </span>
        ) : (
          <span className="text-[10px] text-zinc-600 font-mono">--</span>
        )}
      </div>

      {exec?.output != null && (
        <div className="mt-3.5 pt-3.5 border-t border-white/[0.04]">
          <button
            type="button"
            className="flex items-center justify-between w-full text-[10px] font-semibold text-violet-400/90 hover:text-violet-300 transition-colors"
            onClick={() => setOpen(!open)}
          >
            <span>Agent Output payload</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-500">
              {open ? 'Collapse' : 'Expand'}
            </span>
          </button>
          {open && (
            <pre className="mt-2.5 max-h-24 overflow-auto rounded-lg bg-[#070913] border border-white/[0.05] p-2.5 font-mono text-[9px] text-zinc-400 leading-normal scrollbar-thin">
              {JSON.stringify(exec.output, null, 2)}
            </pre>
          )}
        </div>
      )}
    </motion.div>
  );
}

function StatusPill({ status }: { status: string }) {
  const running = status === 'RUNNING' || status === 'RETRYING';
  const done = status === 'COMPLETED';
  const failed = status === 'FAILED';
  
  return (
    <span
      className={cn(
        'rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border',
        done && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15',
        running && 'bg-amber-500/10 text-amber-300 border-amber-500/15 animate-pulse',
        failed && 'bg-red-500/10 text-red-400 border-red-500/15',
        status === 'PENDING' && 'bg-[#14141a] text-zinc-500 border-white/[0.03]',
      )}
    >
      {status}
    </span>
  );
}
