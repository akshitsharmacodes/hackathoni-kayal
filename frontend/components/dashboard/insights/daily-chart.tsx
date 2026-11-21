"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { CalendarDays } from "lucide-react";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { Stats } from "@/lib/api";
import { CATEGORIES } from "@/lib/kayal";
import { categoryConfig } from "./chart-config";
import { ChartEmpty, InsightCard } from "./insight-card";

const toDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export function DailyChart({ daily }: { daily: Stats["daily"] }) {
  const data = daily.slice(-7).map((d) => ({ ...d, day: toDate(d.date).toLocaleDateString("en-IN", { weekday: "short" }) }));
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <InsightCard label="Reports · last 7 days" value={total}>
      {total === 0 ? (
        <ChartEmpty icon={CalendarDays}>No reports in the last 7 days. New reports will appear here as they come in.</ChartEmpty>
      ) : (
        <ChartContainer config={categoryConfig} className="aspect-auto h-[260px] w-full">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={40} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const date = payload?.[0]?.payload?.date as string | undefined;
                    return date ? toDate(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) : null;
                  }}
                />
              }
            />
            <ChartLegend itemSorter={null} content={<ChartLegendContent className="flex-wrap gap-x-4 gap-y-1.5 whitespace-nowrap" />} />
            {CATEGORIES.map((c) => (
              <Bar key={c.id} dataKey={c.id} stackId="day" fill={`var(--color-${c.id})`} maxBarSize={36} />
            ))}
          </BarChart>
        </ChartContainer>
      )}
    </InsightCard>
  );
}
