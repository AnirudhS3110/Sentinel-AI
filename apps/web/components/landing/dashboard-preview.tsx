'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SectionHeading } from './section-heading';

export function DashboardPreviewSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Console preview"
          title="Your incident command center"
          description="Dense, readable layouts inspired by the best observability tools — without the terminal aesthetic."
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-12"
        >
          <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-violet-600/40 via-fuchsia-500/30 to-cyan-500/40 opacity-60 blur-xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0c0c12]/90 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-4 text-xs text-zinc-500">SentinelAI · Dashboard</span>
            </div>
            <div className="flex min-h-[340px]">
              <aside className="hidden w-44 border-r border-white/[0.06] bg-white/[0.02] p-4 md:block">
                <p className="text-xs font-semibold text-white">SentinelAI</p>
                <nav className="mt-6 space-y-1">
                  {['Dashboard', 'Incidents', 'Architecture'].map((item, i) => (
                    <div
                      key={item}
                      className={`rounded-lg px-2 py-1.5 text-xs ${i === 0 ? 'bg-violet-500/20 text-violet-200' : 'text-zinc-500'}`}
                    >
                      {item}
                    </div>
                  ))}
                </nav>
              </aside>
              <main className="flex-1 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Orchestration overview</h3>
                  <span className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1 text-xs text-white">
                    Start workflow
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {[
                    { l: 'Active', v: '12' },
                    { l: 'Running', v: '8' },
                    { l: 'Failed', v: '1' },
                    { l: 'Resolved', v: '47' },
                  ].map((c) => (
                    <div
                      key={c.l}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3"
                    >
                      <p className="text-[10px] text-zinc-500">{c.l}</p>
                      <p className="mt-1 text-xl font-semibold text-white">{c.v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <div className="grid grid-cols-4 gap-2 border-b border-white/[0.06] px-3 py-2 text-[10px] text-zinc-500">
                    <span>Title</span>
                    <span>Severity</span>
                    <span>Stage</span>
                    <span>Status</span>
                  </div>
                  {[
                    ['API latency spike', 'HIGH', 'Validation', 'Running'],
                    ['Redis connection timeout', 'CRITICAL', 'Remediation', 'Running'],
                    ['Deploy rollback', 'MEDIUM', 'Resolved', 'Complete'],
                  ].map((row) => (
                    <div
                      key={row[0]}
                      className="grid grid-cols-4 gap-2 border-b border-white/[0.04] px-3 py-2.5 text-xs last:border-0"
                    >
                      <span className="text-white">{row[0]}</span>
                      <span className="text-orange-400">{row[1]}</span>
                      <span className="text-zinc-400">{row[2]}</span>
                      <span className="text-emerald-400">{row[3]}</span>
                    </div>
                  ))}
                </div>
              </main>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="absolute -right-4 top-1/4 hidden rounded-xl border border-violet-500/30 bg-[#12121a]/95 p-4 shadow-xl backdrop-blur-xl lg:block"
          >
            <p className="text-xs font-medium text-violet-300">Live timeline</p>
            <div className="mt-2 space-y-2">
              {['planner.completed', 'classification.completed', 'validation.running'].map((e) => (
                <div key={e} className="rounded-lg bg-white/[0.04] px-2 py-1 text-[10px] text-zinc-400">
                  {e}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        <p className="mt-8 text-center">
          <Link href="/dashboard" className="text-sm font-medium text-violet-400 hover:text-violet-300">
            Open the full console →
          </Link>
        </p>
      </div>
    </section>
  );
}
