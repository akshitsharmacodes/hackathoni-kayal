"use client";

import { CloudOff } from "lucide-react";
import { useStats } from "@/hooks/use-dashboard";
import { CategoryChart } from "./category-chart";
import { DailyChart } from "./daily-chart";
import { HotspotsList } from "./hotspots-list";
import { InsightCardSkeleton } from "./insight-card";
import { StatusChart } from "./status-chart";

const grid = "grid gap-4 p-6 xl:grid-cols-2";

export function InsightsGrid() {
  const { data, isError } = useStats();

  if (!data) {
    if (isError) {
      return (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="max-w-sm space-y-3 text-center">
            <CloudOff className="mx-auto size-10 text-muted-foreground" strokeWidth={1.5} />
            <p className="font-medium">Can&apos;t load insights right now</p>
            <p className="text-sm text-muted-foreground">We&apos;ll keep trying every few seconds.</p>
          </div>
        </div>
      );
    }
    return (
      <div className={grid}>
        {Array.from({ length: 4 }).map((_, i) => <InsightCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className={grid}>
      <DailyChart daily={data.daily} />
      <CategoryChart byCategory={data.by_category} />
      <StatusChart byStatus={data.by_status} />
      <HotspotsList hotspots={data.hotspots} />
    </div>
  );
}
