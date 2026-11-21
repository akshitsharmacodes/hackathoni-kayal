import { Cell, Cite, HairGrid, Reveal, StorySection } from "./primitives";

const PROBLEMS = [
  {
    color: "#16A34A",
    title: "Water hyacinth chokes the canals",
    cause: "Since the Thanneermukkom bund (1976) the southern lake stays fresh most of the year, and the floating weed thrives there.",
    effect: "In September 2026 it tangled propellers and brought boat services around Kumarakom to a standstill.",
    cite: [4, 3],
  },
  {
    color: "#EA580C",
    title: "Plastic, sewage and oil",
    cause: "About 700 registered and 750 unregistered houseboats, farm runoff from Kuttanad and untreated settlement waste reach the same water.",
    effect: "A university study found microplastics in lake sediment at every site it sampled.",
    cite: [4, 5],
  },
  {
    color: "#2563EB",
    title: "Floods in a land below sea level",
    cause: "Kuttanad sits below sea level, so heavy rain and released dam water have nowhere to go.",
    effect: "In August 2018 nearly 1.5 lakh people, about 80% of Kuttanad, fled their homes within two days.",
    cite: [2, 6],
  },
  {
    color: "#7C3AED",
    title: "The reporting gap",
    cause: "A fisher who spots a weed mat or an oil slick makes a call or a WhatsApp forward, often in Malayalam, Hindi or Tamil, with no exact location.",
    effect: "Officials can't see where problems cluster, and the citizen rarely hears back. The same problem is reported again and again.",
    cite: undefined,
  },
];

export function Problem() {
  return (
    <StorySection
      id="problem"
      index="02"
      eyebrow="The problem"
      title={<>What is going wrong, and why.</>}
      intro="These problems return every season, in the same places. The information about them is lost in phone calls."
    >
      <Reveal>
        <HairGrid className="sm:grid-cols-2">
          {PROBLEMS.map((p) => (
            <Cell key={p.title}>
              <h3 className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
                <span className="size-2 rounded-full" style={{ backgroundColor: p.color }} aria-hidden />
                {p.title}
              </h3>
              <dl className="mt-5 grid gap-4 text-[15px] leading-relaxed sm:grid-cols-[72px_1fr] sm:gap-x-4 sm:gap-y-3">
                <dt className="font-mono text-xs text-muted-foreground sm:pt-1">Cause</dt>
                <dd className="text-foreground/85">{p.cause}</dd>
                <dt className="font-mono text-xs text-muted-foreground sm:pt-1">Effect</dt>
                <dd className="text-foreground/85">
                  {p.effect}
                  {p.cite && <Cite n={p.cite} />}
                </dd>
              </dl>
            </Cell>
          ))}
        </HairGrid>
      </Reveal>
    </StorySection>
  );
}
