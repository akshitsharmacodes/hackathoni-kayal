"use client";

import { Cell, Pie, PieChart } from "recharts";
import { Inbox } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { Stats } from "@/lib/api";
import { statusConfig } from "./chart-config";
import { ChartEmpty, InsightCard } from "./insight-card";

const STATUSES = Object.keys(statusConfig) as (keyof typeof statusConfig)[];

export function StatusChart({ byStatus }: { byStatus: Stats["by_status"] }) {
  const data = STATUSES.map((s) => ({ status: s, count: byStatus[s] ?? 0 }));
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <InsightCard label="Reports by status" value={total} unit="all time">
      {total === 0 ? (
        <ChartEmpty icon={Inbox}>No reports yet. Once citizens start reporting, their progress shows up here.</ChartEmpty>
      ) : (
        <div className="grid h-full items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ChartContainer config={statusConfig} className="mx-auto aspect-square h-[240px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="status" />} />
              <Pie
                data={data.filter((d) => d.count > 0)}
                dataKey="count"
                nameKey="status"
                innerRadius="62%"
                outerRadius="92%"
                paddingAngle={2}
                cornerRadius={4}
                stroke="var(--card)"
                strokeWidth={2}
              >
                {data.filter((d) => d.count > 0).map((d) => (
                  <Cell key={d.status} fill={`var(--color-${d.status})`} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <ul className="space-y-2.5 text-sm">
            {data.map((d) => (
              <li key={d.status} className="flex items-center gap-2.5">
                <span className="size-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: statusConfig[d.status].color }} />
                <span className="flex-1 text-muted-foreground">{statusConfig[d.status].label}</span>
                <span className="tabular font-medium">{d.count}</span>
                <span className="tabular w-10 text-right text-xs text-muted-foreground">{Math.round((d.count / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </InsightCard>
  );
}
