import type { Status } from "@/lib/api";
import { STATUS_LABEL } from "@/lib/kayal";
import { cn } from "@/lib/utils";

// PRD §10A status badges: open (gold outline), in progress (green tint), resolved (green solid),
// rejected (muted), duplicate (grey dashed).
const STYLE: Record<Status, string> = {
  draft: "border-border text-muted-foreground",
  open: "border-gold/60 text-[color:var(--gold)]",
  in_progress: "border-transparent bg-primary/10 text-primary",
  resolved: "border-transparent bg-primary text-primary-foreground",
  rejected: "border-transparent bg-muted text-muted-foreground",
  duplicate: "border-dashed border-muted-foreground/40 text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span className={cn("inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-medium whitespace-nowrap", STYLE[status], className)}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function CategoryDot({ color, className }: { color: string; className?: string }) {
  return <span className={cn("inline-block size-2 shrink-0 rounded-full", className)} style={{ backgroundColor: color }} />;
}
