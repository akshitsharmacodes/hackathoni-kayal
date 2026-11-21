"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Keyboard, Send, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { MicButton } from "@/components/citizen/mic-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/use-language";
import { useLocation } from "@/hooks/use-location";
import { audioFilename, toSpeechWav, useRecorder } from "@/hooks/use-recorder";
import { api, type AskResult } from "@/lib/api";
import { playBase64Wav } from "@/lib/kayal";

// PRD §7.2: same giant-mic screen in gold; one-shot question → spoken answer (D19).
export default function AskPage() {
  const { language, t } = useLanguage();
  const pos = useLocation();
  const recorder = useRecorder();
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState<AskResult | null>(null);

  async function ask(audio: Blob | null, typed?: string) {
    const form = new FormData();
    form.append("language", language ?? "ml-IN");
    form.append("lat", String(pos.lat));
    form.append("lng", String(pos.lng));
    setBusy(true);
    if (audio) {
      const wav = await toSpeechWav(audio);
      form.append("audio", wav, audioFilename(wav));
    } else form.append("text", typed ?? "");
    try {
      const r = await api.ask(form);
      setAnswer(r);
      playBase64Wav(r.answer_audio);
    } catch (e) {
      toast.error(t.error);
    } finally {
      setBusy(false);
    }
  }

  async function onMic() {
    if (recorder.state === "recording") return recorder.stop();
    const audio = await recorder.start();
    if (!audio) return toast.error(t.micDenied);
    ask(audio);
  }

  if (answer) {
    return (
      <div className="flex flex-1 flex-col gap-6 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <p className="text-lg text-muted-foreground">“{answer.question}”</p>
        <div className="rounded-3xl border border-border bg-card p-6">
          <p className="text-[22px] leading-relaxed">{answer.answer}</p>
        </div>
        <button onClick={() => playBase64Wav(answer.answer_audio)} className="flex items-center gap-2 self-start text-primary">
          <Volume2 className="size-5" /> {t.playAgain}
        </button>
        <div className="mt-auto space-y-3">
          <Button onClick={() => { setAnswer(null); setText(""); }} className="h-14 w-full rounded-2xl bg-gold text-lg text-white hover:bg-gold/90">
            {t.askAgain}
          </Button>
          <Link href="/report" className="block py-2 text-center text-muted-foreground">{t.report}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Link href="/report" className="mt-4 flex items-center gap-1.5 self-start text-muted-foreground">
        <ArrowLeft className="size-4" /> {t.report}
      </Link>
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <MicButton
          tone="gold"
          state={busy ? "busy" : recorder.state === "recording" ? "recording" : "idle"}
          onClick={onMic}
          label={t.ask}
          seconds={recorder.seconds}
        />
        <div className="space-y-2 text-center">
          <p className="text-2xl font-medium">{busy ? t.thinking : recorder.state === "recording" ? t.tapToStop : t.ask}</p>
          {!busy && recorder.state !== "recording" && <p className="text-muted-foreground">{t.askHint}</p>}
        </div>
      </div>

      {typing ? (
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim()) ask(null, text.trim());
          }}
        >
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.askHint}
            rows={2}
            className="min-h-14 flex-1 rounded-2xl bg-card text-lg"
          />
          <Button type="submit" disabled={busy || !text.trim()} className="size-14 rounded-2xl" aria-label={t.ask}>
            <Send className="size-5" />
          </Button>
        </form>
      ) : (
        <button onClick={() => setTyping(true)} className="flex items-center justify-center gap-2 py-2 text-muted-foreground">
          <Keyboard className="size-5" /> {t.typeInstead}
        </button>
      )}
    </div>
  );
}
