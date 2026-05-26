'use client';

import { cn } from '@/lib/utils';
import type { IncidentSeverity } from '@/lib/types';

const styles: Record<string, string> = {
  CRITICAL: 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/25',
  HIGH: 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/25',
  MEDIUM: 'bg-[#eab308]/15 text-[#eab308] border-[#eab308]/25',
  LOW: 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/25',
};

export function ReportSeverityBadge({
  severity,
  className,
}: {
  severity?: IncidentSeverity | null;
  className?: string;
}) {
  const s = severity ?? 'MEDIUM';
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        styles[s] ?? styles.MEDIUM,
        className,
      )}
    >
      {s.charAt(0) + s.slice(1).toLowerCase()}
    </span>
  );
}
