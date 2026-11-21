# Kayal (കായൽ)

Multilingual voice and photo reporting for the Alappuzha backwaters. HackaThoni 2026.
Spec: [docs/PRD.md](docs/PRD.md) · Devin tasks: [docs/devin-tickets.md](docs/devin-tickets.md)

```
frontend/  Next.js 16 + shadcn/ui + TanStack Query + Leaflet   → http://localhost:3000
backend/   FastAPI + SQLAlchemy + Alembic (uv)                 → http://localhost:8000/docs
```

## Run locally

```powershell
# backend (first time: fill backend/.env, see below)
cd backend
uv sync
uv run alembic upgrade head
uv run python -m scripts.seed --reset
uv run uvicorn app.main:app --reload --port 8000
```

```powershell
# frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:3000/report (citizen) and http://localhost:3000/dashboard (panchayat).

## backend/.env

| Key | Notes |
|---|---|
| `SARVAM_API_KEY` | required |
| `SMALLEST_API_KEY` | TTS primary; Sarvam is used if empty |
| `DATABASE_URL` | Supabase **session pooler** URI with `postgresql+psycopg://` prefix. Empty = local SQLite (dev only) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` | Storage uploads (public buckets `report-photos`, `report-audio`). Empty = local `uploads/` (dev only) |
| `SMALLEST_VOICE_EN/HI/TA` | optional smallest.ai voice ids; Malayalam defaults to `parvathy` |

## Phone demo (HTTPS needed for mic + camera)

```powershell
cloudflared tunnel --url http://localhost:3000
```
Open the printed `https://….trycloudflare.com/report` on the phone.

## Smoke test

```powershell
cd backend; uv run python tests/smoke.py            # direct
$env:API="http://localhost:3000/api"; uv run python tests/smoke.py   # through the Next.js proxy
```
