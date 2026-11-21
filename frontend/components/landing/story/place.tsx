import { Cell, Cite, HairGrid, Reveal, StorySection } from "./primitives";

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
    text: "Paddy grown on land reclaimed from the lake. Named a Globally Important Agricultural Heritage System by FAO in 2013.",
    cite: 2,
  },
  {
    value: "Every day",
    label: "People on the water",
    text: "Fishers, farmers, boat crews and houseboat workers live on the same waterways and feel every change first.",
    cite: undefined,
  },
];

export function Place() {
  return (
    <StorySection
      id="place"
      index="01"
      eyebrow="The place"
      title={<>A lake that feeds a district.</>}
      intro="Alappuzha lives on its backwaters. When the water is choked, dirty or rising, the people on it every day know first."
    >
      <Reveal>
        <HairGrid className="sm:grid-cols-3">
          {FACTS.map((f) => (
            <Cell key={f.label}>
              <p className="font-mono text-xs text-muted-foreground">{f.label}</p>
              <p className="tabular mt-3 text-3xl font-semibold tracking-[-0.03em]">{f.value}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {f.text}
                {f.cite && <Cite n={f.cite} />}
              </p>
            </Cell>
          ))}
        </HairGrid>
      </Reveal>
    </StorySection>
  );
}
