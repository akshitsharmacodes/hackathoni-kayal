import { CircleHelp, Construction, Droplet, Leaf, Trash2, Waves, type LucideIcon } from "lucide-react";
import type { Category, Status } from "@/lib/api";

// PRD §10A: muted category colours that sit well on kasavu cream.
export const CATEGORIES: { id: Category; color: string; icon: LucideIcon; en: string }[] = [
  { id: "plastic", color: "#C2410C", icon: Trash2, en: "Plastic" },
  { id: "water_hyacinth", color: "#3F7D3A", icon: Leaf, en: "Water hyacinth" },
  { id: "oil", color: "#3B3A36", icon: Droplet, en: "Oil spill" },
  { id: "flooding", color: "#2F5D8A", icon: Waves, en: "Flooding" },
  { id: "broken_jetty", color: "#8A5A2B", icon: Construction, en: "Broken jetty" },
  { id: "other", color: "#7A5C8E", icon: CircleHelp, en: "Other" },
];
export const CATEGORY = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<Category, (typeof CATEGORIES)[number]>;

export const STATUS_LABEL: Record<Status, string> = {
  draft: "Draft",
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
  rejected: "Rejected",
  duplicate: "Duplicate",
};

// FR-13 + D40 (mirrors backend TRANSITIONS)
export const NEXT_STATUSES: Record<Status, Status[]> = {
  draft: [],
  open: ["in_progress", "resolved", "rejected", "duplicate"],
  in_progress: ["resolved", "rejected", "duplicate", "open"],
  resolved: ["open"],
  rejected: ["open"],
  duplicate: [],
};

export function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}

export function playBase64Wav(b64: string): HTMLAudioElement | null {
  if (!b64) return null;
  const audio = new Audio(`data:audio/wav;base64,${b64}`);
  audio.play().catch(() => {});
  return audio;
}

export const ALAPPUZHA = { lat: 9.4981, lng: 76.3388 };
