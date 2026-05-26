'use client';

import { motion } from 'framer-motion';
import {
  Workflow,
  Timer,
  RotateCcw,
  CheckCircle,
  Layers3,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  type LucideIcon,
} from 'lucide-react';
import type { WorkflowFleetMetrics } from '@/lib/workflows-data';
import { MiniSparkline } from '@/components/agents/mini-sparkline';
import { cn } from '@/lib/utils';

const cards: {
  label: string;
  delta: string;
  trendDir: 'up' | 'down' | 'neutral';
  trendGood: boolean; // is "up" good for this metric?
  icon: LucideIcon;
  iconColor: string;
  accentColor: string;
  value: (m: WorkflowFleetMetrics) => string;
  spark: (m: WorkflowFleetMetrics) => number[];
  sparkColor: string;
}[] = [
  {
    label: 'Active Workflows',
    delta: '↑ 4 vs last hour',
    trendDir: 'up',
    trendGood: true,
    icon: Workflow,
    iconColor: '#8b5cf6',
    accentColor: '#8b5cf6',
    value: (m) => String(m.activeWorkflows),
    spark: (m) => m.throughputSpark,
    sparkColor: '#8b5cf6',
  },
  {
    label: 'Avg Runtime',
    delta: '↓ 0.12s vs 7d',
    trendDir: 'down',
    trendGood: true,
    icon: Timer,
    iconColor: '#06b6d4',
    accentColor: '#06b6d4',
    value: (m) => `${m.avgRuntimeSec}s`,
    spark: (m) => m.runtimeSpark.map((v) => v * 40),
    sparkColor: '#06b6d4',
  },
  {
    label: 'Retry Rate',
    delta: '↓ 0.8% vs 7d',
    trendDir: 'down',
    trendGood: true,
    icon: RotateCcw,
    iconColor: '#f59e0b',
    accentColor: '#f59e0b',
    value: (m) => `${m.retryRate}%`,
    spark: (m) => m.retrySpark.map((v) => v * 15),
    sparkColor: '#f59e0b',
  },
  {
    label: 'Success Rate',
    delta: '↑ 1.2% vs 7d',
    trendDir: 'up',
    trendGood: true,
    icon: CheckCircle,
    iconColor: '#10b981',
    accentColor: '#10b981',
    value: (m) => `${m.successRate}%`,
    spark: (m) => m.throughputSpark.map((v) => v * 0.5),
    sparkColor: '#10b981',
  },
  {
    label: 'Queue Depth',
    delta: 'Stable',
    trendDir: 'neutral',
    trendGood: true,
    icon: Layers3,
    iconColor: '#3b82f6',
    accentColor: '#3b82f6',
    value: (m) => String(m.queueDepth),
    spark: (m) => m.throughputSpark,
    sparkColor: '#3b82f6',
  },
  {
    label: 'Running Now',
    delta: 'Live',
    trendDir: 'neutral',
    trendGood: true,
    icon: Activity,
    iconColor: '#10b981',
    accentColor: '#10b981',
    value: (m) => String(m.runningExecutions),
    spark: (m) => m.runtimeSpark.map((v) => v * 35),
    sparkColor: '#10b981',
  },
];

function TrendIcon({ dir, good }: { dir: 'up' | 'down' | 'neutral'; good: boolean }) {
  const color = dir === 'neutral' ? '#64748b' : good ? '#10b981' : '#ef4444';
  if (dir === 'up') return <TrendingUp className="h-3 w-3" style={{ color }} strokeWidth={2} />;
  if (dir === 'down') return <TrendingDown className="h-3 w-3" style={{ color }} strokeWidth={2} />;
  return <Minus className="h-3 w-3" style={{ color }} strokeWidth={2} />;
}

export function WorkflowMetricsRow({ metrics }: { metrics: WorkflowFleetMetrics }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          whileHover={{ y: -3, scale: 1.01 }}
          className={cn(
            'relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)]',
            'bg-[rgba(17,24,39,0.72)] p-4 shadow-[0_8px_28px_rgba(0,0,0,0.22)] backdrop-blur-[20px]',
            'transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]',
          )}
          style={{ minHeight: 110 }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${c.accentColor}50 50%, transparent 100%)`,
            }}
          />

          {/* Top row: icon + sparkline */}
          <div className="flex items-start justify-between gap-2">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: `${c.iconColor}18`,
                boxShadow: `0 0 14px ${c.iconColor}22`,
              }}
            >
              <c.icon className="h-[15px] w-[15px]" style={{ color: c.iconColor }} strokeWidth={1.8} />
            </div>
            {/* Constrained sparkline */}
            <div className="w-[56px] shrink-0">
              <MiniSparkline data={c.spark(metrics)} color={c.sparkColor} height={28} />
            </div>
          </div>

          {/* Value + label */}
          <div className="mt-2">
            <p
              className="text-[20px] font-bold tabular-nums leading-none tracking-tight text-[#f8fafc]"
            >
              {c.value(metrics)}
            </p>
            <p className="mt-1 text-[11px] font-medium leading-tight text-[#64748b]">{c.label}</p>
          </div>

          {/* Delta */}
          <div className="mt-2.5 flex items-center gap-1">
            <TrendIcon dir={c.trendDir} good={c.trendGood} />
            <p className="text-[10px] text-[#64748b]">{c.delta}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
