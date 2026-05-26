'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import type { Incident } from '@/lib/types';
import { Surface, SectionTitle, Eyebrow } from '@/components/platform/surface';
import { StatusIndicator, statusToTone } from '@/components/ui/status-indicator';
import { statusLabel } from '@/lib/status';
import { SeverityBadge } from '@/components/incidents/status-badge';
import { cn } from '@/lib/utils';

export function IncidentList({ incidents }: { incidents: Incident[] }) {
  if (!incidents.length) {
    return (
      <Surface variant="raised" className="flex flex-col items-center px-6 py-20 text-center">
        <p className="text-sm font-medium text-zinc-300">No incidents yet</p>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-500">
          Start a workflow from the button above — agents will pick up logs and run the pipeline automatically.
        </p>
      </Surface>
    );
  }

  return (
    <Surface variant="raised" className="overflow-hidden">
      <div className="flex items-baseline justify-between px-6 pt-5">
        <div>
          <Eyebrow>Queue</Eyebrow>
          <SectionTitle className="mt-1">All incidents</SectionTitle>
        </div>
        <span className="text-xs tabular-nums text-zinc-500">{incidents.length}</span>
      </div>
      <ul className="mt-4 divide-y divide-white/[0.04]">
        {incidents.map((inc, i) => (
          <motion.li
            key={inc.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.min(i * 0.04, 0.3) }}
          >
            <Link
              href={`/incidents/${inc.id}`}
              className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
            >
              <StatusIndicator
                label=""
                tone={statusToTone(inc.status)}
                pulse={statusToTone(inc.status) === 'live'}
                className="shrink-0 [&>span:last-child]:hidden"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-zinc-100 transition-colors group-hover:text-white">
                  {inc.title}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">{statusLabel(inc.status)}</p>
              </div>
              <div className="hidden shrink-0 items-center gap-3 sm:flex">
                <SeverityBadge severity={inc.severity} />
              </div>
              <time
                className={cn(
                  'shrink-0 text-xs tabular-nums text-zinc-600',
                  'group-hover:text-zinc-400',
                )}
              >
                {formatDistanceToNow(new Date(inc.createdAt), { addSuffix: true })}
              </time>
            </Link>
          </motion.li>
        ))}
      </ul>
    </Surface>
  );
}
