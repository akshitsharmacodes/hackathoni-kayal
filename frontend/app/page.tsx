import { Credits } from "@/components/landing/credits";
import { Hero } from "@/components/landing/hero";
import { LanguageMarquee } from "@/components/landing/language-marquee";
import { LiveNumbers } from "@/components/landing/live-numbers";
import { Steps } from "@/components/landing/steps";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <Hero />
      <Steps />
      <LiveNumbers />
      <LanguageMarquee />
      <Credits />
    </main>
  );
}
