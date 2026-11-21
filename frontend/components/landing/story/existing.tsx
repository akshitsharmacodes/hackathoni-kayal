import { Bell, Building2, MessageCircle, Phone, Sparkles } from "lucide-react";
import { Cite, Reveal, StorySection } from "./primitives";

// Honest, qualitative comparison: what each channel does well and where it falls short for backwater problems.
const ROWS = [
  {
    icon: Phone,
    name: "Calling the ward member or panchayat",
    good: "Personal, in your own language, no app needed.",
    gap: "No photo, no exact spot, no record. Depends on one person answering and remembering.",
  },
  {
    icon: MessageCircle,
    name: "WhatsApp groups and forwards",
    good: "Fast, photos and voice notes, everyone already uses it.",
    gap: "Messages get buried and forwarded without location. Rumours spread during floods. Nothing is tracked.",
  },
  {
    icon: Building2,
    name: "K-SMART (Kerala LSGD e-governance app, since Jan 2024)",
    good: "Official channel for local-body services, with online complaints and status tracking.",
    gap: "A general e-governance portal built around forms. Not designed for a quick voice report from a boat with a photo and an exact pin.",
    cite: 7,
  },
  {
    icon: Bell,
    name: "Disaster and weather alerts (KSDMA, IMD)",
    good: "Authoritative warnings for districts and dams.",
    gap: "One-way and district-level. They can't tell a resident whether water is entering houses in their own ward right now.",
  },
];

export function Existing() {
  return (
    <StorySection
      id="today"
      eyebrow="What exists today"
      title={<>Good channels, but none built for the backwaters</>}
      intro="Kayal doesn't replace these. It fills the gap between a fisher's voice and an official's map."
    >
      <Reveal className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="hidden grid-cols-[1.2fr_1fr_1.3fr] gap-6 border-b border-border px-7 py-4 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
          <span>Channel</span>
          <span>Works well</span>
          <span>Gap for backwater problems</span>
        </div>
        <ul className="divide-y divide-border">
          {ROWS.map((r) => (
            <li key={r.name} className="grid gap-3 px-7 py-6 transition-colors hover:bg-muted/40 md:grid-cols-[1.2fr_1fr_1.3fr] md:gap-6">
              <p className="flex items-start gap-3 font-medium">
                <r.icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                <span>
                  {r.name}
                  {r.cite && <Cite n={r.cite} />}
                </span>
              </p>
              <p className="text-[15px] leading-relaxed text-foreground/80">
                <span className="mr-1 text-xs font-medium uppercase tracking-wider text-muted-foreground md:hidden">Works well · </span>
                {r.good}
              </p>
              <p className="text-[15px] leading-relaxed text-foreground/80">
                <span className="mr-1 text-xs font-medium uppercase tracking-wider text-muted-foreground md:hidden">Gap · </span>
                {r.gap}
              </p>
            </li>
          ))}
          <li className="grid gap-3 bg-primary px-7 py-7 text-primary-foreground md:grid-cols-[1.2fr_2.3fr] md:gap-6">
            <p className="flex items-start gap-3 text-lg font-semibold">
              <Sparkles className="mt-1 size-5 shrink-0 text-[color:var(--gold)]" /> Kayal
            </p>
            <p className="text-[15px] leading-relaxed text-primary-foreground/90">
              Speak in Malayalam, Hindi, Tamil or English, add a photo, and confirm an exact pin (GPS to within 30 m, or placed by hand). AI sorts the
              problem, the panchayat sees it on a live map with hotspots and duplicates, and the citizen hears the status back. Residents can also ask,
              by voice, what is happening near them.
            </p>
          </li>
        </ul>
      </Reveal>
    </StorySection>
  );
}
