import Link from "next/link";
import { ArrowRight, LayoutDashboard, Mic } from "lucide-react";

// Minimal entry page. The animated pitch landing (Magic UI / Aceternity) is P2, Devin ticket C.
export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-background px-6 text-center">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--gold)]">Alappuzha · Kerala</p>
        <h1 className="text-5xl font-semibold tracking-tight text-primary sm:text-6xl">കായൽ Kayal</h1>
        <p className="mx-auto max-w-md text-lg text-muted-foreground">
          Speak up for the backwaters, in Malayalam, Hindi, Tamil or English.
        </p>
      </div>
      <div className="grid w-full max-w-md gap-3 sm:grid-cols-2">
        <Link href="/report" className="group flex items-center justify-between rounded-2xl bg-primary px-5 py-4 text-primary-foreground">
          <span className="flex items-center gap-2"><Mic className="size-5" /> Citizen app</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link href="/dashboard" className="group flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4">
          <span className="flex items-center gap-2"><LayoutDashboard className="size-5" /> Panchayat</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </main>
  );
}
