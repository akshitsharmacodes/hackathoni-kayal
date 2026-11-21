"""/api/ask: one-shot voice question → spoken answer (FR-15..18)."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Alert, GaugeStation
from app.routers.gauges import gauge_out
from app.routers.reports import read_upload, upstream
from app.schemas import AskOut, AskSources, Language
from app.services import sarvam, tts
from app.services.geo import distance_km, find_place_in_text, local_name, nearest_place
from app.services.reports import aware, reports_near
from app.services.weather import rain_next_hours

router = APIRouter(prefix="/api", tags=["ask"])
DEFAULT = (9.4981, 76.3388)  # Alappuzha town


@router.post("/ask", response_model=AskOut)
def ask(
    language: Language = Form("ml-IN"),
    text: str = Form(""),
    lat: float | None = Form(None),
    lng: float | None = Form(None),
    audio: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    audio_in = read_upload(audio)
    question = text.strip()
    if audio_in:
        question, _ = upstream("Speech recognition", sarvam.transcribe, *audio_in, language)
    if not question:
        raise HTTPException(400, "Please ask a question.")

    place = find_place_in_text(db, question) or (nearest_place(db, lat, lng) if lat is not None and lng is not None else None)
    plat, plng = (place.lat, place.lng) if place else ((lat, lng) if lat is not None else DEFAULT)
    place_label = local_name(place, language, "Alappuzha")

    # (a) nearby citizen reports
    near = reports_near(db, plat, plng, km=5, hours=48)
    now = datetime.now(timezone.utc)
    reports_ctx = [{
        "category": r.category.value, "severity": r.severity, "status": r.status.value,
        "summary": r.summary_en, "place": r.place_name, "km_away": round(d, 1),
        "hours_ago": round((now - aware(r.created_at)).total_seconds() / 3600, 1),
    } for r, d in near[:15]]

    # (b) rain forecast
    rain = rain_next_hours(plat, plng)

    # (c) official alerts covering this place
    alerts = [a for a in db.scalars(select(Alert).where(Alert.active.is_(True)))
              if (a.expires_at is None or aware(a.expires_at) > now)
              and distance_km(plat, plng, a.lat, a.lng) <= a.radius_km]

    # (d) river gauges within 10 km (demo data)
    gauges = [gauge_out(s) for s in db.scalars(select(GaugeStation))
              if distance_km(plat, plng, s.lat, s.lng) <= 10]
    gauges_ctx = [{"station": g.name, "level_m": g.level_m, "warning_m": g.warning_level_m,
                   "danger_m": g.danger_level_m, "state": g.state, "simulated": True} for g in gauges]

    context = {
        "place": place.name_en if place else "Alappuzha",
        "citizen_reports_last_48h_within_5km": reports_ctx,
        "rain_forecast_next_12h_mm": rain,
        "official_alerts": [{"title": a.title, "message": a.message, "severity": a.severity} for a in alerts],
        "river_gauges_demo_data": gauges_ctx,
    }
    reply = upstream("Answering", sarvam.answer, question, language, context)
    try:
        audio_b64 = tts.speak(reply, language)
    except Exception:
        audio_b64 = ""

    return AskOut(
        question=question, language=language, place=place_label, answer=reply, answer_audio=audio_b64,
        sources=AskSources(reports=len(near), rain_mm_12h=rain, alerts=[a.title for a in alerts],
                           gauges=[{"name": g.name, "level_m": g.level_m, "state": g.state} for g in gauges]),
    )
