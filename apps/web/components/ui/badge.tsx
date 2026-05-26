import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide',
  {
    variants: {
      variant: {
        default: 'border-border bg-muted text-muted-foreground',
        running: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
        done: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
        failed: 'border-red-500/30 bg-red-500/10 text-red-400',
        low: 'border-slate-500/30 bg-slate-500/10 text-slate-400',
        medium: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
        high: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
        critical: 'border-red-500/30 bg-red-500/10 text-red-300',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export function Badge({ className, variant, ...props }: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
