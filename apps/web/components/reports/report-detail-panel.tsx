'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Database,
  AlertTriangle,
  Users,
  Activity,
  DollarSign,
  Box,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import type { Incident, IncidentReport } from '@/lib/types';
import {
  buildTimelineEntries,
  HIGHLIGHTS,
  incidentDisplayId,
  parseRemediationSteps,
  resolutionDuration,
  syntheticChartSeries,
  syntheticImpactMetrics,
} from '@/lib/reports-filters';
import { ReportSeverityBadge } from './severity-badge';
import { ConfidenceGauge } from './confidence-gauge';
import { ImpactChart } from './impact-chart';
import { cn } from '@/lib/utils';

const TABS = ['Summary', 'Timeline', 'Root Cause', 'Remediation', 'Impact', 'Metadata'] as const;

export function ReportDetailPanel({
  incident,
  report,
  loading,
}: {
  incident: Incident | null;
  report: IncidentReport | null;
  loading?: boolean;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Summary');

  if (!incident && !loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(17,24,39,0.7)] backdrop-blur-[20px]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0b1020]">
          <Database className="h-6 w-6 text-[#475569]" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="text-[14px] font-semibold text-[#94a3b8]">No report selected</p>
          <p className="mt-1 text-[12px] text-[#475569]">Select a report from the list to view incident intelligence</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(17,24,39,0.7)] p-6 backdrop-blur-[20px]">
        {/* Shimmer loading state */}
        <div className="shimmer-skeleton h-8 w-64 rounded-lg" />
        <div className="shimmer-skeleton h-4 w-48 rounded" />
        <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shimmer-skeleton h-20 rounded-xl" />
          ))}
        </div>
        <div className="shimmer-skeleton h-48 rounded-xl" />
        <div className="shimmer-skeleton h-32 rounded-xl" />
      </div>
    );
  }

  if (!incident) return null;

  const metrics = syntheticImpactMetrics(incident);
  const chartData = syntheticChartSeries(incident);
  const timeline = buildTimelineEntries(incident, report?.timeline);
  const steps = report ? parseRemediationSteps(report.remediation) : [];
  const resolved = incident.status === 'RESOLVED';
  const duration = resolutionDuration(incident);
  const confidence = report ? 92 : 68;

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(17,24,39,0.7)] shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
      {/* Header */}
      <div className="border-b border-[rgba(255,255,255,0.06)] px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[18px] font-semibold leading-tight text-[#f8fafc]">{incident.title}</h2>
              <ReportSeverityBadge severity={incident.severity} />
            </div>
            <p className="mt-2 text-[11px] text-[#64748b]">
              Incident ID: {incidentDisplayId(incident.id)} ·{' '}
              {format(new Date(incident.createdAt), 'MMM d, yyyy HH:mm')}
              {duration && ` · Resolved in ${duration}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'rounded-full px-3 py-1 text-[11px] font-semibold',
                resolved
                  ? 'border border-[rgba(16,185,129,0.25)] bg-[#10b981]/10 text-[#10b981]'
                  : 'border border-[rgba(139,92,246,0.25)] bg-[#8b5cf6]/10 text-[#a78bfa]',
              )}
            >
              {resolved ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Resolved
                </span>
              ) : (
                'Ongoing'
              )}
            </span>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-[#7c3aed] px-3.5 py-2 text-[12px] font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#6d28d9]"
              style={{ boxShadow: '0 0 24px rgba(124,58,237,0.35)' }}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-0 overflow-x-auto border-b border-[rgba(255,255,255,0.06)]">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'relative shrink-0 px-4 pb-3 text-[13px] font-medium transition-colors',
                tab === t ? 'text-[#f8fafc]' : 'text-[#64748b] hover:text-[#94a3b8]',
              )}
            >
              {t}
              {tab === t && (
                <motion.span
                  layoutId="report-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#8b5cf6]"
                  style={{ boxShadow: '0 0 8px rgba(139,92,246,0.8)' }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {tab === 'Summary' && (
              <SummaryTab
                incident={incident}
                report={report}
                metrics={metrics}
                chartData={chartData}
                timeline={timeline}
                steps={steps}
                confidence={confidence}
              />
            )}
            {tab === 'Timeline' && <TimelineTab entries={timeline} />}
            {tab === 'Root Cause' && (
              <RootCauseTab report={report} category={incident.category} />
            )}
            {tab === 'Remediation' && <RemediationTab steps={steps} incidentId={incident.id} />}
            {tab === 'Impact' && <ImpactTab metrics={metrics} chartData={chartData} />}
            {tab === 'Metadata' && <MetadataTab incident={incident} report={report} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SummaryTab({
  incident,
  report,
  metrics,
  chartData,
  timeline,
  steps,
  confidence,
}: {
  incident: Incident;
  report: IncidentReport | null;
  metrics: ReturnType<typeof syntheticImpactMetrics>;
  chartData: ReturnType<typeof syntheticChartSeries>;
  timeline: ReturnType<typeof buildTimelineEntries>;
  steps: string[];
  confidence: number;
}) {
  const summary =
    report?.summary ??
    incident.description ??
    'AI-generated executive summary will appear when the report agent completes.';

  return (
    <div className="space-y-5">
      {/* Executive Summary + AI Confidence */}
      <div className="grid gap-5 xl:grid-cols-[1fr_260px]">
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(11,16,32,0.6)] p-5">
          <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Executive Summary</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-[#94a3b8]">{summary}</p>
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[rgba(255,255,255,0.05)] pt-4 sm:grid-cols-4">
            <SummaryMetric label="Severity" value={incident.severity ?? '—'} accent="critical" />
            <SummaryMetric label="Impact" value={`${metrics.failRate}%`} sub="requests failed" />
            <SummaryMetric label="Affected Users" value={metrics.users.toLocaleString()} />
            <SummaryMetric
              label="Duration"
              value={resolutionDuration(incident) ?? 'In progress'}
            />
          </div>
        </div>
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(11,16,32,0.6)] p-5">
          <h3 className="text-center text-[13px] font-semibold uppercase tracking-wider text-[#475569]">AI Confidence</h3>
          <div className="mt-4 flex justify-center">
            <ConfidenceGauge value={confidence} />
          </div>
        </div>
      </div>

      {/* Key Highlights + Incident Timeline */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(11,16,32,0.6)] p-5">
          <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Key Highlights</h3>
          <ul className="mt-4 space-y-3.5">
            {HIGHLIGHTS.map((h, i) => (
              <motion.li
                key={h.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8b5cf6]"
                  style={{ boxShadow: '0 0 8px rgba(139,92,246,0.6)' }}
                />
                <div>
                  <p className="text-[13px] font-semibold text-[#f8fafc]">{h.label}</p>
                  <p className="text-[11px] text-[#64748b]">{h.sub}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(11,16,32,0.6)] p-5">
          <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Incident Timeline</h3>
          <TimelineList entries={timeline.slice(0, 4)} compact />
          <Link
            href={`/incidents/${incident.id}`}
            className="group mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#8b5cf6] transition-colors hover:text-[#a78bfa]"
          >
            View full timeline
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Impact Chart */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(11,16,32,0.6)] p-5">
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Impact Analysis</h3>
        <div className="mt-4">
          <ImpactChart data={chartData} />
        </div>
        <div className="mt-4 flex flex-wrap gap-6 border-t border-[rgba(255,255,255,0.05)] pt-4 text-[12px] text-[#64748b]">
          <span>Payment failures: <strong className="text-[#f8fafc]">4,382</strong></span>
          <span>Revenue impact: <strong className="text-[#f8fafc]">${metrics.revenue.toLocaleString()}</strong></span>
          <span>Affected transactions: <strong className="text-[#f8fafc]">5,219</strong></span>
        </div>
      </div>

      {/* Remediation + Root Cause + Impact Cards */}
      <div className="grid gap-5 lg:grid-cols-3">
        <RemediationBlock steps={steps} incidentId={incident.id} />
        <RootCauseBlock report={report} category={incident.category} />
        <ImpactCards metrics={metrics} />
      </div>
    </div>
  );
}

function SummaryMetric({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#475569]">{label}</p>
      <p
        className={cn(
          'mt-1 text-[15px] font-bold leading-tight',
          accent === 'critical' ? 'text-[#ef4444]' : 'text-[#f8fafc]',
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[10px] text-[#64748b]">{sub}</p>}
    </div>
  );
}

function TimelineTab({ entries }: { entries: ReturnType<typeof buildTimelineEntries> }) {
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(11,16,32,0.6)] p-6">
      <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Full Timeline</h3>
      <TimelineList entries={entries} />
    </div>
  );
}

function TimelineList({
  entries,
  compact,
}: {
  entries: ReturnType<typeof buildTimelineEntries>;
  compact?: boolean;
}) {
  return (
    <ul className={cn('relative', compact ? 'mt-4' : 'mt-6')}>
      {/* Vertical line */}
      <div className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-[#8b5cf6]/60 via-[#06b6d4]/40 to-transparent" />
      {entries.map((e, i) => (
        <motion.li
          key={`${e.time}-${i}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.3 }}
          className="relative flex gap-4 pb-5 last:pb-0"
        >
          <span
            className={cn(
              'relative z-10 mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-[#060c1a]',
              e.tone === 'green'
                ? 'bg-[#10b981]'
                : 'bg-[#8b5cf6]',
            )}
            style={{
              boxShadow: e.tone === 'green'
                ? '0 0 12px rgba(16,185,129,0.6)'
                : '0 0 12px rgba(139,92,246,0.5)',
            }}
          />
          <div className="min-w-0 flex-1">
            <span className="rounded border border-[rgba(255,255,255,0.05)] bg-[#0b1020] px-1.5 py-0.5 font-mono text-[10px] text-[#64748b]">
              {e.time}
            </span>
            <p className="mt-1 text-[13px] font-medium text-[#f8fafc]">{e.label}</p>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}

function RootCauseTab({
  report,
  category,
}: {
  report: IncidentReport | null;
  category?: string | null;
}) {
  return <RootCauseBlock report={report} category={category} large />;
}

function RootCauseBlock({
  report,
  category,
  large,
}: {
  report: IncidentReport | null;
  category?: string | null;
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(11,16,32,0.6)] p-5',
        large && 'min-h-[280px]',
      )}
    >
      <Database className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 text-[#8b5cf6]/6" />
      <AlertTriangle className="pointer-events-none absolute bottom-4 right-8 h-16 w-16 text-[#f59e0b]/8" />
      <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Root Cause</h3>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-[#475569]">Primary cause</p>
      <p className="mt-1.5 text-[13px] font-medium text-[#f8fafc]">
        {report?.rootCause ?? 'Pending analysis agent output'}
      </p>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-[#475569]">Contributing factors</p>
      <ul className="mt-2 space-y-1.5">
        {['Connection pool exhaustion under peak load', 'Slow query accumulation in payment service', ...(category ? [`Category: ${category}`] : [])].map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-[12px] text-[#94a3b8]">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#475569]" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RemediationTab({ steps, incidentId }: { steps: string[]; incidentId: string }) {
  return <RemediationBlock steps={steps} incidentId={incidentId} large />;
}

function RemediationBlock({
  steps,
  incidentId,
  large,
}: {
  steps: string[];
  incidentId: string;
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(11,16,32,0.6)] p-5',
        large && 'min-h-[280px]',
      )}
    >
      <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Remediation Summary</h3>
      <ol className="mt-4 space-y-3">
        {(steps.length ? steps : ['Remediation steps pending report generation.']).map(
          (step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex gap-3 text-[12px] text-[#94a3b8]"
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-[#a78bfa]"
                style={{
                  background: 'rgba(139,92,246,0.15)',
                  boxShadow: '0 0 10px rgba(139,92,246,0.2)',
                }}
              >
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </motion.li>
          ),
        )}
      </ol>
      <Link
        href={`/incidents/${incidentId}`}
        className="group mt-5 inline-flex items-center gap-1 text-[12px] font-semibold text-[#8b5cf6] transition-colors hover:text-[#a78bfa]"
      >
        View full remediation plan
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

function ImpactTab({
  metrics,
  chartData,
}: {
  metrics: ReturnType<typeof syntheticImpactMetrics>;
  chartData: ReturnType<typeof syntheticChartSeries>;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(11,16,32,0.6)] p-5">
        <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Impact Over Time</h3>
        <ImpactChart data={chartData} />
      </div>
      <ImpactCards metrics={metrics} />
    </div>
  );
}

function ImpactCards({ metrics }: { metrics: ReturnType<typeof syntheticImpactMetrics> }) {
  const cards = [
    { label: 'User Impact', value: metrics.users.toLocaleString(), sub: '22.1% of total users', icon: Users, color: '#8b5cf6' },
    { label: 'Request Failure Rate', value: `${metrics.failRate}%`, sub: `${(metrics.users * 0.234).toFixed(0)} failed requests`, icon: Activity, color: '#ef4444' },
    { label: 'Revenue Impact', value: `$${metrics.revenue.toLocaleString()}`, sub: 'During outage window', icon: DollarSign, color: '#10b981' },
    { label: 'Services Affected', value: String(metrics.services), sub: 'See details', icon: Box, color: '#f59e0b' },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          whileHover={{ y: -3, scale: 1.01 }}
          className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(11,16,32,0.6)] p-4 transition-all duration-200 hover:border-[rgba(255,255,255,0.1)]"
          style={{
            ':hover': { boxShadow: `0 0 30px ${c.color}15` },
          } as React.CSSProperties}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: `${c.color}15`, boxShadow: `0 0 12px ${c.color}20` }}
          >
            <c.icon className="h-4 w-4" style={{ color: c.color }} strokeWidth={1.75} />
          </div>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-[#475569]">{c.label}</p>
          <p className="mt-1 text-[18px] font-bold leading-tight text-[#f8fafc]">{c.value}</p>
          <p className="mt-0.5 text-[10px] text-[#475569]">{c.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}

function MetadataTab({
  incident,
  report,
}: {
  incident: Incident;
  report: IncidentReport | null;
}) {
  const rows = [
    ['Incident ID', incidentDisplayId(incident.id)],
    ['Internal ID', incident.id],
    ['Status', incident.status],
    ['Severity', incident.severity ?? '—'],
    ['Category', incident.category ?? '—'],
    ['Created', format(new Date(incident.createdAt), 'PPpp')],
    ['Report generated', report ? format(new Date(report.createdAt), 'PPpp') : '—'],
  ];
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(11,16,32,0.6)] p-5">
      <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Metadata</h3>
      <dl className="divide-y divide-[rgba(255,255,255,0.05)]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between py-3 text-[12px]">
            <dt className="text-[#64748b]">{k}</dt>
            <dd className="font-mono font-medium text-[#f8fafc]">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
