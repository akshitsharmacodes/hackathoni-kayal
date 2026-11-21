import type { ChartConfig } from "@/components/ui/chart";
import { CATEGORIES } from "@/lib/kayal";

// Category colours from CATEGORIES; lifted toward the foreground in dark mode so dark hues (oil) stay visible.
export const darkCategoryColor = (color: string) => `color-mix(in oklab, ${color} 70%, var(--foreground))`;

export const categoryConfig = Object.fromEntries(
  CATEGORIES.map((c) => [
    c.id,
    { label: c.en, theme: { light: c.color, dark: darkCategoryColor(c.color) } },
  ]),
) satisfies ChartConfig;

export const statusConfig = {
  open: { label: "Open", color: "var(--gold)" },
  in_progress: { label: "In progress", color: "color-mix(in oklab, var(--primary) 55%, var(--card))" },
  resolved: { label: "Resolved", color: "var(--primary)" },
  rejected: { label: "Rejected", color: "var(--muted-foreground)" },
  duplicate: { label: "Duplicate", color: "color-mix(in oklab, var(--muted-foreground) 40%, var(--card))" },
} satisfies ChartConfig;
