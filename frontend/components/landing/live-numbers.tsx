"use client";

import { useQuery } from "@tanstack/react-query";
import { api, type Stats } from "@/lib/api";
import { NumberTicker } from "./number-ticker";

const ITEMS: { key: keyof Pick<Stats, "total" | "open" | "in_progress" | "active_alerts">; label: string }[] = [
  { key: "total", label: "Reports filed" },
  { key: "open", label: "Open now" },
  { key: "in_progress", label: "Being fixed" },
  { key: "active_alerts", label: "Active alerts" },
];

export function LiveNumbers() {
  const { data, isSuccess } = useQuery({
    queryKey: ["landing-stats"],
    queryFn: api.stats,
    retry: false,
    refetchInterval: (q) => (q.state.status === "success" ? 15_000 : false),
  });

  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Live from the Alappuzha console
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
          {ITEMS.map(({ key, label }) => {
            const value = isSuccess ? data?.[key] : undefined;
            return (
              <div key={key} className="bg-card p-6">
                <dt className="font-mono text-xs text-muted-foreground">{label}</dt>
                <dd className="tabular mt-2 text-4xl font-semibold tracking-[-0.04em]">
                  {typeof value === "number" ? <NumberTicker value={value} /> : <span aria-label="not available">—</span>}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
