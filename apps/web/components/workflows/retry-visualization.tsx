'use client';

import { motion } from 'framer-motion';
import { RotateCcw, AlertTriangle, ShieldCheck, Wrench } from 'lucide-react';

export function RetryVisualization({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[rgba(245,158,11,0.25)] bg-[rgba(17,24,39,0.65)] p-6 backdrop-blur-[18px]"
    >
      <div className="flex items-center gap-2">
        <RotateCcw className="h-4 w-4 text-[#f59e0b]" />
        <h3 className="text-base font-semibold text-[#f8fafc]">Retry orchestration path</h3>
      </div>
      <p className="mt-2 text-sm text-[#94a3b8]">
        Validation failed — runtime reroutes through remediation and re-validates automatically.
      </p>
      <div className="relative mt-8 flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-12">
        <Step icon={ShieldCheck} label="Validate" state="failed" />
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="hidden h-px w-16 bg-gradient-to-r from-[#ef4444] to-[#f59e0b] md:block"
        />
        <motion.div
          className="flex flex-col items-center text-[#f59e0b] md:hidden"
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          ↓
        </motion.div>
        <Step icon={Wrench} label="Remediate" state="retry" />
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
          className="hidden h-px w-16 bg-gradient-to-r from-[#f59e0b] to-[#8b5cf6] md:block"
        />
        <motion.div
          className="flex flex-col items-center text-[#8b5cf6] md:hidden"
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
        >
          ↓
        </motion.div>
        <Step icon={ShieldCheck} label="Validate" state="running" />
      </div>
      <div className="mt-6 flex items-center gap-2 rounded-lg border border-[rgba(239,68,68,0.2)] bg-[#ef4444]/5 px-3 py-2 text-xs text-[#94a3b8]">
        <AlertTriangle className="h-3.5 w-3.5 text-[#ef4444]" />
        Intelligent reroute — retry count increments on workflow execution record
      </div>
    </motion.div>
  );
}

function Step({
  icon: Icon,
  label,
  state,
}: {
  icon: typeof ShieldCheck;
  label: string;
  state: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#111827] shadow-[0_0_24px_rgba(124,58,237,0.12)]">
        <Icon className="h-5 w-5 text-[#a78bfa]" />
      </div>
      <span className="text-sm font-medium text-[#f8fafc]">{label}</span>
      <span className="rounded-full bg-[#161d2b] px-2 py-0.5 text-[10px] capitalize text-[#94a3b8]">
        {state}
      </span>
    </div>
  );
}
