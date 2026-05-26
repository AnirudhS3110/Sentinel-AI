'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.08)] px-8 py-16 text-center md:px-16 md:py-20"
      >
        <div className="pointer-events-none absolute inset-0 landing-cta-gradient opacity-20" />
        <div className="pointer-events-none absolute -left-20 top-0 h-60 w-60 rounded-full bg-[#7c3aed]/30 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-60 w-60 rounded-full bg-[#06b6d4]/20 blur-[100px]" />
        <div className="relative z-10">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#111827]/80">
            <Sparkles className="h-6 w-6 text-[#a78bfa]" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#f8fafc] md:text-4xl">
            Ready to orchestrate your first incident?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-[#94a3b8]">
            Paste logs, start the workflow, and watch six AI agents collaborate in realtime — from
            triage to resolution.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl landing-cta-gradient px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_48px_-8px_rgba(124,58,237,0.5)] transition-transform hover:scale-[1.02]"
            >
              Get started free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(17,24,39,0.6)] px-8 py-3.5 text-sm font-medium text-[#f8fafc] backdrop-blur-md hover:border-[rgba(255,255,255,0.18)]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export function LandingFooter() {
  const cols = [
    { title: 'Product', links: ['Features', 'Architecture', 'Pricing', 'Changelog'] },
    { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
    { title: 'Resources', links: ['Docs', 'API', 'Status', 'Security'] },
  ];

  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#0b1020]/50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Image src="/sentinel-logo.png" alt="SentinelAI" width={140} height={32} className="h-8 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#64748b]">
              Premium AI incident orchestration for teams who run production infrastructure.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">{col.title}</p>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <span className="cursor-default text-sm text-[#64748b] transition-colors hover:text-[#94a3b8]">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.06)] pt-8 md:flex-row">
          <p className="text-xs text-[#64748b]">© {new Date().getFullYear()} SentinelAI. All rights reserved.</p>
          <nav className="flex flex-wrap gap-6 text-xs text-[#64748b]">
            <Link href="/dashboard" className="hover:text-[#94a3b8]">
              Dashboard
            </Link>
            <Link href="/architecture" className="hover:text-[#94a3b8]">
              Architecture
            </Link>
            <Link href="/login" className="hover:text-[#94a3b8]">
              Sign in
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
