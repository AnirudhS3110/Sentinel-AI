'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShieldAlert,
  Workflow,
  FileText,
  Bot,
  Plug,
  Settings,
  ChevronDown,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useSidebar } from './platform-shell';

const links = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, match: (p: string) => p === '/dashboard' },
  {
    href: '/dashboard',
    label: 'Incidents',
    icon: ShieldAlert,
    match: (p: string) => p.startsWith('/incidents'),
  },
  {
    href: '/workflows',
    label: 'Workflows',
    icon: Workflow,
    match: (p: string) => p.startsWith('/workflows'),
  },
  {
    href: '/reports',
    label: 'Reports',
    icon: FileText,
    match: (p: string) => p.startsWith('/reports'),
  },
  {
    href: '/agents',
    label: 'Agents',
    icon: Bot,
    match: (p: string) => p.startsWith('/agents'),
  },
  { href: '/dashboard', label: 'Integrations', icon: Plug, disabled: true },
  { href: '/dashboard', label: 'Settings', icon: Settings, disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, configured } = useAuth();
  const { isCollapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  
  const name = user?.displayName ?? user?.email?.split('@')[0] ?? 'Arjun Patel';
  const email = user?.email ?? (configured ? 'Account' : 'dev@sentinel.local');
  const initial = name.charAt(0).toUpperCase();

  const nav = (
    <div className="flex h-full flex-col justify-between py-4">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo and Collapse Header */}
        <div className={cn("px-5 py-2 flex items-center justify-between", isCollapsed && "px-0 justify-center")}>
          <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
            {isCollapsed ? (
              <div 
                onClick={(e) => {
                  e.preventDefault();
                  setCollapsed(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] shadow-[0_0_16px_rgba(124,58,237,0.4)] hover:scale-105 transition-all duration-200 cursor-pointer"
                title="Expand Sidebar"
              >
                <span className="text-sm font-black text-white">S</span>
              </div>
            ) : (
              <Image
                src="/sentinel-logo.png"
                alt="SentinelAI"
                width={140}
                height={32}
                className="h-7 w-auto object-contain object-left"
                priority
              />
            )}
          </Link>
          {!isCollapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="hidden lg:flex h-6 w-6 items-center justify-center rounded-md border border-[rgba(255,255,255,0.06)] bg-[#0b1020]/40 text-[#475569] hover:text-[#94a3b8] hover:bg-[#1b2540] transition-all"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="mx-4 my-4 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />

        {/* Nav links */}
        <nav className="flex-1 space-y-1 px-3 overflow-y-auto scrollbar-none">
          {links.map((l) => {
            const active = l.match ? l.match(pathname) : pathname === l.href;
            const inner = (
              <>
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200',
                    active
                      ? 'bg-[#7c3aed]/30 text-[#c4b5fd]'
                      : 'text-[#475569] group-hover:bg-[#1b2540]/80 group-hover:text-[#94a3b8]',
                    l.disabled && 'opacity-30',
                  )}
                >
                  <l.icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
                </span>
                {!isCollapsed && <span className="flex-1 text-[13px] truncate">{l.label}</span>}
                {!isCollapsed && l.disabled && (
                  <span className="rounded-md border border-[rgba(255,255,255,0.06)] bg-[#0b1020] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-[#475569]">
                    Soon
                  </span>
                )}
              </>
            );

            const className = cn(
              'group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13px] font-medium transition-all duration-200',
              active ? 'text-[#f1f5f9]' : 'text-[#475569] hover:text-[#94a3b8]',
              l.disabled && 'pointer-events-none',
              isCollapsed && 'justify-center px-0'
            );

            if (l.disabled) {
              return (
                <div key={l.label} className={className} title={isCollapsed ? `${l.label} (Soon)` : undefined}>
                  {inner}
                </div>
              );
            }

            return (
              <Link 
                key={l.label} 
                href={l.href} 
                onClick={() => setMobileOpen(false)} 
                className={className}
                title={isCollapsed ? l.label : undefined}
              >
                <AnimatePresence>
                  {active && !isCollapsed && (
                    <>
                      <motion.span
                        layoutId="sidebar-active-bg"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#7c3aed]/18 via-[#7c3aed]/10 to-transparent"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                      <motion.span
                        layoutId="sidebar-active-indicator"
                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#8b5cf6]"
                        style={{ boxShadow: '0 0 10px rgba(139,92,246,0.8), 0 0 20px rgba(139,92,246,0.4)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    </>
                  )}
                  {active && isCollapsed && (
                    <motion.span
                      layoutId="sidebar-active-dot"
                      className="absolute left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#8b5cf6]"
                      style={{ boxShadow: '0 0 8px rgba(139,92,246,0.8)' }}
                    />
                  )}
                </AnimatePresence>
                <span className={cn("relative z-10 flex items-center gap-3", isCollapsed ? "justify-center w-8" : "w-full")}>
                  {inner}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer section (Status and User) */}
      <div className="flex flex-col gap-2 shrink-0">
        {/* System status */}
        {!isCollapsed ? (
          <div className="mx-4 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#0b1020]/60 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#10b981]" strokeWidth={2.5} />
              <span className="text-[11px] font-medium text-[#64748b]">All systems operational</span>
            </div>
            <div className="mt-1.5 flex gap-1">
              {['API', 'Workers', 'WS'].map((s) => (
                <span
                  key={s}
                  className="rounded bg-[#10b981]/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#10b981]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2" title="All systems operational (API, Workers, WS)">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-[#10b981]/50" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-[#10b981]" />
            </span>
          </div>
        )}

        {/* User card */}
        {!isCollapsed ? (
          <div className="p-3">
            <div
              className="flex items-center gap-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0d1117]/80 p-3"
              style={{ boxShadow: '0 0 0 1px rgba(139,92,246,0.06), inset 0 1px 0 rgba(255,255,255,0.04)' }}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] text-sm font-bold text-white shadow-[0_0_16px_rgba(124,58,237,0.4)]">
                {initial}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[#f1f5f9]">{name}</p>
                <p className="truncate text-[11px] text-[#475569]">SRE Team</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#475569]" />
            </div>
            <p className="mt-1.5 truncate px-1 text-[10px] text-[#475569]">{email}</p>
          </div>
        ) : (
          <div className="p-3 flex flex-col items-center justify-center" title={`${name} (${email}) - SRE Team`}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] text-sm font-bold text-white shadow-[0_0_16px_rgba(124,58,237,0.4)] hover:scale-105 transition-all cursor-pointer">
              {initial}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const shellClass = cn(
    'hidden lg:flex shrink-0 flex-col border-r border-[rgba(255,255,255,0.05)] bg-[#060b15]/98 backdrop-blur-2xl transition-all duration-300 ease-in-out',
    isCollapsed ? 'w-[76px]' : 'w-[248px]'
  );

  const shellStyle = {
    boxShadow: 'inset -1px 0 0 rgba(139,92,246,0.07), 4px 0 30px rgba(0,0,0,0.3)',
  };

  return (
    <>
      <aside className={shellClass} style={shellStyle}>
        {nav}
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-0 bg-black/60 backdrop-blur-[3px]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative h-full flex w-[248px] shrink-0 flex-col border-r border-white/[0.05] bg-[#060b15]/98 backdrop-blur-2xl"
              style={shellStyle}
            >
              {nav}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
