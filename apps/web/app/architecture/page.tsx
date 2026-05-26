'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArchitectureContent } from '@/components/architecture/architecture-content';
import { Home, LayoutDashboard, Cpu } from 'lucide-react';

export default function PublicArchitecturePage() {
  return (
    <div className="min-h-screen bg-[#03030b] text-[#f8fafc] selection:bg-[#8b5cf6]/30 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="pointer-events-none absolute -left-20 top-[10%] h-[350px] w-[350px] rounded-full bg-violet-600/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-[10%] h-[350px] w-[350px] rounded-full bg-cyan-600/5 blur-[120px]" />

      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#03030b]/75 px-6 backdrop-blur-2xl backdrop-saturate-150">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[13px] font-black tracking-[0.15em] text-white uppercase font-sans">
            Sentinel<span className="text-[#a78bfa]">AI</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#0c0c14] hover:bg-[#11111d] px-4 py-2 text-xs font-semibold text-[#94a3b8] transition-all hover:text-[#f8fafc]"
          >
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_16px_rgba(124,58,237,0.35)] transition-all hover:opacity-95"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Open console
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-violet-300">
            <Cpu className="h-3.5 w-3.5" />
            System Blueprint
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            System Architecture
          </h1>
          <p className="mt-3 max-w-2xl text-xs leading-relaxed text-zinc-400">
            A technical guide explaining SentinelAI's distributed queues, multi-agent validation graphs, 
            real-time telemetry message-bus, and persistent relational data storage.
          </p>
        </motion.div>

        <ArchitectureContent />
      </main>
    </div>
  );
}
