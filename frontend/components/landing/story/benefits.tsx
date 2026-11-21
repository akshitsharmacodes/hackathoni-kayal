import { Anchor, Fish, Landmark, Languages } from "lucide-react";
import { Reveal, StorySection } from "./primitives";

const PEOPLE = [
  {
    icon: Fish,
    who: "Residents, fishers and farmers",
    points: [
      "Report in under a minute, by voice, without typing or forms",
      "See your complaint move: received, in progress, resolved",
      "Ask by voice whether water is rising near your home",
    ],
  },
  {
    icon: Languages,
    who: "Migrant workers",
    points: [
      "Use Kayal in Hindi or Tamil; the panchayat still reads it in English and Malayalam",
      "No need to find someone to translate a phone call",
      "Hear safety alerts spoken in your language",
    ],
  },
  {
    icon: Landmark,
    who: "Panchayat officials",
    points: [
      "Every report on one map with an exact pin, photo and the citizen's own voice",
      "Hotspots and likely duplicates show where to send the team first",
      "Post an alert once, and Kayal reads it out to everyone who asks",
    ],
  },
  {
    icon: Anchor,
    who: "Boat crews and tourism",
    points: [
      "Flag weed-blocked channels and broken jetties before they stop a trip",
      "Cleaner, navigable water is better for every houseboat and ferry",
      "A visible record that problems are being fixed",
    ],
  },
];

export function Benefits() {
  return (
    <StorySection
      eyebrow="Who benefits"
      tinted
      title={<>A daily utility for citizens, a working tool for civic bodies</>}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {PEOPLE.map((p, i) => (
          <Reveal key={p.who} delay={(i % 2) * 0.08} className="rounded-3xl border border-border bg-card p-7">
            <p className="flex items-center gap-3 text-lg font-semibold tracking-tight">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <p.icon className="size-5" />
              </span>
              {p.who}
            </p>
            <ul className="mt-5 space-y-3">
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-3 text-[15px] leading-relaxed text-foreground/85">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[color:var(--gold)]" />
                  {pt}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </StorySection>
  );
}
