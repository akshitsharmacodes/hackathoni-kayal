"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { TAGLINE } from "@/components/brand/logo";
import { CtaButtons } from "./cta-buttons";
import { PhoneDemo } from "./phone-demo";
import { SPONSORS } from "./sponsors";

const META = ["Malayalam · हिन्दी · தமிழ் · English", "Exact pin, GPS ±30 m", "Status you can check"];

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: "easeOut" as const, delay } };
  const { scrollY } = useScroll();
  const parallax = useTransform(scrollY, [0, 500], [0, reduce ? 0 : -32]);

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pt-24 pb-16 sm:gap-16 sm:pt-28 lg:grid-cols-[1.15fr_1fr] lg:pt-36 lg:pb-28">
        <div>
          <motion.h1
            {...rise(0.05)}
            className="mt-6 text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.4rem]"
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
          style={{ y: parallax }}
          className="flex justify-center lg:justify-end"
        >
          <PhoneDemo />
        </motion.div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{TAGLINE}</span>
          <span className="font-mono text-xs">
            Built with{" "}
            {SPONSORS.map((s, i) => (
              <span key={s.name}>
                {i > 0 && " · "}
                <a href={s.url} target="_blank" rel="noreferrer" className="hover:text-foreground">{s.name}</a>
              </span>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}
