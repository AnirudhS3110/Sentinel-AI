'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import type { Incident } from '@/lib/types';
import { Surface, SectionTitle, Eyebrow } from '@/components/platform/surface';
import { statusLabel } from '@/lib/status';
import { Edit2, Copy, Check, ShieldAlert, Layers } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function IncidentMetadataPanel({ incident }: { incident: Incident }) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(incident.id);
    setCopied(true);
    toast.success('Incident ID copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const rows = [
    { 
      label: 'Incident ID', 
      value: (
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.04]">
          {incident.id.slice(0, 12)}...
          <button 
            onClick={handleCopyId}
            className="hover:text-white transition-colors"
            title="Copy full UUID"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          </button>
        </span>
      ) 
    },
    { label: 'Created', value: format(new Date(incident.createdAt), 'MMM d, yyyy · HH:mm') },
    { label: 'Severity', value: incident.severity ?? 'MEDIUM' },
    { label: 'Source', value: 'DataDog Webhook' },
    { 
      label: 'Environment', 
      value: (
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
          production
        </span>
      ) 
    },
    { 
      label: 'Related Alerts', 
      value: (
        <span className="text-amber-400 font-semibold flex items-center gap-1">
          <ShieldAlert className="h-3 w-3" />
          3 active signals
        </span>
      ) 
    },
  ];

  return (
    <Surface variant="raised" className="p-5 bg-[rgba(17,24,39,0.75)] border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-[20px] flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-4 mb-4">
          <div>
            <Eyebrow className="text-zinc-500 font-semibold tracking-widest text-[10px]">METADATA RECORD</Eyebrow>
            <SectionTitle className="mt-0.5 text-sm font-bold text-white">Incident Details</SectionTitle>
          </div>
          <button 
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
            title="Edit metadata"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <dl className="space-y-3">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-4 py-1.5 text-xs border-b border-white/[0.02] last:border-0 pb-1.5 last:pb-0">
              <dt className="text-zinc-500 font-semibold tracking-wide uppercase text-[10px]">{r.label}</dt>
              <dd className="max-w-[65%] truncate font-medium text-zinc-200">
                {r.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 pt-4 border-t border-white/[0.04]">
        <Link
          href={`/incidents/${incident.id}`}
          className="group flex items-center gap-1 text-[11px] font-bold text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-wider"
        >
          View full investigation details 
          <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </Link>
      </div>
    </Surface>
  );
}
