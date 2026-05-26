'use client';

import { motion } from 'framer-motion';
import { GlassCard } from './glass-card';
import { SectionHeading } from './section-heading';

const metrics = [
  { label: 'Active incidents', value: '12', change: '+3' },
  { label: 'Running workflows', value: '8', change: '' },
  { label: 'Avg. resolution', value: '4.2m', change: '-18%' },
  { label: 'Success rate', value: '94%', change: '+2%' },
];

export function ObservabilitySection() {
  return (
    <section id="observability" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Realtime observability"
          title="Command-center visibility for every incident"
          description="Timelines, agent grids, structured outputs, and reports — unified in one polished console."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard className="!p-5">
                <p className="text-xs text-zinc-500">{m.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{m.value}</p>
                {m.change && (
                  <p className="mt-1 text-xs text-emerald-400/90">{m.change}</p>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
        <TopologyViz />
      </div>
    </section>
  );
}

function TopologyViz() {
  const layers = [
    { name: 'Next.js UI', sub: 'Socket.IO client' },
    { name: 'Nest API', sub: 'REST + Gateway' },
    { name: 'BullMQ', sub: 'Job queues' },
    { name: 'Workers', sub: '6 agents' },
    { name: 'Redis', sub: 'Pub/Sub' },
    { name: 'Postgres', sub: 'Prisma' },
  ];
  return (
    <GlassCard glow className="mt-8">
      <p className="mb-6 text-sm font-medium text-white">Infrastructure topology</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {layers.map((l, i) => (
          <div key={l.name} className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="rounded-xl border border-white/[0.1] bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-4 py-3 text-center shadow-lg"
            >
              <p className="text-sm font-medium text-white">{l.name}</p>
              <p className="text-xs text-zinc-500">{l.sub}</p>
            </motion.div>
            {i < layers.length - 1 && (
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="text-violet-400"
              >
                →
              </motion.span>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
