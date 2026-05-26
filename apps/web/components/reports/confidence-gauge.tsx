'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function ConfidenceGauge({ value = 92 }: { value?: number }) {
  const data = [
    { value, fill: 'url(#confidenceGrad)' },
    { value: 100 - value, fill: 'rgba(22,29,43,0.6)' },
  ];

  const confidenceLabel =
    value >= 90 ? 'High Confidence' : value >= 70 ? 'Medium Confidence' : 'Low Confidence';
  const confidenceColor =
    value >= 90 ? '#10b981' : value >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-[148px] w-[148px]">
        {/* Outer ambient glow ring */}
        <div
          className="absolute inset-[-6px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${confidenceColor}18 0%, transparent 70%)`,
            animation: 'pulse-glow 2.5s ease-in-out infinite',
          }}
        />
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <linearGradient id="confidenceGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="glow-gauge">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={64}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <span className="text-[28px] font-bold tabular-nums leading-none text-[#f8fafc]">
            {value}%
          </span>
          <span className="mt-1 text-[10px] font-medium text-[#64748b]">AI Score</span>
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: confidenceColor, boxShadow: `0 0 6px ${confidenceColor}` }}
          />
          <p className="text-[12px] font-semibold" style={{ color: confidenceColor }}>
            {confidenceLabel}
          </p>
        </div>
        <p className="text-[10px] text-[#64748b]">Based on agent analysis</p>
      </div>
    </div>
  );
}
