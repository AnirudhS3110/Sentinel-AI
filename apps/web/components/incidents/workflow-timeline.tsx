'use client';

import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import type { WorkflowEventPayload } from '@sentinel/shared';
import { cn } from '@/lib/utils';
import { statusLabel } from '@/lib/status';

function eventTone(type: string): string {
  if (type.includes('failed') || type === 'validation.failed')
    return 'border-red-500/30 bg-red-500/10';
  if (type.includes('completed') || type.includes('generated') || type === 'workflow.completed')
    return 'border-emerald-500/30 bg-emerald-500/10';
  if (type.includes('started') || type === 'retry.triggered')
    return 'border-amber-500/30 bg-amber-500/10';
  return 'border-white/[0.06] bg-white/[0.02]';
}

export function WorkflowTimeline({ events }: { events: WorkflowEventPayload[] }) {
  if (!events.length) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
        <p className="mt-3 text-sm text-zinc-500">Waiting for workflow events…</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {events.map((e, i) => (
          <motion.div
            key={`${e.timestamp}-${e.type}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn('rounded-lg border px-4 py-3', eventTone(e.type))}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-zinc-500">{format(new Date(e.timestamp), 'HH:mm:ss')}</span>
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                {e.type.replace(/\./g, ' ')}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-zinc-200">{e.message}</p>
            {e.stage && (
              <p className="mt-1 text-xs text-violet-400/90">Stage · {statusLabel(e.stage)}</p>
            )}
            {e.retryCount != null && (
              <p className="mt-0.5 text-xs text-amber-400">Retry #{e.retryCount}</p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
