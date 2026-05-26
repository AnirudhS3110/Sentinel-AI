'use client';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import type { WorkflowRun } from '@/lib/workflows-data';
import { chartDurationTrend } from '@/lib/workflows-data';

const GlassTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'rgba(11,16,32,0.95)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        backdropFilter: 'blur(20px)',
        padding: '8px 12px',
        fontSize: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <p style={{ color: '#64748b', marginBottom: 4, fontSize: 10 }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, fontWeight: 600 }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export function WorkflowCharts({ runs }: { runs: WorkflowRun[] }) {
  const duration = chartDurationTrend(runs);
  const retryData = duration.map((d, i) => ({
    label: d.label,
    rate: Math.max(0, 4 - (i % 3)),
  }));
  const throughput = duration.map((d, i) => ({
    label: d.label,
    count: 140 + i * 12,
  }));

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <ChartCard title="Execution Duration" subtitle="Avg ms per run">
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={duration} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-duration" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <filter id="glow-purple-line" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip content={<GlassTooltip />} />
            <Area
              type="monotone"
              dataKey="ms"
              name="Duration"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#grad-duration)"
              dot={false}
              animationDuration={1000}
              style={{ filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.7))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Retry Rate" subtitle="Retries per workflow">
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={retryData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-retry" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip content={<GlassTooltip />} />
            <Area
              type="monotone"
              dataKey="rate"
              name="Retries"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#grad-retry)"
              dot={false}
              animationDuration={1000}
              style={{ filter: 'drop-shadow(0 0 5px rgba(245,158,11,0.6))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Throughput" subtitle="Workflows per day">
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={throughput} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-throughput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip content={<GlassTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              name="Count"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#grad-throughput)"
              dot={false}
              animationDuration={1000}
              style={{ filter: 'drop-shadow(0 0 5px rgba(6,182,212,0.6))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(17,24,39,0.7)] p-4 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      <p className="text-[13px] font-semibold text-[#f8fafc]">{title}</p>
      {subtitle && <p className="mt-0.5 text-[10px] text-[#64748b]">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}
