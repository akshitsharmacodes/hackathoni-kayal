"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { TAGLINE } from "@/components/brand/logo";
import { CtaButtons } from "./cta-buttons";
import { PhoneDemo } from "./phone-demo";

const META = ["Malayalam · हिन्दी · தமிழ் · English", "Exact pin, GPS ±30 m", "Status you can check"];

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: "easeOut" as const, delay } };

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-6 pt-32 pb-20 lg:grid-cols-[1.15fr_1fr] lg:pt-36 lg:pb-28">
        <div>
          <motion.div {...rise(0)}>
            <Link
              href="#how"
              className="group inline-flex h-7 items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] text-accent-foreground">NEW</span>
              Built for Alappuzha · HackaThoni 2026
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
          <motion.h1
            {...rise(0.05)}
            className="mt-6 text-[2.9rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.4rem]"
          >
            Speak up for the <span className="text-primary">backwaters.</span>
          </motion.h1>
          <motion.p {...rise(0.1)} className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Report plastic, water hyacinth, oil and flooding by voice, with a photo and an exact pin. The panchayat sees it on a live
            map, and you can follow what happens next.
          </motion.p>
          <motion.div {...rise(0.15)}>
            <CtaButtons className="mt-8" />
          </motion.div>
          <motion.ul {...rise(0.2)} className="mt-8 flex flex-col gap-2 font-mono text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-5">
            {META.map((m, i) => (
              <li key={m} className="flex items-center gap-5">
                {i > 0 && <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />}
                {m}
              </li>
            ))}
          </motion.ul>
        </div>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="flex justify-center lg:justify-end"
        >
          <PhoneDemo />
        </motion.div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{TAGLINE}</span>
          <span className="font-mono text-xs">Built with Sarvam AI · smallest.ai · Devin · TinkerHub</span>
        </div>
      </div>
    </section>
  );
}
