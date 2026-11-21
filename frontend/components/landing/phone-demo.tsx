"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Camera, Check, Leaf, LocateFixed, MapPin, Mic, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Speak", "Confirm pin", "Check type", "Sent"] as const;
const STEP_MS = 3200;

/* Hero phone: the real citizen workflow, at a readable scale. The review screen
   stays mounted across beats 2 and 3 — the pin drops, then the category lights. */

function SoundBars() {
  return (
    <div className="flex h-5 items-end gap-[3px]" aria-hidden>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-primary/70"
          animate={{ height: ["25%", "100%", "40%", "85%", "25%"] }}
          transition={{ duration: 1.15, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function ScreenSpeak() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
      <div>
        <p className="text-[15px] font-semibold tracking-tight">നമസ്കാരം</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">Tell me the problem</p>
      </div>
      <div className="relative">
        <motion.span
          className="absolute inset-0 rounded-full bg-destructive/25"
          animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          aria-hidden
        />
        <span className="relative flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Mic className="size-8" strokeWidth={1.75} />
        </span>
        <span className="absolute -right-2.5 bottom-0 flex size-8 items-center justify-center rounded-full border-2 border-card bg-muted text-foreground">
          <Camera className="size-3.5" />
        </span>
      </div>
      <SoundBars />
      <p className="font-mono text-[11px] text-muted-foreground">0:07 · tap to stop</p>
      <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
        <LocateFixed className="size-3.5 text-primary" /> Location ready · ±12 m
      </p>
    </div>
  );
}

function ScreenReview({ focus }: { focus: "pin" | "type" }) {
  const chips = [
    { id: "plastic", label: "Plastic" },
    { id: "hyacinth", label: "Hyacinth", active: true },
    { id: "oil", label: "Oil" },
    { id: "flood", label: "Flood" },
    { id: "jetty", label: "Jetty" },
    { id: "other", label: "Other" },
  ];
  return (
    <div className="flex h-full flex-col gap-2 pt-1">
      <p className="text-[15px] font-semibold tracking-tight">Is this right?</p>
      <div className="rounded-lg border border-border bg-card p-2.5">
        <p lang="ml" className="text-[12px] leading-snug">കനാലിൽ പോള നിറഞ്ഞ് വള്ളം പോകാൻ കഴിയുന്നില്ല.</p>
        <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="size-3" /> Kainakary
        </p>
      </div>

      <p className="font-mono text-[10px] text-muted-foreground">LOCATION</p>
      <div className="relative h-[4.5rem] shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
        <div className="absolute -left-4 top-7 h-7 w-[140%] -rotate-6 bg-accent" aria-hidden />
        <div className="absolute left-[30%] top-0 h-full w-5 rotate-6 bg-accent/80" aria-hidden />
        <div className="absolute left-[72%] top-0 h-full w-3.5 -rotate-3 bg-accent/60" aria-hidden />
        {/* neighbouring reports for context */}
        {[[18, 72, "#EA580C"], [80, 30, "#2563EB"], [58, 78, "#A16207"]].map(([x, y, c], i) => (
          <span key={i} className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70"
            style={{ left: `${x}%`, top: `${y}%`, backgroundColor: c as string, opacity: 0.8 }} />
        ))}
        {focus === "pin" && (
          <>
            <motion.span
              className="absolute left-[52%] top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 bg-primary/10"
              initial={{ scale: 2.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.div className="absolute left-[52%] top-1/2" initial={{ y: -48, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 17, delay: 0.25 }}>
              <MapPin className="size-6 -translate-x-1/2 -translate-y-full fill-primary text-background" />
            </motion.div>
          </>
        )}
        {focus === "type" && (
          <MapPin className="absolute left-[52%] top-1/2 size-6 -translate-x-1/2 -translate-y-full fill-primary text-background" />
        )}
      </div>
      <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <LocateFixed className="size-3 text-primary" /> ±12 m · tap the map to correct
      </p>

      <p className="font-mono text-[10px] text-muted-foreground">PROBLEM TYPE</p>
      <div className="grid grid-cols-3 gap-1.5">
        {chips.map((c) => (
          <motion.span
            key={c.id}
            animate={focus === "type" && c.active ? { backgroundColor: "#16A34A", color: "#ffffff", borderColor: "#16A34A" } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center justify-center gap-1 rounded-md border border-border bg-card py-1 text-[10px]"
          >
            {c.active && focus === "type" && <Leaf className="size-3" />}
            {c.label}
          </motion.span>
        ))}
      </div>
      <div className="mt-auto shrink-0">
        <span className="flex h-9 items-center justify-center rounded-lg bg-primary text-xs font-medium text-primary-foreground">Send</span>
      </div>
    </div>
  );
}

function ScreenSent() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 16 }}
        className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <Check className="size-8" strokeWidth={2.25} />
      </motion.span>
      <div>
        <p className="text-base font-semibold">Complaint #41 registered</p>
        <p lang="ml" className="mt-1 text-[11px] leading-snug text-muted-foreground">
          നന്ദി. കൈനകരി ഭാഗത്തെ പോള സംബന്ധിച്ച പരാതി രേഖപ്പെടുത്തി.
        </p>
      </div>
      <div className="w-full rounded-lg border border-border bg-card p-3 text-left">
        <p className="font-mono text-[10px] text-muted-foreground">WHAT HAPPENS NEXT</p>
        <ol className="mt-2 space-y-1.5 text-[11px] leading-snug">
          {["The panchayat sees it on their map", "A team is sent to the spot", "You can check the status anytime"].map((s, i) => (
            <li key={s} className="flex gap-2">
              <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>
      <p className="flex items-center gap-1 text-[10px] text-primary">
        <Volume2 className="size-3.5" /> Heard aloud in Malayalam
      </p>
    </div>
  );
}

/** Hero: the real citizen workflow inside a quiet device frame, console reacting beside it. */
export function PhoneDemo() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  const screenKey = step === 0 ? "speak" : step === 3 ? "sent" : "review";
  const sent = step === 3;

  return (
    <div className="relative mx-auto w-full max-w-[24rem] select-none" aria-label="Demo of reporting a problem in Kayal">
      {/* Phone */}
      <div className="relative w-[16.5rem] rounded-[2rem] border border-border bg-card p-4 shadow-sm">
        <div className="mx-auto mb-3 h-1 w-14 rounded-full bg-foreground/15" aria-hidden />
        <div className="flex items-baseline justify-between">
          <span lang="ml" className="text-sm font-semibold text-primary">കായൽ</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">മലയാളം</span>
        </div>
        <div className="relative mt-3 h-[23rem] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={screenKey}
              className="absolute inset-0"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {step === 0 ? <ScreenSpeak /> : sent ? <ScreenSent /> : <ScreenReview focus={step === 1 ? "pin" : "type"} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Step indicator */}
      <ol className="mt-6 flex w-[16.5rem] justify-between">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => setStep(i)}
              className={cn("flex flex-col items-center gap-1.5 font-mono text-[10px] transition-colors", i === step ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <span className={cn("h-px w-10 transition-colors", i === step ? "bg-primary" : "bg-border")} />
              {s}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
