'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { n: 1, title: 'Plan', sub: 'Incident mapped' },
  { n: 2, title: 'Classify', sub: 'Severity detected' },
  { n: 3, title: 'Analyze', sub: 'Root cause found' },
  { n: 4, title: 'Validate', sub: 'Confirm findings', active: true },
  { n: 5, title: 'Remediate', sub: 'Apply fixes' },
  { n: 6, title: 'Report', sub: 'Generate report' },
  { n: 7, title: 'Resolved', sub: 'Incident closed' },
];

export function PipelineSection() {
  const activeIdx = STEPS.findIndex((s) => s.active);

  return (
    <section id="pipeline" className="relative px-6 py-20 md:py-24 bg-[#03030b]">
      {/* Background glow overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(124,58,237,0.06),transparent)]" />
      
      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column - Hero text (Watch Demo button removed) */}
          <div className="lg:col-span-4 flex flex-col items-start gap-4">
            <span className="rounded-full bg-violet-600/10 border border-violet-500/20 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-violet-300">
              Live Demo
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
              See SentinelAI <br />in action
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Watch how AI agents collaborate in real-time to resolve incidents end-to-end.
            </p>
          </div>

          {/* Right Column - Stepper Card */}
          <div className="lg:col-span-8 w-full overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-white/[0.05] bg-[#060814]/90 p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-8 block">
                  End-to-end orchestration pipeline
                </span>

                {/* Responsive horizontal scrollbar for mobile, scaling normally on desktop */}
                <div className="overflow-x-auto scrollbar-none pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
                  <div className="relative py-2 min-w-[620px] md:min-w-0">
                    {/* Pipeline connection bar */}
                    <div className="absolute left-2 right-2 top-[24px] h-[1.5px] rounded bg-white/[0.05]">
                      <motion.div
                        className="h-full rounded bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${((activeIdx + 0.5) / STEPS.length) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </div>

                    {/* Pipeline Nodes */}
                    <div className="relative flex justify-between gap-1">
                      {STEPS.map((step, i) => {
                        const done = i < activeIdx;
                        return (
                          <motion.div
                            key={step.n}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="flex flex-col items-center text-center"
                          >
                            <div
                              className={cn(
                                'flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold border transition-all duration-300',
                                done && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15',
                                step.active && 'bg-violet-600 text-white border-violet-400/50 shadow-[0_0_16px_rgba(139,92,246,0.65)] animate-pulse',
                                !done && !step.active && 'bg-[#0b0c15] text-zinc-600 border-white/[0.04]',
                              )}
                            >
                              {done ? '✓' : step.n}
                            </div>
                            <p className={cn(
                              "mt-3.5 text-[11px] font-bold tracking-tight",
                              step.active ? "text-violet-300" : done ? "text-emerald-400" : "text-zinc-500"
                            )}>
                              {step.title}
                            </p>
                            <p className="mt-0.5 text-[9px] text-zinc-600 font-semibold tracking-wide">{step.sub}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status bar & View Live Dashboard link */}
              <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <p className="text-[11px] font-semibold text-zinc-400">
                    <span className="text-emerald-400 uppercase tracking-wider font-bold">Live</span>
                    <span className="text-zinc-700 mx-1.5">&bull;</span>
                    Validation agent is verifying database connection pool metrics...
                  </p>
                </div>

                <Link
                  href="/dashboard"
                  className="group flex items-center gap-1 text-[11px] font-bold text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-wider"
                >
                  View live dashboard
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
