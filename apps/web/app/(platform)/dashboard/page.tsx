'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Topbar } from '@/components/layout/topbar';
import { fetchIncidents, fetchIncident, fetchLatestReport } from '@/lib/api';
import { useWorkflowSocket } from '@/hooks/use-workflow-socket';
import { IncidentPageHeader } from '@/components/incidents/incident-page-header';
import { IncidentStageHero } from '@/components/incidents/incident-stage-hero';
import { WorkflowTimelineStream } from '@/components/incidents/workflow-timeline-stream';
import { AgentExecutionGrid } from '@/components/incidents/agent-execution-grid';
import { LiveLogsStream } from '@/components/incidents/live-logs-stream';
import { IncidentMetadataPanel } from '@/components/incidents/incident-metadata-panel';
import { IncidentActivityPanel } from '@/components/incidents/incident-activity-panel';
import { ReportPanel } from '@/components/incidents/report-panel';
import { CreateIncidentDialog } from '@/components/incidents/create-incident-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiErrorCard } from '@/components/ui/api-error-card';
import { formatApiError } from '@/lib/api-error';
import { ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['incidents'],
    queryFn: () => fetchIncidents(1, 50),
    refetchInterval: 10_000,
  });

  const incidents = listQuery.data?.data ?? [];

  // Find the most active/latest incident
  const activeIncident = useMemo(() => {
    if (incidents.length === 0) return null;
    return incidents.find(i => i.status !== 'RESOLVED' && i.status !== 'FAILED') ?? incidents[0];
  }, [incidents]);

  const activeId = activeIncident?.id ?? null;

  // Set up workflow events socket for active incident
  const { events, connected } = useWorkflowSocket(activeId);

  // Fetch full details of the active incident
  const incidentQuery = useQuery({
    queryKey: ['incident', activeId],
    queryFn: () => fetchIncident(activeId!),
    enabled: Boolean(activeId),
    refetchInterval: 8_000,
  });

  const incident = incidentQuery.data ?? activeIncident;

  const status = incident?.status ?? '';
  const reportReady = useMemo(
    () => ['REPORT_GENERATION', 'RESOLVED'].includes(status) || events.some((e) => e.type.includes('report')),
    [status, events],
  );

  const reportQuery = useQuery({
    queryKey: ['report', activeId],
    queryFn: () => fetchLatestReport(activeId!),
    enabled: Boolean(activeId) && reportReady,
    retry: false,
    refetchInterval: reportReady && status !== 'RESOLVED' ? 5_000 : false,
  });

  useEffect(() => {
    if (!activeId || !events.length) return;
    qc.invalidateQueries({ queryKey: ['incident', activeId] });
    const last = events[events.length - 1];
    if (last.type.includes('report') || last.type.includes('completed')) {
      qc.invalidateQueries({ queryKey: ['report', activeId] });
    }
  }, [events.length, events, activeId, qc]);

  const workflow = incident?.workflowExecutions?.[0];
  const agents = workflow?.agentExecutions ?? [];
  const latestReport = reportQuery.data ?? incident?.reports?.[0];

  // Loading state
  if (listQuery.isLoading) {
    return (
      <>
        <Topbar title="Command Center" />
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

  // Error state
  if (listQuery.isError) {
    return (
      <>
        <Topbar title="Command Center" />
        <div className="p-6 lg:px-8">
          <ApiErrorCard message={formatApiError((listQuery.error as Error).message)} />
        </div>
      </>
    );
  }

  // Empty state
  if (!activeIncident || !incident) {
    return (
      <>
        <Topbar title="Command Center" subtitle="All systems monitored" apiConnected={listQuery.isSuccess} />
        <div className="mx-auto flex max-w-[1400px] flex-1 flex-col items-center justify-center p-8 min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center max-w-md text-center p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(17,24,39,0.7)] shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-[20px]"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10b981]/10 text-[#10b981] mb-6 shadow-[0_0_24px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-semibold text-[#f8fafc]">All systems operational</h2>
            <p className="mt-3 text-sm text-[#64748b] leading-relaxed">
              SentinelAI is actively monitoring your connected telemetry streams. There are no unresolved incidents or active execution pipelines.
            </p>
            <div className="mt-8 flex justify-center">
              <CreateIncidentDialog />
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar 
        title="Command Center" 
        subtitle={activeIncident ? `Active: ${activeIncident.title}` : 'Realtime orchestration'} 
        apiConnected={listQuery.isSuccess}
      />
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
