"use client";

import { Loader2, Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  state: "idle" | "recording" | "busy";
  onClick: () => void;
  tone?: "green" | "gold";
  label: string;
  seconds?: number;
};

/** The giant round mic (D29). Green for reporting, gold for asking. */
export function MicButton({ state, onClick, tone = "green", label, seconds = 0 }: Props) {
  const recording = state === "recording";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === "busy"}
      aria-label={label}
      className={cn(
        "relative flex size-44 items-center justify-center rounded-full text-primary-foreground shadow-[0_18px_40px_-18px_rgba(31,77,58,0.55)] transition-all duration-200 active:scale-95 disabled:opacity-90",
        tone === "green" ? "bg-primary" : "bg-gold text-white",
        recording && "mic-recording bg-destructive",
      )}
    >
      <span className="absolute inset-2 rounded-full border border-white/15" />
      {state === "busy" ? (
        <Loader2 className="size-14 animate-spin" strokeWidth={1.75} />
      ) : recording ? (
        <span className="flex flex-col items-center gap-1">
          <Square className="size-11 fill-current" strokeWidth={1.5} />
          <span className="tabular text-sm font-medium opacity-90">0:{String(seconds).padStart(2, "0")}</span>
        </span>
      ) : (
        <Mic className="size-16" strokeWidth={1.75} />
      )}
    </button>
  );
}
