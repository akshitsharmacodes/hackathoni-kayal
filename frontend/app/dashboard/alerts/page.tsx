"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BellRing, Gauge as GaugeIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAlerts, useGauges, usePlaces } from "@/hooks/use-dashboard";
import { api, type Alert } from "@/lib/api";
import { timeAgo } from "@/lib/kayal";
import { cn } from "@/lib/utils";

const SEV: Record<Alert["severity"], string> = {
  info: "bg-primary/10 text-primary",
  warning: "bg-accent text-accent-foreground",
  danger: "bg-destructive/10 text-destructive",
};
const GAUGE: Record<string, string> = { normal: "text-primary", warning: "text-gold-ink", danger: "text-destructive", unknown: "text-muted-foreground" };
const select = "h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm";

export default function AlertsPage() {
  const qc = useQueryClient();
  const { data: alerts = [] } = useAlerts();
  const { data: places = [] } = usePlaces();
  const { data: gauges = [] } = useGauges();
  const [form, setForm] = useState({ title: "", message: "", place_id: "", radius_km: "5", severity: "warning" as Alert["severity"], hours: "24" });

  const create = useMutation({
    mutationFn: () =>
      api.createAlert({
        title: form.title,
        message: form.message,
        place_id: Number(form.place_id),
        radius_km: Number(form.radius_km),
        severity: form.severity,
        expires_at: form.hours ? new Date(Date.now() + Number(form.hours) * 3600_000).toISOString() : null,
      }),
    onSuccess: () => {
      toast.success("Alert published. Kayal will mention it in voice answers.");
      setForm((f) => ({ ...f, title: "", message: "" }));
      qc.invalidateQueries();
    },
    onError: (e) => toast.error(e.message),
  });
  const toggle = useMutation({
    mutationFn: (a: Alert) => api.setAlertActive(a.id, !a.active),
    onSuccess: () => qc.invalidateQueries(),
  });

  const valid = form.title.trim() && form.message.trim() && form.place_id;

  return (
    <>
      <PageHeader title="Alerts & river levels" description="Official alerts are read out to citizens who ask about the area" />
      <div className="grid gap-6 p-6 xl:grid-cols-[380px_1fr]">
        <form
          onSubmit={(e) => { e.preventDefault(); if (valid) create.mutate(); }}
          className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5"
        >
          <p className="flex items-center gap-2 font-medium"><BellRing className="size-4" /> New alert</p>
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ferry suspended" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="What should people know or do?" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="place">Place</Label>
              <select id="place" className={select} value={form.place_id} onChange={(e) => setForm({ ...form, place_id: e.target.value })}>
                <option value="">Choose…</option>
                {places.map((p) => <option key={p.id} value={p.id}>{p.name_en} · {p.name_ml}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="radius">Radius (km)</Label>
              <Input id="radius" type="number" min={1} max={30} value={form.radius_km} onChange={(e) => setForm({ ...form, radius_km: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hours">Expires in (h)</Label>
              <Input id="hours" type="number" min={1} value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Severity</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["info", "warning", "danger"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm({ ...form, severity: s })}
                    className={cn("h-9 rounded-lg border text-sm capitalize", form.severity === s ? cn("border-transparent", SEV[s]) : "border-border text-muted-foreground")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Button type="submit" disabled={!valid || create.isPending} className="w-full">Publish alert</Button>
        </form>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card">
            <p className="border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Alerts</p>
            <ul className="divide-y divide-border">
              {alerts.length === 0 && <li className="px-5 py-8 text-center text-sm text-muted-foreground">No alerts yet.</li>}
              {alerts.map((a) => {
                const expired = a.expires_at && new Date(a.expires_at) < new Date();
                const live = a.active && !expired;
                return (
                  <li key={a.id} className={cn("flex items-start justify-between gap-4 px-5 py-4", !live && "opacity-55")}>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 font-medium">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs capitalize", SEV[a.severity])}>{a.severity}</span>
                        {a.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{a.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.radius_km} km radius · posted {timeAgo(a.created_at)}{expired ? " · expired" : a.expires_at ? ` · until ${new Date(a.expires_at).toLocaleString("en-IN", { hour: "numeric", minute: "2-digit", day: "numeric", month: "short" })}` : ""}
                      </p>
                    </div>
                    {!expired && (
                      <Button size="sm" variant="outline" onClick={() => toggle.mutate(a)}>{a.active ? "Deactivate" : "Activate"}</Button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">River gauges</p>
              <span className="rounded-full border border-dashed border-muted-foreground/50 px-2 py-0.5 text-xs text-muted-foreground">Simulated demo data</span>
            </div>
            <ul className="grid gap-px bg-border sm:grid-cols-2">
              {gauges.map((g) => {
                const pct = g.level_m ? Math.min(100, (g.level_m / g.danger_level_m) * 100) : 0;
                return (
                  <li key={g.id} className="space-y-2 bg-card px-5 py-4">
                    <p className="flex items-center justify-between text-sm font-medium">
                      <span className="flex items-center gap-2"><GaugeIcon className="size-4 text-muted-foreground" />{g.name.replace(" (demo)", "")}</span>
                      <span className={cn("capitalize", GAUGE[g.state])}>{g.state}</span>
                    </p>
                    <p className="tabular text-2xl font-semibold">{g.level_m?.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">m</span></p>
                    <div className="relative h-1.5 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%`, backgroundColor: g.state === "danger" ? "var(--destructive)" : g.state === "warning" ? "var(--gold)" : undefined }} />
                      <span className="absolute top-[-3px] h-3 w-px bg-foreground/40" style={{ left: `${(g.warning_level_m / g.danger_level_m) * 100}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground">Warning {g.warning_level_m} m · Danger {g.danger_level_m} m</p>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
