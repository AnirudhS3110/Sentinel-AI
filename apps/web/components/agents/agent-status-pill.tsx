'use client';

import { cn } from '@/lib/utils';
import type { AgentUiStatus } from '@/lib/agents-data';

const styles: Record<AgentUiStatus, string> = {
  active: 'bg-[rgba(16,185,129,0.15)] text-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.25)]',
  idle: 'bg-[rgba(234,179,8,0.12)] text-[#eab308]',
  error: 'bg-[rgba(239,68,68,0.15)] text-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.2)]',
};

export function AgentStatusPill({ status }: { status: AgentUiStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize',
        styles[status],
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'active' && 'bg-[#10b981] animate-pulse',
          status === 'idle' && 'bg-[#eab308]',
          status === 'error' && 'bg-[#ef4444] animate-pulse',
        )}
      />
      {status}
    </span>
  );
}
