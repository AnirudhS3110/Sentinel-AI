'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  GitBranch,
  Boxes,
  SearchCode,
  ShieldCheck,
  Wrench,
  FileText,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NodeVisualState } from '@/lib/workflows-data';

export type WorkflowNodeData = {
  label: string;
  stageKey: string;
  state: NodeVisualState;
  duration: string;
  retries: number;
};

const ICONS: Record<string, LucideIcon> = {
  PLANNING: GitBranch,
  CLASSIFICATION: Boxes,
  ROOT_CAUSE_ANALYSIS: SearchCode,
  VALIDATION: ShieldCheck,
  REMEDIATION: Wrench,
  REPORT_GENERATION: FileText,
  RESOLVED: CheckCircle2,
};

const stateConfig: Record<
  NodeVisualState,
  {
    border: string;
    bg: string;
    shadow: string;
    iconBg: string;
    iconColor: string;
    labelColor: string;
    stateColor: string;
    stateLabel: string;
  }
> = {
  completed: {
    border: 'rgba(16,185,129,0.4)',
    bg: 'rgba(16,185,129,0.08)',
    shadow: '0 0 24px rgba(16,185,129,0.4)',
    iconBg: 'rgba(16,185,129,0.15)',
    iconColor: '#10b981',
    labelColor: '#f1f5f9',
    stateColor: '#10b981',
    stateLabel: 'Completed',
  },
  running: {
    border: 'rgba(139,92,246,0.6)',
    bg: 'rgba(139,92,246,0.1)',
    shadow: '0 0 32px rgba(139,92,246,0.55)',
    iconBg: 'rgba(139,92,246,0.2)',
    iconColor: '#c4b5fd',
    labelColor: '#f8fafc',
    stateColor: '#a78bfa',
    stateLabel: 'Running',
  },
  pending: {
    border: 'rgba(255,255,255,0.07)',
    bg: 'rgba(11,16,32,0.7)',
    shadow: 'none',
    iconBg: 'rgba(255,255,255,0.06)',
    iconColor: '#475569',
    labelColor: '#64748b',
    stateColor: '#334155',
    stateLabel: 'Pending',
  },
  failed: {
    border: 'rgba(239,68,68,0.5)',
    bg: 'rgba(239,68,68,0.08)',
    shadow: '0 0 24px rgba(239,68,68,0.4)',
    iconBg: 'rgba(239,68,68,0.15)',
    iconColor: '#ef4444',
    labelColor: '#f8fafc',
    stateColor: '#ef4444',
    stateLabel: 'Failed',
  },
  retrying: {
    border: 'rgba(245,158,11,0.5)',
    bg: 'rgba(245,158,11,0.08)',
    shadow: '0 0 24px rgba(245,158,11,0.4)',
    iconBg: 'rgba(245,158,11,0.15)',
    iconColor: '#f59e0b',
    labelColor: '#f8fafc',
    stateColor: '#f59e0b',
    stateLabel: 'Retrying',
  },
};

function WorkflowStageNodeComponent({ data }: NodeProps) {
  const d = data as WorkflowNodeData;
  const Icon = ICONS[d.stageKey] ?? GitBranch;
  const cfg = stateConfig[d.state];
  const isRunning = d.state === 'running';
  const isCompleted = d.state === 'completed';
  const isPending = d.state === 'pending';

  return (
    <div
      className={cn(
        'relative rounded-xl border px-3.5 py-2.5 backdrop-blur-md transition-all duration-300',
        isRunning && 'ring-1 ring-[rgba(139,92,246,0.3)]',
        d.state === 'failed' && 'animate-[shake_0.4s_ease-in-out]',
      )}
      style={{
        minWidth: 120,
        borderColor: cfg.border,
        background: cfg.bg,
        boxShadow: cfg.shadow,
        opacity: isPending ? 0.55 : 1,
      }}
    >
      {/* Running shimmer */}
      {isRunning && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute -inset-full animate-[shimmer_2.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
      )}

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 8,
          height: 8,
          background: cfg.iconColor,
          border: 'none',
          boxShadow: `0 0 8px ${cfg.iconColor}80`,
        }}
      />

      {/* Completed check badge */}
      {isCompleted && (
        <div
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#10b981]"
          style={{ boxShadow: '0 0 10px rgba(16,185,129,0.7)' }}
        >
          <CheckCircle2 className="h-3 w-3 text-white" strokeWidth={2.5} />
        </div>
      )}

      {/* Content */}
      <div className="flex items-center gap-2">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          style={{ background: cfg.iconBg }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color: cfg.iconColor }} strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <p
            className="truncate text-[11px] font-semibold leading-tight"
            style={{ color: cfg.labelColor }}
          >
            {d.label}
          </p>
          <div className="mt-0.5 flex items-center gap-1">
            {isRunning && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute h-full w-full animate-ping rounded-full bg-[#8b5cf6] opacity-75" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[#8b5cf6]" />
              </span>
            )}
            <p className="text-[9px] font-medium" style={{ color: cfg.stateColor }}>
              {cfg.stateLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Duration + retries */}
      <div className="mt-1.5 flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-1.5">
        <span
          className="font-mono text-[9px] tabular-nums"
          style={{ color: isRunning ? cfg.stateColor : '#475569' }}
        >
          {d.duration}
        </span>
        {d.retries > 0 && (
          <span className="rounded-full bg-[#f59e0b]/15 px-1.5 py-0.5 text-[8px] font-bold text-[#f59e0b]">
            ↻ {d.retries}
          </span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 8,
          height: 8,
          background: cfg.iconColor,
          border: 'none',
          boxShadow: `0 0 8px ${cfg.iconColor}80`,
        }}
      />
    </div>
  );
}

export const WorkflowStageNode = memo(WorkflowStageNodeComponent);
