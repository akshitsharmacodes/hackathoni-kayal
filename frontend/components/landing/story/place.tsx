import { Cite, Reveal, StorySection } from "./primitives";

const FACTS = [
  {
    value: "1,51,250 ha",
    label: "Vembanad-Kol Wetland",
    text: "A Ramsar wetland of international importance since 2002, the largest brackish wetland on India's south-west coast.",
    cite: 1,
  },
  {
    value: "Below sea level",
    label: "Kuttanad farming",
    text: "Paddy is grown on land reclaimed from the lake, below sea level. FAO named it a Globally Important Agricultural Heritage System in 2013.",
    cite: 2,
  },
  {
    value: "On the water",
    label: "Every single day",
    text: "Fishers, farmers, boat crews and houseboat workers all live on the same waterways, and feel every change in them first.",
    cite: undefined,
  },
];

export function Place() {
  return (
    <StorySection
      id="place"
      eyebrow="The place"
      title={<>A lake that feeds a district, and the people who notice first</>}
      intro="Alappuzha lives on its backwaters. When the water is choked, dirty or rising, the first people to know are the ones on it every day."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {FACTS.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.08} lift className="relative overflow-hidden rounded-3xl border border-border bg-card p-7">
            <span aria-hidden className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[color:var(--gold)]/10 blur-2xl" />
            <p className="tabular text-3xl font-semibold tracking-tight text-primary sm:text-4xl">{f.value}</p>
            <p className="mt-1 text-sm font-medium uppercase tracking-wider text-muted-foreground">{f.label}</p>
            <p className="mt-4 leading-relaxed text-foreground/80">
              {f.text}
              {f.cite && <Cite n={f.cite} />}
            </p>
          </Reveal>
        ))}
      </div>
    </StorySection>
  );
}
