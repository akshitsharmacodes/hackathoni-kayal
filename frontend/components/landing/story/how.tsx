import { Camera, Check, Leaf, LocateFixed, MapPin, Mic, Volume2 } from "lucide-react";
import { Reveal, StorySection } from "./primitives";

/* Small, crafted mock-ups of the real screens (no screenshots needed, always crisp). */

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex h-56 w-36 flex-col items-center justify-center gap-3 rounded-[1.6rem] border-[5px] border-foreground/85 bg-background p-3 shadow-[0_20px_40px_-24px_rgba(31,27,20,0.5)]">
      {children}
    </div>
  );
}

function MockSpeak() {
  return (
    <Phone>
      <div className="relative">
        <span className="flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Mic className="size-8" />
        </span>
        <span className="absolute -right-2 bottom-0 flex size-8 items-center justify-center rounded-full border-2 border-background bg-card shadow">
          <Camera className="size-3.5" />
        </span>
      </div>
      <p lang="ml" className="text-center text-[10px] leading-tight">തൊട്ട് പ്രശ്നം പറയൂ</p>
    </Phone>
  );
}

function MockPin() {
  return (
    <Phone>
      <div className="relative h-24 w-full overflow-hidden rounded-xl bg-[#e9e4d6]">
        <div className="absolute inset-x-0 top-10 h-5 -rotate-6 bg-[#c9d6d3]" />
        <span className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 bg-primary/10" />
        <MapPin className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-full fill-primary text-background" />
      </div>
      <p className="flex items-center gap-1 text-[10px] text-primary">
        <LocateFixed className="size-3" /> GPS ±12 m
      </p>
    </Phone>
  );
}

function MockSort() {
  return (
    <Phone>
      <p lang="ml" className="text-center text-[10px] leading-snug">കനാലിൽ പോള നിറഞ്ഞ് വള്ളം പോകുന്നില്ല</p>
      <span className="flex items-center gap-1 rounded-full bg-[#3F7D3A] px-2.5 py-1 text-[10px] text-white">
        <Leaf className="size-3" /> Water hyacinth
      </span>
      <span className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`h-2.5 w-1.5 rounded-sm ${i < 4 ? "bg-foreground/70" : "bg-border"}`} />
        ))}
      </span>
      <span className="rounded-lg bg-primary px-3 py-1 text-[10px] text-primary-foreground">Send</span>
    </Phone>
  );
}

function MockMap() {
  const pins = [
    [22, 30, "#3F7D3A"], [30, 38, "#3F7D3A"], [26, 34, "#3F7D3A"], [62, 58, "#2F5D8A"], [70, 64, "#2F5D8A"],
    [45, 22, "#C2410C"], [80, 30, "#3B3A36"], [55, 78, "#8A5A2B"],
  ] as const;
  return (
    <div className="mx-auto h-56 w-full max-w-[15rem] overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-[0_20px_40px_-24px_rgba(31,27,20,0.4)]">
      <div className="flex gap-1.5 pb-2">
        {["9 open", "5 in progress", "Hotspot: Kainakary"].map((s) => (
          <span key={s} className="rounded-md border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground">{s}</span>
        ))}
      </div>
      <div className="relative h-[calc(100%-1.75rem)] rounded-xl bg-[#e9e4d6]">
        <div className="absolute left-[38%] top-0 h-full w-6 rotate-12 bg-[#c9d6d3]" />
        {pins.map(([x, y, c], i) => (
          <span key={i} className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70" style={{ left: `${x}%`, top: `${y}%`, backgroundColor: c, opacity: 0.85 }} />
        ))}
        <span className="absolute left-[26%] top-[34%] size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#3F7D3A]" />
      </div>
    </div>
  );
}

function MockStatus() {
  return (
    <Phone>
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Check className="size-6" />
      </span>
      <div className="w-full space-y-1.5 text-[10px]">
        {["Received", "In progress", "Resolved"].map((s, i) => (
          <p key={s} className="flex items-center gap-1.5">
            <span className={`size-1.5 rounded-full ${i < 2 ? "bg-primary" : "bg-[color:var(--gold)]"}`} /> {s}
          </p>
        ))}
      </div>
      <p className="flex items-center gap-1 text-[10px] text-primary">
        <Volume2 className="size-3" /> Spoken reply
      </p>
    </Phone>
  );
}

const STEPS = [
  { n: "01", title: "Speak, in your language", text: "Tap one big button and describe the problem in Malayalam, Hindi, Tamil or English. Add a photo if you like.", mock: <MockSpeak /> },
  { n: "02", title: "Confirm the exact spot", text: "Kayal waits for a GPS fix within 30 m, or lets you drag the pin. It never saves a guessed location.", mock: <MockPin /> },
  { n: "03", title: "AI sorts it", text: "Sarvam AI turns the voice into text and sorts the photo and words into a problem type and severity, which you can correct.", mock: <MockSort /> },
  { n: "04", title: "The panchayat sees it", text: "A live map shows every report with hotspots, likely duplicates, the photo and the citizen's own voice.", mock: <MockMap /> },
  { n: "05", title: "You hear back", text: "Citizens check their complaint's status with their phone number, and anyone can ask by voice: is the water rising near me?", mock: <MockStatus /> },
];

export function How() {
  return (
    <StorySection
      id="how"
      eyebrow="How Kayal works"
      title={<>From a voice on the water to a pin on the panchayat map</>}
      intro="Built for people who would rather speak than type. One action per screen, every step spoken back."
    >
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08} lift className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5">
            {s.mock}
            <div>
              <p className="tabular text-xs font-medium text-gold-ink">{s.n}</p>
              <h3 className="mt-1 text-lg font-semibold leading-snug tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </StorySection>
  );
}
