import {
  endOfDay,
  isWithinInterval,
  startOfDay,
  subDays,
} from 'date-fns';
import type { Incident, IncidentSeverity, IncidentStatus } from './types';

export type ReportSeverityFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';
export type ReportStatusFilter = 'all' | 'resolved' | 'ongoing' | 'investigating';
export type ReportRangeFilter = 'today' | '7d' | '30d' | 'custom';

const RUNNING: IncidentStatus[] = [
  'REMEDIATION',
  'REPORT_GENERATION',
  'HUMAN_APPROVAL',
  'VALIDATION',
];

const INVESTIGATING: IncidentStatus[] = [
  'INCIDENT_CREATED',
  'PLANNING',
  'CLASSIFICATION',
  'ROOT_CAUSE_ANALYSIS',
  'FAILED',
];

export function incidentDisplayId(id: string): string {
  return `INC-${id.replace(/[^a-z0-9]/gi, '').slice(0, 4).toUpperCase()}`;
}

export function reportUiStatus(status: IncidentStatus): 'resolved' | 'ongoing' | 'investigating' {
  if (status === 'RESOLVED') return 'resolved';
  if (RUNNING.includes(status)) return 'ongoing';
  return 'investigating';
}

export function filterIncidents(
  incidents: Incident[],
  opts: {
    search: string;
    severity: ReportSeverityFilter;
    status: ReportStatusFilter;
    range: ReportRangeFilter;
    customFrom?: Date;
    customTo?: Date;
  },
): Incident[] {
  const q = opts.search.trim().toLowerCase();
  const now = new Date();

  let from: Date | null = null;
  let to: Date | null = endOfDay(now);

  if (opts.range === 'today') {
    from = startOfDay(now);
  } else if (opts.range === '7d') {
    from = startOfDay(subDays(now, 7));
  } else if (opts.range === '30d') {
    from = startOfDay(subDays(now, 30));
  } else if (opts.range === 'custom' && opts.customFrom && opts.customTo) {
    from = startOfDay(opts.customFrom);
    to = endOfDay(opts.customTo);
  }

  return incidents.filter((inc) => {
    if (q) {
      const hay = `${inc.title} ${inc.id} ${incidentDisplayId(inc.id)}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    if (opts.severity !== 'all') {
      const sev = (inc.severity ?? 'MEDIUM').toLowerCase() as Lowercase<IncidentSeverity>;
      if (sev !== opts.severity) return false;
    }

    if (opts.status !== 'all') {
      if (reportUiStatus(inc.status) !== opts.status) return false;
    }

    if (from && to) {
      const at = new Date(inc.updatedAt);
      if (!isWithinInterval(at, { start: from, end: to })) return false;
    }

    return true;
  });
}

export function parseRemediationSteps(text: string): string[] {
  const lines = text
    .split(/\n+/)
    .map((l) => l.replace(/^\d+[\).\s]+/, '').trim())
    .filter(Boolean);
  if (lines.length) return lines.slice(0, 8);
  return [text.trim()].filter(Boolean);
}

export function resolutionDuration(incident: Incident): string | null {
  const wf = incident.workflowExecutions?.[0];
  if (!wf?.startedAt) return null;
  const end = wf.completedAt ? new Date(wf.completedAt) : new Date(incident.updatedAt);
  const start = new Date(wf.startedAt);
  const ms = end.getTime() - start.getTime();
  if (ms < 0) return null;
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

/** Stable synthetic metrics for charts when API has no telemetry */
export function syntheticImpactMetrics(incident: Incident) {
  const seed = incident.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const mult = incident.severity === 'CRITICAL' ? 1.2 : incident.severity === 'HIGH' ? 1 : 0.7;
  const users = Math.round((12000 + (seed % 9000)) * mult);
  const failRate = Number((15 + (seed % 15) * mult * 0.1).toFixed(1));
  const revenue = Math.round((12000 + (seed % 20000)) * mult);
  const services = incident.severity === 'CRITICAL' ? 3 : incident.severity === 'HIGH' ? 2 : 1;
  return { users, failRate, revenue, services };
}

export function syntheticChartSeries(incident: Incident) {
  const base = new Date(incident.createdAt).getTime();
  const points = 14;
  const seed = incident.id.length;
  return Array.from({ length: points }, (_, i) => {
    const t = base + i * 120_000;
    const spike = i > points - 6 && i < points - 2 ? 18 + (seed % 8) : 2 + (i % 3);
    const err = Math.min(28, Math.max(1, spike + (i % 2)));
    const success = Math.max(72, 100 - err - (seed % 5));
    return {
      time: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      errorRate: err,
      successRate: success,
    };
  });
}

export type TimelineEntry = { time: string; label: string; tone?: 'purple' | 'green' };

export function buildTimelineEntries(
  incident: Incident,
  reportTimeline?: unknown,
): TimelineEntry[] {
  if (Array.isArray(reportTimeline)) {
    const parsed = reportTimeline
      .filter((e): e is Record<string, unknown> => typeof e === 'object' && e !== null)
      .map((e) => ({
        time: String(e.timestamp ?? e.time ?? ''),
        label: String(e.message ?? e.stage ?? ''),
        tone: (String(e.stage ?? '').toLowerCase().includes('recover') ? 'green' : 'purple') as
          | 'purple'
          | 'green',
      }))
      .filter((e) => e.label);
    if (parsed.length) return parsed;
  }

  const created = new Date(incident.createdAt);
  const fmt = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return [
    { time: fmt(created), label: 'Incident detected', tone: 'purple' },
    {
      time: fmt(new Date(created.getTime() + 120_000)),
      label: 'Alert triggered',
      tone: 'purple',
    },
    {
      time: fmt(new Date(created.getTime() + 300_000)),
      label: 'Root cause identified',
      tone: 'purple',
    },
    {
      time: fmt(new Date(created.getTime() + 480_000)),
      label: 'Fix deployed',
      tone: 'green',
    },
    {
      time: fmt(new Date(incident.updatedAt)),
      label: 'Service recovered',
      tone: 'green',
    },
  ];
}

export const HIGHLIGHTS = [
  { label: 'Detected', sub: 'Incident created' },
  { label: 'Alert Triggered', sub: 'On-call notified' },
  { label: 'Root Cause Identified', sub: 'Analysis agent' },
  { label: 'Fix Deployed', sub: 'Remediation applied' },
  { label: 'Service Recovered', sub: 'Validation passed' },
] as const;
