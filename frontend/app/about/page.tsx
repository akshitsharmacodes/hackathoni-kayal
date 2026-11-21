import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Globe, Mail } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";

const GitHubMark = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.1 11.1 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

const LinkedInMark = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
);

const LINKS = [
  { label: "Portfolio", value: "akshitsharma.dev", url: "https://akshitsharma.dev", icon: Globe },
  { label: "GitHub", value: "akshitsharmacodes", url: "https://github.com/akshitsharmacodes", icon: GitHubMark },
  { label: "LinkedIn", value: "in/akshitsharmacodes", url: "https://www.linkedin.com/in/akshitsharmacodes", icon: LinkedInMark },
  { label: "Email", value: "akshitsharmacodes@gmail.com", url: "mailto:akshitsharmacodes@gmail.com", icon: Mail },
] as const;

const STACK = [
  ["Web", "Next.js 16 · React 19 · Tailwind · shadcn/ui"],
  ["API", "FastAPI · SQLAlchemy · Alembic · Supabase Postgres"],
  ["Voice + AI", "Sarvam AI (STT, classification) · smallest.ai (TTS)"],
  ["Map", "Leaflet · OpenStreetMap"],
] as const;

export default function AboutPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" aria-label="Kayal home">
            <Logo markClassName="size-8" />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:py-24">
        <p className="font-mono text-xs text-muted-foreground">
          <span className="text-foreground">01</span>
          <span className="mx-2 text-border">/</span>
          About the developer
        </p>

        <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl">Akshit Sharma</h1>
        <p className="mt-3 text-lg text-muted-foreground">Solo builder — designed and built Kayal at HackaThoni 2026.</p>

        <div className="mt-10 space-y-5 text-[17px] leading-relaxed text-foreground/90">
          <p>
            Kayal started from a simple gap: the people who see the Alappuzha backwaters choking first — fishers and
            commuters on the water — are the least likely to file a typed complaint on an English web portal. The
            reporting channel didn&apos;t match the reporter.
          </p>
          <p>
            So Kayal flips it. You speak, in Malayalam, Hindi, Tamil or English. You drop an exact pin. AI sorts the
            report and the panchayat sees it on a live map within seconds. Every step is spoken back, so nobody has to
            read or write to use it.
          </p>
          <p>
            Everything here — the citizen app, the panchayat console, this page — was built end-to-end during the
            hackathon: voice pipeline, data model, map, insights and the design system.
          </p>
        </div>

        <section className="mt-12">
          <h2 className="font-mono text-xs text-muted-foreground">Under the hood</h2>
          <dl className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {STACK.map(([k, v]) => (
              <div key={k} className="bg-card p-5">
                <dt className="font-mono text-xs text-muted-foreground">{k}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12">
          <h2 className="font-mono text-xs text-muted-foreground">Elsewhere</h2>
          <ul className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {LINKS.map(({ label, value, url, icon: Icon }) => (
              <li key={label}>
                <a href={url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 bg-card p-5 transition-colors hover:bg-muted/50">
                  <span className="flex items-center gap-3">
                    <Icon className="size-4 text-muted-foreground" />
                    <span>
                      <span className="block font-mono text-xs text-muted-foreground">{label}</span>
                      <span className="mt-0.5 block text-sm font-medium">{value}</span>
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <Link href="/" className="mt-12 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to Kayal
        </Link>
      </div>

      <footer className="border-t border-border">
        <p className="mx-auto w-full max-w-3xl px-6 py-6 font-mono text-[11px] text-muted-foreground/70">
          Built with heart in India.
        </p>
      </footer>
    </main>
  );
}
