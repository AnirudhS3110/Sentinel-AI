'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { WorkflowRun } from '@/lib/workflows-data';
import { workflowDisplayId } from '@/lib/workflows-data';
import { incidentDisplayId } from '@/lib/reports-filters';
import { cn } from '@/lib/utils';

const statusConfig: Record<WorkflowRun['status'], { pill: string; dot: string; label: string }> = {
  running: { pill: 'bg-[#8b5cf6]/12 text-[#a78bfa] border-[rgba(139,92,246,0.2)]', dot: '#8b5cf6', label: 'Running' },
  completed: { pill: 'bg-[#10b981]/12 text-[#10b981] border-[rgba(16,185,129,0.2)]', dot: '#10b981', label: 'Completed' },
  failed: { pill: 'bg-[#ef4444]/12 text-[#ef4444] border-[rgba(239,68,68,0.2)]', dot: '#ef4444', label: 'Failed' },
  retrying: { pill: 'bg-[#f59e0b]/12 text-[#f59e0b] border-[rgba(245,158,11,0.2)]', dot: '#f59e0b', label: 'Retrying' },
};

export function WorkflowRunsTable({
  runs,
  selectedId,
  onSelect,
}: {
  runs: WorkflowRun[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(17,24,39,0.7)] backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-5 py-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#f8fafc]">Workflow Runs</h3>
          <p className="mt-0.5 text-[11px] text-[#64748b]">{runs.length} runs in view</p>
        </div>
        {selectedId && (
          <div className="flex items-center gap-1.5 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[#8b5cf6]/8 px-2.5 py-1">
            <span className="text-[10px] font-medium text-[#a78bfa]">Viewing: {workflowDisplayId(selectedId)}</span>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(11,16,32,0.9)] backdrop-blur-xl">
              {['Workflow ID', 'Incident', 'Status', 'Duration', 'Retries', 'Started', 'Completed'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#475569]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {runs.map((r, i) => {
              const selected = r.id === selectedId;
              const cfg = statusConfig[r.status];
              return (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  onClick={() => onSelect(r.id)}
                  className={cn(
                    'group relative cursor-pointer border-b border-[rgba(255,255,255,0.04)] transition-all duration-150 last:border-0',
                    selected
                      ? 'bg-[rgba(139,92,246,0.08)]'
                      : 'hover:bg-[rgba(255,255,255,0.025)]',
                  )}
                >
                  {/* Active row left border */}
                  <td className="relative px-5 py-3.5 font-mono text-[11px] text-[#64748b]">
                    {selected && (
                      <span
                        className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-[#8b5cf6]"
                        style={{ boxShadow: '0 0 8px rgba(139,92,246,0.6)' }}
                      />
                    )}
                    {workflowDisplayId(r.id)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/incidents/${r.incidentId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[13px] font-semibold text-[#f1f5f9] transition-colors hover:text-[#a78bfa]"
                    >
                      {r.incidentTitle}
                    </Link>
                    <p className="mt-0.5 font-mono text-[10px] text-[#475569]">{incidentDisplayId(r.incidentId)}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }}
                      />
                      <span
                        className={cn(
                          'rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                          cfg.pill,
                        )}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[12px] tabular-nums text-[#94a3b8]">{r.durationLabel}</td>
                  <td className="px-5 py-3.5 tabular-nums text-[12px] text-[#94a3b8]">
                    {r.retries > 0 ? (
                      <span className="rounded bg-[#f59e0b]/10 px-1.5 py-0.5 text-[11px] font-semibold text-[#f59e0b]">
                        {r.retries}
                      </span>
                    ) : (
                      <span className="text-[#475569]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[11px] text-[#64748b]">
                    {format(new Date(r.startedAt), 'MMM d, HH:mm')}
                  </td>
                  <td className="px-5 py-3.5 text-[11px] text-[#64748b]">
                    {r.completedAt ? format(new Date(r.completedAt), 'MMM d, HH:mm') : (
                      <span className="text-[#475569]">—</span>
                    )}
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
