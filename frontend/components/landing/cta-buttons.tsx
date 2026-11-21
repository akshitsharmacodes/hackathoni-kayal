import Link from "next/link";
import { ArrowRight, LayoutDashboard, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export function CtaButtons({ className }: { className?: string }) {
  return (
    <div className={cn("grid w-full max-w-md gap-3 sm:max-w-xl sm:grid-cols-2", className)}>
      <Link
        href="/report"
        className="group flex items-center justify-between gap-3 rounded-2xl bg-primary px-5 py-4 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <span className="flex items-center gap-2 whitespace-nowrap">
          <Mic className="size-5" /> Citizen app
        </span>
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
      <Link
        href="/dashboard"
        className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-lg font-medium transition-colors hover:border-gold/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <span className="flex items-center gap-2 whitespace-nowrap">
          <LayoutDashboard className="size-5 text-primary" /> Panchayat console
        </span>
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
