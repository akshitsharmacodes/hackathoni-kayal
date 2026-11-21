"use client";

import { motion, useReducedMotion } from "motion/react";
import { Languages, LocateFixed, ShieldCheck } from "lucide-react";
import { CtaButtons } from "./cta-buttons";
import { PhoneDemo } from "./phone-demo";
import { WaveBackground } from "./wave-background";

const FACTS = [
  { icon: Languages, text: "Malayalam · हिन्दी · தமிழ் · English" },
  { icon: LocateFixed, text: "Exact pin, GPS within 30 m" },
  { icon: ShieldCheck, text: "Status you can check" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut" as const, delay } };

  return (
    <section id="top" className="relative isolate overflow-hidden px-6 pt-28 pb-28 sm:pb-36">
      <WaveBackground />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div className="text-center lg:text-left">
          <motion.p {...rise(0)} className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" /> Alappuzha · Kuttanad · Kerala
          </motion.p>
          <motion.h1 {...rise(0.08)} className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Speak up for the{" "}
            <span className="relative whitespace-nowrap text-primary">
              backwaters
              <motion.svg
                viewBox="0 0 300 12"
                className="absolute -bottom-2 left-0 h-3 w-full text-[color:var(--gold)]"
                preserveAspectRatio="none"
                aria-hidden
              >
                <motion.path
                  d="M2 8 C 60 2, 120 12, 180 6 S 270 4, 298 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, delay: 0.5, ease: "easeInOut" }}
                />
              </motion.svg>
            </span>
            .
          </motion.h1>
          <motion.p {...rise(0.16)} className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
            <span lang="ml" className="font-medium text-foreground">കായൽ Kayal</span> lets anyone report plastic, water hyacinth, oil and
            flooding by voice, with a photo and an exact pin. The panchayat sees it on a live map and acts.
          </motion.p>
          <motion.ul {...rise(0.24)} className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
            {FACTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground/80">
                <Icon className="size-4 text-primary" /> {text}
              </li>
            ))}
          </motion.ul>
          <motion.div {...rise(0.32)}>
            <CtaButtons className="mx-auto mt-9 lg:mx-0" />
          </motion.div>
          <motion.p {...rise(0.4)} className="mt-6 text-xs text-muted-foreground">
            Built with Sarvam AI · smallest.ai · Devin · for HackaThoni 2026
          </motion.p>
        </div>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex justify-center"
        >
          <PhoneDemo />
        </motion.div>
      </div>
    </section>
  );
}
