'use client';

import { motion } from 'framer-motion';
import { GlassCard, SpotlightCard } from './glass-card';
import { SectionHeading } from './section-heading';

const agents = [
  { name: 'Planner', desc: 'Decomposes incident context into executable steps', icon: '◆' },
  { name: 'Classification', desc: 'Severity, category, and routing signals', icon: '◇' },
  { name: 'Analysis', desc: 'Root cause inference from logs and metadata', icon: '○' },
  { name: 'Validation', desc: 'Schema checks with LangGraph retry paths', icon: '□' },
  { name: 'Remediation', desc: 'Actionable fix plans with guardrails', icon: '△' },
  { name: 'Report', desc: 'Executive summary and timeline export', icon: '◎' },
];

const activity = [
  { event: 'workflow.started', detail: 'Incident #a8f2 · planner queued', time: '2s ago' },
  { event: 'agent.completed', detail: 'Classification · HIGH · database', time: '8s ago' },
  { event: 'validation.failed', detail: 'Retry #1 → remediation branch', time: '12s ago' },
  { event: 'remediation.generated', detail: '4 steps · pool resize recommended', time: '18s ago' },
  { event: 'report.generated', detail: 'Summary ready for review', time: '24s ago' },
];

export function AgentPipelineSection() {
  return (
    <section id="workflow" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="AI agent pipeline"
          title="Six specialized agents, one coordinated workflow"
          description="Each stage emits structured JSON, persists to Postgres, and broadcasts events in realtime."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <SpotlightCard className="h-full">
                <span className="text-2xl text-violet-400/80">{a.icon}</span>
                <h3 className="mt-3 text-base font-semibold text-white">{a.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{a.desc}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LiveExecutionSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Live execution"
            title="Watch every stage as it happens"
            description="Socket.IO streams workflow events to your browser — no polling, no refresh."
            align="left"
          />
          <GlassCard glow className="!p-0">
            <div className="border-b border-white/[0.06] px-5 py-3">
              <p className="text-sm font-medium text-white">Activity feed</p>
              <p className="text-xs text-zinc-500">incident / a8f2-workflow</p>
            </div>
            <ul className="max-h-[280px] divide-y divide-white/[0.04] overflow-hidden">
              {activity.map((item, i) => (
                <motion.li
                  key={item.event + i}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                >
                  <div>
                    <p className="text-sm font-medium text-violet-200/90">{item.event}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">{item.detail}</p>
                  </div>
                  <span className="shrink-0 text-xs text-zinc-600">{item.time}</span>
                </motion.li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

export function AnimatedCharts() {
  const bars = [40, 65, 45, 80, 55, 90, 70, 85];
  return (
    <div className="flex h-24 items-end justify-between gap-1.5 px-2">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-full max-w-[12px] rounded-t-sm bg-gradient-to-t from-violet-600 to-violet-400/60"
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.5 }}
        />
      ))}
    </div>
  );
}
