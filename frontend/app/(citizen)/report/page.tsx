"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Camera, CheckCircle2, LocateFixed, LocateOff, MapPin, RotateCcw, Volume2, X } from "lucide-react";
import { toast } from "sonner";
import { CategoryChips } from "@/components/citizen/category-chips";
import { MicButton } from "@/components/citizen/mic-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";
import { GOOD_ACCURACY_M, resizePhoto, useLocation } from "@/hooks/use-location";
import { audioFilename, toSpeechWav, useRecorder } from "@/hooks/use-recorder";
import { api, ApiError, type AnalyzeResult, type Category, type Pin, type SubmitResult } from "@/lib/api";
import { ALAPPUZHA, playBase64Wav } from "@/lib/kayal";
import { Skeleton } from "@/components/ui/skeleton";

// Leaflet needs `window`, so the mini-map only renders in the browser.
const PinMap = dynamic(() => import("@/components/citizen/pin-map"), {
  ssr: false,
  loading: () => <Skeleton className="size-full rounded-none" />,
});

type Step = "home" | "analyzing" | "review" | "sending" | "done";

// PRD §7.1: home = giant mic + small camera → review → done.
export default function ReportPage() {
  const { language, t } = useLanguage();
  const { best, status: gps } = useLocation();
  const [manualPin, setManualPin] = useState<{ lat: number; lng: number } | null>(null);
  const recorder = useRecorder();
  const fileInput = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("home");
  const [photo, setPhoto] = useState<{ blob: Blob; url: string } | null>(null);
  const [draft, setDraft] = useState<AnalyzeResult | null>(null);
  const [category, setCategory] = useState<Category>("other");
  const [phone, setPhone] = useState("");
  // Remember the citizen's number on this device so they type it only once (also pre-fills "My complaints").
  useEffect(() => {
    try {
      setPhone(localStorage.getItem("kayal.phone") ?? "");
    } catch {}
  }, []);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const lang = language ?? "ml-IN";

  // D53-D55: the report's location is either a GPS fix (≤ 30 m to auto-accept) or a pin the citizen placed.
  // There is never a silent fallback location.
  const pin: Pin | null = manualPin
    ? { ...manualPin, accuracy: null, source: "manual" }
    : best
      ? { lat: best.lat, lng: best.lng, accuracy: Math.round(best.accuracy), source: "gps" }
      : null;
  const pinOk = !!pin && (pin.source === "manual" || (pin.accuracy ?? Infinity) <= GOOD_ACCURACY_M);
  const onPlace = useCallback((lat: number, lng: number) => setManualPin({ lat, lng }), []);

  async function analyze(audio: Blob | null) {
    if (!audio && !photo) return;
    setStep("analyzing");
    const form = new FormData();
    // Draft only; the confirmed pin is sent with /submit.
    form.append("lat", String(best?.lat ?? ALAPPUZHA.lat));
    form.append("lng", String(best?.lng ?? ALAPPUZHA.lng));
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
      toast.error(e instanceof ApiError && e.status === 422 ? t.noSpeech : t.error);
      setStep("home");
    }
  }

  async function onMic() {
    if (recorder.state === "recording") return recorder.stop();
    const started = Date.now();
    const audio = await recorder.start();
    if (audio === null) {
      toast.error(t.micDenied);
      return;
    }
    // An accidental double tap gives a near-empty clip: ask again instead of filing a report.
    if (Date.now() - started < 1200) {
      toast.error(t.noSpeech);
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
    if (!draft || !pin || !pinOk) return;
    setStep("sending");
    try {
      const r = await api.submit(draft.draft_id, category, pin, phone.trim() || undefined);
      try {
        if (phone.trim()) localStorage.setItem("kayal.phone", phone.trim());
      } catch {}
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
    setManualPin(null);
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
          <p className="font-medium text-primary">{t.thankYou}</p>
        </div>
        <div className="w-full rounded-xl border border-border bg-card p-5 text-left">
          <p className="font-mono text-xs text-muted-foreground">{t.nextTitle}</p>
          <ol className="mt-3 space-y-2.5">
            {t.nextSteps.map((s, i) => (
              <li key={s} className="flex gap-3 text-[15px] leading-snug">
                <span className="mt-0.5 shrink-0 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <button onClick={() => playBase64Wav(result.reply_audio)} className="flex items-center gap-2 text-primary">
          <Volume2 className="size-5" /> {t.playAgain}
        </button>
        <Button onClick={reset} className="mt-4 h-14 w-full rounded-lg text-lg">
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

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {photo && <img src={photo.url} alt="" className="h-44 w-full object-cover" />}
          <div className="space-y-2 p-5">
            <p className="text-xl leading-snug">{draft.summary_local || draft.transcript}</p>
            <p className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-4" /> {draft.place_name}
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="font-mono text-xs text-muted-foreground">{t.locationTitle}</h2>
          <div className="relative h-52 overflow-hidden rounded-xl border border-border">
            <PinMap pin={pin} accuracy={pin?.source === "gps" ? pin.accuracy : null} onPlace={onPlace} />
          </div>
          <p className={pinOk ? "text-sm text-muted-foreground" : "text-sm font-medium text-gold-ink"}>
            {!pin ? t.mapHintOff : pinOk ? t.mapHintGood : t.mapHintWeak}
            {pin?.source === "gps" && pin.accuracy !== null && <span className="tabular"> · ±{pin.accuracy} m</span>}
          </p>
          {pin && !pinOk && (
            <Button variant="outline" onClick={() => setManualPin({ lat: pin.lat, lng: pin.lng })} className="h-12 w-full rounded-lg text-base">
              <LocateFixed className="size-4" /> {t.pinCorrect}
            </Button>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-mono text-xs text-muted-foreground">{t.problemType}</h2>
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
            className="h-14 rounded-lg bg-card px-4 text-lg"
          />
          <p className="text-sm text-muted-foreground">{t.phoneHint}</p>
        </section>

        <div className="sticky bottom-0 -mx-5 mt-auto space-y-2 border-t border-border bg-background/95 px-5 pb-4 pt-3 backdrop-blur">
          <Button onClick={send} disabled={step === "sending" || !pinOk} className="h-14 w-full rounded-lg text-lg">
            {step === "sending" ? t.sending : t.send}
          </Button>
          {!pinOk && <p className="text-center text-sm text-muted-foreground">{t.pinNeeded}</p>}
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
        <div className="text-center">
          <p className="text-2xl font-semibold tracking-tight">{t.greeting(new Date().getHours())}</p>
          <p className="mt-1 text-muted-foreground">{t.greetingSub}</p>
        </div>
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
                <img src={photo.url} alt={t.photoAdded} className="size-16 rounded-lg border-4 border-background object-cover shadow-md" />
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

        <p className="-mt-4 flex items-center gap-1.5 text-sm text-muted-foreground" aria-live="polite">
          {gps === "denied" || gps === "unsupported" ? <LocateOff className="size-4" /> : <LocateFixed className={gps === "good" ? "size-4 text-primary" : "size-4 animate-pulse"} />}
          {gps === "good" && best
            ? t.gpsReady(Math.round(best.accuracy))
            : gps === "weak"
              ? t.gpsWeak
              : gps === "denied" || gps === "unsupported"
                ? t.gpsOff
                : t.gpsLocating}
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
