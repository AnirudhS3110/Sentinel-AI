import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'live' | 'success' | 'warning' | 'error';

const toneMap: Record<Tone, { dot: string; ring?: string; label: string }> = {
  neutral: { dot: 'bg-zinc-500', label: 'text-zinc-400' },
  live: { dot: 'bg-amber-400', ring: 'ring-amber-400/40', label: 'text-amber-200/90' },
  success: { dot: 'bg-emerald-400', label: 'text-emerald-300/90' },
  warning: { dot: 'bg-amber-400', label: 'text-amber-200/90' },
  error: { dot: 'bg-red-400', label: 'text-red-300/90' },
};

export function StatusIndicator({
  label,
  tone = 'neutral',
  pulse = false,
  className,
  dotOnly = false,
}: {
  label: string;
  tone?: Tone;
  pulse?: boolean;
  className?: string;
  dotOnly?: boolean;
}) {
  const t = toneMap[tone];
  const dot = (
    <span className="relative flex h-2 w-2 shrink-0">
      {pulse && (
        <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', t.dot)} />
      )}
      <span className={cn('relative h-2 w-2 rounded-full', t.dot, pulse && t.ring && `ring-2 ${t.ring}`)} />
    </span>
  );
  if (dotOnly || !label) return <span className={className}>{dot}</span>;
  return (
    <span className={cn('inline-flex items-center gap-2 text-xs font-medium', t.label, className)}>
      {dot}
      {label}
    </span>
  );
}

export function statusToTone(status: string): Tone {
  if (status === 'RESOLVED') return 'success';
  if (status === 'FAILED') return 'error';
  if (
    ['PLANNING', 'CLASSIFICATION', 'ROOT_CAUSE_ANALYSIS', 'VALIDATION', 'REMEDIATION', 'REPORT_GENERATION', 'HUMAN_APPROVAL'].includes(
      status,
    )
  ) {
    return 'live';
  }
  return 'neutral';
}
