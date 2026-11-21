"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Flame } from "lucide-react";
import { ReportSheet } from "@/components/dashboard/report-sheet";
import { CategoryDot, StatusBadge } from "@/components/dashboard/status-badge";
import { StatStrip } from "@/components/dashboard/stat-strip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useGauges, useReports, useStats } from "@/hooks/use-dashboard";
import { CATEGORIES, CATEGORY, timeAgo } from "@/lib/kayal";
import { cn } from "@/lib/utils";

// Leaflet touches `window`, so the map only renders in the browser.
const KayalMap = dynamic(() => import("@/components/dashboard/kayal-map"), {
  ssr: false,
  loading: () => <Skeleton className="size-full rounded-none" />,
});

export function MapView() {
  const { data: reports = [] } = useReports();
  const { data: gauges = [] } = useGauges();
  const { data: stats } = useStats();
  const [selected, setSelected] = useState<number | null>(null);

  // Officials should not miss a new report: announce anything newer than what was on screen.
  const lastSeen = useRef<number | null>(null);
  useEffect(() => {
    if (reports.length === 0) return;
    const maxId = Math.max(...reports.map((r) => r.id));
    if (lastSeen.current !== null && maxId > lastSeen.current) {
      reports
        .filter((r) => r.id > lastSeen.current!)
        .slice(0, 3)
        .forEach((r) =>
          toast(`New report #${r.id} · ${CATEGORY[r.category].en}`, {
            description: `${r.place_name} · severity ${r.severity}/5`,
            action: { label: "Open", onClick: () => setSelected(r.id) },
          }),
        );
    }
    lastSeen.current = maxId;
  }, [reports]);

  const latest = reports.slice(0, 40);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-6">
      <StatStrip />
      <div className="grid min-h-[560px] flex-1 grid-cols-1 overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-[1fr_340px]">
        <div className="relative min-h-[420px]">
          <KayalMap reports={reports} gauges={gauges} selectedId={selected} onSelect={setSelected} />
          <div className="pointer-events-none absolute bottom-3 left-3 z-[2] flex flex-wrap gap-x-3 gap-y-1 rounded-lg border border-border bg-card/90 px-3 py-2 text-xs text-muted-foreground backdrop-blur">
            {CATEGORIES.map((c) => (
              <span key={c.id} className="flex items-center gap-1.5"><CategoryDot color={c.color} />{c.en}</span>
            ))}
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full border border-dashed border-muted-foreground" />River gauge (demo)</span>
          </div>
        </div>

        <aside className="flex min-h-0 flex-col border-t border-border lg:border-t-0 lg:border-l">
          {stats && stats.hotspots.length > 0 && (
            <div className="border-b border-border p-4">
              <p className="mb-2 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <Flame className="size-3.5" /> Hotspots
              </p>
              <ul className="space-y-1.5">
                {stats.hotspots.slice(0, 4).map((h) => (
                  <li key={h.place + h.category} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2"><CategoryDot color={CATEGORY[h.category].color} />{h.place} · {CATEGORY[h.category].en}</span>
                    <span className="tabular font-medium">{h.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="px-4 pt-4 pb-2 font-mono text-xs text-muted-foreground">Latest reports</p>
          <ScrollArea className="min-h-0 flex-1 lg:h-0">
            <ul className="px-2 pb-2">
              {latest.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => setSelected(r.id)}
                    className={cn(
                      "flex w-full flex-col gap-1 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-muted",
                      selected === r.id && "bg-muted",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <CategoryDot color={CATEGORY[r.category].color} />#{r.id} {r.place_name}
                      </span>
                      <StatusBadge status={r.status} />
                    </span>
                    <span className="line-clamp-1 pl-4 text-xs text-muted-foreground">{timeAgo(r.created_at)} · {r.summary_en}</span>
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </aside>
      </div>
      <ReportSheet id={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
