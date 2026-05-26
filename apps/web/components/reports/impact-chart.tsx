'use client';


import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const GlassTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'rgba(11,16,32,0.96)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        backdropFilter: 'blur(20px)',
        padding: '8px 12px',
        fontSize: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <p style={{ color: '#64748b', marginBottom: 6, fontSize: 10, fontWeight: 600 }}>{label}</p>
      {payload.map((entry:any) => (
        <div key={entry.name} className="flex items-center gap-2" style={{ marginBottom: 2 }}>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: entry.color,
              boxShadow: `0 0 6px ${entry.color}`,
            }}
          />
          <span style={{ color: '#94a3b8' }}>{entry.name}:</span>
          <span style={{ color: '#f8fafc', fontWeight: 600 }}>{entry.value}%</span>
        </div>
      ))}
    </div>
  );
};

export function ImpactChart({
  data,
}: {
  data: { time: string; errorRate: number; successRate: number }[];
}) {
  return (
    <div className="h-[210px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="impact-error-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="impact-success-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: '#475569', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#475569', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<GlassTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#64748b', paddingTop: 8 }}
            iconType="circle"
            iconSize={7}
          />
          <Area
            type="monotone"
            dataKey="errorRate"
            name="Error Rate"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#impact-error-grad)"
            dot={false}
            animationDuration={1000}
            animationEasing="ease-out"
            style={{ filter: 'drop-shadow(0 0 5px rgba(239,68,68,0.6))' }}
          />
          <Area
            type="monotone"
            dataKey="successRate"
            name="Success Rate"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#impact-success-grad)"
            dot={false}
            animationDuration={1000}
            animationEasing="ease-out"
            style={{ filter: 'drop-shadow(0 0 5px rgba(16,185,129,0.5))' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
