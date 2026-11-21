"use client";

import { useEffect, useState } from "react";

/** D54: a fix is good enough to use automatically when accuracy is ≤ 30 m. */
export const GOOD_ACCURACY_M = 30;

export type Fix = { lat: number; lng: number; accuracy: number };
export type GpsStatus = "locating" | "good" | "weak" | "denied" | "unsupported";

/**
 * Keeps listening to GPS while the page is open (watchPosition) and keeps the most accurate fix.
 * Phones usually give a rough Wi-Fi/cell fix first (50–500 m) and a precise satellite fix seconds later.
 * Never invents a location: `best` stays null until the phone reports one (D53).
 */
export function useLocation() {
  const [best, setBest] = useState<Fix | null>(null);
  const [status, setStatus] = useState<GpsStatus>("locating");

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    let stopped = false;
    const id = navigator.geolocation.watchPosition(
      (p) => {
        if (stopped) return;
        const fix = { lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy };
        setBest((prev) => (!prev || fix.accuracy <= prev.accuracy ? fix : prev));
        setStatus((s) => (fix.accuracy <= GOOD_ACCURACY_M ? "good" : s === "good" ? "good" : "weak"));
      },
      (err) => {
        if (stopped) return;
        setStatus((s) => (err.code === err.PERMISSION_DENIED ? "denied" : s === "locating" ? "weak" : s));
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20_000 },
    );
    return () => {
      stopped = true;
      navigator.geolocation.clearWatch(id);
    };
  }, []);

  return { best, status };
}

/** Shrink a camera photo to ≤ 1280 px JPEG before upload (NFR-3). */
export function resizePhoto(file: File, max = 1280): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * s);
      canvas.height = Math.round(img.height * s);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("resize failed"))), "image/jpeg", 0.82);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
