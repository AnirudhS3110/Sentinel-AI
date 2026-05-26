'use client';

import { useEffect, useState } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function WorkflowsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  range,
  onRangeChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  range: string;
  onRangeChange: (v: string) => void;
}) {
  const [draft, setDraft] = useState(search);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => onSearchChange(draft), 300);
    return () => clearTimeout(t);
  }, [draft, onSearchChange]);

  useEffect(() => {
    setDraft(search);
  }, [search]);

  const statusOptions = [
    { value: 'all', label: 'All status' },
    { value: 'running', label: 'Running' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'retrying', label: 'Retrying' },
  ];

  const rangeOptions = [
    { value: 'today', label: 'Today' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
  ];

  const selectedStatus = statusOptions.find((o) => o.value === status)?.label ?? 'All status';
  const selectedRange = rangeOptions.find((o) => o.value === range)?.label ?? 'Last 7 days';

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Search */}
      <div className="relative min-w-[240px] flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#475569]"
          strokeWidth={2}
        />
        <input
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search workflows, incidents…"
          className={cn(
            'h-9 w-full rounded-xl border bg-[#0b1020]/80 pl-9 pr-4 text-[13px] text-[#f8fafc]',
            'placeholder:text-[#475569] outline-none transition-all duration-200',
            focused
              ? 'border-[rgba(139,92,246,0.4)] shadow-[0_0_0_3px_rgba(139,92,246,0.1)]'
              : 'border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)]',
          )}
        />
      </div>

      {/* Status filter */}
      <FilterSelect
        label={`Status: ${selectedStatus}`}
        options={statusOptions}
        value={status}
        onChange={onStatusChange}
      />

      {/* Range filter */}
      <FilterSelect
        label={selectedRange}
        options={rangeOptions}
        value={range}
        onChange={onRangeChange}
      />
    </div>
  );
}

function FilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[12px] font-medium transition-all duration-200',
          open
            ? 'border-[rgba(139,92,246,0.35)] bg-[#8b5cf6]/8 text-[#c4b5fd]'
            : 'border-[rgba(255,255,255,0.07)] bg-[#0b1020]/80 text-[#94a3b8] hover:border-[rgba(255,255,255,0.12)] hover:text-[#f8fafc]',
        )}
      >
        {label}
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.ul
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute right-0 z-50 mt-1.5 min-w-[150px] overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0d1525]/98 py-1 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            >
              {options.map((o) => (
                <li key={o.value}>
                  <button
                    type="button"
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium capitalize transition-colors',
                      value === o.value
                        ? 'bg-[#8b5cf6]/10 text-[#c4b5fd]'
                        : 'text-[#94a3b8] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f8fafc]',
                    )}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                  >
                    <span className="flex-1">{o.label}</span>
                    {value === o.value && (
                      <Check className="h-3 w-3 text-[#8b5cf6]" strokeWidth={2.5} />
                    )}
                  </button>
                </li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
