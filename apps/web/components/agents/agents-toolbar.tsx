'use client';

import { useEffect, useState } from 'react';
import { Search, LayoutGrid, List, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AgentFilterPill } from '@/lib/agents-data';
import { cn } from '@/lib/utils';

export function AgentsToolbar({
  pill,
  onPillChange,
  counts,
  search,
  onSearchChange,
  statusDropdown,
  onStatusDropdownChange,
  view,
  onViewChange,
}: {
  pill: AgentFilterPill;
  onPillChange: (p: AgentFilterPill) => void;
  counts: { all: number; active: number; idle: number; error: number };
  search: string;
  onSearchChange: (v: string) => void;
  statusDropdown: string;
  onStatusDropdownChange: (v: string) => void;
  view: 'grid' | 'list';
  onViewChange: (v: 'grid' | 'list') => void;
}) {
  const [draft, setDraft] = useState(search);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => onSearchChange(draft), 300);
    return () => clearTimeout(t);
  }, [draft, onSearchChange]);

  useEffect(() => {
    setDraft(search);
  }, [search]);

  const pills: { id: AgentFilterPill; label: string; count: number }[] = [
    { id: 'all', label: 'All Agents', count: counts.all },
    { id: 'active', label: 'Active', count: counts.active },
    { id: 'idle', label: 'Idle', count: counts.idle },
    { id: 'error', label: 'Error', count: counts.error },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-2">
        {pills.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPillChange(p.id)}
            className={cn(
              'rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200',
              pill === p.id
                ? 'bg-[#7c3aed] text-white shadow-[0_0_24px_rgba(124,58,237,0.35)]'
                : 'bg-[#111827]/80 text-[#94a3b8] hover:bg-[#161d2b] hover:text-[#f8fafc]',
            )}
          >
            {p.label} ({p.count})
          </button>
        ))}
      </div>

      <div className="relative min-w-[200px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
        <input
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search agents..."
          className={cn(
            'h-10 w-full rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#111827]/80 pl-10 pr-4 text-sm text-[#f8fafc]',
            'placeholder:text-[#64748b] focus:border-[rgba(139,92,246,0.4)] focus:outline-none focus:ring-2 focus:ring-[rgba(139,58,237,0.12)]',
          )}
        />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex h-10 items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#111827]/80 px-3 text-sm text-[#94a3b8]"
        >
          Status: {statusDropdown === 'all' ? 'All' : statusDropdown}
          <ChevronDown className={cn('h-4 w-4 transition-transform', dropdownOpen && 'rotate-180')} />
        </button>
        <AnimatePresence>
          {dropdownOpen && (
            <motion.ul
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute right-0 z-50 mt-2 min-w-[140px] rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111827]/95 py-1 shadow-xl backdrop-blur-xl"
            >
              {['all', 'active', 'idle', 'error'].map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm capitalize text-[#94a3b8] hover:bg-[#1b2540] hover:text-[#f8fafc]"
                    onClick={() => {
                      onStatusDropdownChange(s);
                      setDropdownOpen(false);
                    }}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <div className="flex rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#111827]/80 p-0.5">
        <button
          type="button"
          onClick={() => onViewChange('grid')}
          className={cn(
            'rounded-md p-2 transition-colors',
            view === 'grid' ? 'bg-[#8b5cf6]/20 text-[#a78bfa]' : 'text-[#64748b]',
          )}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onViewChange('list')}
          className={cn(
            'rounded-md p-2 transition-colors',
            view === 'list' ? 'bg-[#8b5cf6]/20 text-[#a78bfa]' : 'text-[#64748b]',
          )}
          aria-label="List view"
        >
          <List className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
