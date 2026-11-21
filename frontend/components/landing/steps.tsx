import { Camera, CircleCheck, Mic, type LucideIcon } from "lucide-react";

const STEPS: { icon: LucideIcon; title: string; ml: string; body: string }[] = [
  { icon: Mic, title: "Speak", ml: "പറയൂ", body: "Tap the mic and describe the problem in your own language." },
  { icon: Camera, title: "Snap", ml: "ഫോട്ടോ എടുക്കൂ", body: "Add a photo. Kayal reads the place, category and severity." },
  { icon: CircleCheck, title: "Solved", ml: "പരിഹാരം", body: "The panchayat acts on a live map, and you hear back when it is fixed." },
];

export function Steps() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
      <SectionLabel>How it works</SectionLabel>
      <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
        Speak <span className="text-gold">·</span> Snap <span className="text-gold">·</span> Solved
      </h2>
      <ol className="mt-12 grid gap-4 sm:grid-cols-3 sm:gap-6">
        {STEPS.map(({ icon: Icon, title, ml, body }, i) => (
          <li key={title} className="relative rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="size-6" />
              </span>
              <span className="tabular text-sm text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
            <p lang="ml" className="text-sm text-gold">
              {ml}
            </p>
            <p className="mt-3 text-base text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">{children}</p>;
}
