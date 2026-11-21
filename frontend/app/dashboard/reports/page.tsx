"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { ReportSheet } from "@/components/dashboard/report-sheet";
import { CategoryDot, StatusBadge } from "@/components/dashboard/status-badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useReports } from "@/hooks/use-dashboard";
import type { Category, Status } from "@/lib/api";
import { CATEGORIES, CATEGORY, STATUS_LABEL, timeAgo } from "@/lib/kayal";
import { cn } from "@/lib/utils";

const STATUSES: Status[] = ["open", "in_progress", "resolved", "rejected", "duplicate"];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export default function ReportsPage() {
  const { data, isLoading } = useReports();
  const [status, setStatus] = useState<Status | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter(
      (r) =>
        (!status || r.status === status) &&
        (!category || r.category === category) &&
        (!term || `${r.id} ${r.place_name} ${r.summary_en} ${r.summary_local} ${r.transcript}`.toLowerCase().includes(term)),
    );
  }, [data, status, category, q]);

  return (
    <>
      <PageHeader title="Reports" description={`${rows.length} of ${data?.length ?? 0} reports`}>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search place, words, #id" className="h-9 w-64 pl-8" />
        </div>
      </PageHeader>

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          <Chip active={!status} onClick={() => setStatus(null)}>All statuses</Chip>
          {STATUSES.map((s) => (
            <Chip key={s} active={status === s} onClick={() => setStatus(status === s ? null : s)}>{STATUS_LABEL[s]}</Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={!category} onClick={() => setCategory(null)}>All issues</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={category === c.id} onClick={() => setCategory(category === c.id ? null : c.id)}>
              <CategoryDot color={c.color} /> {c.en}
            </Chip>
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-16 pl-4">#</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Place</TableHead>
                <TableHead className="w-[40%]">Summary</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead className="pr-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-6" /></TableCell></TableRow>
                ))}
              {rows.map((r) => (
                <TableRow key={r.id} onClick={() => setSelected(r.id)} className="cursor-pointer">
                  <TableCell className="tabular pl-4 text-muted-foreground">{r.id}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2"><CategoryDot color={CATEGORY[r.category].color} />{CATEGORY[r.category].en}</span>
                  </TableCell>
                  <TableCell>{r.place_name}</TableCell>
                  <TableCell className="max-w-0 truncate text-muted-foreground">{r.summary_en}</TableCell>
                  <TableCell>
                    <span className="flex gap-0.5" aria-label={`${r.severity} of 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={cn("h-3 w-1.5 rounded-sm", i < r.severity ? "bg-foreground/70" : "bg-border")} />
                      ))}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{timeAgo(r.created_at)}</TableCell>
                  <TableCell className="pr-4"><StatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
              {!isLoading && rows.length === 0 && (
                <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No reports match these filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ReportSheet id={selected} onClose={() => setSelected(null)} />
    </>
  );
}
