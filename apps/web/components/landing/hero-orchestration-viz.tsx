'use client';

import { motion } from 'framer-motion';
import { AnimatedBeam } from './animated-beam';

const nodes = [
  { id: 'incident', label: 'Incident', color: 'from-zinc-500 to-zinc-600', status: 'triggered' },
  { id: 'planner', label: 'Planner', color: 'from-violet-500 to-violet-700', status: 'active' },
  { id: 'classify', label: 'Classify', color: 'from-indigo-500 to-indigo-700', status: 'done' },
  { id: 'analyze', label: 'Analyze', color: 'from-blue-500 to-blue-700', status: 'done' },
  { id: 'validate', label: 'Validate', color: 'from-cyan-500 to-cyan-700', status: 'running' },
];

export function HeroOrchestrationViz() {
  return (
    <div className="relative rounded-2xl border border-white/[0.1] bg-white/[0.03] p-6 shadow-2xl backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">Live orchestration</span>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
          Running
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 py-4">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {node.status === 'active' && (
                <motion.span
                  className="absolute -inset-1 rounded-xl bg-violet-500/40 blur-md"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <div
                className={`relative flex h-12 min-w-[72px] items-center justify-center rounded-xl bg-gradient-to-br ${node.color} px-3 text-xs font-medium text-white shadow-lg`}
              >
                {node.label}
              </div>
            </motion.div>
            {i < nodes.length - 1 && <AnimatedBeam className="hidden w-8 sm:block" />}
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2 rounded-xl border border-white/[0.06] bg-black/30 p-3">
        {[
          { time: '14:02:11', msg: 'classification.completed · severity HIGH', tone: 'text-emerald-400/90' },
          { time: '14:02:18', msg: 'validation.running · schema check', tone: 'text-amber-300/90' },
          { time: '14:02:19', msg: 'agent.analysis · 1.2s duration', tone: 'text-zinc-400' },
        ].map((line, i) => (
          <motion.div
            key={line.time}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.15 }}
            className="flex gap-3 text-[11px]"
          >
            <span className="text-zinc-600">{line.time}</span>
            <span className={line.tone}>{line.msg}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
