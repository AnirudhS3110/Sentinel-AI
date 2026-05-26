'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  GitBranch, 
  Boxes, 
  SearchCode, 
  ShieldCheck, 
  Wrench, 
  FileText,
  Activity,
  Layers,
  Settings,
  Shield,
  LayoutGrid
} from 'lucide-react';

const STAGES = [
  { label: 'Plan', done: true },
  { label: 'Classify', done: true },
  { label: 'Analyze', done: true },
  { label: 'Validate', active: true },
  { label: 'Remediate', pending: true },
  { label: 'Report', pending: true },
  { label: 'Resolved', pending: true }
];

const ACTIVITY = [
  { time: '3:11:17 AM', msg: 'Root cause analysis completed', stage: 'Validation', dotColor: 'bg-[#10b981]' },
  { time: '3:10:42 AM', msg: 'Database connection pool exhausted', stage: 'Analysis', dotColor: 'bg-[#10b981]' },
  { time: '3:09:58 AM', msg: 'Slow queries detected', stage: 'Analysis', dotColor: 'bg-[#8b5cf6]' },
  { time: '3:09:21 AM', msg: 'Incident classified as CRITICAL', stage: 'Classification', dotColor: 'bg-[#8b5cf6]' },
];

const AGENTS = [
  { name: 'Planner', status: 'COMPLETED', time: '1.2s', color: '#10b981', sparkData: [10, 10, 10, 10] },
  { name: 'Classification', status: 'COMPLETED', time: '2.1s', color: '#10b981', sparkData: [10, 10, 10, 10] },
  { name: 'Analysis', status: 'RUNNING', time: '14.5s', color: '#8b5cf6', sparkData: [12, 18, 14, 22, 16, 25, 20] },
  { name: 'Validation', status: 'RUNNING', time: '8.3s', color: '#8b5cf6', sparkData: [8, 12, 15, 11, 18, 14, 22] },
  { name: 'Remediation', status: 'PENDING', time: '—', color: '#475569', sparkData: [10, 10, 10, 10] },
  { name: 'Report', status: 'PENDING', time: '—', color: '#475569', sparkData: [10, 10, 10, 10] },
];

export function HeroDashboardPreview() {
  return (
    <div 
      className="relative hidden lg:block"
      style={{
        perspective: '2000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Dynamic Purple Background Glow */}
      <div className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[radial-gradient(circle_at_70%_40%,rgba(139,92,246,0.3),transparent_70%)] blur-3xl" />
      
      {/* 3D Tilted Dashboard Card */}
      <motion.div
        initial={{ opacity: 0, rotateY: 0, rotateX: 0 }}
        animate={{ 
          opacity: 1, 
          rotateY: -15, 
          rotateX: 8, 
          rotateZ: -2.5,
          y: [0, -8, 0]
        }}
        transition={{ 
          rotateY: { duration: 0.8, ease: 'easeOut' },
          rotateX: { duration: 0.8, ease: 'easeOut' },
          rotateZ: { duration: 0.8, ease: 'easeOut' },
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
        }}
        className={cn(
          "relative flex h-[500px] w-[760px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#040612]/95 text-white shadow-[25px_30px_70px_-15px_rgba(0,0,0,0.8),_0_0_50px_rgba(139,92,246,0.15)] backdrop-blur-3xl"
        )}
      >
        {/* Left Narrow Sidebar */}
        <div className="flex h-full w-[56px] shrink-0 flex-col items-center border-r border-white/[0.05] bg-[#02030a]/80 py-4 gap-5">
          {/* Logo emblem */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="mx-2 h-px w-6 bg-white/[0.05]" />
          
          {/* Icons stack */}
          <div className="flex flex-col gap-4 text-zinc-500">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-violet-400">
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:text-zinc-300 transition-colors">
              <Activity className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:text-zinc-300 transition-colors">
              <Shield className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:text-zinc-300 transition-colors">
              <SearchCode className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:text-zinc-300 transition-colors">
              <Wrench className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:text-zinc-300 transition-colors">
              <FileText className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:text-zinc-300 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Layout */}
        <div className="flex flex-1 flex-col">
          {/* Internal Topbar */}
          <div className="flex h-[48px] items-center justify-between border-b border-white/[0.05] bg-[#02030a]/40 px-5">
            <span className="text-xs font-semibold text-zinc-500">Dashboard</span>
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
            </div>
          </div>

          {/* Main Dashboard body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left section (Main telemetry & grid) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-none border-r border-white/[0.05]">
              {/* Incident header block */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-wide">INC-8372</span>
                  <span className="rounded px-1.5 py-0.5 text-[8px] font-black uppercase text-red-400 border border-red-500/20 bg-red-500/5">
                    Critical
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">Redis connection timeout</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Started 3:08:10 AM &bull; 14m 32s elapsed</p>
              </div>

              {/* Stepper Pipeline Row */}
              <div className="relative pt-1 pb-2">
                <div className="absolute inset-x-2 top-[12px] h-[1.5px] rounded bg-white/[0.05]">
                  <div className="h-full w-[54%] bg-gradient-to-r from-emerald-500 via-violet-500 to-transparent rounded" />
                </div>
                <div className="relative flex justify-between">
                  {STAGES.map((s, idx) => (
                    <div key={s.label} className="flex flex-col items-center">
                      <div className={cn(
                        "z-10 flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold border",
                        s.done && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                        s.active && "bg-violet-600 text-white border-violet-400/50 shadow-[0_0_12px_rgba(139,92,246,0.6)] animate-pulse",
                        s.pending && "bg-[#0b0c15] text-zinc-600 border-white/[0.05]"
                      )}>
                        {s.done ? '✓' : idx + 1}
                      </div>
                      <span className={cn(
                        "text-[8px] mt-1 font-semibold",
                        s.active ? "text-violet-300" : s.done ? "text-emerald-500" : "text-zinc-600"
                      )}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Double Column Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Live Activity Feed */}
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] p-3 flex flex-col justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Live activity</p>
                  <ul className="space-y-2.5">
                    {ACTIVITY.map((e, idx) => (
                      <li key={idx} className="flex gap-2 text-[9px]">
                        <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", e.dotColor)} />
                        <div className="min-w-0">
                          <span className="text-zinc-500 font-mono">{e.time}</span>
                          <p className="text-zinc-300 font-medium leading-normal truncate">{e.msg}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Agent Executions column */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Agent executions</p>
                    <span className="text-[8px] text-violet-400 hover:text-violet-300 font-semibold cursor-pointer">View all</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {AGENTS.map((a, idx) => (
                      <div 
                        key={idx}
                        className={cn(
                          "rounded-lg border border-white/[0.05] bg-white/[0.01] p-2 flex flex-col justify-between h-[52px]",
                          a.status === 'RUNNING' && "border-violet-500/20 bg-violet-600/[0.01]"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-zinc-300 truncate max-w-[50%]">{a.name}</span>
                          <span 
                            className="text-[7.5px] font-bold tracking-wide"
                            style={{ color: a.color }}
                          >
                            {a.status}
                          </span>
                        </div>
                        
                        {/* Sparkline representation */}
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <div className="flex-1 h-3 flex items-end">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 24 10">
                              <polyline
                                fill="none"
                                stroke={a.color}
                                strokeWidth="1"
                                points={a.sparkData.map((val, i) => `${(i / (a.sparkData.length - 1)) * 24},${10 - (val / 30) * 10}`).join(' ')}
                              />
                            </svg>
                          </div>
                          {a.time !== '—' && (
                            <span className="text-[8px] font-mono text-zinc-500 shrink-0">{a.time}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right block (Current status overview sidebar) */}
            <div className="w-[172px] shrink-0 p-5 bg-[#02030a]/20 flex flex-col gap-5 text-xs">
              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Current stage</span>
                <span className="text-sm font-bold text-white mt-1 block">Validation</span>
              </div>
              
              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Agents active</span>
                <span className="text-sm font-semibold text-white mt-1 block">2 / 6</span>
              </div>

              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Retries</span>
                <span className="text-sm font-semibold text-white mt-1 block">0</span>
              </div>

              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">ETA</span>
                <span className="text-sm font-semibold text-cyan-400 mt-1 block font-mono">~ 2m 15s</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
