'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { usePlatformMenu } from '@/components/layout/platform-shell';
import { Button } from '@/components/ui/button';
import { fetchIncidents, fetchLatestReport } from '@/lib/api';
import {
  filterIncidents,
  type ReportRangeFilter,
  type ReportSeverityFilter,
  type ReportStatusFilter,
} from '@/lib/reports-filters';
import { ApiErrorCard } from '@/components/ui/api-error-card';
import { formatApiError } from '@/lib/api-error';
import { Skeleton } from '@/components/ui/skeleton';
import { ReportsToolbar } from './reports-toolbar';
import { ReportsListPanel } from './reports-list-panel';
import { ReportDetailPanel } from './report-detail-panel';

function parseSeverity(v: string | null): ReportSeverityFilter {
  if (v === 'critical' || v === 'high' || v === 'medium' || v === 'low') return v;
  return 'all';
}

function parseStatus(v: string | null): ReportStatusFilter {
  if (v === 'resolved' || v === 'ongoing' || v === 'investigating') return v;
  return 'all';
}

function parseRange(v: string | null): ReportRangeFilter {
  if (v === 'today' || v === '7d' || v === '30d' || v === 'custom') return v;
  return '7d';
}

export function ReportsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openMenu = usePlatformMenu();

  const severity = parseSeverity(searchParams.get('severity'));
  const status = parseStatus(searchParams.get('status'));
  const range = parseRange(searchParams.get('range'));
  const search = searchParams.get('q') ?? '';
  const selectedId = searchParams.get('incident');
  const customFrom = searchParams.get('from') ?? '';
  const customTo = searchParams.get('to') ?? '';

  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === '') params.delete(k);
        else params.set(k, v);
      });
      router.replace(`/reports?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['incidents', 'reports'],
    queryFn: () => fetchIncidents(1, 100),
  });

  const allIncidents = data?.data ?? [];

  const filtered = useMemo(
    () =>
      filterIncidents(allIncidents, {
        search,
        severity,
        status,
        range,
        customFrom: customFrom ? new Date(customFrom) : undefined,
        customTo: customTo ? new Date(customTo) : undefined,
      }),
    [allIncidents, search, severity, status, range, customFrom, customTo],
  );

  const selectedIncident =
    filtered.find((i) => i.id === selectedId) ??
    filtered[0] ??
    null;

  const effectiveSelectedId = selectedId ?? filtered[0]?.id ?? null;

  const reportQuery = useQuery({
    queryKey: ['report', effectiveSelectedId],
    queryFn: () => fetchLatestReport(effectiveSelectedId!),
    enabled: Boolean(effectiveSelectedId),
  });

  const handleSelect = (id: string) => {
    updateParams({ incident: id });
  };

  useEffect(() => {
    if (!filtered.length) return;
    const valid = selectedId && filtered.some((i) => i.id === selectedId);
    if (!valid) {
      updateParams({ incident: filtered[0].id });
    }
  }, [filtered, selectedId, updateParams]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-[calc(100vh)] min-h-0 flex-col px-6 py-5"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
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
              Reports
            </h1>
            <p className="mt-1 text-sm text-[#94a3b8]">
              AI-generated incident reports and insights
            </p>
          </div>
        </div>
      </div>

      <ReportsToolbar
        search={search}
        onSearchChange={(v) => updateParams({ q: v || null })}
        severity={severity}
        onSeverityChange={(v) => updateParams({ severity: v === 'all' ? null : v })}
        status={status}
        onStatusChange={(v) => updateParams({ status: v === 'all' ? null : v })}
        range={range}
        onRangeChange={(v) => updateParams({ range: v === '7d' ? null : v })}
        customFrom={customFrom}
        customTo={customTo}
        onCustomFromChange={(v) => updateParams({ from: v || null })}
        onCustomToChange={(v) => updateParams({ to: v || null })}
      />

      <div className="mt-4 min-h-0 flex-1">
        {isLoading ? (
          <div className="flex h-full gap-4">
            <Skeleton className="h-full w-[320px] rounded-2xl bg-[#111827]" />
            <Skeleton className="h-full flex-1 rounded-2xl bg-[#111827]" />
          </div>
        ) : isError ? (
          <ApiErrorCard message={formatApiError((error as Error).message)} />
        ) : (
          <div className="flex h-full gap-4">
            <ReportsListPanel
              incidents={filtered}
              selectedId={effectiveSelectedId}
              onSelect={handleSelect}
              totalLabel={filtered.length}
            />
            <ReportDetailPanel
              incident={selectedIncident}
              report={reportQuery.data ?? selectedIncident?.reports?.[0] ?? null}
              loading={reportQuery.isLoading && Boolean(effectiveSelectedId)}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
