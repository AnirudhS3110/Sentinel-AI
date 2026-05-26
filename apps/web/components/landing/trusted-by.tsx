'use client';

import { motion as FramerMotion } from 'framer-motion';

const TECH_STACK = [
  {
    name: 'Next.js',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C22 6.477 17.523 2 12 2zm3.766 15.228l-5.696-7.337v6.621H8.718V8.163h1.352l5.696 7.337v-6.621h1.352v9.064h-1.352z" fill="currentColor" />
      </svg>
    ),
    colorClass: 'group-hover:text-white',
  },
  {
    name: 'NestJS',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm8 13.5L12 20l-8-4.5v-7L12 4l8 4.5v7z" fill="currentColor" />
        <path d="M12 6l6 3.5v5L12 11V6z" fill="currentColor" />
      </svg>
    ),
    colorClass: 'group-hover:text-[#ea2845]',
  },
  {
    name: 'TypeScript',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" />
        <path d="M12 18h-2v-8H7V8h8v2h-3v8zm4 0h-2v-8h3v2h-1v6z" fill="#03030b" />
      </svg>
    ),
    colorClass: 'group-hover:text-[#3178c6]',
  },
  {
    name: 'Tailwind CSS',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.567.89 2.29 1.624C13.722 10.686 15.023 12 18.002 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.567-.89-2.29-1.624C16.28 6.114 14.979 4.8 12.001 4.8zm-6 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.567.89 2.29 1.624C7.722 15.486 9.023 16 12.002 16c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.567-.89-2.29-1.624C10.28 10.914 8.979 9.6 6.001 9.6z" fill="currentColor" />
      </svg>
    ),
    colorClass: 'group-hover:text-[#38BDF8]',
  },
  {
    name: 'Redis',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" />
        <path d="M2 12l10 5 10-5M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    colorClass: 'group-hover:text-[#D82C20]',
  },
  {
    name: 'PostgreSQL',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5c-2.48 0-4.5-2.02-4.5-4.5S8.52 8.5 11 8.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z" fill="currentColor" />
        <path d="M11 11h2v3h-2z" fill="currentColor" />
      </svg>
    ),
    colorClass: 'group-hover:text-[#336791]',
  },
  {
    name: 'Gemini API',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" fill="url(#gemini-grad-trusted)" />
        <defs>
          <linearGradient id="gemini-grad-trusted" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1a73e8" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#e8710a" />
          </linearGradient>
        </defs>
      </svg>
    ),
    colorClass: 'group-hover:opacity-100',
  },
  {
    name: 'LangGraph',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2.5" fill="currentColor" />
        <circle cx="5" cy="19" r="2.5" fill="currentColor" />
        <circle cx="19" cy="19" r="2.5" fill="currentColor" />
        <line x1="12" y1="7.5" x2="6.5" y2="16.5" />
        <line x1="12" y1="7.5" x2="17.5" y2="16.5" />
        <line x1="7.5" y1="19" x2="16.5" y2="19" />
      </svg>
    ),
    colorClass: 'group-hover:text-[#10b981]',
  },
];

export function TrustedBySection() {
  return (
    <section className="bg-[#03030b] px-6 py-8 border-b border-white/[0.03]">
      <div className="mx-auto max-w-7xl">
        <FramerMotion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500"
        >
          Tech Stack Powering SentinelAI
        </FramerMotion.p>
        
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {TECH_STACK.map((tech, i) => (
            <FramerMotion.div
              key={tech.name}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="flex items-center gap-2 cursor-default group"
            >
              <span className={`opacity-60 group-hover:opacity-100 transition-all duration-300 text-zinc-500 ${tech.colorClass}`}>
                {tech.icon}
              </span>
              <span className="text-[13px] font-bold tracking-tight text-zinc-500 group-hover:text-white transition-colors duration-300">
                {tech.name}
              </span>
            </FramerMotion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
