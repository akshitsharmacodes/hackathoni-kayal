"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Fade/slide in once when scrolled into view. `lift` adds a gentle hover lift for cards. */
export function Reveal({
  children,
  className,
  delay = 0,
  lift = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  lift?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn(
        lift && "transition-shadow duration-300 hover:shadow-[0_28px_56px_-32px_rgba(31,77,58,0.38)]",
        className,
      )}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={lift && !reduce ? { y: -4 } : undefined}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
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
    <section id={id} className={cn("scroll-mt-16", tinted && "border-y border-border bg-card/60", className)}>
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
        <Reveal className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-gold-ink">
            <span className="h-px w-8 bg-[color:var(--gold)]" aria-hidden />
            {eyebrow}
          </p>
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
    <sup className="ml-0.5 text-[0.7em] font-medium">
      {ids.map((id, i) => (
        <a key={id} href={`#source-${id}`} className="text-gold-ink hover:underline" aria-label={`Source ${id}`}>
          {i > 0 ? "," : ""}[{id}]
        </a>
      ))}
    </sup>
  );
}
