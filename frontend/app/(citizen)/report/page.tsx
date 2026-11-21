"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, Camera, CheckCircle2, MapPin, RotateCcw, Volume2, X } from "lucide-react";
import { toast } from "sonner";
import { CategoryChips } from "@/components/citizen/category-chips";
import { MicButton } from "@/components/citizen/mic-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";
import { resizePhoto, useLocation } from "@/hooks/use-location";
import { audioFilename, toSpeechWav, useRecorder } from "@/hooks/use-recorder";
import { api, type AnalyzeResult, type Category, type SubmitResult } from "@/lib/api";
import { playBase64Wav } from "@/lib/kayal";

type Step = "home" | "analyzing" | "review" | "sending" | "done";

// PRD §7.1: home = giant mic + small camera → review → done.
export default function ReportPage() {
  const { language, t } = useLanguage();
  const pos = useLocation();
  const recorder = useRecorder();
  const fileInput = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("home");
  const [photo, setPhoto] = useState<{ blob: Blob; url: string } | null>(null);
  const [draft, setDraft] = useState<AnalyzeResult | null>(null);
  const [category, setCategory] = useState<Category>("other");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<SubmitResult | null>(null);

  const lang = language ?? "ml-IN";

  async function analyze(audio: Blob | null) {
    if (!audio && !photo) return;
    setStep("analyzing");
    const form = new FormData();
    form.append("lat", String(pos.lat));
    form.append("lng", String(pos.lng));
    form.append("language", lang);
    if (audio) {
      const wav = await toSpeechWav(audio);
      form.append("audio", wav, audioFilename(wav));
    }
    if (photo) form.append("photo", photo.blob, "photo.jpg");
    try {
      const d = await api.analyze(form);
      setDraft(d);
      setCategory(d.ai_category);
      setStep("review");
    } catch (e) {
      toast.error(t.error);
      setStep("home");
    }
  }

  async function onMic() {
    if (recorder.state === "recording") return recorder.stop();
    const audio = await recorder.start();
    if (recorder.state === "denied" || audio === null) {
      if (audio === null) toast.error(t.micDenied);
      return;
    }
    analyze(audio);
  }

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const blob = await resizePhoto(file);
    if (photo) URL.revokeObjectURL(photo.url);
    setPhoto({ blob, url: URL.createObjectURL(blob) });
  }

  async function send() {
    if (!draft) return;
    setStep("sending");
    try {
      const r = await api.submit(draft.draft_id, category, phone.trim() || undefined);
      setResult(r);
      setStep("done");
      playBase64Wav(r.reply_audio);
    } catch (e) {
      toast.error(t.error);
      setStep("review");
    }
  }

  function reset() {
    if (photo) URL.revokeObjectURL(photo.url);
    setPhoto(null);
    setDraft(null);
    setResult(null);
    setPhone("");
    setStep("home");
  }

  // ---------- Done ----------
  if (step === "done" && result) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center animate-in fade-in duration-300">
        <CheckCircle2 className="size-24 text-primary" strokeWidth={1.25} />
        <div className="space-y-3">
          <h1 className="text-[28px] font-semibold">{t.registered(result.report.id)}</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">{result.reply_text}</p>
        </div>
        <button onClick={() => playBase64Wav(result.reply_audio)} className="flex items-center gap-2 text-primary">
          <Volume2 className="size-5" /> {t.playAgain}
        </button>
        <Button onClick={reset} className="mt-4 h-14 w-full rounded-2xl text-lg">
          {t.done}
        </Button>
      </div>
    );
  }

  // ---------- Review ----------
  if ((step === "review" || step === "sending") && draft) {
    return (
      <div className="flex flex-1 flex-col gap-5 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h1 className="text-[26px] font-semibold">{t.isThisRight}</h1>

        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          {photo && <img src={photo.url} alt="" className="h-44 w-full object-cover" />}
          <div className="space-y-2 p-5">
            <p className="text-xl leading-snug">{draft.summary_local || draft.transcript}</p>
            <p className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-4" /> {draft.place_name}
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{t.problemType}</h2>
          <CategoryChips value={category} onChange={setCategory} labels={t.categories} />
        </section>

        <section className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-muted-foreground">{t.phoneLabel}</label>
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="98470 12345"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-14 rounded-2xl bg-card px-4 text-lg"
          />
          <p className="text-sm text-muted-foreground">{t.phoneHint}</p>
        </section>

        <div className="mt-auto space-y-3 pt-2">
          <Button onClick={send} disabled={step === "sending"} className="h-14 w-full rounded-2xl text-lg">
            {step === "sending" ? t.sending : t.send}
          </Button>
          <button onClick={reset} className="flex w-full items-center justify-center gap-2 py-2 text-muted-foreground">
            <RotateCcw className="size-4" /> {t.retake}
          </button>
        </div>
      </div>
    );
  }

  // ---------- Home (giant mic) ----------
  const busy = step === "analyzing";
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <div className="relative">
          <MicButton
            state={busy ? "busy" : recorder.state === "recording" ? "recording" : "idle"}
            onClick={onMic}
            label={t.tapToSpeak}
            seconds={recorder.seconds}
          />
          {/* Small camera button beside the mic (D29) */}
          <div className="absolute -right-4 bottom-1">
            {photo ? (
              <div className="relative">
                <img src={photo.url} alt={t.photoAdded} className="size-16 rounded-2xl border-4 border-background object-cover shadow-md" />
                <button
                  onClick={() => setPhoto(null)}
                  aria-label="Remove photo"
                  className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-foreground text-background"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInput.current?.click()}
                disabled={busy}
                aria-label={t.addPhoto}
                className="flex size-16 items-center justify-center rounded-full border-4 border-background bg-card text-foreground shadow-md"
              >
                <Camera className="size-6" strokeWidth={1.75} />
              </button>
            )}
            <input ref={fileInput} type="file" accept="image/*" capture="environment" className="hidden" onChange={onPhoto} />
          </div>
        </div>

        <p className="min-h-14 max-w-xs text-center text-xl leading-snug text-foreground/80">
          {busy ? t.understanding : recorder.state === "recording" ? t.tapToStop : t.tapToSpeak}
        </p>

        {photo && !busy && recorder.state !== "recording" && (
          <Button variant="outline" onClick={() => analyze(null)} className="h-12 rounded-full px-6 text-base">
            {t.send} <ArrowRight className="size-4" />
          </Button>
        )}
      </div>

      <nav className="flex items-center justify-center gap-6 text-base text-muted-foreground">
        <Link href="/ask" className="py-2 underline-offset-4 hover:underline">{t.ask}</Link>
        <span className="size-1 rounded-full bg-border" />
        <Link href="/my-reports" className="py-2 underline-offset-4 hover:underline">{t.myReports}</Link>
      </nav>
    </div>
  );
}
