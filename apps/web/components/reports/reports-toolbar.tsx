'use client';

import { Search, Calendar } from 'lucide-react';
import { FilterDropdown } from './filter-dropdown';
import type {
  ReportRangeFilter,
  ReportSeverityFilter,
  ReportStatusFilter,
} from '@/lib/reports-filters';
import { cn } from '@/lib/utils';

export function ReportsToolbar({
  search,
  onSearchChange,
  severity,
  onSeverityChange,
  status,
  onStatusChange,
  range,
  onRangeChange,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  severity: ReportSeverityFilter;
  onSeverityChange: (v: ReportSeverityFilter) => void;
  status: ReportStatusFilter;
  onStatusChange: (v: ReportStatusFilter) => void;
  range: ReportRangeFilter;
  onRangeChange: (v: ReportRangeFilter) => void;
  customFrom: string;
  customTo: string;
  onCustomFromChange: (v: string) => void;
  onCustomToChange: (v: string) => void;
}) {
  return (
    <div className="flex h-14 flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search reports..."
          className={cn(
            'h-10 w-full rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#111827]/80 pl-10 pr-4 text-sm text-[#f8fafc]',
            'placeholder:text-[#64748b] transition-all duration-200',
            'focus:border-[rgba(139,92,246,0.4)] focus:outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.15)]',
          )}
        />
      </div>
      <FilterDropdown
        label="Severity"
        value={severity}
        onChange={onSeverityChange}
        options={[
          { value: 'all', label: 'All' },
          { value: 'critical', label: 'Critical' },
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' },
        ]}
      />
      <FilterDropdown
        label="Status"
        value={status}
        onChange={onStatusChange}
        options={[
          { value: 'all', label: 'All' },
          { value: 'resolved', label: 'Resolved' },
          { value: 'ongoing', label: 'Ongoing' },
          { value: 'investigating', label: 'Investigating' },
        ]}
      />
      <FilterDropdown
        label="Date Range"
        value={range}
        onChange={onRangeChange}
        icon={Calendar}
        options={[
          { value: 'today', label: 'Today' },
          { value: '7d', label: '7 days' },
          { value: '30d', label: '30 days' },
          { value: 'custom', label: 'Custom' },
        ]}
      />
      {range === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => onCustomFromChange(e.target.value)}
            className="h-10 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#111827]/80 px-2 text-xs text-[#94a3b8]"
          />
          <span className="text-[#64748b]">–</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => onCustomToChange(e.target.value)}
            className="h-10 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#111827]/80 px-2 text-xs text-[#94a3b8]"
          />
        </div>
      )}
    </div>
  );
}
