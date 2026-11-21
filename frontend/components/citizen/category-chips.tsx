"use client";

import type { Category } from "@/lib/api";
import { CATEGORIES } from "@/lib/kayal";
import { cn } from "@/lib/utils";

/** D51: Lucide icon + label chips; AI choice pre-selected, tap to correct (D30). */
export function CategoryChips({
  value,
  onChange,
  labels,
}: {
  value: Category;
  onChange: (c: Category) => void;
  labels: Record<Category, string>;
}) {
  return (
    <div role="radiogroup" className="grid grid-cols-3 gap-2">
      {CATEGORIES.map(({ id, icon: Icon, color }) => {
        const active = id === value;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(id)}
            className={cn(
              "flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 py-3 text-center text-[13px] leading-tight transition-colors",
              active ? "border-transparent text-white" : "border-border bg-card text-foreground",
            )}
            style={active ? { backgroundColor: color } : undefined}
          >
            <Icon className="size-6" style={active ? undefined : { color }} strokeWidth={1.75} />
            {labels[id]}
          </button>
        );
      })}
    </div>
  );
}
