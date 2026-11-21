"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Leaf, LocateFixed, MapPin, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Speak", "Exact pin", "AI sorts", "Sent"] as const;
const STEP_MS = 2600;

function SoundBars() {
  return (
    <div className="flex h-6 items-end gap-1" aria-hidden>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full bg-primary/70"
          animate={{ height: ["20%", "100%", "35%", "80%", "20%"] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.09, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function ScreenSpeak() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <div className="relative">
        <motion.span
          className="absolute inset-0 rounded-full bg-destructive/30"
          animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
          transition={{ duration: 1.3, repeat: Infinity }}
        />
        <span className="relative flex size-24 items-center justify-center rounded-full bg-destructive text-white shadow-lg">
          <Mic className="size-10" />
        </span>
      </div>
      <SoundBars />
      <p lang="ml" className="px-3 text-center text-[13px] leading-snug text-foreground/80">
        ഇവിടെ കനാലിൽ പോള നിറഞ്ഞു, വള്ളം പോകുന്നില്ല
      </p>
    </div>
  );
}

function ScreenPin() {
  return (
    <div className="flex h-full flex-col gap-3 pt-2">
      <p className="font-mono text-[11px] text-muted-foreground">Where is the problem?</p>
      <div className="relative h-40 overflow-hidden rounded-2xl bg-muted">
        <div className="absolute -left-4 top-16 h-8 w-[130%] -rotate-12 bg-accent" />
        <div className="absolute left-10 top-0 h-full w-5 rotate-6 bg-accent" />
        <motion.span
          className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 bg-primary/10"
          initial={{ scale: 2.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.3 }}
        >
          <MapPin className="size-8 -translate-x-1/2 -translate-y-full fill-primary text-background" />
        </motion.div>
      </div>
      <p className="flex items-center gap-1.5 text-[13px] text-primary">
        <LocateFixed className="size-4" /> Location ready · ±12 m
      </p>
    </div>
  );
}

function ScreenSort() {
  return (
    <div className="flex h-full flex-col gap-3 pt-2">
      <p className="font-mono text-[11px] text-muted-foreground">Is this right?</p>
      <div className="rounded-2xl border border-border bg-card p-3">
        <p lang="ml" className="text-[13px] leading-snug">കനാലിൽ പോള നിറഞ്ഞ് വള്ളം പോകാൻ കഴിയുന്നില്ല.</p>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="size-3" /> Kainakary</p>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {["Plastic", "Hyacinth", "Oil", "Flood", "Jetty", "Other"].map((c) => (
          <motion.span
            key={c}
            initial={false}
            animate={c === "Hyacinth" ? { backgroundColor: "#16A34A", color: "#ffffff", scale: [1, 1.08, 1] } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center justify-center gap-1 rounded-xl border border-border bg-card py-2 text-[11px]"
          >
            {c === "Hyacinth" && <Leaf className="size-3" />}
            {c}
          </motion.span>
        ))}
      </div>
      <span className="mt-auto rounded-xl bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground">Send</span>
    </div>
  );
}

function ScreenSent() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <motion.span
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <Check className="size-10" strokeWidth={2.5} />
      </motion.span>
      <p className="text-lg font-semibold">Complaint #41 registered</p>
      <p lang="ml" className="px-2 text-[12px] leading-snug text-muted-foreground">നന്ദി. കൈനകരി ഭാഗത്തെ പോള സംബന്ധിച്ച പരാതി രേഖപ്പെടുത്തി.</p>
    </div>
  );
}

const SCREENS = [ScreenSpeak, ScreenPin, ScreenSort, ScreenSent];

/** Hero product demo: a phone that loops through the real flow, with the panchayat console reacting behind it. */
export function PhoneDemo() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  const Screen = SCREENS[step];
  const sent = step === 3;

  return (
    <div className="relative mx-auto w-full max-w-[25rem] select-none" aria-label="Animated demo of reporting a problem in Kayal">
      {/* Console card behind the phone */}
      <div className="absolute -right-2 top-10 hidden w-60 rounded-xl border border-border bg-card p-3 shadow-[0_24px_48px_-28px_rgba(17,24,39,0.35)] sm:block">
        <p className="font-mono text-[10px] text-muted-foreground">Panchayat console</p>
        <div className="relative mt-2 h-36 overflow-hidden rounded-xl bg-muted">
          <div className="absolute left-[45%] top-0 h-full w-5 rotate-12 bg-accent" />
          {[
            [20, 30, "#EA580C"], [70, 25, "#2563EB"], [80, 70, "#374151"], [35, 75, "#A16207"], [60, 50, "#2563EB"],
          ].map(([x, y, c], i) => (
            <span key={i} className="absolute size-2.5 rounded-full" style={{ left: `${x}%`, top: `${y}%`, backgroundColor: c as string }} />
          ))}
          <AnimatePresence>
            {sent && (
              <motion.span
                key="new-pin"
                className="absolute left-[42%] top-[42%] size-3.5 rounded-full border-2 border-white bg-[#16A34A]"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.6, 1] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {sent && (
            <motion.p
              key="toast"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 flex items-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-[11px] text-foreground"
            >
              <span className="size-1.5 rounded-full bg-primary" /> New · Water hyacinth · Kainakary
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Phone */}
      <div className="relative w-[15.5rem] rounded-[2.2rem] border border-border bg-card p-4 shadow-[0_1px_0_rgba(17,24,39,0.04),0_30px_60px_-30px_rgba(17,24,39,0.35)]">
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-foreground/15" />
        <div className="flex items-baseline justify-between">
          <span lang="ml" className="text-sm font-semibold text-primary">കായൽ</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">മലയാളം</span>
        </div>
        <div className="relative mt-3 h-[22rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Screen />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Step indicator */}
      <ol className="mt-6 flex w-[15.5rem] justify-between">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => setStep(i)}
              className={cn("flex flex-col items-center gap-1.5 text-[11px] transition-colors", i === step ? "text-primary" : "text-muted-foreground")}
            >
              <span className={cn("h-1 w-10 rounded-full transition-colors", i === step ? "bg-primary" : "bg-border")} />
              {s}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
