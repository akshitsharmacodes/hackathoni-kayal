"use client";

import { motion, useReducedMotion } from "motion/react";
import { CATEGORIES } from "@/lib/kayal";

/* Hero visual: a quiet console-style map panel. Category-coloured pins over
   stylised backwater channels; one new pin settles in on load. */

const PINS = [
  // [x%, y%, category]
  [22, 30, "water_hyacinth"], [30, 38, "water_hyacinth"], [26, 34, "water_hyacinth"],
  [18, 60, "plastic"], [62, 58, "flooding"], [70, 64, "flooding"],
  [45, 22, "plastic"], [80, 30, "oil"], [55, 78, "broken_jetty"], [36, 50, "other"],
] as const;

const NEW_PIN = { x: 52, y: 44, category: "water_hyacinth" } as const;

const CHIPS = ["11 open", "5 in progress", "Hotspot: Kainakary"];

const color = (c: string) => CATEGORIES.find((k) => k.id === c)?.color ?? "#6B7280";

export function MapPanel() {
  const reduce = useReducedMotion();
  return (
    <div className="w-full max-w-[34rem] overflow-hidden rounded-xl border border-border bg-card">
      {/* Console title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <p className="font-mono text-[10px] text-muted-foreground">PANCHAYAT CONSOLE — LIVE</p>
        <div className="flex gap-1.5">
          {CHIPS.map((s) => (
            <span key={s} className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[20rem] bg-muted sm:h-[24rem]" role="img" aria-label="Live map of reports in the Alappuzha backwaters">
        {/* faint technical grid */}
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_5%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--foreground)_5%,transparent)_1px,transparent_1px)] [background-size:32px_32px]" aria-hidden />
        {/* water channels */}
        <div className="absolute -left-8 top-[42%] h-9 w-[130%] -rotate-6 bg-accent" aria-hidden />
        <div className="absolute left-[38%] top-0 h-full w-6 rotate-12 bg-accent" aria-hidden />
        <div className="absolute left-[70%] top-0 h-full w-4 -rotate-3 bg-accent/70" aria-hidden />

        {/* existing report pins */}
        {PINS.map(([x, y, c], i) => (
          <span
            key={i}
            className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70"
            style={{ left: `${x}%`, top: `${y}%`, backgroundColor: color(c), opacity: 0.85 }}
          />
        ))}

        {/* Kainakary hotspot */}
        <span className="absolute left-[26%] top-[34%] size-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/60" aria-hidden />

        {/* the new report settling in */}
        <motion.span
          className="absolute size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 bg-primary/10"
          style={{ left: `${NEW_PIN.x}%`, top: `${NEW_PIN.y}%` }}
          aria-hidden
          initial={reduce ? false : { scale: 2.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
        />
        <motion.span
          className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          style={{ left: `${NEW_PIN.x}%`, top: `${NEW_PIN.y}%`, backgroundColor: color(NEW_PIN.category) }}
          initial={reduce ? false : { scale: 0 }}
          animate={{ scale: [0, 1.5, 1] }}
          transition={{ duration: 0.55, delay: 0.7, ease: "easeOut" }}
        />
      </div>

      {/* Footer strip */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 font-mono text-[10px] text-muted-foreground">
        <span>9.50°N 76.35°E</span>
        <span>Alappuzha · Vembanad</span>
      </div>
    </div>
  );
}
