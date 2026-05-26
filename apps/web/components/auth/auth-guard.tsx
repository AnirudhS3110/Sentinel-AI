'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { PlatformBackground } from '@/components/platform/platform-background';
import { Panel } from '@/components/platform/panel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, configured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && configured && !user) {
      router.replace('/login');
    }
  }, [loading, configured, user, router]);

  // Dev mode — no Firebase: allow console with API dev token
  if (!configured) {
    return <>{children}</>;
  }

  if (loading) {
    return <AuthShellLoading />;
  }

  if (!user) {
    return <AuthShellRedirect />;
  }

  return <>{children}</>;
}

function AuthShellLoading() {
  return (
    <div className="platform-shell relative flex min-h-screen bg-[#050508]">
      <PlatformBackground />
      <Skeleton className="hidden w-60 rounded-none lg:block" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <Skeleton className="h-10 w-64 rounded-lg bg-white/[0.06]" />
        <Skeleton className="h-72 flex-1 rounded-xl bg-white/[0.06]" />
      </div>
    </div>
  );
}

function AuthShellRedirect() {
  return (
    <div className="platform-shell relative flex min-h-screen items-center justify-center bg-[#050508] px-4">
      <PlatformBackground />
      <Panel className="relative max-w-sm p-8 text-center">
        <h2 className="text-lg font-semibold text-white">Sign in required</h2>
        <p className="mt-2 text-sm text-zinc-400">Redirecting to login…</p>
        <Button className="mt-6 w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white" asChild>
          <Link href="/login">Go to sign in</Link>
        </Button>
      </Panel>
    </div>
  );
}
