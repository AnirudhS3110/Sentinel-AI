'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: 'center' | 'left';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-xl')}
    >
      <p className="text-sm font-medium text-violet-400">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h2>
      <p className="mt-4 text-base leading-relaxed text-zinc-400">{description}</p>
    </motion.div>
  );
}
