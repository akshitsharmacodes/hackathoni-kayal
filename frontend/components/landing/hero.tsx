import { WaveBackground } from "./wave-background";
import { CtaButtons } from "./cta-buttons";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[88dvh] flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-48 text-center sm:pb-60">
      <WaveBackground />
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold sm:text-sm">Alappuzha · Kuttanad · Kerala</p>
      <h1 className="mt-6 font-heading text-6xl font-semibold tracking-tight text-primary sm:text-8xl">
        <span lang="ml">കായൽ</span> <span>Kayal</span>
      </h1>
      <p className="mt-5 max-w-xl text-xl text-foreground/80 sm:text-2xl">Speak up for the backwaters.</p>
      <p className="mt-3 max-w-md text-base text-muted-foreground sm:text-lg">
        Report plastic, water hyacinth, oil and flooding with your voice and a photo. The panchayat sees it on a live map.
      </p>
      <CtaButtons className="mt-10" />
    </section>
  );
}
