'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';
import { usePlatformMenu } from '@/components/layout/platform-shell';
import { Button } from '@/components/ui/button';
import { fetchIncident, fetchIncidents } from '@/lib/api';
import {
  aggregateAgentFleet,
  filterAgents,
  countByStatus,
  type AgentFilterPill,
} from '@/lib/agents-data';
import { ApiErrorCard } from '@/components/ui/api-error-card';
import { formatApiError } from '@/lib/api-error';
import { Skeleton } from '@/components/ui/skeleton';
import { FleetMetricsRow } from './fleet-metrics-row';
import { AgentsToolbar } from './agents-toolbar';
import { AgentCard } from './agent-card';
import { LiveActivityFeed } from './live-activity-feed';
import { AgentPerformanceTable } from './agent-performance-table';
import { cn } from '@/lib/utils';

async function loadEnrichedIncidents() {
  const page = await fetchIncidents(1, 50);
  const top = page.data.slice(0, 20);
  if (!top.length) return [];
  const detailed = await Promise.all(top.map((i) => fetchIncident(i.id).catch(() => i)));
  const rest = page.data.slice(20);
  return [...detailed, ...rest];
}

export function AgentsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openMenu = usePlatformMenu();

  const pill = (searchParams.get('pill') as AgentFilterPill) || 'all';
  const search = searchParams.get('q') ?? '';
  const statusDropdown = searchParams.get('status') ?? 'all';
  const view = (searchParams.get('view') as 'grid' | 'list') || 'grid';
  const range = searchParams.get('range') ?? '7d';

  const [rangeOpen, setRangeOpen] = useState(false);

  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === '') params.delete(k);
        else params.set(k, v);
      });
      router.replace(`/agents?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const { data: incidents, isLoading, isError, error } = useQuery({
    queryKey: ['agents-incidents'],
    queryFn: loadEnrichedIncidents,
    refetchInterval: 15_000,
  });

  const { agents, fleet, activity } = useMemo(
    () => aggregateAgentFleet(incidents ?? []),
    [incidents],
  );

  const filtered = useMemo(
    () => filterAgents(agents, { pill, search, statusDropdown }),
    [agents, pill, search, statusDropdown],
  );

  const counts = useMemo(() => countByStatus(agents), [agents]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-5"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {openMenu && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="mt-1 text-[#64748b] lg:hidden"
              onClick={openMenu}
              aria-label="Open menu"
            >
              ☰
            </Button>
          )}
          <div>
            <h1 className="text-[40px] font-bold leading-[1.1] tracking-[-1px] text-[#f8fafc]">
              Agents
            </h1>
            <p className="mt-1 text-sm text-[#94a3b8]">
              Monitor and manage all agents in your orchestration pipeline
            </p>
          </div>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setRangeOpen(!rangeOpen)}
            className="flex h-10 items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#111827]/80 px-4 text-sm text-[#94a3b8]"
          >
            <Calendar className="h-4 w-4" />
            {range === '30d' ? 'Last 30 days' : range === 'today' ? 'Today' : 'Last 7 days'}
            <ChevronDown className="h-4 w-4" />
          </button>
          {rangeOpen && (
            <ul className="absolute right-0 z-50 mt-2 min-w-[160px] rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111827]/95 py-1 shadow-xl backdrop-blur-xl">
              {[
                { v: 'today', l: 'Today' },
                { v: '7d', l: 'Last 7 days' },
                { v: '30d', l: 'Last 30 days' },
              ].map((o) => (
                <li key={o.v}>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm text-[#94a3b8] hover:bg-[#1b2540]"
                    onClick={() => {
                      updateParams({ range: o.v === '7d' ? null : o.v });
                      setRangeOpen(false);
                    }}
                  >
                    {o.l}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[100px] rounded-2xl bg-[#111827]" />
            ))}
          </div>
          <Skeleton className="h-12 rounded-xl bg-[#111827]" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl bg-[#111827]" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <ApiErrorCard message={formatApiError((error as Error).message)} />
      ) : (
        <div className="space-y-4">
          <FleetMetricsRow fleet={fleet} />

          <AgentsToolbar
            pill={pill}
            onPillChange={(p) => updateParams({ pill: p === 'all' ? null : p })}
            counts={counts}
            search={search}
            onSearchChange={(v) => updateParams({ q: v || null })}
            statusDropdown={statusDropdown}
            onStatusDropdownChange={(v) => updateParams({ status: v === 'all' ? null : v })}
            view={view}
            onViewChange={(v) => updateParams({ view: v === 'grid' ? null : v })}
          />

          <div
            className={cn(
              view === 'grid'
                ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'
                : 'flex flex-col gap-4',
            )}
          >
            {filtered.map((agent, i) => (
              <AgentCard key={agent.kind} agent={agent} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-[#64748b]">No agents match your filters.</p>
          )}

          <div className="grid gap-4 pb-6 lg:grid-cols-2">
            <LiveActivityFeed events={activity} />
            <AgentPerformanceTable agents={agents} />
          </div>
        </div>
      )}
    </motion.div>
  );
}
