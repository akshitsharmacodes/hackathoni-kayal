// Typed client for the FastAPI backend (PRD §13). All calls go through the Next.js /api proxy.

export type Language = "ml-IN" | "en-IN" | "hi-IN" | "ta-IN";
export type Category = "plastic" | "water_hyacinth" | "oil" | "flooding" | "broken_jetty" | "other";
export type Status = "draft" | "open" | "in_progress" | "resolved" | "rejected" | "duplicate";

export interface StatusEvent {
  id: number;
  from_status: Status | null;
  to_status: Status;
  note: string;
  created_at: string;
}

export interface Report {
  id: number;
  created_at: string;
  updated_at: string;
  status: Status;
  lat: number;
  lng: number;
  place_name: string;
  language: Language;
  transcript: string;
  ai_category: Category;
  category: Category;
  category_corrected: boolean;
  severity: number;
  summary_en: string;
  summary_local: string;
  photo_url: string | null;
  audio_url: string | null;
  reporter_phone: string | null;
  possible_duplicate_of: number | null;
  duplicate_of: number | null;
}

export interface ReportDetail extends Report {
  events: StatusEvent[];
  duplicate_count: number;
}

export interface AnalyzeResult {
  draft_id: number;
  transcript: string;
  language: Language;
  ai_category: Category;
  severity: number;
  place_name: string;
  summary_local: string;
  summary_en: string;
  photo_url: string | null;
}

export interface SubmitResult {
  report: Report;
  possible_duplicate_of: number | null;
  reply_text: string;
  reply_audio: string;
}

export interface AskResult {
  question: string;
  language: Language;
  place: string;
  answer: string;
  answer_audio: string;
  sources: { reports: number; rain_mm_12h: number | null; alerts: string[]; gauges: { name: string; level_m: number | null; state: string }[] };
}

export interface Alert {
  id: number;
  title: string;
  message: string;
  place_id: number | null;
  lat: number;
  lng: number;
  radius_km: number;
  severity: "info" | "warning" | "danger";
  active: boolean;
  created_at: string;
  expires_at: string | null;
}

export interface Gauge {
  id: number;
  name: string;
  lat: number;
  lng: number;
  level_m: number | null;
  recorded_at: string | null;
  warning_level_m: number;
  danger_level_m: number;
  state: "normal" | "warning" | "danger" | "unknown";
  is_demo: boolean;
  history: { t: string; level_m: number }[];
}

export interface Place {
  id: number;
  name_en: string;
  name_ml: string;
  name_hi: string;
  name_ta: string;
  lat: number;
  lng: number;
}

export interface Stats {
  total: number;
  open: number;
  in_progress: number;
  resolved_today: number;
  active_alerts: number;
  by_status: Partial<Record<Status, number>>;
  by_category: Partial<Record<Category, number>>;
  hotspots: { place: string; category: Category; count: number }[];
  daily: ({ date: string; count: number } & Record<Category, number>)[];
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, typeof body.detail === "string" ? body.detail : "Something went wrong");
  return body as T;
}

const json = (method: string, data: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export const api = {
  analyze: (form: FormData) => request<AnalyzeResult>("/reports/analyze", { method: "POST", body: form }),
  submit: (id: number, category: Category, phone?: string) =>
    request<SubmitResult>(`/reports/${id}/submit`, json("POST", { category, phone: phone || null })),
  ask: (form: FormData) => request<AskResult>("/ask", { method: "POST", body: form }),
  myReports: (phone: string) => request<ReportDetail[]>(`/reports/mine?phone=${encodeURIComponent(phone)}`),

  reports: () => request<Report[]>("/reports"),
  report: (id: number) => request<ReportDetail>(`/reports/${id}`),
  setStatus: (id: number, status: Status, note = "", duplicate_of?: number) =>
    request<Report>(`/reports/${id}/status`, json("PATCH", { status, note, duplicate_of })),
  stats: () => request<Stats>("/stats"),
  gauges: () => request<Gauge[]>("/gauges"),
  alerts: () => request<Alert[]>("/alerts"),
  createAlert: (a: { title: string; message: string; place_id: number; radius_km: number; severity: Alert["severity"]; expires_at?: string | null }) =>
    request<Alert>("/alerts", json("POST", a)),
  setAlertActive: (id: number, active: boolean) => request<Alert>(`/alerts/${id}`, json("PATCH", { active })),
  places: () => request<Place[]>("/places"),
};
