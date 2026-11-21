"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Language } from "@/lib/api";
import { STRINGS } from "@/lib/i18n";

// D31: language picked once on first open, remembered on the device.
const KEY = "kayal.language";
const listeners = new Set<() => void>();

function read(): Language | null {
  try {
    const v = localStorage.getItem(KEY);
    return v && v in STRINGS ? (v as Language) : null;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

/** Returns undefined during server render / before hydration, null if never chosen. */
export function useLanguage() {
  const language = useSyncExternalStore(subscribe, read, () => undefined);
  const setLanguage = useCallback((lang: Language) => {
    try {
      localStorage.setItem(KEY, lang);
    } catch {}
    listeners.forEach((l) => l());
  }, []);
  const t = STRINGS[language ?? "ml-IN"];
  return { language, setLanguage, t, ready: language !== undefined };
}
