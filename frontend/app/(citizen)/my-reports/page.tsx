"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";
import { api, type ReportDetail, type Status } from "@/lib/api";
import { CATEGORY } from "@/lib/kayal";
import { cn } from "@/lib/utils";

const TONE: Record<Status, string> = {
  draft: "bg-muted text-muted-foreground",
  open: "bg-accent text-accent-foreground",
  in_progress: "bg-primary/10 text-primary",
  resolved: "bg-primary text-primary-foreground",
  rejected: "bg-muted text-muted-foreground",
  duplicate: "bg-muted text-muted-foreground",
};

// D18 / FR-19: look up complaints by phone number (unverified, demo only).
export default function MyReportsPage() {
  const { language, t } = useLanguage();
  const [phone, setPhone] = useState("");
  useEffect(() => {
    try {
      setPhone(localStorage.getItem("kayal.phone") ?? "");
    } catch {}
  }, []);
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<ReportDetail[] | null>(null);

  async function find(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      setItems(await api.myReports(phone));
    } catch (err) {
      toast.error(t.error);
    } finally {
      setBusy(false);
    }
  }

  const dateFmt = new Intl.DateTimeFormat(language ?? "en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

  return (
    <div className="flex flex-1 flex-col gap-6 pt-4">
      <Link href="/report" className="flex items-center gap-1.5 self-start text-muted-foreground">
        <ArrowLeft className="size-4" /> {t.report}
      </Link>
      <h1 className="text-[26px] font-semibold">{t.myReports}</h1>

      <form onSubmit={find} className="flex gap-2">
        <Input
          type="tel"
          inputMode="numeric"
          placeholder={t.enterPhone}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-14 flex-1 rounded-2xl bg-card px-4 text-lg"
        />
        <Button type="submit" disabled={busy || phone.replace(/\D/g, "").length < 10} className="h-14 rounded-2xl px-6 text-lg">
          {t.find}
        </Button>
      </form>

      {items?.length === 0 && <p className="text-center text-muted-foreground">{t.noReports}</p>}

      <ul className="space-y-3">
        {items?.map((r) => {
          const cat = CATEGORY[r.category];
          return (
            <li key={r.id} className="rounded-3xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${cat.color}1A`, color: cat.color }}>
                    <cat.icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium">{t.categories[r.category]} · #{r.id}</p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" /> {r.place_name} · {dateFmt.format(new Date(r.created_at))}
                    </p>
                  </div>
                </div>
                <span className={cn("rounded-full px-3 py-1 text-sm font-medium", TONE[r.status])}>{t.statuses[r.status]}</span>
              </div>
              {r.summary_local && <p className="mt-3 leading-relaxed text-foreground/80">{r.summary_local}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
