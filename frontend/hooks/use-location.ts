"use client";

import { useEffect, useState } from "react";
import { ALAPPUZHA } from "@/lib/kayal";

/** GPS captured silently on load; falls back to Alappuzha town centre. */
export function useLocation() {
  const [pos, setPos] = useState<{ lat: number; lng: number; precise: boolean }>({ ...ALAPPUZHA, precise: false });
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude, precise: true }),
      () => {},
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  }, []);
  return pos;
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
