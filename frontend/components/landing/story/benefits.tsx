import { Anchor, Fish, Landmark, Languages } from "lucide-react";
import { Cell, HairGrid, Reveal, StorySection } from "./primitives";

const PEOPLE = [
  {
    icon: Fish,
    who: "Residents, fishers, farmers",
    points: [
      "Report in under a minute by voice; no forms",
      "See it move: received, in progress, resolved",
      "Ask by voice whether water is rising nearby",
    ],
  },
  {
    icon: Languages,
    who: "Migrant workers",
    points: [
      "Use Kayal in Hindi or Tamil; officials read it in English and Malayalam",
      "No need to find someone to translate a call",
      "Hear official alerts spoken in your language",
    ],
  },
  {
    icon: Landmark,
    who: "Panchayat officials",
    points: [
      "Every report on one map: exact pin, photo, the citizen's own voice",
      "Hotspots and likely duplicates show where to send the team first",
      "Post an alert once; Kayal reads it to everyone who asks",
    ],
  },
  {
    icon: Anchor,
    who: "Boat crews and tourism",
    points: [
      "Flag blocked channels and broken jetties before they stop a trip",
      "Cleaner, navigable water for every houseboat and ferry",
      "A visible record that problems get fixed",
    ],
  },
];

export function Benefits() {
  return (
    <StorySection
      id="benefits"
      index="05"
      eyebrow="Who benefits"
      title={<>A daily utility for citizens. A working tool for civic bodies.</>}
    >
      <Reveal>
        <HairGrid className="sm:grid-cols-2">
          {PEOPLE.map((p) => (
            <Cell key={p.who}>
              <p className="flex items-center gap-2.5 font-semibold tracking-tight">
                <p.icon className="size-4 text-primary" />
                {p.who}
              </p>
              <ul className="mt-4 space-y-2.5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground">
                    <span className="mt-[0.6rem] h-px w-3 shrink-0 bg-foreground/30" aria-hidden />
                    {pt}
                  </li>
                ))}
              </ul>
            </Cell>
          ))}
        </HairGrid>
      </Reveal>
    </StorySection>
  );
}
