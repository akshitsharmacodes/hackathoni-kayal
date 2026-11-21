"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Quiet fade-up on first view. (`lift` kept for API compatibility; precision style uses no hover lift.) */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  lift?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/** Section with a numbered monospace label, tight headline and optional intro. */
export function StorySection({
  id,
  index,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id?: string;
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  tinted?: boolean;
}) {
  return (
    <section id={id} className={cn("scroll-mt-16 border-t border-border", className)}>
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <p className="font-mono text-xs text-muted-foreground">
            {index && <span className="text-foreground">{index}</span>}
            {index && <span className="mx-2 text-border">/</span>}
            {eyebrow}
          </p>
          <div>
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.6rem]">{title}</h2>
            {intro && <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">{intro}</p>}
          </div>
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

/** Hairline grid: cells share 1px borders (Linear/Vercel style) instead of floating rounded cards. */
export function HairGrid({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("grid gap-px overflow-hidden rounded-xl border border-border bg-border", className)}>{children}</div>;
}

export function Cell({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("bg-card p-6 transition-colors hover:bg-muted/50 sm:p-7", className)}>{children}</div>;
}

/** Superscript link to the numbered source list at the bottom of the page. */
export function Cite({ n }: { n: number | number[] }) {
  const ids = Array.isArray(n) ? n : [n];
  return (
    <sup className="ml-0.5 font-mono text-[0.68em]">
      {ids.map((id, i) => (
        <a key={id} href={`#source-${id}`} className="text-muted-foreground hover:text-primary" aria-label={`Source ${id}`}>
          {i > 0 ? "," : ""}[{id}]
        </a>
      ))}
    </sup>
  );
}
