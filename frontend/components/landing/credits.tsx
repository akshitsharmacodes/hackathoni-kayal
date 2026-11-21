import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CtaButtons } from "./cta-buttons";

export function Credits() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.6rem]">Try it on your phone now.</h2>
          <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-muted-foreground">
            Report as a citizen, then watch it appear in the panchayat console a few seconds later.
          </p>
        </div>
        <CtaButtons className="lg:justify-end" />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-8">
          <Logo tagline markClassName="size-9" />
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/report" className="hover:text-foreground">Citizen app</Link>
            <Link href="/dashboard" className="hover:text-foreground">Panchayat console</Link>
            <a href="#sources" className="hover:text-foreground">Sources</a>
          </nav>
          <p className="w-full font-mono text-xs text-muted-foreground sm:w-auto">Sarvam AI · smallest.ai · Devin · TinkerHub</p>
        </div>
      </div>
    </footer>
  );
}
