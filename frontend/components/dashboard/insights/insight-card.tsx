import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function InsightCard({
  label,
  value,
  unit,
  className,
  children,
}: {
  label: string;
  value: number;
  unit?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-card p-5", className)}>
      <div>
        <p className="font-mono text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 flex items-baseline gap-1.5">
          <span className="tabular text-3xl font-semibold tracking-tight">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </p>
      </div>
      <div className="min-h-[240px] flex-1">{children}</div>
    </section>
  );
}

export function InsightCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <div className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-[240px] w-full rounded-xl" />
    </div>
  );
}

export function ChartEmpty({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-center">
      <Icon className="size-6 text-muted-foreground" strokeWidth={1.5} />
      <p className="max-w-56 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
