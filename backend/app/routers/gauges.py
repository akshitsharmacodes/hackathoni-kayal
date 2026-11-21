"""/api/gauges: simulated river gauge readings (D21, always flagged is_demo)."""
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db import get_db
from app.models import GaugeStation
from app.schemas import GaugeOut
from app.services.reports import aware

router = APIRouter(prefix="/api/gauges", tags=["gauges"])


def gauge_out(s: GaugeStation) -> GaugeOut:
    latest = s.readings[-1] if s.readings else None
    level = latest.level_m if latest else None
    state = ("unknown" if level is None else "danger" if level >= s.danger_level_m
             else "warning" if level >= s.warning_level_m else "normal")
    return GaugeOut(
        id=s.id, name=s.name, lat=s.lat, lng=s.lng, level_m=level,
        recorded_at=latest.recorded_at if latest else None,
        warning_level_m=s.warning_level_m, danger_level_m=s.danger_level_m,
        state=state, is_demo=s.is_demo,
        history=[{"t": aware(r.recorded_at), "level_m": r.level_m} for r in s.readings[-16:]],
    )


@router.get("", response_model=list[GaugeOut])
def list_gauges(db: Session = Depends(get_db)):
    return [gauge_out(s) for s in db.scalars(select(GaugeStation).options(selectinload(GaugeStation.readings)))]
