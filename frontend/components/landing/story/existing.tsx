import { Bell, Building2, Check, MessageCircle, Phone } from "lucide-react";
import { Cite, Reveal, StorySection } from "./primitives";

// Honest, qualitative comparison: what each channel does well and where it falls short for backwater problems.
const ROWS = [
  {
    icon: Phone,
    name: "Calling the ward member",
    good: "Personal, in your own language, no app needed.",
    gap: "No photo, no exact spot, no record. Depends on one person answering and remembering.",
  },
  {
    icon: MessageCircle,
    name: "WhatsApp groups",
    good: "Fast; photos and voice notes; everyone already uses it.",
    gap: "Messages get buried and forwarded without location. Rumours spread during floods. Nothing is tracked.",
  },
  {
    icon: Building2,
    name: "K-SMART (LSGD app, Jan 2024)",
    good: "Official channel for local-body services, with online complaints and status tracking.",
    gap: "A general e-governance portal built around forms; not designed for a quick voice report from a boat with a photo and an exact pin.",
    cite: 7,
  },
  {
    icon: Bell,
    name: "KSDMA / IMD alerts",
    good: "Authoritative warnings for districts and dams.",
    gap: "One-way and district-level. Can't tell a resident whether water is entering houses in their ward right now.",
  },
];

const KAYAL = [
  "Speak in Malayalam, Hindi, Tamil or English",
  "Photo + exact pin (GPS ±30 m, or placed by hand)",
  "AI sorts the problem; citizen can correct it",
  "Live map for the panchayat: hotspots, duplicates",
  "Status the citizen can check; answers by voice",
];

export function Existing() {
  return (
    <StorySection
      id="today"
      index="03"
      eyebrow="What exists today"
      title={<>Good channels. None built for the backwaters.</>}
      intro="Kayal doesn't replace them. It fills the gap between a fisher's voice and an official's map."
    >
      <Reveal className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="hidden grid-cols-[1fr_1fr_1.3fr] gap-6 border-b border-border bg-muted/50 px-6 py-3 font-mono text-xs text-muted-foreground md:grid">
          <span>Channel</span>
          <span>Works well</span>
          <span>Gap</span>
        </div>
        <ul className="divide-y divide-border">
          {ROWS.map((r) => (
            <li key={r.name} className="grid gap-2 px-6 py-5 transition-colors hover:bg-muted/40 md:grid-cols-[1fr_1fr_1.3fr] md:gap-6">
              <p className="flex items-start gap-2.5 text-[15px] font-medium">
                <r.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>
                  {r.name}
                  {r.cite && <Cite n={r.cite} />}
                </span>
              </p>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{r.good}</p>
              <p className="text-[15px] leading-relaxed text-foreground/85">{r.gap}</p>
            </li>
          ))}
        </ul>
        <div className="grid gap-4 border-t border-border bg-accent/60 px-6 py-6 md:grid-cols-[1fr_2.3fr] md:gap-6">
          <p className="text-[15px] font-semibold text-accent-foreground">Kayal</p>
          <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {KAYAL.map((k) => (
              <li key={k} className="flex items-start gap-2 text-[15px] text-foreground/90">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {k}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </StorySection>
  );
}
