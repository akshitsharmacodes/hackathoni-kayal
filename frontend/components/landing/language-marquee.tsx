import { Marquee } from "./marquee";

const LANGUAGES = [
  { label: "മലയാളം", lang: "ml" },
  { label: "हिन्दी", lang: "hi" },
  { label: "தமிழ்", lang: "ta" },
  { label: "English", lang: "en" },
];

export function LanguageMarquee() {
  return (
    <section className="border-t border-border py-14">
      <p className="text-center font-mono text-xs text-muted-foreground">Speak in your language</p>
      <div className="relative mt-8">
        <Marquee pauseOnHover className="[--duration:36s] [--gap:3rem]">
          {LANGUAGES.map(({ label, lang }) => (
            <span key={lang} lang={lang} className="flex items-center gap-12 text-3xl font-medium tracking-tight text-foreground/80 sm:text-5xl">
              {label}
              <span aria-hidden className="size-1.5 rounded-full bg-border" />
            </span>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background sm:w-40" />
      </div>
    </section>
  );
}
