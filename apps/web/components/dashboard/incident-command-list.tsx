'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import type { Incident } from '@/lib/types';
import { Surface, SectionTitle, Eyebrow } from '@/components/platform/surface';
import { SeverityBadge } from '@/components/incidents/status-badge';
import { statusLabel } from '@/lib/status';
import { cn } from '@/lib/utils';

export function IncidentCommandList({ incidents }: { incidents: Incident[] }) {
  if (!incidents.length) {
    return (
      <Surface variant="raised" className="flex flex-col items-center px-8 py-24 text-center">
        <div className="mb-4 h-12 w-12 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#111827] shadow-[0_0_32px_-8px_rgba(124,58,237,0.3)]" />
        <p className="text-sm font-medium text-[#f8fafc]">No incidents in queue</p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#64748b]">
          Launch an incident to activate the orchestration pipeline and agent fleet.
        </p>
      </Surface>
    );
  }

  return (
    <Surface variant="raised" className="overflow-hidden">
      <div className="flex items-end justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] px-6 py-5">
        <div>
          <Eyebrow>Incident queue</Eyebrow>
          <SectionTitle className="mt-1">Active operations</SectionTitle>
        </div>
        <span className="rounded-full bg-[#161f33] px-2.5 py-1 text-xs tabular-nums text-[#94a3b8]">
          {incidents.length}
        </span>
      </div>
      <ul>
        {incidents.map((inc, i) => {
          const running = !['RESOLVED', 'FAILED', 'INCIDENT_CREATED'].includes(inc.status);
          return (
            <motion.li
              key={inc.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(i * 0.03, 0.25) }}
            >
              <Link
                href={`/incidents/${inc.id}`}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-[rgba(255,255,255,0.04)] px-6 py-4 transition-colors last:border-0 hover:bg-[#161f33]/40"
              >
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl text-[10px] font-bold',
                    running
                      ? 'bg-[#8b5cf6]/20 text-[#a78bfa] shadow-[0_0_20px_-4px_rgba(139,92,246,0.5)]'
                      : 'bg-[#111827] text-[#64748b]',
                  )}
                >
                  {inc.id.slice(0, 4).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium text-[#f8fafc] group-hover:text-white">
                    {inc.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[#64748b]">{statusLabel(inc.status)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {inc.severity && <SeverityBadge severity={inc.severity} />}
                  <time className="text-[11px] tabular-nums text-[#64748b]">
                    {formatDistanceToNow(new Date(inc.updatedAt), { addSuffix: true })}
                  </time>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </Surface>
  );
}
