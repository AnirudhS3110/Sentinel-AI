'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Database, 
  Network, 
  Layers, 
  Terminal, 
  Server, 
  ArrowRight, 
  ArrowLeftRight,
  ShieldAlert, 
  RefreshCw, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LAYERS = [
  {
    title: 'Frontend (Next.js)',
    icon: Terminal,
    color: '#8b5cf6',
    items: [
      'App Router & React Server Components for shell layout',
      'TanStack Query (React Query) for robust API fetching & caching',
      'Socket.IO Client integration on /incidents socket namespace',
      'Framer Motion for fluid micro-interactions and status updates',
    ],
  },
  {
    title: 'API Gateway (NestJS)',
    icon: Server,
    color: '#3b82f6',
    items: [
      'REST endpoints for incident CRUD, workflows, and post-mortems',
      'BullMQ publisher enqueues background agent jobs in Redis',
      'Redis Pub/Sub listener forwards worker events to Socket.IO',
      'Firebase Admin JWT verification guards for platform auth',
    ],
  },
  {
    title: 'Distributed Worker (NestJS)',
    icon: Cpu,
    color: '#10b981',
    items: [
      'BullMQ worker processes downstream queue items concurrently',
      'Six specialized LLM agents using Gemini structured mode',
      'LangGraph StateGraph controls validation paths and loops',
      'Publishes realtime execution logs directly to Redis channels',
    ],
  },
  {
    title: 'Infrastructure & Storage',
    icon: Database,
    color: '#06b6d4',
    items: [
      'PostgreSQL via Prisma ORM for transaction logs & report store',
      'Redis key-value store backs BullMQ job queues and state persistence',
      'TypeScript Workspace imports enums, Zod validation schemas, and types',
    ],
  },
];

const EVENT_STEPS = [
  { step: '1', title: 'Case Injection', desc: 'POST /incidents enqueues workflow jobs.' },
  { step: '2', title: 'Planning Agent', desc: 'Planner parses logs and creates execution plan.' },
  { step: '3', title: 'Telemetry Loop', desc: 'Downstream agents execute analysis & validation.' },
  { step: '4', title: 'State Graph Route', desc: 'LangGraph decides to retry or advance the queue.' },
  { step: '5', title: 'Pub/Sub Broadcast', desc: 'Redis publishes event payload in milliseconds.' },
  { step: '6', title: 'Gateway Forward', desc: 'API gateway broadcasts payload via Socket.IO.' },
  { step: '7', title: 'Console Update', desc: 'UI timeline updates live without polling.' },
];

const RETRY_STEPS = [
  { label: 'Validation Check', desc: 'Safety agent evaluates incident state & safetyScore.' },
  { label: 'Route Decision', desc: 'StateGraph checks if requiresRetry is true & retries < 3.' },
  { label: 'Loop Trigger', desc: 'API enqueues a new analysis job & publishes failure event.' },
  { label: 'Safe Escalation', desc: 'If retries exceed limit, stage fails and operators are paged.' },
];

export function ArchitectureContent() {
  const [activeTab, setActiveTab] = useState<'layers' | 'events' | 'graph'>('layers');

  return (
    <div className="space-y-6">
      {/* Interactive System Dataflow Map */}
      <div className="relative rounded-2xl border border-white/[0.06] bg-[#070913]/90 p-5 md:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-md">
        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-violet-600/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-cyan-600/5 blur-3xl" />
        
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            OPERATIONAL DATAFLOW MAP
          </p>
          <div className="flex items-center gap-1 text-[10px] text-[#10b981] font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
            Active Message Bus
          </div>
        </div>

        {/* Node Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
          <NodeCard 
            label="BROWSER CLIENT" 
            title="Next.js Console" 
            desc="Socket.IO Timeline & Grid" 
            icon={Terminal} 
            color="#8b5cf6" 
          />
          <NodeCard 
            label="API ROUTER" 
            title="NestJS Server" 
            desc="BullMQ Job Producer" 
            icon={Server} 
            color="#3b82f6" 
          />
          <NodeCard 
            label="MESSAGE BROKER" 
            title="Redis Queue" 
            desc="Pub/Sub & BullMQ Bus" 
            icon={ArrowLeftRight} 
            color="#06b6d4" 
          />
          <NodeCard 
            label="DISTRIBUTED WORKER" 
            title="NestJS Workers" 
            desc="Gemini Agents & Graph" 
            icon={Cpu} 
            color="#10b981" 
          />
          <NodeCard 
            label="TRANSACTION DB" 
            title="PostgreSQL" 
            desc="Prisma Persistence" 
            icon={Database} 
            color="#64748b" 
          />
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-white/[0.06] gap-2 pt-2">
        {['layers', 'events', 'graph'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={cn(
              'px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all relative',
              activeTab === tab 
                ? 'border-violet-500 text-white font-black' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            )}
          >
            {tab === 'layers' && 'Core Layers'}
            {tab === 'events' && 'Event Propagation'}
            {tab === 'graph' && 'Self-Healing Retries'}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'layers' && (
            <motion.div
              key="layers"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {LAYERS.map((layer, idx) => {
                const LayerIcon = layer.icon;
                return (
                  <div 
                    key={layer.title}
                    className="rounded-2xl border border-white/[0.05] bg-[#0b0d18]/40 p-5 hover:border-white/[0.08] hover:bg-[#0f1225]/40 transition-all group relative overflow-hidden"
                  >
                    <div 
                      className="pointer-events-none absolute inset-x-0 top-0 h-16 opacity-[0.02]"
                      style={{ background: `radial-gradient(ellipse at 50% 0%, ${layer.color}, transparent)` }}
                    />
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${layer.color}15` }}
                      >
                        <LayerIcon className="h-4.5 w-4.5" style={{ color: layer.color }} />
                      </div>
                      <h3 className="text-sm font-bold text-white tracking-tight">{layer.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {layer.items.map((item, i) => (
                        <li key={i} className="flex gap-2 text-xs text-zinc-400 items-start leading-relaxed">
                          <span className="mt-1.5 h-1 w-1 rounded-full bg-violet-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-white/[0.05] bg-[#0b0d18]/40 p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Info className="h-4 w-4 text-violet-400 shrink-0" />
                <span>Follow the event timeline of a SRE incident workflow execution.</span>
              </div>
              
              <div className="relative pl-6 space-y-4 border-l border-white/[0.04] py-2 ml-3">
                {EVENT_STEPS.map((s, idx) => (
                  <motion.div 
                    key={s.step} 
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative flex flex-col gap-1"
                  >
                    {/* Pulsing state connector node */}
                    <span className="absolute -left-[31px] top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#050816] border border-white/[0.1] text-[9px] font-mono text-zinc-500 font-bold">
                      {s.step}
                    </span>
                    <h4 className="text-xs font-bold text-white tracking-tight">{s.title}</h4>
                    <p className="text-[11px] text-zinc-400 leading-normal">{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'graph' && (
            <motion.div
              key="graph"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-white/[0.05] bg-[#0b0d18]/40 p-6 grid gap-6 md:grid-cols-12"
            >
              <div className="md:col-span-5 flex flex-col justify-between h-full gap-4">
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
                    <RefreshCw className="h-4.5 w-4.5 animate-spin-slow" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight">LangGraph Retry Loop</h3>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    Rather than static pipelines, SentinelAI implements a cyclic graph path to validate safety metrics.
                    If the verification stage flags inconsistency, the graph invokes self-healing actions.
                  </p>
                </div>
                
                <div className="bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl flex gap-3">
                  <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0" />
                  <div className="text-[10.5px] leading-relaxed text-zinc-400">
                    <span className="font-semibold text-white">Infinite Loop protection:</span> If an agent is unable to validate the incident safely within 3 attempts, the graph halts processing and pages the on-call SRE.
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 border-l border-white/[0.04] md:pl-6 space-y-4 py-1">
                {RETRY_STEPS.map((s, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#161a33] text-[10px] font-bold text-violet-400 font-mono">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">{s.label}</h4>
                      <p className="text-[11px] text-zinc-500 leading-normal mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NodeCard({ 
  label, 
  title, 
  desc, 
  icon: Icon,
  color 
}: { 
  label: string; 
  title: string; 
  desc: string; 
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}) {
  return (
    <div 
      className="rounded-xl border border-white/[0.04] bg-[#0c0d18]/90 p-4 transition-all hover:bg-[#111327]/60 group flex flex-col justify-between"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
    >
      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">{label}</span>
      <div className="flex items-center gap-2 mt-2">
        <Icon className="h-4.5 w-4.5 shrink-0" style={{ color }} />
        <h4 className="text-xs font-bold text-white tracking-tight">{title}</h4>
      </div>
      <p className="text-[10px] text-zinc-500 mt-1.5 leading-snug">{desc}</p>
    </div>
  );
}
