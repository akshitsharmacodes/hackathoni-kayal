import { Credits } from "@/components/landing/credits";
import { Hero } from "@/components/landing/hero";
import { SiteNav } from "@/components/landing/site-nav";
import { LanguageMarquee } from "@/components/landing/language-marquee";
import { LiveNumbers } from "@/components/landing/live-numbers";
import { Benefits } from "@/components/landing/story/benefits";
import { Existing } from "@/components/landing/story/existing";
import { How } from "@/components/landing/story/how";
import { Place } from "@/components/landing/story/place";
import { Problem } from "@/components/landing/story/problem";
import { SourcesList } from "@/components/landing/story/sources-list";

// Story landing (approved plan, 22 Nov): place → problem & causes → existing solutions → how → benefits → live → sources.
export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <SiteNav />
      <Hero />
      <Place />
      <Problem />
      <Existing />
      <How />
      <Benefits />
      <LiveNumbers />
      <LanguageMarquee />
      <Credits />
      <SourcesList />
    </main>
  );
}
