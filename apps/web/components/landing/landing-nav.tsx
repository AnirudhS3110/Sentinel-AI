'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '/architecture', label: 'Architecture' },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-white/[0.06] bg-[#03030b]/80 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] backdrop-blur-xl'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] shadow-[0_0_16px_rgba(124,58,237,0.4)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6v12M8 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[14px] font-black tracking-[0.15em] text-white uppercase font-sans">
            Sentinel<span className="text-[#a78bfa]">AI</span>
          </span>
        </Link>

        {/* Center navigation */}
        <nav className="hidden items-center gap-1.5 md:flex">
          <button
            type="button"
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-[#94a3b8] transition-colors hover:text-[#f8fafc]"
          >
            Product
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={(e) => handleLinkClick(e, l.href)}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-[#94a3b8] transition-colors hover:text-[#f8fafc]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right side options */}
        <div className="flex items-center gap-3">
          {/* GitHub Icon Link only */}
          <a
            href="https://github.com/AnirudhS3110/Sentinel-AI.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-[#0c0c14] hover:bg-[#11111d] text-[#94a3b8] transition-all hover:border-white/15 hover:text-[#f8fafc] shadow-[0_0_12px_rgba(0,0,0,0.2)]"
            title="GitHub Repository"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>

          <Link
            href="/login"
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#94a3b8] transition-colors hover:text-[#f8fafc]"
          >
            Sign in
          </Link>
          
          <Link
            href="/dashboard"
            className="group flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.35)] transition-all hover:opacity-95 hover:scale-[1.02]"
          >
            Get started
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
