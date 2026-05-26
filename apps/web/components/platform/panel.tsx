import { cn } from '@/lib/utils';

export function Panel({
  children,
  className,
  glow,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/[0.08] bg-white/[0.03] shadow-[0_4px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm',
        glow && 'shadow-[0_0_40px_-12px_rgba(139,92,246,0.25)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">{children}</h2>
  );
}
