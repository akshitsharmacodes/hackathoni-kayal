import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CtaButtons({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      <Link
        href="/report"
        className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
      >
        Report a problem
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
      <Link
        href="/dashboard"
        className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-5 text-[15px] font-medium transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
      >
        Open panchayat console
      </Link>
    </div>
  );
}
