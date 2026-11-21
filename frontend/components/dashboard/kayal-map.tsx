"use client";

import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { Circle, CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { Gauge, Report } from "@/lib/api";
import { CATEGORY, STATUS_LABEL } from "@/lib/kayal";

// D13 + D50 (revised 22 Nov): CARTO now needs a key, so standard OpenStreetMap tiles
// softened with a CSS filter (.kayal-tiles in globals.css) to match the earthy palette.
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const GAUGE_COLOR = { normal: "#3F7D3A", warning: "#B8892B", danger: "#A33A2B", unknown: "#6B6252" };

/** Zoom to fit all reports once, the first time data arrives. */
function FitOnce({ points }: { points: [number, number][] }) {
  const map = useMap();
  const done = useRef(false);
  useEffect(() => {
    if (done.current || points.length === 0) return;
    done.current = true;
    map.fitBounds(points, { padding: [40, 40], maxZoom: 13 });
  }, [map, points]);
  return null;
}

export default function KayalMap({
  reports,
  gauges,
  selectedId,
  onSelect,
}: {
  reports: Report[];
  gauges: Gauge[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <MapContainer center={[9.46, 76.39]} zoom={12} scrollWheelZoom className="size-full" zoomControl={false}>
      <FitOnce points={reports.map((r) => [r.lat, r.lng] as [number, number])} />
      <TileLayer key={dark ? "d" : "l"} url={TILE_URL} attribution={ATTRIBUTION} className={dark ? "kayal-tiles-dark" : "kayal-tiles"} />

      {gauges.map((g) => (
        <CircleMarker
          key={`g${g.id}`}
          center={[g.lat, g.lng]}
          radius={7}
          pathOptions={{ color: GAUGE_COLOR[g.state], weight: 2, dashArray: "3 3", fillColor: dark ? "#1C1A15" : "#FFFDF7", fillOpacity: 1 }}
        >
          <Tooltip direction="top" offset={[0, -6]}>
            <div className="text-xs">
              <b>{g.name}</b> · {g.level_m?.toFixed(2)} m · {g.state}
              <div className="opacity-70">Simulated demo data</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}

      {/* D56: show how precise the selected report's location is */}
      {reports
        .filter((r) => r.id === selectedId && r.location_accuracy_m)
        .map((r) => (
          <Circle
            key={`acc${r.id}`}
            center={[r.lat, r.lng]}
            radius={r.location_accuracy_m!}
            pathOptions={{ color: CATEGORY[r.category].color, weight: 1, dashArray: "4 4", fillOpacity: 0.08 }}
          />
        ))}

      {reports.map((r) => {
        const color = CATEGORY[r.category].color;
        const muted = r.status === "resolved" || r.status === "rejected" || r.status === "duplicate";
        const selected = r.id === selectedId;
        return (
          <CircleMarker
            key={r.id}
            center={[r.lat, r.lng]}
            radius={5 + r.severity * 1.6}
            eventHandlers={{ click: () => onSelect(r.id) }}
            pathOptions={{
              color: selected ? (dark ? "#EFE8D6" : "#1F1B14") : color,
              weight: selected ? 3 : 1.5,
              fillColor: color,
              fillOpacity: muted ? 0.15 : 0.6,
              dashArray: muted ? "3 3" : undefined,
            }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              <div className="text-xs">
                <b>#{r.id} {CATEGORY[r.category].en}</b> · {r.place_name}
                <div className="opacity-70">{STATUS_LABEL[r.status]} · severity {r.severity}/5</div>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
