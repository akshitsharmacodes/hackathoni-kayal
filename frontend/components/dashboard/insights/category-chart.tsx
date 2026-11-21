"use client";

import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts";
import { CheckCircle2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { Stats } from "@/lib/api";
import { CATEGORIES } from "@/lib/kayal";
import { categoryConfig } from "./chart-config";
import { ChartEmpty, InsightCard } from "./insight-card";

export function CategoryChart({ byCategory }: { byCategory: Stats["by_category"] }) {
  const data = CATEGORIES.map((c) => ({ category: c.id, label: c.en, count: byCategory[c.id] ?? 0 }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <InsightCard label="Active reports by category" value={total} unit="open or in progress">
      {total === 0 ? (
        <ChartEmpty icon={CheckCircle2}>Nothing active right now. Every report has been handled.</ChartEmpty>
      ) : (
        <ChartContainer config={categoryConfig} className="aspect-auto h-[260px] w-full">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 36, left: 0, bottom: 0 }}>
            <XAxis type="number" dataKey="count" hide allowDecimals={false} />
            <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={116} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="category" />} />
            <Bar dataKey="count" radius={4} maxBarSize={28}>
              {data.map((d) => (
                <Cell key={d.category} fill={`var(--color-${d.category})`} />
              ))}
              <LabelList dataKey="count" position="right" offset={8} className="tabular fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </InsightCard>
  );
}
