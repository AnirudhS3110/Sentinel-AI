'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassCard } from './glass-card';
import { SectionHeading } from './section-heading';
import { Button } from '@/components/ui/button';

const stack = ['NestJS', 'BullMQ', 'Redis', 'LangGraph', 'Prisma', 'Gemini', 'Socket.IO', 'Firebase'];

export function IntegrationsSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Architecture"
            title="Integrates with your existing stack"
            description="Modular monorepo — API, worker, shared types, and a realtime web console. No microservice sprawl."
            align="left"
          />
          <GlassCard glow>
            <div className="flex flex-wrap gap-2">
              {stack.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-full border border-white/[0.1] bg-white/[0.05] px-3 py-1.5 text-sm text-zinc-300"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-zinc-400">
              Events flow from workers through Redis to the API gateway and into browser timelines.
              Validation failures route through LangGraph into remediation retries automatically.
            </p>
            <Button variant="outline" className="mt-6 border-white/15 bg-white/5 text-white" asChild>
              <Link href="/architecture">Explore system design</Link>
            </Button>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
