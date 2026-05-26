'use client';

import Link from 'next/link';
import type { Incident } from '@/lib/types';
import { SeverityBadge, StatusBadge } from './status-badge';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { Edit2, Bell, ShieldAlert, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';
import { CreateIncidentDialog } from './create-incident-dialog';

export function IncidentPageHeader({
  incident,
  connected,
}: {
  incident: Incident;
  connected: boolean;
}) {
  const { user } = useAuth();
  const name = user?.displayName ?? user?.email?.split('@')[0] ?? 'Arjun Patel';
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/[0.04] pb-5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 transition-colors hover:text-violet-400"
          >
            Dashboard
          </Link>
          <span className="text-zinc-700 text-xs">/</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400 font-mono">
            {incident.id.slice(0, 8)}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            {incident.title}
          </h1>
          <button 
            className="text-zinc-500 hover:text-white transition-colors"
            title="Edit incident title"
            aria-label="Edit title"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs text-zinc-400 flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-zinc-500" />
          Incident Command Center &bull; Created by SRE Orchestrator
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2.5 border-r border-white/[0.08] pr-4 mr-1">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
          <StatusIndicator
            label={connected ? 'LIVE' : 'SYNCING'}
            tone={connected ? 'success' : 'warning'}
            pulse={connected}
          />
        </div>

        <div className="flex items-center gap-2">
          <CreateIncidentDialog />
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            title="Share Incident"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <div 
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] text-xs font-bold text-white shadow-[0_0_12px_rgba(124,58,237,0.3)] ml-1"
            title={`Assigned to ${name}`}
          >
            {initial}
          </div>
        </div>
      </div>
    </div>
  );
}
