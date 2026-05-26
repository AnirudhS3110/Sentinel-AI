'use client';

import { motion } from 'framer-motion';
import {
  Bot,
  Zap,
  CheckCircle,
  Timer,
  BarChart3,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react';
import type { FleetMetrics } from '@/lib/agents-data';
import { MiniSparkline } from './mini-sparkline';
import { cn } from '@/lib/utils';

const cards: {
  key: keyof FleetMetrics | 'successSpark';
  label: string;
  sub: (f: FleetMetrics) => string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  iconClass: string;
  accentColor: string;
  value: (f: FleetMetrics) => string;
  spark: (f: FleetMetrics) => number[];
  sparkColor: string;
}[] = [
  {
    key: 'totalAgents',
    label: 'Total Agents',
    sub: () => 'All systems operational',
    trend: 'neutral',
    icon: Bot,
    iconClass: 'text-[#8b5cf6] bg-[#8b5cf6]/12',
    accentColor: '#8b5cf6',
    value: (f) => String(f.totalAgents),
    spark: () => [40, 45, 42, 48, 50, 52, 50, 55, 58, 60, 58, 62],
    sparkColor: '#8b5cf6',
  },
  {
    key: 'activeExecutions',
    label: 'Active Executions',
    sub: () => 'Across all agents',
    trend: 'up',
    icon: Zap,
    iconClass: 'text-[#3b82f6] bg-[#3b82f6]/12',
    accentColor: '#3b82f6',
    value: (f) => String(f.activeExecutions),
    spark: (f) => f.execSpark,
    sparkColor: '#3b82f6',
  },
  {
    key: 'successRate',
    label: 'Success Rate',
    sub: () => '↑ 2.3% vs last 7 days',
    trend: 'up',
    icon: CheckCircle,
    iconClass: 'text-[#10b981] bg-[#10b981]/12',
    accentColor: '#10b981',
    value: (f) => `${f.successRate}%`,
    spark: (f) => f.successSpark,
    sparkColor: '#10b981',
  },
  {
    key: 'avgResponseSec',
    label: 'Avg Response Time',
    sub: () => '↓ 0.15s vs last 7 days',
    trend: 'down',
    icon: Timer,
    iconClass: 'text-[#06b6d4] bg-[#06b6d4]/12',
    accentColor: '#06b6d4',
    value: (f) => `${f.avgResponseSec}s`,
    spark: (f) => f.timeSpark,
    sparkColor: '#06b6d4',
  },
  {
    key: 'totalExecutions',
    label: 'Total Executions',
    sub: () => '↑ 128 vs last 7 days',
    trend: 'up',
    icon: BarChart3,
    iconClass: 'text-[#8b5cf6] bg-[#8b5cf6]/12',
    accentColor: '#8b5cf6',
    value: (f) => f.totalExecutions.toLocaleString(),
    spark: (f) => f.execSpark,
    sparkColor: '#a855f7',
  },
  {
    key: 'failedExecutions',
    label: 'Failed Executions',
    sub: () => '↓ 18 vs last 7 days',
    trend: 'down',
    icon: AlertCircle,
    iconClass: 'text-[#ef4444] bg-[#ef4444]/12',
    accentColor: '#ef4444',
    value: (f) => String(f.failedExecutions),
    spark: () => [70, 65, 60, 55, 50, 48, 45, 42, 40, 38, 35, 32],
    sparkColor: '#ef4444',
  },
];

export function FleetMetricsRow({ fleet }: { fleet: FleetMetrics }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.06, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          whileHover={{ y: -3, scale: 1.01 }}
          className={cn(
            'relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)]',
            'bg-[rgba(17,24,39,0.7)] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-[20px]',
            'transition-all duration-300 hover:border-[rgba(255,255,255,0.1)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)]',
          )}
          style={{
            minHeight: 108,
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-4 right-4 h-px rounded-full opacity-60"
            style={{ background: `linear-gradient(90deg, transparent, ${c.accentColor}60, transparent)` }}
          />

          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  'mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300',
                  c.iconClass,
                )}
                style={{ boxShadow: `0 0 16px ${c.accentColor}20` }}
              >
                <c.icon className="h-4 w-4" strokeWidth={1.8} />
              </div>
              <p
                className="text-[22px] font-bold tabular-nums tracking-tight text-[#f8fafc]"
                style={{ lineHeight: 1 }}
              >
                {c.value(fleet)}
              </p>
              <p className="mt-1 text-[11px] font-medium text-[#64748b]">{c.label}</p>
            </div>
            <div className="w-[52px] shrink-0">
              <MiniSparkline data={c.spark(fleet)} color={c.sparkColor} height={32} />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            {c.trend === 'up' && (
              <TrendingUp className="h-3 w-3 text-[#10b981]" strokeWidth={2} />
            )}
            {c.trend === 'down' && (
              <TrendingDown className="h-3 w-3" style={{ color: c.key === 'failedExecutions' ? '#10b981' : '#ef4444' }} strokeWidth={2} />
            )}
            <p className="text-[10px] text-[#64748b]">{c.sub(fleet)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
