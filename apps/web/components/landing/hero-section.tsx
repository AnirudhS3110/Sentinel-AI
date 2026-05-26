'use client';

import Link from 'next/link';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Sparkles, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { HeroDashboardPreview } from './hero-dashboard-preview';

const stagger:Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 },
  }),
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-[110px] md:pb-24 md:pt-[130px] bg-[#03030b]">
      {/* Curved glowing grid overlay in background */}
      <div className="pointer-events-none absolute left-0 top-[20%] h-[350px] w-[350px] rounded-full bg-violet-600/10 blur-[120px]" />
      
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div>
            {/* Sparkle Badge */}
            <motion.div
              custom={0}
              variants={stagger}
              initial="hidden"
              animate="show"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1.5"
            >
              <Sparkles className="h-3 w-3 text-violet-300" />
              <span className="text-[10px] font-bold tracking-[0.12em] text-violet-200 uppercase">
                AI-powered incident orchestration
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              custom={1}
              variants={stagger}
              initial="hidden"
              animate="show"
              className="max-w-xl text-[2.85rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[3.85rem] lg:text-[4.25rem]"
            >
              AI That{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-violet-500 to-indigo-400">
                Detects, Analyzes, and Fixes
              </span>{' '}
              Production Issues.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              custom={2}
              variants={stagger}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-lg text-sm leading-relaxed text-[#94a3b8]"
            >
              Monitor infrastructure problems in real-time and automate investigation,
              validation, and remediation workflows with AI-powered orchestration.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              custom={3}
              variants={stagger}
              initial="hidden"
              animate="show"
              className="mt-8 flex flex-wrap items-center gap-4.5"
            >
              <Link
                href="/dashboard"
                className="group   flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-xs font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.4)] transition-all hover:scale-[1.02] hover:opacity-95"
              >
                Start orchestrating
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#0c0c14] hover:bg-[#11111d] px-6 py-3.5 text-xs font-semibold text-white transition-all hover:border-white/15"
                onClick={() => window.open("https://github.com/AnirudhS3110/Sentinel-AI.git", "_blank")}
              >
                Repository
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.div>

            {/* Feature lists */}
            <motion.div
              custom={4}
              variants={stagger}
              initial="hidden"
              animate="show"
              className="mt-12 flex flex-wrap gap-8 border-t border-white/[0.04] pt-8"
            >
              <HeroFeature 
                icon={Activity} 
                title="Real-time execution" 
                desc="Watch agents work live" 
              />
              <HeroFeature 
                icon={Cpu} 
                title="AI-first remediation" 
                desc="Smarter, faster resolutions" 
              />
              <HeroFeature 
                icon={ShieldCheck} 
                title="Production ready" 
                desc="Built for scale and reliability" 
              />
            </motion.div>
          </div>

          {/* Right Preview */}
          <div className="relative flex justify-center">
            <HeroDashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroFeature({ 
  icon: Icon, 
  title, 
  desc 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  title: string; 
  desc: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600/10 border border-violet-500/15 text-violet-400">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-bold text-white tracking-wide">{title}</p>
        <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">{desc}</p>
      </div>
    </div>
  );
}
