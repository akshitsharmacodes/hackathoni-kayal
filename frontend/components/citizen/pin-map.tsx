"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTheme } from "next-themes";
import { useEffect, useMemo } from "react";
import { Circle, MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { ALAPPUZHA } from "@/lib/kayal";

// A small, calm pin (divIcon avoids Leaflet's default image paths, which break in bundlers).
const PIN = L.divIcon({
  className: "",
  html: `<div style="width:30px;height:30px;transform:translate(-15px,-30px)">
    <svg viewBox="0 0 24 24" width="30" height="30"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" fill="#1E5B3A" stroke="#FFFFFF" stroke-width="1.5"/><circle cx="12" cy="10" r="2.6" fill="#E07A2E"/></svg></div>`,
  iconSize: [0, 0],
});

function Recenter({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), zoom), { animate: true });
  }, [map, lat, lng, zoom]);
  return null;
}

function TapToPlace({ onPlace }: { onPlace: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPlace(e.latlng.lat, e.latlng.lng) });
  return null;
}

/** Review-screen mini-map (D55): shows the GPS pin + accuracy circle; tap or drag to set the exact spot. */
export default function PinMap({
  pin,
  accuracy,
  onPlace,
}: {
  pin: { lat: number; lng: number } | null;
  accuracy: number | null;
  onPlace: (lat: number, lng: number) => void;
}) {
  const { resolvedTheme } = useTheme();
  const center = pin ?? ALAPPUZHA;
  const handlers = useMemo(
    () => ({
      dragend: (e: L.LeafletEvent) => {
        const p = (e.target as L.Marker).getLatLng();
        onPlace(p.lat, p.lng);
      },
    }),
    [onPlace],
  );

  return (
    <MapContainer center={[center.lat, center.lng]} zoom={pin ? 17 : 12} zoomControl={false} attributionControl={false} className="size-full">
      <TileLayer key={resolvedTheme} url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" className={resolvedTheme === "dark" ? "kayal-tiles-dark" : "kayal-tiles"} />
      <TapToPlace onPlace={onPlace} />
      {pin && (
        <>
          <Recenter lat={pin.lat} lng={pin.lng} zoom={16} />
          {accuracy !== null && (
            <Circle center={[pin.lat, pin.lng]} radius={accuracy} pathOptions={{ color: "#1E5B3A", weight: 1, fillOpacity: 0.08 }} />
          )}
          <Marker position={[pin.lat, pin.lng]} icon={PIN} draggable eventHandlers={handlers} />
        </>
      )}
    </MapContainer>
  );
}
