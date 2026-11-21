"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/hooks/use-dashboard";
import { CATEGORY } from "@/lib/kayal";
import { cn } from "@/lib/utils";

// PRD §10A: 4–6 quiet stat cards with tabular figures.
export function StatStrip() {
  const { data } = useStats();
  if (!data) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[76px] rounded-xl" />)}
      </div>
    );
  }
  const top = Object.entries(data.by_category).sort((a, b) => b[1] - a[1])[0];
  const topCat = top ? CATEGORY[top[0] as keyof typeof CATEGORY] : null;

  const items = [
    { label: "Open", value: data.open },
    { label: "In progress", value: data.in_progress },
    { label: "Resolved today", value: data.resolved_today },
    { label: "Top issue", value: topCat ? topCat.en : "—", sub: top ? `${top[1]} active` : undefined, color: topCat?.color },
    { label: "Active alerts", value: data.active_alerts },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {items.map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
          <p className="tabular mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight">
            {s.color && <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />}
            <span className={cn(typeof s.value === "string" && "text-base leading-8")}>{s.value}</span>
            {s.sub && <span className="hidden text-xs font-normal text-muted-foreground 2xl:inline">{s.sub}</span>}
          </p>
        </div>
      ))}
    </div>
  );
}
