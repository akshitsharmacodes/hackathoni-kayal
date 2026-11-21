# Kayal (കായൽ): PRD + SRS

> Multilingual voice and photo reporting for the Alappuzha backwaters.
> HackaThoni, 21–22 Nov 2026, solo build. Status: **v0.2: all questions resolved, awaiting final approval. No implementation until approved.**

---

## 1. Summary

Kayal lets anyone living or working on the Alappuzha backwaters **speak** about a problem in their own language and **take a photo**. Their phone adds the GPS location. AI turns this into a structured report (category, severity, summary) and the citizen can correct it. The report then appears as a pin on a **live map for the panchayat**. Citizens can also **ask by voice** ("Is the water rising near Kainakary?"). Kayal answers out loud using nearby reports, the rain forecast, official alerts and river levels.

**Hackathon fit**
| Track | How Kayal fits |
|---|---|
| 01 Place & People (primary) | Backwater waste, water hyacinth, oil, flooding and jetty safety in Alappuzha / Kuttanad |
| 02 Beyond English | Voice-first in Malayalam, Hindi, Tamil and English (Sarvam STT/LLM/TTS, smallest.ai TTS) |
| 03 Beyond the Screen | Camera photo understanding, GPS location, map |

**Sponsor use:** Sarvam (speech-to-text, LLM, fallback TTS), smallest.ai (main TTS), Devin (bounded side tasks).

---

## 2. Problem

- The Vembanad backwaters suffer from **plastic and sewage**, **water hyacinth** (it blocks canals and hurts fishing), **engine oil** from boats, and **frequent flooding** in Kuttanad, where farmland lies below sea level.
- The people who notice first are fishers, boat crews, farmers and elderly residents. Many prefer **speaking** in **Malayalam** (or Hindi or Tamil, for migrant workers) to filling in English forms.
- Today complaints arrive as phone calls or WhatsApp messages, with **no exact location, no photo and no tracking**. Officials can't see where problems cluster, and citizens never learn what happened.
- During floods people rely on rumours. There is no simple voice answer to "is it safe near me?"

## 3. Users

| Persona | Need |
|---|---|
| **Citizen reporter** (fisher, boat crew, farmer, resident, migrant worker) | Report in under 30 s by voice + photo in their language; later check the status by phone number |
| **Citizen asker** | Ask a spoken question about their area and get a spoken answer |
| **Panchayat official** | See all reports on a map, find hotspots, change status, merge duplicates, post alerts |

## 4. Goals and non-goals

**Goals (demo, 09:30 on 22 Nov)**
- G1: A live report from a phone on the houseboat appears on the projected map within about 15 s.
- G2: A voice question in Malayalam gets a correct, spoken Malayalam answer.
- G3: The same works in English, Hindi and Tamil.
- G4: The official handles the report through its status lifecycle and the citizen sees the change by phone number.

**Non-goals (for the hackathon)**
- Login or roles for officials (open dashboard)
- OTP verification of phone numbers
- Offline queue / background sync
- Real river or dam data integration (mocked; see §9.4)
- SMS / WhatsApp notifications
- Multi-turn voice conversation

---

## 5. Decisions log (all made by you)

| # | Area | Decision |
|---|---|---|
| D1 | Frontend | **Next.js (App Router)**, React |
| D2 | UI | **shadcn/ui + Tailwind**, **Magic UI / Aceternity** (pitch wow), **Lucide** icons, **Recharts** (shadcn charts) |
| D3 | Backend | **FastAPI** (Python) |
| D4 | Python tooling | **uv** (pyproject.toml) |
| D5 | Database | **Supabase Postgres** |
| D6 | Photo storage | **Supabase Storage** |
| D7 | DB access | **SQLAlchemy + Alembic** |
| D8 | Repo | **Monorepo**: `/frontend` + `/backend` |
| D9 | Frontend → API | **Next.js rewrites proxy** (`/api/*` → FastAPI) |
| D10 | Hosting for demo | **Laptop + HTTPS tunnel** (one tunnel, to Next.js) |
| D11 | Dashboard auth | **None for demo** |
| D12 | Live updates | **Polling every 5 s** |
| D13 | Map | **Leaflet + OpenStreetMap** (react-leaflet) |
| D14 | Category | **AI decides, citizen can correct** before submitting |
| D15 | Languages | **Malayalam, English, Hindi, Tamil** |
| D16 | Status lifecycle | **Open → In progress → Resolved**, plus **Rejected** and **Duplicate** |
| D17 | Duplicates | **Auto-suggest, official confirms** |
| D18 | Citizen tracking | **By phone number, unverified (demo)** |
| D19 | Ask mode | **One-shot Q&A** |
| D20 | Ask data | **Nearby reports + rain forecast + official alerts + river/dam levels** |
| D21 | River data | **Mocked seeded gauge readings, labelled "demo data"** |
| D22 | AI models | **Tested set** (see §9) |
| D23 | Voice input | **Record then upload** (≤ 25 s) |
| D24 | TTS | **smallest.ai primary, Sarvam fallback** |
| D25 | PWA | **Installable (manifest), no offline** |
| D26 | Devin | **Bounded side tasks** (see §14) |
| D27 | Old prototype | **Delete** (`main.py`, `ai.py`, `db.py`, `places.py`, `seed.py`, `static/`, `kayal.db`, root `package.json`/`node_modules`/`test-sarvam.js`) once implementation starts |
| D28 | Design goal | Dashboard **extremely clean and elegant**; citizen app **very, very simple** (used by locals only) |
| D29 | Citizen home | **One giant mic button**, with **a small camera button beside it**; Ask and My reports are small text links at the bottom |
| D30 | Review step | **Keep the review screen** (AI category chips + summary + optional phone) |
| D31 | Language choice | **Pick once on first open** (4 big buttons), remembered on the device; changeable from a small corner switch |
| D32 | Effects | **Magic UI / Aceternity on the landing page only**; citizen app and dashboard use calm shadcn + subtle motion |
| D33 | Palette | **Kerala earthy**: kasavu cream, gold, deep green |
| D34 | Dashboard layout | **Sidebar nav (Map, Reports, Alerts, Insights) + map + report list** |
| D35 | Theme | **Citizen app always light**; dashboard **light by default with a dark toggle** |

---

## 6. Features and priorities

Priorities are **proposed**; confirm them in review. P0 = must work at the demo, P1 = should, P2 = nice to have.

| ID | Feature | Pri |
|---|---|---|
| F1 | Voice + photo + GPS report capture (phone) | P0 |
| F2 | AI analysis: transcript, language, category, severity, summaries, place | P0 |
| F3 | Review screen: citizen sees AI result, can change category, adds optional phone number, submits | P0 |
| F4 | Spoken confirmation in the reporter's language | P0 |
| F5 | Live dashboard map with coloured pins, filters, report drawer (photo, summaries) | P0 |
| F6 | Status changes (Open / In progress / Resolved / Rejected / Duplicate) with history | P0 |
| F7 | Voice Ask (one-shot) with spoken answer, using reports + rain + alerts + river levels | P0 |
| F8 | Malayalam + English | P0 |
| F9 | Hindi + Tamil | P1 |
| F10 | Duplicate auto-suggest + official merge | P1 |
| F11 | "My reports" lookup by phone number | P1 |
| F12 | Official alerts: create / list / expire on dashboard | P1 |
| F13 | Mock river gauge readings shown on map + used in Ask | P1 |
| F14 | Dashboard stats: counts by category/status, hotspots, Recharts trend | P1 |
| F15 | Landing / pitch page with Magic UI / Aceternity effects | P2 |
| F16 | PWA manifest + icons (add to home screen) | P2 |

---

## 7. User flows

### 7.0 First open (citizen)
1. Full-screen language picker: four large buttons, each written in its own script: **മലയാളം · हिन्दी · தமிழ் · English**.
2. The choice is saved on the device (localStorage). The home screen opens. A small language chip in the top-right corner can change it later.

### 7.1 Report (citizen, phone): the home screen *is* the report flow
1. Home: the Kayal wordmark, **one giant mic button** in the centre, a **small camera button** beside it, and the hint "Tap and speak" in the chosen language. Small links at the bottom: *Ask* · *My reports*.
2. Tap mic → speak (≤ 25 s, auto-stop, live waveform/pulse) → tap to stop. Tapping the camera before or after speaking adds a photo (shrunk on the phone to ≤ 1280 px JPEG); a thumbnail appears beside the mic.
3. GPS is captured silently on load (fallback: Alappuzha town centre).
4. As soon as the recording stops, analysis starts automatically: `POST /api/reports/analyze` → a draft is created. A calm loading state shows ("Understanding…").
5. **Review screen** (one card, big type): photo thumbnail, AI summary in the chosen language, place, and **6 picture chips** for the category (AI choice pre-selected; tap to change). There is an optional phone number field ("to track your complaint") with one line of consent text.
6. One big **Send** button → `POST /api/reports/{id}/submit` → status `open`.
7. Success screen: a large check mark, "Complaint #23 registered", and the spoken confirmation in the chosen language. A "Done" button returns home.

### 7.2 Ask (citizen, phone)
1. Tap the small *Ask* link → the same giant-mic screen in a different accent → speak a question (typing is available behind a small keyboard icon).
2. `POST /api/ask` → STT → work out the place (named in the question, else GPS) → gather context → LLM answer in the same language → TTS.
3. Show the transcript, answer text and sources used (counts, rain mm, alerts, gauge), and play the audio.

### 7.3 Track (citizen)
1. **My reports** → enter phone number → `GET /api/reports/mine?phone=` → list with status badges and history.

### 7.4 Dashboard (official, laptop / projector)
1. `/dashboard` layout: **left sidebar nav** (Map · Reports · Alerts · Insights, plus a theme toggle) | **stats strip above the map** | **report list on the right**. Polls every 5 s.
   - **Map** (default): map + latest-reports list; hotspots highlighted.
   - **Reports**: a data table (shadcn Table) with filters for status, category and date, plus search.
   - **Alerts**: list + create form; river gauges with demo-data badges.
   - **Insights**: Recharts charts: reports per day, by category, by status, top hotspots.
2. Click a pin → drawer: photo, transcript, summaries (local + English), severity, status history, **possible duplicate** banner.
3. Change status via buttons; for **Duplicate**, pick the original report (pre-filled with the suggestion).
4. **Alerts** panel: create an alert (title, message, place/radius, severity, expiry).
5. River gauges show as distinct markers labelled "demo data".

---

## 8. Functional requirements

### Reporting
- **FR-1** The system shall accept a report draft containing at least one of: an audio clip (≤ 25 s; webm/ogg/m4a/wav), a photo (JPEG ≤ 2 MB after resizing), or typed text; plus lat/lng.
- **FR-2** The system shall transcribe audio with Sarvam `saaras:v4` (`mode="transcribe"`, language auto-detect) and store the transcript and detected language code.
- **FR-3** The citizen's chosen language (D31) is sent with every request and sets the reply/TTS language and the language of `summary_local`. The STT detected language is stored too. *(Whether the chosen language is also passed to STT as a hint is open question 13.)* Allowed: {ml-IN, en-IN, hi-IN, ta-IN}.
- **FR-4** The system shall classify the report with `gemma4` (text + base64 photo, `response_format=json_object`) into: `category ∈ {plastic, water_hyacinth, oil, flooding, broken_jetty, other}`, `severity ∈ 1..5`, `place` (free text), `summary_en`, `summary_local` (in the detected language).
- **FR-5** The backend shall validate the AI output (unknown category → `other`, severity clamped to 1–5) and never trust it blindly.
- **FR-6** The system shall resolve the place: a known place named in the transcript or AI place, else the nearest known place to GPS.
- **FR-7** Drafts shall not appear on the dashboard. A draft becomes `open` only on submit. Drafts older than 24 h may be purged.
- **FR-8** On submit, the citizen may override the category; the system stores both `ai_category` and the final `category`, plus `category_corrected`.
- **FR-9** The citizen may attach an optional phone number (normalised to E.164, +91 default) shown with consent text.
- **FR-10** On submit, the system shall return a confirmation sentence and TTS audio in the detected language.

### Duplicates
- **FR-11** On submit, the system shall look for open/in-progress reports in the **same category within 200 m and 24 h** (proposed thresholds) and set `possible_duplicate_of` to the closest match.
- **FR-12** An official can mark a report `duplicate` with `duplicate_of = <id>`; the original shows a "reported N times" count.

### Status
- **FR-13** Allowed statuses: `draft`, `open`, `in_progress`, `resolved`, `rejected`, `duplicate`. Allowed transitions (proposed): open→in_progress/resolved/rejected/duplicate; in_progress→resolved/rejected/duplicate; resolved/rejected→open (reopen).
- **FR-14** Every status change writes a `status_events` row (from, to, note, time).

### Ask
- **FR-15** The system shall accept an audio or text question plus optional lat/lng.
- **FR-16** Context gathered: (a) reports within 5 km in 48 h (non-draft, non-rejected), (b) Open-Meteo precipitation for the next 12 h, (c) active alerts covering the place, (d) latest mock gauge readings within 10 km.
- **FR-17** The answer shall come from `sarvam-105b-conversations` in the asker's language, 2–3 spoken-style sentences, using only the given data, with a safety tip when data is thin.
- **FR-18** The response returns the question, place, answer text, answer audio, and a `sources` object (counts / values used).

### Tracking, alerts, gauges, dashboard
- **FR-19** `GET /api/reports/mine?phone=` returns that number's reports with status history (no OTP; demo only).
- **FR-20** Officials can create, list and deactivate alerts (title, message, place, lat/lng, radius_km, severity, expires_at).
- **FR-21** Gauge readings are seeded per station with warning/danger levels and `is_demo = true`; the UI always labels them "demo data".
- **FR-22** The dashboard polls `GET /api/reports?since=` every 5 s and supports filters (category, status, date range).
- **FR-23** Stats endpoint: counts by category and status, hotspots (place + category with ≥ 2 open reports), daily counts for the last 7 days.

### TTS
- **FR-24** TTS shall try smallest.ai `lightning_v3.1_pro` with a voice for the language, then fall back to Sarvam `bulbul:v3` with `language_code` set. Output: base64 WAV.

## 9. AI pipeline (SRS detail)

### 9.1 Models (tested tonight unless marked)
| Step | Provider / model | Tested |
|---|---|---|
| Speech → text | Sarvam `saaras:v4`, REST, ≤ 30 s | ✅ Malayalam |
| Sort report (text + photo → JSON) | Sarvam-hosted `gemma4`, `json_object` | ✅ text only; ⚠️ photo not yet |
| Answer question | Sarvam `sarvam-105b-conversations` | ✅ Malayalam |
| Text → speech (primary) | smallest.ai `lightning_v3.1_pro` | ❌ needs key; Malayalam voices: parvathy, lakshmi, vishnu… |
| Text → speech (fallback) | Sarvam `bulbul:v3` (`priya`) | ✅ Malayalam |
| Rain | Open-Meteo hourly precipitation (no key) | ✅ |

### 9.2 Prompt contracts
- **Classify** → JSON keys: `category, severity, place, summary_en, summary_local`. The prompt includes the category definitions and the target language for `summary_local`.
- **Answer** → system prompt: "You are Kayal… answer in {language} in 2–3 short spoken sentences, no markdown, only use the given data…". The user message holds the question plus the JSON context.

### 9.3 Latency budget (target)
| Call | Target |
|---|---|
| analyze (STT + classify) | ≤ 10 s |
| submit (DB + dup check + TTS) | ≤ 5 s |
| ask (STT + context + LLM + TTS) | ≤ 15 s |
Next.js proxy timeout must be raised above 30 s (`experimental.proxyTimeout`), see §16.

### 9.4 Mock river gauges (demo data)
Three or four stations (e.g. Nedumudi, Kidangara/Champakulam, Pallathuruthy, Thottappally spillway), with readings every 3 h for 48 h and warning/danger thresholds. **The UI and pitch label these clearly as simulated.**

---

## 10. Non-functional requirements
- **NFR-1 Mobile first:** works on Android Chrome and iOS Safari at 360 px width; tap targets ≥ 44 px.
- **NFR-2 HTTPS:** phones must use the tunnel URL (mic and camera need a secure origin).
- **NFR-3 Weak network:** photos resized on the phone; audio ≤ 25 s; clear loading and error states; retry button.
- **NFR-4 Secrets:** API keys only in `backend/.env` (gitignored); never sent to the browser; frontend never calls Sarvam, smallest.ai or Supabase with secret keys.
- **NFR-5 Privacy:** phone numbers optional, shown masked on the dashboard (`+91 98•••••210`), never in the Ask context.
- **NFR-6 Safety of AI output:** all AI text rendered as text, never as HTML.
- **NFR-7 Accessibility:** every action works by voice or large buttons; spoken feedback for each step; labels in the user's language.
- **NFR-8 Theme:** citizen app always light (readable in sun); dashboard light by default with a dark toggle, via shadcn tokens.

---

## 10A. Design system

### Principles
- **Citizen app: one thing per screen.** At most one primary action and one secondary action. Big type (≥ 20 px body, ≥ 28 px headings), icons with words, no jargon, no English unless English was chosen. Every step also speaks.
- **Dashboard: quiet and precise.** Lots of whitespace, a hairline border instead of heavy shadows, one accent colour, numbers in tabular figures. Colour is used only for meaning (category, status, severity).
- **Motion:** short, subtle fades and slides (150–250 ms). Mic pulse while recording. No decorative animation outside the landing page.

### Palette: Kerala earthy (proposed tokens; confirm in review)
| Token | Light | Dark (dashboard only) | Use |
|---|---|---|---|
| `--background` | kasavu cream `#F8F3E6` | `#14130F` | page |
| `--card` | `#FFFDF7` | `#1C1A15` | cards, panels |
| `--foreground` | ink `#1F1B14` | `#EFE8D6` | text |
| `--muted-foreground` | `#6B6252` | `#A79E8A` | secondary text |
| `--primary` | deep green `#1F4D3A` | `#4E9C7A` | mic button, primary buttons |
| `--accent` | kasavu gold `#B8892B` | `#D4A84A` | highlights, active nav, focus ring |
| `--border` | `#E6DDC8` | `#2E2A22` | hairlines |
| `--destructive` | `#A33A2B` | `#D0604F` | reject, danger |

**Category colours (map + chips, muted to fit the palette):** plastic `#C2410C` · water hyacinth `#3F7D3A` · oil `#3B3A36` · flooding `#2F5D8A` · broken jetty `#8A5A2B` · other `#7A5C8E`.
**Status badges:** open (gold outline) · in progress (green tint) · resolved (green solid) · rejected (muted) · duplicate (grey dashed).

### Typography (proposed; confirm in review)
- Latin: **Inter** (UI) with tabular numbers on the dashboard.
- Malayalam: **Noto Sans Malayalam** · Hindi: **Noto Sans Devanagari** · Tamil: **Noto Sans Tamil**, loaded with `next/font`, so each script looks consistent.
- Wordmark: "കായൽ Kayal".

### Citizen app screens (mobile, 360–430 px)
| Screen | Content |
|---|---|
| Language picker | 4 full-width buttons, each in its own script |
| Home / Report | wordmark + language chip · giant mic (≈ 160 px) · small camera button · hint text · footer links *Ask · My reports* |
| Understanding | mic morphs into a spinner, "Understanding…" |
| Review | photo thumb · summary · place · 6 category picture chips · optional phone · **Send** |
| Done | big check · "#23 registered" · spoken confirmation · **Done** |
| Ask | giant mic (gold accent) → answer card in large type + replay audio button |
| My reports | phone field → simple list of cards with status badge and date |

shadcn components: Button, Card, Badge, Input, ToggleGroup (category chips), Sheet/Drawer, Sonner (toasts), Skeleton.

### Dashboard (desktop ≥ 1280 px, projector-friendly)
- **Left sidebar** (shadcn Sidebar): Kayal wordmark, nav (Map, Reports, Alerts, Insights), theme toggle.
- **Top stats strip:** 4–6 stat cards (open, in progress, resolved today, top category, active alerts).
- **Centre:** Leaflet map with muted tiles (CARTO Positron light / Dark Matter dark *(tile choice: open question 15)*), severity-sized circle markers in category colours, gauge markers with a "demo" tag.
- **Right:** scrollable latest-reports list (category dot, place, time ago, status badge); click → right **Sheet** with photo, summaries, status history timeline, duplicate banner, and status action buttons.
- shadcn components: Sidebar, Card, Table, Badge, Sheet, Tabs, Select, DropdownMenu, Dialog, Chart (Recharts), Sonner, Skeleton, Tooltip.

### Landing page (pitch only)
Magic UI / Aceternity allowed here only (e.g. animated hero, number tickers, marquee of languages) to open the demo; links to `/report` and `/dashboard`.

---

## 11. Architecture

```
Phone / Laptop browser
        │  HTTPS (tunnel → localhost:3000)
        ▼
Next.js (App Router, shadcn, Leaflet)   ── rewrites /api/* ──►  FastAPI (localhost:8000)
                                                                   │
                     ┌──────────────────────────┬──────────────────┼───────────────────┐
                     ▼                          ▼                  ▼                   ▼
          Supabase Postgres           Supabase Storage      Sarvam API          smallest.ai API
          (SQLAlchemy+Alembic)        (photos bucket)       (STT, LLMs, TTS)    (TTS)   + Open-Meteo
```

### 11.1 Repo layout (monorepo)
```
/frontend            Next.js App Router (pnpm or npm: see open questions)
  app/
    page.tsx               landing / pitch (Magic UI / Aceternity: the only place with effects)
    (citizen)/             always-light layout, language provider
      report/page.tsx      home = giant mic + camera → review → done
      ask/page.tsx         citizen voice Q&A
      my-reports/page.tsx  lookup by phone
      language/page.tsx    first-open language picker
    dashboard/             sidebar layout, theme toggle
      page.tsx             Map view (default)
      reports/page.tsx     table view
      alerts/page.tsx      alerts + gauges
      insights/page.tsx    charts
    manifest.ts            PWA manifest
  components/
    ui/                    shadcn components
    voice-recorder.tsx     mic button + MediaRecorder hook
    photo-capture.tsx      camera input + resize
    category-picker.tsx    AI suggestion + correction chips
    status-badge.tsx
    report-drawer.tsx
    map/kayal-map.tsx      react-leaflet (client only, dynamic import)
    charts/                Recharts via shadcn chart
  lib/api.ts               typed fetch helpers
  next.config.ts           rewrites + proxyTimeout
/backend             FastAPI (uv)
  pyproject.toml
  alembic/ + alembic.ini
  app/
    main.py                app factory, routers, CORS off (same origin via proxy)
    config.py              settings from .env (pydantic-settings)
    db.py                  engine, session dependency
    models.py              SQLAlchemy models
    schemas.py             Pydantic request/response models
    routers/  reports.py  ask.py  alerts.py  gauges.py  stats.py
    services/ stt.py  classify.py  answer.py  tts.py  weather.py  storage.py  places.py  duplicates.py
  scripts/seed.py         places, demo reports, gauges, alerts
/docs/PRD.md
```

### 11.2 Environment variables (`backend/.env`)
`SARVAM_API_KEY`, `SMALLEST_API_KEY`, `DATABASE_URL` (Supabase Postgres connection string), `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (Storage uploads, server only), `STORAGE_BUCKET=report-photos`.
Frontend: `BACKEND_URL=http://localhost:8000` (used only by rewrites).

---

## 12. Data model (Postgres)

**places**: `id`, `name_en`, `name_ml`, `name_hi`, `name_ta`, `match_terms` (text[]), `lat`, `lng`

**reports**
| column | type | notes |
|---|---|---|
| id | serial PK | shown to citizens as #id |
| created_at, updated_at | timestamptz | |
| status | enum report_status | draft/open/in_progress/resolved/rejected/duplicate |
| lat, lng | double | |
| place_id | FK places | nullable |
| place_name | text | |
| language | text | ml-IN / en-IN / hi-IN / ta-IN |
| transcript | text | |
| ai_category, category | enum report_category | |
| category_corrected | bool | |
| severity | smallint 1–5 | |
| summary_en, summary_local | text | |
| photo_url | text | Supabase Storage public URL (`report-photos`) |
| audio_url | text | Supabase Storage URL (`report-audio`), nullable |
| reporter_phone | text | nullable, E.164 |
| possible_duplicate_of | FK reports | nullable, set by system |
| duplicate_of | FK reports | nullable, set by official |

**status_events**: `id`, `report_id` FK, `from_status`, `to_status`, `note`, `created_at`

**alerts**: `id`, `title`, `message`, `place_id` FK nullable, `lat`, `lng`, `radius_km`, `severity` (info/warning/danger), `active` bool, `created_at`, `expires_at`

**gauge_stations**: `id`, `name`, `lat`, `lng`, `warning_level_m`, `danger_level_m`, `is_demo` bool
**gauge_readings**: `id`, `station_id` FK, `level_m`, `recorded_at`

Indexes: `reports(status, created_at)`, `reports(category)`, `reports(reporter_phone)`. Distance done in Python with haversine (no PostGIS, per D5 choice).

---

## 13. API specification (FastAPI, all under `/api`)

| Method | Path | Body / query | Returns |
|---|---|---|---|
| POST | `/reports/analyze` | multipart: `lat`, `lng`, `audio?`, `photo?`, `text?` | `{draft_id, transcript, language, ai_category, severity, place_name, summary_local, summary_en, photo_url}` |
| POST | `/reports/{id}/submit` | JSON: `{category, phone?}` | `{report, possible_duplicate_of?, reply_text, reply_audio}` |
| GET | `/reports` | `since?, status?, category?, from?, to?` | `Report[]` (no drafts) |
| GET | `/reports/{id}` | | `Report` + `events[]` + `duplicate_count` |
| PATCH | `/reports/{id}/status` | JSON: `{status, note?, duplicate_of?}` | `Report` (validates transitions) |
| GET | `/reports/mine` | `phone` | `Report[]` with events |
| POST | `/ask` | multipart: `audio?`, `text?`, `lat?`, `lng?` | `{question, language, place, answer, answer_audio, sources:{reports, rain_mm_12h, alerts, gauges}}` |
| GET/POST | `/alerts` | POST JSON alert | `Alert[]` / `Alert` |
| PATCH | `/alerts/{id}` | `{active}` | `Alert` |
| GET | `/gauges` | | stations + latest reading + status (normal/warning/danger) |
| GET | `/stats` | | counts by category & status, hotspots, last-7-days series |
| GET | `/health` | | `{ok, db, sarvam, smallest}` |

Errors: `400` validation, `404` not found, `409` invalid status transition, `502` upstream AI failure with a friendly message.

---

## 14. Build plan (proposed, about 9 h remaining)

| Time | Work | Who |
|---|---|---|
| 00:00–00:45 | Monorepo scaffold: Next.js + shadcn init; FastAPI + uv; Supabase project, DB URL, bucket; Alembic first migration | Me + you |
| 00:45–02:30 | Backend P0: analyze/submit/reports/status/ask, services, seed | Me |
| 01:00–03:00 | **Devin ticket A:** dashboard stats + Recharts components from the API contract (§13) | Devin |
| 01:00–02:00 | **Devin ticket B:** seed script content: places in 4 languages, 30 demo reports, gauges, alerts | Devin |
| 02:30–04:30 | Frontend P0: report flow, review screen, ask, dashboard map + drawer + status | Me |
| 04:30–05:30 | P1: duplicates, my-reports, alerts UI, Hindi/Tamil checks | Me |
| 05:30–06:30 | Tunnel, test on real phone, fix bugs | You + me |
| 06:30–07:15 | P2: landing page (Magic UI), PWA manifest; **record backup demo video** | Me / **Devin ticket C** (landing) |
| 07:15–09:30 | Pitch, rehearse, rest | You |

Devin rules: each ticket gets the API contract, file paths it may touch, and "done" criteria; no access to `.env`.

## 15. Demo script (3 min, proposed)
1. **Problem (30 s):** photo of canal hyacinth / flood + "complaints get lost, people speak Malayalam".
2. **Live report (60 s):** on the boat deck, speak Malayalam + photo → review screen → submit → spoken reply → pin pops up on the projected map.
3. **Official (30 s):** open the drawer → "possible duplicate" → mark In progress; citizen's "My reports" shows the change.
4. **Ask (45 s):** "കൈനകരിയിൽ വെള്ളം കയറുന്നുണ്ടോ?" → spoken answer citing reports, rain, alert and gauge; then the same in Hindi.
5. **Scale (15 s):** any panchayat, any Indian language, WhatsApp/IVR next.

## 16. Risks
| Risk | Mitigation |
|---|---|
| Boat internet slow or down | Hotspot; small payloads; backup video; seeded data |
| Next.js proxy times out after 30 s by default | Set `experimental.proxyTimeout` to 120 s |
| gemma4 photo + JSON not yet tested | Test first in the backend phase; fallback: classify text only, describe photo separately |
| smallest.ai voices for hi/ta unknown | Look up voice ids; Sarvam fallback covers all 4 languages |
| Supabase connection from laptop (IPv6 / pooler) | Use the Supabase **pooler** connection string |
| Scope is large for ~9 h solo | Strict P0 → P1 → P2 order; cut P2 first |
| Unverified phone lookup exposes reports | Demo-only; masked display; OTP listed as future work |

## 17. Future work
OTP verification, official login/roles, offline queue, WhatsApp/IVR channel (smallest.ai voice agents), real CWC/KSDMA gauge data, PostGIS, SMS status updates, multi-turn Ask, more languages.

---

## 18. Resolved review decisions (all made by you, 22 Nov)

| # | Question | Decision |
|---|---|---|
| D36 | Frontend package manager | **npm** |
| D37 | Voice clips | **Stored in Supabase Storage** (`report-audio` bucket); officials can replay them in the report drawer → add `audio_url` to `reports` and an audio player to the drawer |
| D38 | Photo URLs | **Public bucket** (`report-photos`) |
| D39 | Duplicate rule | **Same category, within 200 m, within 24 h** |
| D40 | Status transitions | **FR-13 as written; Resolved/Rejected can be reopened to Open** |
| D41 | Priorities | **§6 split confirmed** (Hindi/Tamil are P1) |
| D42 | Landing page | **Yes, P2** (only if time remains) |
| D43 | Data fetching | **TanStack Query** (`refetchInterval: 5000` for dashboard polling) |
| D44 | Review form | **Plain React state** |
| D45 | Backend config | **pydantic-settings** |
| D46 | Tunnel | **cloudflared** (quick tunnel to Next.js :3000) |
| D47 | Devin | **Tickets A (dashboard charts), B (4-language seed data), C (landing page)** as in §14 |
| D48 | STT language | **The chosen language is sent to Saaras as a hint** |
| D49 | Palette & fonts | **§10A approved as proposed** |
| D50 | Map tiles | ~~CARTO Positron / Dark Matter~~ → **revised: OpenStreetMap tiles with a muted CSS filter** (CARTO now requires an API key) |
| D51 | Category chips | **Lucide icons + label** |
| D52 | UI copy | **Claude drafts all strings in 4 languages; you or a local checks the Malayalam** |

### Location accuracy and speed (decided 22 Nov, 02:00)

| # | Question | Decision |
|---|---|---|
| D53 | No good GPS fix | **Never save a fake location.** Ask the user to turn location on; **Send stays locked** until there is a GPS fix ≤ 30 m or a pin the citizen placed |
| D54 | Auto-accept accuracy | **≤ 30 m**, from continuous GPS listening (`watchPosition`, best fix kept) |
| D55 | Review mini-map | **Always shown, pin draggable / tap to place**; "Location is correct" button for a rough fix |
| D56 | Store accuracy | **`location_accuracy_m` + `location_source` (gps / manual)** on reports; dashboard shows the accuracy circle and the source |
| D57 | Speed | **Quick wins applied:** Supabase uploads run in parallel with STT + AI, places cached in memory, GPS starts on page load (analyze ≈ 10 s → ≈ 4 s measured) |
| D58 | Streaming STT | **Keep record-then-upload** (D23) |
| D59 | Hosting | **Keep laptop + tunnel for the demo**; cloud deployment is post-hackathon work |

### Brand, theme and navigation (decided 22 Nov, 02:45)

| # | Question | Decision |
|---|---|---|
| D60 | Logo | **Hand-crafted SVG**: lamp flame (nilavilakku) over backwater waves; wordmark "കായൽ Kayal"; also the favicon and app icon |
| D61 | Tagline | **"Your voice. Our waters. Together."** |
| D62 | Preloader | **Nilavilakku lamp lighting**, CSS only, once per browser session, skipped for reduced motion |
| D63 | Theme | **Light/dark everywhere, follows the device, toggle remembered** (replaces D35) |
| D64 | Navigation | **Logo = Home everywhere**; Home · Citizen app · Panchayat console switcher in landing nav, citizen header and dashboard sidebar |
| D65 | Sidebar | **Collapses to an icon rail** with tooltips (Ctrl/Cmd + B), state remembered |
| D67 | Visual redesign (22 Nov, 02:55) | **Linear/Vercel precision**: hairline grids instead of floating rounded cards, numbered monospace section labels, tight headlines, colour only for meaning. Replaces the Kerala-earthy look of §10A |
| D68 | Colour scheme | **Backwater green `#1E5B3A` on off-white `#FAFAF7`**, ink `#111827`, monsoon orange `#E07A2E` for alerts / "open"; near-black dark theme; category colours re-tuned |
| D69 | Typography | **Geist + Geist Mono** (labels, numbers) with Noto for Malayalam, Hindi, Tamil |
| D66 | Welcoming | Time-of-day **greeting** on citizen home; **thank-you + "what happens next"** after sending; **help line** on every citizen page (helpline number via `NEXT_PUBLIC_HELPLINE`) |

No open questions remain.