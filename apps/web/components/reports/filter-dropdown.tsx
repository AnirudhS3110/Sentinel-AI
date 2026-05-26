'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  icon: Icon,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  icon?: typeof Calendar;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const selected = options.find((o) => o.value === value)?.label ?? label;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
        className={cn(
          'flex h-10 min-w-[120px] items-center justify-between gap-2 rounded-xl border border-[rgba(255,255,255,0.06)]',
          'bg-[#111827]/80 px-3 text-sm text-[#94a3b8] transition-all duration-200',
          'hover:border-[rgba(255,255,255,0.1)] hover:bg-[#161d2b]',
          open && 'border-[rgba(139,92,246,0.35)] shadow-[0_0_24px_-6px_rgba(124,58,237,0.25)]',
        )}
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="h-3.5 w-3.5 text-[#64748b]" />}
          <span>{selected}</span>
        </span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 z-50 mt-2 min-w-full overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111827]/95 py-1 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            {options.map((opt) => (
              <li key={opt.value} role="option" aria-selected={opt.value === value}>
                <button
                  type="button"
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm transition-colors',
                    opt.value === value
                      ? 'bg-[#8b5cf6]/15 text-[#f8fafc]'
                      : 'text-[#94a3b8] hover:bg-[#1b2540] hover:text-[#f8fafc]',
                  )}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
