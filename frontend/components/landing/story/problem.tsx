import { Droplet, Leaf, MessageSquareOff, Waves } from "lucide-react";
import { Cite, Reveal, StorySection } from "./primitives";

const PROBLEMS = [
  {
    icon: Leaf,
    color: "#3F7D3A",
    title: "Water hyacinth chokes the canals",
    cause:
      "Since the Thanneermukkom bund (1976) the southern lake stays fresh for most of the year, and the floating weed thrives there.",
    effect: "In September 2026 it tangled propellers and brought boat services around Kumarakom to a standstill.",
    cite: [4, 3],
  },
  {
    icon: Droplet,
    color: "#C2410C",
    title: "Plastic, sewage and oil",
    cause:
      "Around 700 registered and 750 unregistered houseboats, farm runoff from Kuttanad and untreated settlement waste all reach the same water.",
    effect: "A university study found microplastics in lake sediment at every site it sampled.",
    cite: [4, 5],
  },
  {
    icon: Waves,
    color: "#2F5D8A",
    title: "Floods in a land below sea level",
    cause: "Kuttanad sits below sea level, so heavy rain and released dam water have nowhere to go.",
    effect: "In August 2018 nearly 1.5 lakh people, about 80% of Kuttanad, fled their homes within two days.",
    cite: [2, 6],
  },
  {
    icon: MessageSquareOff,
    color: "#7A5C8E",
    title: "The reporting gap",
    cause:
      "A fisher who spots a weed mat or an oil slick makes a phone call or a WhatsApp forward, often in Malayalam, Hindi or Tamil, with no exact location.",
    effect: "Officials can't see where problems cluster, and the citizen rarely hears back. The same problem gets reported again and again.",
    cite: undefined,
  },
];

export function Problem() {
  return (
    <StorySection
      eyebrow="The problem"
      tinted
      title={<>What is going wrong, and why</>}
      intro="These are not one-off events. They come back every season, in the same places, and the information about them is lost in phone calls."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {PROBLEMS.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 0.08} className="flex flex-col rounded-3xl border border-border bg-card p-7">
            <span className="flex size-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${p.color}1A`, color: p.color }}>
              <p.icon className="size-5" />
            </span>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">{p.title}</h3>
            <dl className="mt-4 space-y-3 text-[15px] leading-relaxed">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Cause</dt>
                <dd className="mt-1 text-foreground/85">{p.cause}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Effect</dt>
                <dd className="mt-1 text-foreground/85">
                  {p.effect}
                  {p.cite && <Cite n={p.cite} />}
                </dd>
              </div>
            </dl>
          </Reveal>
        ))}
      </div>
    </StorySection>
  );
}
