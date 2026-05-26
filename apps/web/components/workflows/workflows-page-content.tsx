'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { usePlatformMenu } from '@/components/layout/platform-shell';
import { Button } from '@/components/ui/button';
import { fetchIncident, fetchIncidents } from '@/lib/api';
import {
  buildWorkflowRuns,
  aggregateWorkflowFleet,
  filterWorkflowRuns,
  eventsToTimeline,
  defaultTimeline,
  shouldShowRetryPath,
} from '@/lib/workflows-data';
import { useWorkflowSocket } from '@/hooks/use-workflow-socket';
import { ApiErrorCard } from '@/components/ui/api-error-card';
import { formatApiError } from '@/lib/api-error';
import { WorkflowMetricsRow } from './workflow-metrics-row';
import { WorkflowsToolbar } from './workflows-toolbar';
import { WorkflowCanvas } from './workflow-canvas';
import { WorkflowTimeline } from './workflow-timeline';
import { WorkflowRunsTable } from './workflow-runs-table';
import { RetryVisualization } from './retry-visualization';
import { WorkflowCharts } from './workflow-charts';

async function loadIncidents() {
  const page = await fetchIncidents(1, 50);
  const top = page.data.slice(0, 25);
  const detailed = await Promise.all(top.map((i) => fetchIncident(i.id).catch(() => i)));
  return [...detailed, ...page.data.slice(25)];
}

/* ─── Shimmer skeleton ─────────────────────────────────────────────────────── */
function MetricSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="shimmer-skeleton relative h-[110px] overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.04)]"
        />
      ))}
    </div>
  );
}

function CanvasSkeleton() {
  return (
    <div className="shimmer-skeleton h-[350px] overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.04)]" />
  );
}

/* ─── Empty state ──────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(17,24,39,0.7)] py-20 backdrop-blur-[20px]"
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          background: 'rgba(139,92,246,0.1)',
          boxShadow: '0 0 40px rgba(124,58,237,0.15)',
          border: '1px solid rgba(139,92,246,0.2)',
        }}
      >
        <Activity className="h-7 w-7 text-[#8b5cf6]" strokeWidth={1.5} />
      </div>
      <p className="text-[15px] font-semibold text-[#f8fafc]">No workflow runs found</p>
      <p className="mt-2 max-w-xs text-center text-[13px] text-[#64748b]">
        Adjust your search or filters, or trigger an incident workflow from the dashboard.
      </p>
    </motion.div>
  );
}

/* ─── Main component ────────────────────────────────────────────────────────── */
export function WorkflowsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openMenu = usePlatformMenu();

  const search = searchParams.get('q') ?? '';
  const status = searchParams.get('status') ?? 'all';
  const range = searchParams.get('range') ?? '7d';
  const workflowId = searchParams.get('workflow');

  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === '') params.delete(k);
        else params.set(k, v);
      });
      router.replace(`/workflows?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const { data: incidents, isLoading, isError, error } = useQuery({
    queryKey: ['workflows-incidents'],
    queryFn: loadIncidents,
    refetchInterval: 12_000,
  });

  const allRuns = useMemo(() => buildWorkflowRuns(incidents ?? []), [incidents]);
  const filtered = useMemo(
    () => filterWorkflowRuns(allRuns, { search, status, range }),
    [allRuns, search, status, range],
  );

  const selectedRun = filtered.find((r) => r.id === workflowId) ?? filtered[0] ?? null;
  const effectiveWorkflowId = workflowId ?? filtered[0]?.id ?? null;

  useEffect(() => {
    if (!filtered.length) return;
    if (!workflowId || !filtered.some((r) => r.id === workflowId)) {
      updateParams({ workflow: filtered[0].id });
    }
  }, [filtered, workflowId, updateParams]);

  const metrics = useMemo(() => aggregateWorkflowFleet(allRuns), [allRuns]);
  const { events, connected } = useWorkflowSocket(selectedRun?.incidentId ?? null);

  const timeline = useMemo(() => {
    const items = events.length ? eventsToTimeline(events) : defaultTimeline();
    return items;
  }, [events]);

  const showRetry = shouldShowRetryPath(selectedRun, events);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto"
    >
      {/* Page Header */}
      <div className="sticky top-0 z-20 border-b border-[rgba(255,255,255,0.05)] bg-[#050816]/80 px-6 py-4 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {openMenu && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-[#64748b] lg:hidden"
                onClick={openMenu}
                aria-label="Open menu"
              >
                ☰
              </Button>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[22px] font-bold tracking-tight text-[#f8fafc]">Workflows</h1>
                {connected && (
                  <div className="flex items-center gap-1.5 rounded-full border border-[rgba(16,185,129,0.2)] bg-[#10b981]/8 px-2.5 py-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute h-full w-full animate-ping rounded-full bg-[#10b981] opacity-60" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#10b981]">
                      WebSocket
                    </span>
                  </div>
                )}
              </div>
              <p className="mt-0.5 text-[12px] text-[#64748b]">
                Realtime orchestration runtime — execution graph, routing &amp; live monitoring
              </p>
            </div>
          </div>

          {/* Toolbar integrated in header */}
          <div className="hidden flex-1 justify-end lg:flex">
            <div className="w-full max-w-xl">
              <WorkflowsToolbar
                search={search}
                onSearchChange={(v) => updateParams({ q: v || null })}
                status={status}
                onStatusChange={(v) => updateParams({ status: v === 'all' ? null : v })}
                range={range}
                onRangeChange={(v) => updateParams({ range: v === '7d' ? null : v })}
              />
            </div>
          </div>
        </div>

        {/* Mobile toolbar */}
        <div className="mt-3 lg:hidden">
          <WorkflowsToolbar
            search={search}
            onSearchChange={(v) => updateParams({ q: v || null })}
            status={status}
            onStatusChange={(v) => updateParams({ status: v === 'all' ? null : v })}
            range={range}
            onRangeChange={(v) => updateParams({ range: v === '7d' ? null : v })}
          />
        </div>
      </div>

      {/* Page Body */}
      <div className="flex-1 space-y-4 px-6 py-5">
        {/* Metrics */}
        {isLoading ? (
          <MetricSkeleton />
        ) : isError ? (
          <ApiErrorCard message={formatApiError((error as Error).message)} />
        ) : (
          <WorkflowMetricsRow metrics={metrics} />
        )}

        {/* Main content */}
        {!isLoading && !isError && (
          <>
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {/* Canvas */}
                {isLoading ? (
                  <CanvasSkeleton />
                ) : (
                  <WorkflowCanvas run={selectedRun} events={events} />
                )}

                {/* Retry path */}
                <RetryVisualization active={showRetry} />

                {/* Timeline + Charts (side by side) */}
                <div className="grid gap-4 lg:grid-cols-2">
                  <WorkflowTimeline items={timeline} />
                  <WorkflowCharts runs={filtered} />
                </div>

                {/* Runs table */}
                <WorkflowRunsTable
                  runs={filtered}
                  selectedId={effectiveWorkflowId}
                  onSelect={(id) => updateParams({ workflow: id })}
                />
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
