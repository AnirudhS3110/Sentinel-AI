'use client';

import { motion } from 'framer-motion';
import type { IncidentStatus } from '@/lib/types';
import { PIPELINE_STAGES, stageIndex } from '@/lib/workflow-stages';
import { cn } from '@/lib/utils';

export function WorkflowStagePipeline({ status }: { status: IncidentStatus | string }) {
  const current = stageIndex(status);
  const failed = status === 'FAILED';

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {PIPELINE_STAGES.map((stage, i) => {
        const done = !failed && i < current;
        const active = !failed && i === current;
        const pending = i > current || failed;
        return (
          <motion.div
            key={stage.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-1.5"
          >
            <span
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium',
                done && 'bg-emerald-500/15 text-emerald-300',
                active && 'bg-violet-500/20 text-violet-200 ring-1 ring-violet-500/40',
                pending && !failed && 'bg-white/[0.04] text-zinc-500',
                failed && i <= current && 'bg-red-500/15 text-red-300',
              )}
            >
              {stage.label}
            </span>
            {i < PIPELINE_STAGES.length - 1 && (
              <span className={cn('text-zinc-600', done && 'text-violet-500/50')}>→</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
