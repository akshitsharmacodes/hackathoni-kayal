import { Marquee } from "./marquee";
import { SectionLabel } from "./steps";

const LANGUAGES = [
  { label: "മലയാളം", lang: "ml" },
  { label: "हिन्दी", lang: "hi" },
  { label: "தமிழ்", lang: "ta" },
  { label: "English", lang: "en" },
];

export function LanguageMarquee() {
  return (
    <section className="py-20 sm:py-24">
      <SectionLabel>Speak in your language</SectionLabel>
      <div className="relative mt-10">
        <Marquee pauseOnHover className="[--duration:30s] [--gap:2.5rem]">
          {LANGUAGES.map(({ label, lang }) => (
            <span key={lang} lang={lang} className="flex items-center gap-10 text-4xl font-medium text-primary sm:text-6xl">
              {label}
              <span aria-hidden className="text-gold">·</span>
            </span>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background sm:w-40" />
      </div>
    </section>
  );
}
