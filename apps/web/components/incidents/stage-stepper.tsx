'use client';

import type { IncidentStatus } from '@/lib/types';
import { PIPELINE_STAGES, stageIndex } from '@/lib/workflow-stages';
import { cn } from '@/lib/utils';

export function StageStepper({ status }: { status: IncidentStatus | string }) {
  const current = stageIndex(status);
  const failed = status === 'FAILED';

  return (
    <div className="relative mt-6">
      <div className="absolute left-0 right-0 top-[11px] h-px bg-white/[0.08]" />
      <div
        className="absolute left-0 top-[11px] h-px bg-gradient-to-r from-violet-500/60 to-violet-500/20 transition-all duration-500"
        style={{
          width: `${Math.max(0, (current / (PIPELINE_STAGES.length - 1)) * 100)}%`,
        }}
      />
      <div className="relative flex justify-between gap-1">
        {PIPELINE_STAGES.map((stage, i) => {
          const done = !failed && i < current;
          const active = !failed && i === current;
          return (
            <div key={stage.key} className="flex flex-col items-center">
              <span
                className={cn(
                  'relative z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] font-semibold transition-all',
                  done && 'bg-emerald-500/20 text-emerald-400 ring-2 ring-[#0a0a0f]',
                  active && 'bg-violet-600 text-white shadow-[0_0_20px_-4px_rgba(139,92,246,0.8)] ring-2 ring-violet-400/50',
                  !done && !active && 'bg-[#14141a] text-zinc-600 ring-2 ring-[#0a0a0f]',
                  failed && i <= current && 'bg-red-500/20 text-red-400',
                )}
              >
                {done ? '✓' : i + 1}
              </span>
              <span
                className={cn(
                  'mt-2 text-[11px] font-medium',
                  active ? 'text-violet-200' : done ? 'text-zinc-500' : 'text-zinc-600',
                )}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
