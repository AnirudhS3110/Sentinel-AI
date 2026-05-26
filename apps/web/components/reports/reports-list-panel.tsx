'use client';

import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import type { Incident } from '@/lib/types';
import { incidentDisplayId } from '@/lib/reports-filters';
import { ReportSeverityBadge } from './severity-badge';
import { cn } from '@/lib/utils';

export function ReportsListPanel({
  incidents,
  selectedId,
  onSelect,
  totalLabel,
}: {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  totalLabel: number;
}) {
  return (
    <div className="flex h-full w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(17,24,39,0.7)] shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-[20px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-4 py-4">
        <p className="text-[14px] font-semibold text-[#f8fafc]">All Reports</p>
        <span className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0b1020] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#64748b]">
          {totalLabel}
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b1020]">
              <svg className="h-5 w-5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <p className="text-[13px] font-medium text-[#64748b]">No reports match</p>
            <p className="mt-1 text-[11px] text-[#475569]">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="p-2">
            {incidents.map((inc, i) => {
              const selected = inc.id === selectedId;
              return (
                <motion.button
                  key={inc.id}
                  type="button"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.15), duration: 0.25 }}
                  onClick={() => onSelect(inc.id)}
                  className={cn(
                    'group relative mb-1.5 flex w-full flex-col rounded-xl border px-4 py-3 text-left transition-all duration-200',
                    selected
                      ? 'border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.08)]'
                      : 'border-transparent bg-transparent hover:border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.03)]',
                  )}
                >
                  {/* Active left accent */}
                  {selected && (
                    <span
                      className="absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-r-full bg-[#8b5cf6]"
                      style={{ boxShadow: '0 0 10px rgba(139,92,246,0.7)' }}
                    />
                  )}
                  <div className="flex items-start justify-between gap-2 pl-1">
                    <p className="line-clamp-1 flex-1 text-[12px] font-semibold text-[#f1f5f9]">
                      {inc.title}
                    </p>
                    <ReportSeverityBadge severity={inc.severity} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between pl-1">
                    <span className="font-mono text-[10px] text-[#475569]">
                      {incidentDisplayId(inc.id)}
                    </span>
                    <span className="text-[10px] text-[#475569]">
                      {formatDistanceToNow(new Date(inc.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {incidents.length > 0 && (
        <div className="border-t border-[rgba(255,255,255,0.06)] p-2">
          <button
            type="button"
            className="w-full rounded-lg py-2 text-[11px] font-semibold text-[#8b5cf6] transition-colors hover:bg-[#8b5cf6]/8 hover:text-[#a78bfa]"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
