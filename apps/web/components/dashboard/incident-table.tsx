'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import type { Incident } from '@/lib/types';
import { SeverityBadge, StatusBadge } from '@/components/incidents/status-badge';
import { workflowHealth } from '@/lib/workflow-stages';
import { Badge } from '@/components/ui/badge';
import { Panel } from '@/components/platform/panel';
import { cn } from '@/lib/utils';

function WorkflowStatusBadge({ status }: { status: string }) {
  const health = workflowHealth(status);
  const variant = health === 'idle' ? 'default' : health;
  const label = status === 'RESOLVED' ? 'Complete' : status === 'FAILED' ? 'Failed' : 'Running';
  return <Badge variant={variant}>{label}</Badge>;
}

export function IncidentTable({ incidents }: { incidents: Incident[] }) {
  if (!incidents.length) {
    return (
      <Panel className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl">◇</div>
        <h3 className="mt-4 text-base font-medium text-white">No incidents yet</h3>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">
          Start a workflow to orchestrate your first incident — paste logs and watch agents execute live.
        </p>
      </Panel>
    );
  }

  return (
    <Panel className="overflow-hidden !p-0">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <h3 className="text-sm font-medium text-white">Recent incidents</h3>
        <span className="text-xs text-zinc-500">{incidents.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02] text-xs font-medium text-zinc-500">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Severity</th>
              <th className="px-5 py-3">Stage</th>
              <th className="px-5 py-3">Workflow</th>
              <th className="px-5 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc, i) => (
              <motion.tr
                key={inc.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="group border-b border-white/[0.04] transition-colors last:border-0 hover:bg-violet-500/[0.04]"
              >
                <td className="px-5 py-3.5">
                  <Link
                    href={`/incidents/${inc.id}`}
                    className="font-medium text-white transition-colors group-hover:text-violet-200"
                  >
                    {inc.title}
                  </Link>
                </td>
                <td className="px-5 py-3.5">
                  <SeverityBadge severity={inc.severity} />
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={inc.status} />
                </td>
                <td className="px-5 py-3.5">
                  <WorkflowStatusBadge status={inc.status} />
                </td>
                <td className={cn('px-5 py-3.5 text-xs text-zinc-500')}>
                  {formatDistanceToNow(new Date(inc.createdAt), { addSuffix: true })}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
