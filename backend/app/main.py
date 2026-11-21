"""Kayal API.

Run (from backend/):   uv run uvicorn app.main:app --reload --port 8000
Interactive docs:      http://localhost:8000/docs
"""
import logging
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.config import settings
from app.db import SessionLocal
from app.routers import alerts, ask, gauges, reports, stats
from app.services.storage import LOCAL_DIR

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")

app = FastAPI(title="Kayal API", description="Multilingual voice + photo reporting for the Alappuzha backwaters")

app.include_router(reports.router)
app.include_router(ask.router)
app.include_router(alerts.router)
app.include_router(gauges.router)
app.include_router(stats.router)

# Local-dev file fallback only (Supabase Storage is used when configured).
LOCAL_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=Path(LOCAL_DIR)), name="uploads")


@app.get("/api/health")
def health():
    try:
        with SessionLocal() as db:
            db.execute(text("select 1"))
        db_ok = True
    except Exception:
        db_ok = False
    return {
        "ok": db_ok,
        "db": "supabase" if not settings.database_url.startswith("sqlite") else "sqlite (dev)",
        "db_ok": db_ok,
        "storage": "supabase" if settings.supabase_url else "local (dev)",
        "sarvam": bool(settings.sarvam_api_key),
        "smallest": bool(settings.smallest_api_key),
    }
