'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signInWithGoogle } from '@/lib/firebase';
import { firebaseConfigured } from '@/lib/config';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { PlatformBackground } from '@/components/platform/platform-background';
import { Panel } from '@/components/platform/panel';

export default function LoginPage() {
  const { user, loading, configured } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (user || !configured)) router.replace('/dashboard');
  }, [loading, user, configured, router]);

  async function handleGoogle() {
    setPending(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.replace('/dashboard');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Sign-in failed';
      setError(
        msg.includes('api-key-not-valid')
          ? 'Invalid Firebase API key. Update apps/web/.env or use dev mode.'
          : msg,
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 text-zinc-100">
      <PlatformBackground />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-500/25">
            S
          </span>
          <span className="text-lg font-semibold text-white">SentinelAI</span>
        </Link>
        <Panel glow className="p-8">
          <h1 className="text-center text-xl font-semibold text-white">Welcome back</h1>
          <p className="mt-2 text-center text-sm text-zinc-400">Sign in to the orchestration console</p>
          <div className="mt-8 space-y-3">
            {configured ? (
              <Button
                className="h-10 w-full border-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90"
                disabled={pending}
                onClick={handleGoogle}
              >
                {pending ? 'Signing in…' : 'Continue with Google'}
              </Button>
            ) : (
              <p className="text-center text-xs text-amber-400/90">Firebase not configured — use dev mode</p>
            )}
            <Button
              variant="outline"
              className="h-10 w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => router.replace('/dashboard')}
            >
              Continue in dev mode
            </Button>
          </div>
          {error && <p className="mt-4 text-center text-xs text-red-400">{error}</p>}
        </Panel>
      </motion.div>
    </div>
  );
}
