'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import type { Incident } from '@/lib/types';
import { Surface, SectionTitle, Eyebrow } from '@/components/platform/surface';
import { statusLabel } from '@/lib/status';
import { cn } from '@/lib/utils';

function severityTone(severity?: string | null) {
  if (severity === 'CRITICAL') return 'bg-[#dc2626]/15 text-[#ef4444] border-[#dc2626]/30';
  if (severity === 'HIGH') return 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30';
  return 'bg-[#8b5cf6]/15 text-[#a78bfa] border-[#8b5cf6]/30';
}

export function ActivityStream({ incidents }: { incidents: Incident[] }) {
  const recent = [...incidents]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  return (
    <Surface variant="glass" className="flex h-full min-h-[320px] flex-col p-5">
      <div className="flex items-center justify-between">
        <div>
          <Eyebrow>Command feed</Eyebrow>
          <SectionTitle className="mt-1">Live activity</SectionTitle>
        </div>
        <span className="relative flex h-2 w-2">
          <span className="absolute h-full w-full animate-ping rounded-full bg-[#10b981]/40" />
          <span className="relative h-2 w-2 rounded-full bg-[#10b981]" />
        </span>
      </div>

      {recent.length === 0 ? (
        <p className="mt-8 text-sm text-[#64748b]">Events stream in as workflows execute.</p>
      ) : (
        <ul className="relative mt-5 flex-1 space-y-1 overflow-y-auto pr-1">
          <div className="absolute bottom-2 left-[11px] top-2 w-px bg-gradient-to-b from-[#8b5cf6]/50 via-[#64748b]/30 to-transparent" />
          <AnimatePresence initial={false}>
            {recent.map((inc, i) => (
              <motion.li
                key={inc.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/incidents/${inc.id}`}
                  className="group relative flex gap-3 rounded-xl py-3 pl-8 pr-2 transition-all hover:bg-[#161f33]/50 hover:shadow-[0_0_24px_-8px_rgba(124,58,237,0.2)]"
                >
                  <span
                    className={cn(
                      'absolute left-2 top-3.5 flex h-5 w-5 items-center justify-center rounded-md border text-[10px] font-bold',
                      severityTone(inc.severity),
                    )}
                  >
                    {i === 0 ? '●' : '→'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#f8fafc] group-hover:text-white">
                      {inc.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#64748b]">
                      {statusLabel(inc.status)} · {formatDistanceToNow(new Date(inc.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Surface>
  );
}
