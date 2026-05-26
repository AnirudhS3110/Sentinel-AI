'use client';

import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { Topbar } from '@/components/layout/topbar';
import { fetchIncident, fetchLatestReport } from '@/lib/api';
import { useWorkflowSocket } from '@/hooks/use-workflow-socket';
import { IncidentPageHeader } from '@/components/incidents/incident-page-header';
import { IncidentStageHero } from '@/components/incidents/incident-stage-hero';
import { WorkflowTimelineStream } from '@/components/incidents/workflow-timeline-stream';
import { AgentExecutionGrid } from '@/components/incidents/agent-execution-grid';
import { LiveLogsStream } from '@/components/incidents/live-logs-stream';
import { IncidentMetadataPanel } from '@/components/incidents/incident-metadata-panel';
import { IncidentActivityPanel } from '@/components/incidents/incident-activity-panel';
import { ReportPanel } from '@/components/incidents/report-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiErrorCard } from '@/components/ui/api-error-card';
import { formatApiError } from '@/lib/api-error';

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const { events, connected } = useWorkflowSocket(id ?? null);

  const incidentQuery = useQuery({
    queryKey: ['incident', id],
    queryFn: () => fetchIncident(id!),
    enabled: Boolean(id),
    refetchInterval: 8_000,
  });

  const incident = incidentQuery.data;
  const status = incident?.status ?? '';

  const reportReady = useMemo(
    () => ['REPORT_GENERATION', 'RESOLVED'].includes(status) || events.some((e) => e.type.includes('report')),
    [status, events],
  );

  const reportQuery = useQuery({
    queryKey: ['report', id],
    queryFn: () => fetchLatestReport(id!),
    enabled: Boolean(id) && reportReady,
    retry: false,
    refetchInterval: reportReady && status !== 'RESOLVED' ? 5_000 : false,
  });

  useEffect(() => {
    if (!events.length) return;
    qc.invalidateQueries({ queryKey: ['incident', id] });
    const last = events[events.length - 1];
    if (last.type.includes('report') || last.type.includes('completed')) {
      qc.invalidateQueries({ queryKey: ['report', id] });
    }
  }, [events.length, events, id, qc]);

  const workflow = incident?.workflowExecutions?.[0];
  const agents = workflow?.agentExecutions ?? [];
  const latestReport = reportQuery.data ?? incident?.reports?.[0];

  if (incidentQuery.isLoading) {
    return (
      <>
        <Topbar title="Incident" />
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 p-6 lg:px-8">
          <Skeleton className="h-10 w-64 rounded-lg bg-white/[0.04]" />
          <Skeleton className="h-48 rounded-2xl bg-white/[0.04]" />
          <div className="grid gap-4 lg:grid-cols-5">
            <Skeleton className="h-80 rounded-2xl bg-white/[0.04] lg:col-span-2" />
            <Skeleton className="h-80 rounded-2xl bg-white/[0.04] lg:col-span-3" />
          </div>
        </div>
      </>
    );
  }

  if (incidentQuery.isError || !incident) {
    return (
      <>
        <Topbar title="Incident" />
        <div className="p-6 lg:px-8">
          <ApiErrorCard message={formatApiError((incidentQuery.error as Error)?.message ?? 'Incident not found')} />
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Incidents" subtitle={incident.title} />
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 p-6 lg:px-8">
        <IncidentPageHeader incident={incident} connected={connected} />

        {(latestReport || reportReady) && (
          <ReportPanel report={latestReport} />
        )}

        <IncidentStageHero
          incident={incident}
          workflowStartedAt={workflow?.startedAt}
          retryCount={workflow?.retryCount ?? 0}
          rootCause={latestReport?.rootCause}
          live={connected}
        />

        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <WorkflowTimelineStream events={events} />
          </div>
          <div className="lg:col-span-3">
            <AgentExecutionGrid executions={agents} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <LiveLogsStream logs={incident.rawLogs} />
          <IncidentMetadataPanel incident={incident} />
          <IncidentActivityPanel events={events} />
        </div>
      </div>
    </>
  );
}
