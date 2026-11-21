"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type State = "idle" | "recording" | "denied";

/** D23: record then upload. Auto-stops after maxMs (Sarvam REST limit is 30 s). */
export function useRecorder(maxMs = 25_000) {
  const [state, setState] = useState<State>("idle");
  const [seconds, setSeconds] = useState(0);
  const rec = useRef<MediaRecorder | null>(null);
  const timers = useRef<number[]>([]);
  const resolver = useRef<((b: Blob | null) => void) | null>(null);

  const clear = () => {
    timers.current.forEach((t) => {
      window.clearTimeout(t);
      window.clearInterval(t);
    });
    timers.current = [];
  };

  useEffect(() => () => {
    clear();
    rec.current?.stream.getTracks().forEach((t) => t.stop());
  }, []);

  const stop = useCallback(() => {
    if (rec.current?.state === "recording") rec.current.stop();
  }, []);

  /** Starts recording; resolves with the audio when recording stops. */
  const start = useCallback(async (): Promise<Blob | null> => {
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setState("denied");
      return null;
    }
    const chunks: Blob[] = [];
    const r = new MediaRecorder(stream);
    rec.current = r;
    r.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const done = new Promise<Blob | null>((resolve) => (resolver.current = resolve));
    r.onstop = () => {
      clear();
      stream.getTracks().forEach((t) => t.stop());
      setState("idle");
      const blob = new Blob(chunks, { type: r.mimeType || "audio/webm" });
      resolver.current?.(blob.size > 0 ? blob : null);
    };
    r.start();
    setSeconds(0);
    setState("recording");
    timers.current.push(window.setInterval(() => setSeconds((s) => s + 1), 1000));
    timers.current.push(window.setTimeout(() => r.state === "recording" && r.stop(), maxMs));
    return done;
  }, [maxMs]);

  return { state, seconds, start, stop };
}

/**
 * Convert any browser recording (WebM/Opus on Android, MP4 on iPhone) to 16 kHz mono 16-bit WAV,
 * trimmed to maxSeconds. Phone WebM files carry no duration header, so Sarvam can think they are
 * longer than its 30 s limit; WAV has an exact length and is Sarvam's recommended input.
 * Falls back to the original blob if the browser cannot decode it.
 */
export async function toSpeechWav(blob: Blob, maxSeconds = 28): Promise<Blob> {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const decoded = await ctx.decodeAudioData(await blob.arrayBuffer());
    void ctx.close();

    const rate = 16_000;
    const seconds = Math.min(decoded.duration, maxSeconds);
    const offline = new OfflineAudioContext(1, Math.max(1, Math.ceil(seconds * rate)), rate);
    const src = offline.createBufferSource();
    src.buffer = decoded;
    src.connect(offline.destination); // down-mixes to mono and resamples to 16 kHz
    src.start(0);
    const pcm = (await offline.startRendering()).getChannelData(0);

    const buffer = new ArrayBuffer(44 + pcm.length * 2);
    const v = new DataView(buffer);
    const str = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    str(0, "RIFF"); v.setUint32(4, 36 + pcm.length * 2, true); str(8, "WAVE");
    str(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    str(36, "data"); v.setUint32(40, pcm.length * 2, true);
    for (let i = 0; i < pcm.length; i++) {
      const s = Math.max(-1, Math.min(1, pcm[i]));
      v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Blob([buffer], { type: "audio/wav" });
  } catch {
    return blob;
  }
}

export function audioFilename(blob: Blob) {
  const t = blob.type;
  return t.includes("mp4") ? "voice.m4a" : t.includes("ogg") ? "voice.ogg" : t.includes("wav") ? "voice.wav" : "voice.webm";
}
