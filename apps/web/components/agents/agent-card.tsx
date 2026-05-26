'use client';

import { motion } from 'framer-motion';
import {
  GitBranch,
  Boxes,
  SearchCode,
  ShieldCheck,
  Wrench,
  FileText,
  MoreVertical,
  type LucideIcon,
} from 'lucide-react';
import type { AgentKind, AgentStats } from '@/lib/agents-data';
import { AgentStatusPill } from './agent-status-pill';
import { MiniSparkline } from './mini-sparkline';
import { cn } from '@/lib/utils';

const ICONS: Record<AgentKind, { icon: LucideIcon; color: string; bg: string }> = {
  PLANNER: { icon: GitBranch, color: '#8b5cf6', bg: '#8b5cf6' },
  CLASSIFICATION: { icon: Boxes, color: '#3b82f6', bg: '#3b82f6' },
  ANALYSIS: { icon: SearchCode, color: '#06b6d4', bg: '#06b6d4' },
  VALIDATION: { icon: ShieldCheck, color: '#10b981', bg: '#10b981' },
  REMEDIATION: { icon: Wrench, color: '#f59e0b', bg: '#f59e0b' },
  REPORT_GENERATION: { icon: FileText, color: '#ef4444', bg: '#ef4444' },
};

const SPARK_COLORS = { green: '#10b981', red: '#ef4444', purple: '#a855f7' };

export function AgentCard({ agent, index }: { agent: AgentStats; index: number }) {
  const meta = ICONS[agent.kind];
  const Icon = meta.icon;
  const sparkColor = SPARK_COLORS[agent.sparkTone];
  const isRunning = agent.status === 'active';
  const isError = agent.status === 'error';

  return (
    <motion.article
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4, scale: 1.005 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border bg-[rgba(17,24,39,0.7)] p-5',
        'shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-[20px]',
        'transition-all duration-300',
        isError
          ? 'border-[rgba(239,68,68,0.25)] hover:border-[rgba(239,68,68,0.4)] hover:shadow-[0_16px_48px_rgba(239,68,68,0.15)]'
          : 'border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] hover:shadow-[0_16px_48px_rgba(124,58,237,0.18)]',
      )}
    >
      {/* Subtle top gradient based on agent color */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-[0.06]"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${meta.bg}, transparent 70%)`,
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105"
            style={{
              background: `${meta.bg}18`,
              boxShadow: `0 0 20px ${meta.bg}20`,
            }}
          >
            <Icon className="h-5 w-5" style={{ color: meta.color }} strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold leading-tight text-[#f8fafc]">{agent.name}</h3>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#64748b]">{agent.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <AgentStatusPill status={agent.status} />
          <button
            type="button"
            className="rounded-lg p-1 text-[#475569] opacity-0 transition-all duration-200 hover:bg-[#1b2540] hover:text-[#94a3b8] group-hover:opacity-100"
            aria-label="More options"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-4 gap-0 divide-x divide-[rgba(255,255,255,0.05)] border-y border-[rgba(255,255,255,0.05)] py-4">
        <StatCell label="Executions" value={String(agent.executions)} />
        <StatCell label="Avg Time" value={agent.avgTimeLabel} />
        <StatCell
          label="Success"
          value={`${agent.successRate}%`}
          valueClass={agent.successRate >= 95 ? 'text-[#10b981]' : agent.successRate >= 85 ? 'text-[#f59e0b]' : 'text-[#ef4444]'}
        />
        <StatCell label="Retries" value={String(agent.retries)} />
      </div>

      {/* Sparkline */}
      <div className="mt-4">
        <MiniSparkline data={agent.sparkline} color={sparkColor} height={44} />
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          {isRunning && (
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-[#10b981] opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-[#10b981]" />
            </span>
          )}
          {isError && (
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-[#ef4444] opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-[#ef4444]" />
            </span>
          )}
          <span className="text-[11px] text-[#64748b]">
            Last run: <span className="text-[#94a3b8]">{agent.lastRun ?? '—'}</span>
          </span>
        </div>
        <div className="flex min-w-[110px] items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#0d1117]">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${meta.bg}80, ${meta.color})`,
                boxShadow: `0 0 8px ${meta.color}60`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${agent.participation}%` }}
              transition={{ delay: index * 0.07 + 0.4, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>
          <span className="text-[11px] tabular-nums text-[#94a3b8]">{agent.participation}%</span>
        </div>
      </div>
    </motion.article>
  );
}

function StatCell({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col items-center px-2 first:items-start first:pl-0 last:items-end last:pr-0">
      <p className={cn('text-[13px] font-semibold tabular-nums text-[#f8fafc]', valueClass)}>{value}</p>
      <p className="mt-0.5 text-[10px] text-[#64748b]">{label}</p>
    </div>
  );
}
