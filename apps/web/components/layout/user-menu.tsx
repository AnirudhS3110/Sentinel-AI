'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { firebaseSignOut } from '@/lib/firebase';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function UserMenu() {
  const { user, configured } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const label = user?.email ?? (configured ? 'Account' : 'Dev mode');
  const initial = label.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-sm transition-colors hover:bg-white/[0.08]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/80 to-indigo-600/80 text-xs font-semibold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[140px] truncate text-xs text-zinc-300 sm:inline">{label}</span>
      </button>
      {open && (
        <div
          className={cn(
            'absolute right-0 z-50 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-white/[0.1] bg-[#12121a]/95 p-1 shadow-xl backdrop-blur-xl',
          )}
        >
          <p className="border-b border-white/[0.06] px-3 py-2 text-xs text-zinc-500">{label}</p>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-zinc-300 hover:text-white"
            onClick={async () => {
              setOpen(false);
              await firebaseSignOut();
              router.push('/login');
            }}
          >
            Sign out
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-zinc-300 hover:text-white"
            onClick={() => {
              setOpen(false);
              router.push('/');
            }}
          >
            Back to site
          </Button>
        </div>
      )}
    </div>
  );
}
