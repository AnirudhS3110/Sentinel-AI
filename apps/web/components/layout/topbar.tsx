'use client';

import { UserMenu } from './user-menu';
import { useSidebar } from './platform-shell';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { apiSetupHint } from '@/lib/api-error';

export function Topbar({
  title,
  subtitle,
  trailing,
  apiConnected,
}: {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  apiConnected?: boolean;
}) {
  const { isCollapsed, setCollapsed, setMobileOpen, mobileOpen } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      setCollapsed(!isCollapsed);
    } else {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between',
        'border-b border-[rgba(255,255,255,0.06)] bg-[#050816]/70 px-6 backdrop-blur-2xl backdrop-saturate-150 lg:px-8',
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-[#64748b] hover:text-[#f8fafc]"
          onClick={handleToggle}
          aria-label="Toggle navigation"
        >
          <MenuIcon />
        </Button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-[#f8fafc]">{title}</p>
          {subtitle && <p className="truncate text-[11px] text-[#64748b]">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ConnectionPulse connected={apiConnected} />
        {trailing}
        <UserMenu />
      </div>
    </header>
  );
}

function ConnectionPulse({ connected }: { connected?: boolean }) {
  if (connected === undefined) return null;
  return (
    <div
      className="hidden items-center gap-2 rounded-full border border-[rgba(255,255,255,0.06)] bg-[#0b1020]/80 px-3 py-1.5 sm:flex"
      title={apiSetupHint()}
    >
      <span className="relative flex h-2 w-2">
        {connected && (
          <span className="absolute h-full w-full animate-ping rounded-full bg-[#10b981]/50" />
        )}
        <span
          className={cn(
            'relative h-2 w-2 rounded-full',
            connected ? 'bg-[#10b981]' : 'bg-[#6b7280]',
          )}
        />
      </span>
      <span className="text-[11px] font-medium text-[#94a3b8]">
        {connected ? 'API connected' : 'API offline'}
      </span>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
