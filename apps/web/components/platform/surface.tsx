import { cn } from '@/lib/utils';

/** Layered surfaces — depth via glow, not heavy borders */
export function Surface({
  children,
  className,
  variant = 'raised',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'raised' | 'inset' | 'ghost' | 'glass' | 'elevated';
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[rgba(255,255,255,0.06)]',
        variant === 'raised' &&
          'bg-[#111827]/90 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_12px_48px_-16px_rgba(0,0,0,0.65)]',
        variant === 'elevated' &&
          'bg-[#161f33]/80 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_56px_-12px_rgba(124,58,237,0.15)]',
        variant === 'inset' && 'bg-[#0b1020]/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]',
        variant === 'ghost' && 'border-transparent bg-transparent',
        variant === 'glass' &&
          'bg-[var(--sentinel-card-glow),#0b1020]/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl',
        className,
      )}
      style={variant === 'glass' ? { background: 'var(--sentinel-card-glow), #0b1020' } : undefined}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-[11px] font-medium uppercase tracking-[0.12em] text-[#64748b]", className)}>{children}</p>
  );
}

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-[15px] font-semibold tracking-tight text-[#f8fafc]', className)}>{children}</h2>
  );
}
