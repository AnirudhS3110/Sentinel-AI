'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import type { AgentStats } from '@/lib/agents-data';
import { MiniSparkline } from './mini-sparkline';
import { cn } from '@/lib/utils';

export function AgentPerformanceTable({ agents }: { agents: AgentStats[] }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(17,24,39,0.7)] shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-[20px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-5 py-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#f8fafc]">Agent Performance</h3>
          <p className="mt-0.5 text-[11px] text-[#64748b]">Last 7 days</p>
        </div>
        <Link
          href="/dashboard"
          className="group flex items-center gap-1 text-[11px] font-medium text-[#8b5cf6] transition-colors hover:text-[#a78bfa]"
        >
          View full analytics
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.04)]">
              <th className="px-5 pb-3 pt-3 text-[10px] font-semibold uppercase tracking-wider text-[#475569]">Agent</th>
              <th className="px-3 pb-3 pt-3 text-[10px] font-semibold uppercase tracking-wider text-[#475569]">Success Rate</th>
              <th className="px-3 pb-3 pt-3 text-[10px] font-semibold uppercase tracking-wider text-[#475569]">Avg Response</th>
              <th className="px-3 pb-3 pt-3 text-[10px] font-semibold uppercase tracking-wider text-[#475569]">Trend</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a, i) => {
              const isGood = a.successRate >= 95;
              const rateColor = isGood ? '#10b981' : a.successRate >= 85 ? '#f59e0b' : '#ef4444';
              return (
                <motion.tr
                  key={a.kind}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
                  className={cn(
                    'group relative border-b border-[rgba(255,255,255,0.04)] transition-colors duration-150 last:border-0',
                    'hover:bg-[rgba(255,255,255,0.025)]',
                  )}
                >
                  {/* Left accent on hover */}
                  <td className="relative px-5 py-3.5">
                    <span className="absolute left-0 top-1/2 h-0 w-[2px] -translate-y-1/2 rounded-r-full bg-[#8b5cf6] opacity-0 transition-all duration-200 group-hover:h-6 group-hover:opacity-100" />
                    <span className="text-[13px] font-semibold text-[#f1f5f9]">{a.name}</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#0d1117]">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${rateColor}80, ${rateColor})` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${a.successRate}%` }}
                          transition={{ delay: i * 0.05 + 0.3, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                        />
                      </div>
                      <span
                        className="text-[12px] font-semibold tabular-nums"
                        style={{ color: rateColor }}
                      >
                        {a.successRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="text-[12px] tabular-nums text-[#94a3b8]">{a.avgTimeLabel}</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {a.status === 'error' ? (
                        <TrendingDown className="h-3 w-3 text-[#ef4444]" strokeWidth={2} />
                      ) : (
                        <TrendingUp className="h-3 w-3 text-[#10b981]" strokeWidth={2} />
                      )}
                      <div className="w-20">
                        <MiniSparkline
                          data={a.sparkline}
                          color={a.status === 'error' ? '#ef4444' : '#10b981'}
                          height={24}
                        />
                      </div>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
