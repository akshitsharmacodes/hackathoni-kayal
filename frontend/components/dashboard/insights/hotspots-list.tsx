import { MapPin } from "lucide-react";
import type { Stats } from "@/lib/api";
import { CATEGORY } from "@/lib/kayal";
import { darkCategoryColor } from "./chart-config";
import { ChartEmpty, InsightCard } from "./insight-card";

const LIMIT = 6;

export function HotspotsList({ hotspots }: { hotspots: Stats["hotspots"] }) {
  const top = hotspots.slice(0, LIMIT);
  const max = Math.max(1, ...top.map((h) => h.count));
  const places = new Set(hotspots.map((h) => h.place)).size;

  return (
    <InsightCard label="Top hotspots" value={places} unit={places === 1 ? "place" : "places"}>
      {top.length === 0 ? (
        <ChartEmpty icon={MapPin}>No hotspots yet. A place shows up here once it has two or more active reports of the same kind.</ChartEmpty>
      ) : (
        <ol className="divide-y divide-border">
          {top.map((h, i) => {
            const cat = CATEGORY[h.category];
            return (
              <li
                key={`${h.place}-${h.category}`}
                className="flex items-center gap-3 py-2.5 first:pt-0"
                style={{ "--hotspot": cat.color, "--hotspot-dark": darkCategoryColor(cat.color) } as React.CSSProperties}
              >
                <span className="tabular w-4 text-xs text-muted-foreground">{i + 1}</span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium">{h.place}</span>
                    <span className="tabular shrink-0 font-semibold">{h.count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 shrink-0 rounded-full bg-(--hotspot) dark:bg-(--hotspot-dark)" />
                    <span className="w-28 shrink-0 truncate text-xs text-muted-foreground">{cat.en}</span>
                    <div className="h-1 flex-1 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-(--hotspot) dark:bg-(--hotspot-dark)" style={{ width: `${(h.count / max) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </InsightCard>
  );
}
