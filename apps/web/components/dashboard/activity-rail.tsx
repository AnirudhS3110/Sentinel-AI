'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import type { Incident } from '@/lib/types';
import { Surface, SectionTitle, Eyebrow } from '@/components/platform/surface';
import { StatusIndicator, statusToTone } from '@/components/ui/status-indicator';
import { statusLabel } from '@/lib/status';

export function ActivityRail({ incidents }: { incidents: Incident[] }) {
  const recent = [...incidents]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <Surface variant="glass" className="flex h-full flex-col p-5">
      <Eyebrow>Live feed</Eyebrow>
      <SectionTitle className="mt-1">Recent activity</SectionTitle>
      <p className="mt-2 text-xs leading-relaxed text-zinc-500">
        Latest incident movement across your workspace.
      </p>

      {recent.length === 0 ? (
        <p className="mt-8 text-xs text-zinc-600">No activity yet.</p>
      ) : (
        <ul className="relative mt-6 flex-1 space-y-0">
          <div className="absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-violet-500/40 via-zinc-700/50 to-transparent" />
          {recent.map((inc, i) => (
            <motion.li
              key={inc.id}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative pl-6"
            >
              <span className="absolute left-0 top-3 h-[10px] w-[10px] rounded-full border-2 border-[#0c0c10] bg-zinc-600" />
              <Link href={`/incidents/${inc.id}`} className="block rounded-lg py-3 pr-2 transition-colors hover:bg-white/[0.03]">
                <div className="flex items-center justify-between gap-2">
                  <StatusIndicator
                    label={statusLabel(inc.status)}
                    tone={statusToTone(inc.status)}
                    pulse={statusToTone(inc.status) === 'live' && i === 0}
                  />
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm font-medium text-zinc-200">{inc.title}</p>
                <p className="mt-1 text-[11px] text-zinc-600">
                  {formatDistanceToNow(new Date(inc.updatedAt), { addSuffix: true })}
                </p>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </Surface>
  );
}
