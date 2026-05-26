'use client';

import { formatDistanceToNow } from 'date-fns';
import type { WorkflowEventPayload } from '@sentinel/shared';
import { Surface, SectionTitle, Eyebrow } from '@/components/platform/surface';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, RefreshCw, MessageSquare, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

function activityIcon(type: string) {
  if (type.includes('failed')) return { Icon: AlertCircle, bg: 'bg-red-500/10', text: 'text-red-400' };
  if (type.includes('completed') || type.includes('generated'))
    return { Icon: CheckCircle2, bg: 'bg-emerald-500/10', text: 'text-emerald-400' };
  if (type.includes('retry')) return { Icon: RefreshCw, bg: 'bg-amber-500/10', text: 'text-amber-400' };
  return { Icon: MessageSquare, bg: 'bg-violet-500/10', text: 'text-violet-400' };
}

function activityTitle(type: string, message: string): string {
  if (message.length < 60) return message;
  if (type.includes('validation')) return 'Validation checks in progress';
  if (type.includes('classification')) return 'Incident triage & routing completed';
  if (type.includes('planning')) return 'Execution plan formulated';
  if (type.includes('remediation')) return 'Remediation strategy synthesized';
  if (type.includes('report')) return 'Post-mortem report compiled';
  return type.replace(/\./g, ' ');
}

export function IncidentActivityPanel({ events }: { events: WorkflowEventPayload[] }) {
  const recent = [...events].reverse().slice(0, 4);

  return (
    <Surface variant="raised" className="flex h-full flex-col justify-between p-5 bg-[rgba(17,24,39,0.75)] border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-[20px]">
      <div>
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-4 mb-4">
          <div>
            <Eyebrow className="text-zinc-500 font-semibold tracking-widest text-[10px]">AUDIT FEED</Eyebrow>
            <SectionTitle className="mt-0.5 text-sm font-bold text-white">Recent Activity</SectionTitle>
          </div>
          <Link
            href="/dashboard"
            className="text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-wider flex items-center gap-1"
          >
            View All
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800/40 text-zinc-500 mb-3 border border-white/[0.03]">
              <User className="h-4.5 w-4.5" />
            </div>
            <p className="text-xs font-semibold text-zinc-500">No activity logged yet</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {recent.map((e, i) => {
              const { Icon, bg, text } = activityIcon(e.type);
              return (
                <li key={`${e.timestamp}-${i}`} className="flex gap-3 items-start group">
                  <div
                    className={cn(
                      'flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg border border-white/[0.03] transition-transform group-hover:scale-105',
                      bg,
                      text,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-200 leading-snug group-hover:text-white transition-colors">
                      {activityTitle(e.type, e.message)}
                    </p>
                    <p className="mt-1 text-[10px] font-mono text-zinc-500">
                      {formatDistanceToNow(new Date(e.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-2.5 bg-white/[0.01] border border-white/[0.03] p-2.5 rounded-xl">
          <div className="h-6 w-6 rounded-full bg-violet-600/10 text-violet-400 flex items-center justify-center text-[10px] font-bold border border-violet-500/10 font-mono">
            OP
          </div>
          <div className="text-[10.5px]">
            <span className="text-zinc-300 font-semibold">Operator override</span>
            <span className="text-zinc-500"> is enabled for validation steps.</span>
          </div>
        </div>
      </div>
    </Surface>
  );
}
