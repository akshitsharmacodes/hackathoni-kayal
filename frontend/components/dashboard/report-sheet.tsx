"use client";

import { useState } from "react";
import { AlertTriangle, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { CategoryDot, StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useReport, useReports, useSetStatus } from "@/hooks/use-dashboard";
import type { Status } from "@/lib/api";
import { CATEGORY, NEXT_STATUSES, STATUS_LABEL, timeAgo } from "@/lib/kayal";

const ACTION_LABEL: Partial<Record<Status, string>> = {
  in_progress: "Start work",
  resolved: "Mark resolved",
  rejected: "Reject",
  open: "Reopen",
};

// PRD §7.4: photo, voice, summaries, history timeline, duplicate banner, status actions.
export function ReportSheet({ id, onClose }: { id: number | null; onClose: () => void }) {
  const { data: r, isLoading } = useReport(id);
  const { data: all } = useReports();
  const setStatus = useSetStatus();
  const [note, setNote] = useState("");
  const [dupTarget, setDupTarget] = useState<string>("");

  const candidates = (all ?? []).filter(
    (x) => r && x.id !== r.id && x.category === r.category && (x.status === "open" || x.status === "in_progress"),
  );

  function change(status: Status, duplicate_of?: number) {
    if (!r) return;
    setStatus.mutate(
      { id: r.id, status, note, duplicate_of },
      {
        onSuccess: () => {
          toast.success(`#${r.id} → ${STATUS_LABEL[status]}`);
          setNote("");
          setDupTarget("");
        },
        onError: (e) => toast.error(e.message),
      },
    );
  }

  return (
    <Sheet open={id !== null} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full gap-0 overflow-x-hidden overflow-y-auto p-0 sm:max-w-md">
        {isLoading || !r ? (
          <div className="space-y-4 p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
            <SheetHeader className="gap-2 border-b border-border p-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CategoryDot color={CATEGORY[r.category].color} />
                {CATEGORY[r.category].en}
                {r.category_corrected && <span>(corrected by citizen; AI said {CATEGORY[r.ai_category].en})</span>}
              </div>
              <SheetTitle className="text-xl">Report #{r.id}</SheetTitle>
              <SheetDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1"><MapPin className="size-3.5" />{r.place_name}</span>
                <span className="tabular">
                  {r.location_source === "manual"
                    ? "Pin placed by citizen"
                    : r.location_accuracy_m
                      ? `GPS ±${Math.round(r.location_accuracy_m)} m`
                      : "GPS"}
                </span>
                <span>{timeAgo(r.created_at)}</span>
                <span>Severity {r.severity}/5</span>
                <StatusBadge status={r.status} />
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 p-6">
              {r.possible_duplicate_of && r.status !== "duplicate" && (
                <div className="flex items-start gap-3 rounded-xl border border-gold/40 bg-accent/60 p-3 text-sm">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[color:var(--gold)]" />
                  <div className="flex-1">
                    Possible duplicate of <b>#{r.possible_duplicate_of}</b> (same issue within 200 m, 24 h).
                  </div>
                  {NEXT_STATUSES[r.status].includes("duplicate") && (
                    <Button size="sm" variant="outline" onClick={() => change("duplicate", r.possible_duplicate_of!)}>
                      Merge
                    </Button>
                  )}
                </div>
              )}
              {r.duplicate_count > 0 && (
                <p className="text-sm text-muted-foreground">Reported {r.duplicate_count + 1} times (incl. merged duplicates).</p>
              )}

              {r.photo_url && <img src={r.photo_url} alt="" className="w-full rounded-xl border border-border object-cover" />}

              <section className="space-y-2">
                <p className="text-[15px] leading-relaxed">{r.summary_local}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{r.summary_en}</p>
              </section>

              {(r.audio_url || r.transcript) && (
                <section className="space-y-2 rounded-xl bg-muted/60 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Citizen’s words</p>
                  {r.transcript && <p className="text-sm leading-relaxed">“{r.transcript}”</p>}
                  {r.audio_url && <audio controls src={r.audio_url} className="h-9 w-full" />}
                </section>
              )}

              {r.reporter_phone && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="size-3.5" /> {r.reporter_phone}</p>
              )}

              <Separator />

              {NEXT_STATUSES[r.status].length > 0 && (
                <section className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Update status</p>
                  <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional), e.g. cleanup boat sent" rows={2} />
                  <div className="flex flex-wrap gap-2">
                    {NEXT_STATUSES[r.status].filter((s) => s !== "duplicate").map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={s === "resolved" || s === "in_progress" ? "default" : s === "rejected" ? "destructive" : "outline"}
                        disabled={setStatus.isPending}
                        onClick={() => change(s)}
                      >
                        {ACTION_LABEL[s] ?? STATUS_LABEL[s]}
                      </Button>
                    ))}
                  </div>
                  {NEXT_STATUSES[r.status].includes("duplicate") && candidates.length > 0 && (
                    <div className="flex items-center gap-2">
                      <select
                        value={dupTarget}
                        onChange={(e) => setDupTarget(e.target.value)}
                        className="h-8 flex-1 rounded-lg border border-input bg-background px-2 text-sm"
                      >
                        <option value="">Duplicate of…</option>
                        {candidates.map((c) => (
                          <option key={c.id} value={c.id}>#{c.id} · {c.place_name} · {timeAgo(c.created_at)}</option>
                        ))}
                      </select>
                      <Button size="sm" variant="outline" disabled={!dupTarget} onClick={() => change("duplicate", Number(dupTarget))}>
                        Mark duplicate
                      </Button>
                    </div>
                  )}
                </section>
              )}

              <section className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">History</p>
                <ol className="relative space-y-4 border-l border-border pl-5">
                  {r.events.map((e) => (
                    <li key={e.id} className="relative">
                      <span className="absolute -left-[25px] top-1.5 size-2 rounded-full bg-primary ring-4 ring-background" />
                      <p className="text-sm font-medium">{STATUS_LABEL[e.to_status]}</p>
                      <p className="text-xs text-muted-foreground">{timeAgo(e.created_at)}{e.note ? ` · ${e.note}` : ""}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
