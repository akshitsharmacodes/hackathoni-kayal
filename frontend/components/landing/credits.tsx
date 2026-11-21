import { Logo } from "@/components/brand/logo";
import { CtaButtons } from "./cta-buttons";

const CREDITS = ["Sarvam AI", "smallest.ai", "Devin", "TinkerHub"];

export function Credits() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Try the demo</h2>
          <p className="mt-3 text-muted-foreground">Report as a citizen on your phone, then watch it land in the console.</p>
        </div>
        <CtaButtons />
        <div className="w-full border-t border-border pt-10 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Built with</p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-lg font-medium text-foreground/80">
            {CREDITS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <Logo tagline markClassName="size-10" />
          </div>
        </div>
      </div>
    </footer>
  );
}
