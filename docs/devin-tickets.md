# Devin tickets (D47): paste one at a time into Devin

Shared context for every ticket:
- Repo: monorepo. `frontend/` = Next.js 16 App Router + shadcn/ui (**Base UI flavour: use the `render` prop, not `asChild`**) + Tailwind v4 + TanStack Query. `backend/` = FastAPI + SQLAlchemy + Alembic (uv).
- Read `docs/PRD.md` §10A (design system) and §13 (API). Read `frontend/AGENTS.md`: Next.js 16 differs from older versions, so check `frontend/node_modules/next/dist/docs/` before using any Next API.
- Design: Kerala earthy palette, which is already in `frontend/app/globals.css` as CSS variables. Category colours are in `frontend/lib/kayal.ts` (`CATEGORIES`). Use them; never hard-code new colours. Keep it calm: hairline borders, no heavy shadows, `tabular` class for numbers.
- **Do not** touch `.env` files, `backend/app/services/*`, `frontend/app/(citizen)/*`, or `frontend/lib/api.ts` types (except where a ticket says so).
- Done = `cd frontend && npx tsc --noEmit` passes, plus the ticket's own criteria. Open a branch `devin/<ticket>`, never push to main.

---

## Ticket A: Insights charts (dashboard)
**Files you may edit/create:** `frontend/app/dashboard/insights/page.tsx`, `frontend/components/dashboard/insights/*`.
**Data:** `GET /api/stats` (TanStack hook `useStats()` in `frontend/hooks/use-dashboard.ts`). Shape: `Stats` in `frontend/lib/api.ts` (`daily[]` has `date`, `count` and one count per category; `by_category`, `by_status`, `hotspots[]`).
**Build** with shadcn `chart` (`frontend/components/ui/chart.tsx`, Recharts):
1. Stacked bar chart: reports per day for the last 7 days, stacked by category (category colours).
2. Horizontal bar: active reports by category.
3. Donut or bar: reports by status.
4. Table/list: top hotspots (place · category · count).
Layout: 2×2 grid of cards on ≥1280 px, single column on mobile; each card has a small uppercase label, a big number and the chart. Light and dark mode must both look right (toggle in the sidebar).
**Done when:** `/dashboard/insights` renders all four with live data, and there are no console errors.

## Ticket B: Seed content in 4 languages
**Files:** `backend/scripts/seed.py` only.
1. Grow `REPORTS` from 15 to ~30 realistic Alappuzha/Kuttanad reports spread over the last 7 days, across all 6 categories and all statuses. Some should be in Hindi or Tamil (`language` `hi-IN` / `ta-IN`, with `summary_local` in that language and `transcript` matching).
2. Add 2 more alerts (one `danger` flood alert in Kavalam, one `info` cleanup-drive alert in Punnamada).
3. Keep coordinates within ~600 m of each place's centre (water/canal-side, not inland).
**Run:** `cd backend && uv run python -m scripts.seed --reset`. **Done when:** it runs cleanly, `/dashboard` shows ~30 pins, and the Insights daily chart has a bar on all 7 days.

## Ticket C: Pitch landing page (P2)
**Files:** `frontend/app/page.tsx`, `frontend/components/landing/*`. Magic UI / Aceternity components are allowed **only here** (D32). Install via their shadcn registry commands.
**Sections:** hero ("കായൽ Kayal · Speak up for the backwaters" + subtle animated water/wave background), a 3-step "Speak · Snap · Solved" strip, live numbers from `GET /api/stats` (number ticker), a marquee of the 4 languages (മലയാളം · हिन्दी · தமிழ் · English), and two CTAs: **Citizen app** → `/report`, **Panchayat console** → `/dashboard`. Credits: Sarvam AI, smallest.ai, Devin, TinkerHub.
**Done when:** it loads in < 2 s on a laptop, looks good at 375 px and 1440 px, and uses the earthy palette (no purple gradients).
