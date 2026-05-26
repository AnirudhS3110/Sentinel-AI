import { cn } from '@/lib/utils';

export function PageContainer({
  children,
  className,
  width = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  width?: 'default' | 'wide' | 'full';
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full flex-1 p-4',
        width === 'default' && 'max-w-5xl',
        width === 'wide' && 'max-w-6xl',
        width === 'full' && 'max-w-none',
        className,
      )}
    >
      {children}
    </div>
  );
}
