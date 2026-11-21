"use client";

import { useQuery } from "@tanstack/react-query";
import { api, type Stats } from "@/lib/api";
import { NumberTicker } from "./number-ticker";
import { SectionLabel } from "./steps";

const ITEMS: { key: keyof Pick<Stats, "total" | "open" | "in_progress" | "resolved_today">; label: string }[] = [
  { key: "total", label: "Reports filed" },
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In progress" },
  { key: "resolved_today", label: "Resolved today" },
];

export function LiveNumbers() {
  const { data, isSuccess } = useQuery({
    queryKey: ["landing-stats"],
    queryFn: api.stats,
    retry: false,
    refetchInterval: (q) => (q.state.status === "success" ? 15_000 : false),
  });

  return (
    <section className="border-y border-border bg-card/60">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <SectionLabel>Live from Alappuzha</SectionLabel>
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {ITEMS.map(({ key, label }) => {
            const value = isSuccess ? data?.[key] : undefined;
            return (
              <div key={key} className="text-center">
                <dd className="tabular text-5xl font-semibold text-primary sm:text-6xl">
                  {typeof value === "number" ? (
                    <NumberTicker value={value} className="text-primary" />
                  ) : (
                    <span aria-label="not available">—</span>
                  )}
                </dd>
                <dt className="mt-2 text-sm text-muted-foreground">{label}</dt>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
