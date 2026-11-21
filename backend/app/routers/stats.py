"""/api/stats and /api/places for the dashboard (FR-23)."""
from collections import Counter
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Alert, Place, Report, ReportStatus as S
from app.schemas import PlaceOut
from app.services.reports import ACTIVE, aware

router = APIRouter(prefix="/api", tags=["dashboard"])
IST = timezone(timedelta(hours=5, minutes=30))


@router.get("/stats")
def stats(db: Session = Depends(get_db)):
    reports = list(db.scalars(select(Report).where(Report.status != S.draft)))
    now = datetime.now(IST)
    today = now.date()
    active = [r for r in reports if r.status in ACTIVE]

    resolved_today = 0
    for r in reports:
        if r.status == S.resolved and aware(r.updated_at).astimezone(IST).date() == today:
            resolved_today += 1

    hotspots = Counter((r.place_name, r.category.value) for r in active)
    days = [(today - timedelta(days=i)) for i in range(6, -1, -1)]
    per_day = Counter(aware(r.created_at).astimezone(IST).date() for r in reports)
    by_cat_day = Counter((aware(r.created_at).astimezone(IST).date(), r.category.value) for r in reports)

    alerts_active = sum(1 for a in db.scalars(select(Alert).where(Alert.active.is_(True)))
                        if a.expires_at is None or aware(a.expires_at) > datetime.now(timezone.utc))

    return {
        "total": len(reports),
        "open": sum(r.status == S.open for r in reports),
        "in_progress": sum(r.status == S.in_progress for r in reports),
        "resolved_today": resolved_today,
        "active_alerts": alerts_active,
        "by_status": dict(Counter(r.status.value for r in reports)),
        "by_category": dict(Counter(r.category.value for r in active)),
        "hotspots": [{"place": p, "category": c, "count": n}
                     for (p, c), n in hotspots.most_common() if n >= 2],
        "daily": [{"date": d.isoformat(), "count": per_day.get(d, 0),
                   **{c: by_cat_day.get((d, c), 0) for c in
                      ("plastic", "water_hyacinth", "oil", "flooding", "broken_jetty", "other")}}
                  for d in days],
    }


@router.get("/places", response_model=list[PlaceOut])
def places(db: Session = Depends(get_db)):
    return list(db.scalars(select(Place).order_by(Place.name_en)))
