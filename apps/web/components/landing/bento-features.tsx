'use client';

import { motion } from 'framer-motion';
import {
  Zap,
  ShieldCheck,
  BarChart3,
  Database,
  Link2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    icon: Zap,
    title: 'Event-driven workflows',
    desc: 'BullMQ coordinates specialized AI agents for reliable execution.',
    iconBg: 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_0_14px_rgba(124,58,237,0.4)]',
  },
  {
    icon: ShieldCheck,
    title: 'AI agent collaboration',
    desc: 'Six specialized agents work together to resolve incidents.',
    iconBg: 'bg-gradient-to-br from-blue-600 to-sky-500 shadow-[0_0_14px_rgba(56,189,248,0.3)]',
  },
  {
    icon: BarChart3,
    title: 'Real-time visibility',
    desc: 'Live updates, logs, and timeline streamed in real-time.',
    iconBg: 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_0_14px_rgba(124,58,237,0.4)]',
  },
  {
    icon: Database,
    title: 'Structured outputs',
    desc: 'Schema-validated results at every stage.',
    iconBg: 'bg-gradient-to-br from-blue-600 to-sky-500 shadow-[0_0_14px_rgba(56,189,248,0.3)]',
  },
  {
    icon: Link2,
    title: 'Deep integrations',
    desc: 'Connect your infrastructure, tools, and communication.',
    iconBg: 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_0_14px_rgba(124,58,237,0.4)]',
  },
];

export function BentoFeaturesSection() {
  return (
    <section id="features" className="px-6 py-12 md:py-16 bg-[#03030b]">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05, duration: 0.45, ease: 'easeOut' }}
              whileHover={{ y: -3, scale: 1.005 }}
              className={cn(
                'group relative overflow-hidden rounded-2xl border border-white/[0.04] p-5 transition-all duration-300',
                'bg-[#060814]/90 backdrop-blur-md hover:bg-[#090c1e] hover:border-white/[0.08]',
                'hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]',
              )}
            >
              {/* Soft card top radial glow */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity bg-gradient-to-b from-white to-transparent" />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  {/* Icon with custom bg */}
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl text-white mb-5 transition-transform group-hover:scale-105", 
                    f.iconBg
                  )}>
                    <f.icon className="h-4.5 w-4.5" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-[13px] font-bold text-white tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-zinc-400 font-medium">{f.desc}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
