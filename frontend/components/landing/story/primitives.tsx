"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Fade/slide in once when scrolled into view (calm editorial motion). */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export function StorySection({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  tinted,
}: {
  id?: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  tinted?: boolean;
}) {
  return (
    <section id={id} className={cn(tinted && "border-y border-border bg-card/60", className)}>
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[color:var(--gold)]">{eyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h2>
          {intro && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{intro}</p>}
        </Reveal>
        <div className="mt-12 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}

/** Superscript link to the numbered source list at the bottom of the page. */
export function Cite({ n }: { n: number | number[] }) {
  const ids = Array.isArray(n) ? n : [n];
  return (
    <sup className="ml-0.5 text-[0.65em] font-medium">
      {ids.map((id, i) => (
        <a key={id} href={`#source-${id}`} className="text-[color:var(--gold)] hover:underline">
          {i > 0 ? "," : ""}[{id}]
        </a>
      ))}
    </sup>
  );
}
