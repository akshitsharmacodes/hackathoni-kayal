"""Report rules: status transitions (FR-13), duplicate suggestions (FR-11, D39), time helpers."""
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Report, ReportStatus as S
from app.services.geo import distance_km

# FR-13 + D40: resolved / rejected can be reopened.
TRANSITIONS: dict[S, set[S]] = {
    S.open: {S.in_progress, S.resolved, S.rejected, S.duplicate},
    S.in_progress: {S.resolved, S.rejected, S.duplicate, S.open},
    S.resolved: {S.open},
    S.rejected: {S.open},
    S.duplicate: set(),
    S.draft: set(),
}

ACTIVE = (S.open, S.in_progress)
DUP_RADIUS_KM = 0.2
DUP_WINDOW = timedelta(hours=24)


def aware(dt: datetime) -> datetime:
    """SQLite returns naive datetimes; Postgres returns aware ones. Treat naive as UTC."""
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def find_possible_duplicate(db: Session, report: Report) -> Report | None:
    cutoff = datetime.now(timezone.utc) - DUP_WINDOW
    candidates = db.scalars(select(Report).where(
        Report.id != report.id,
        Report.category == report.category,
        Report.status.in_(ACTIVE),
        Report.created_at >= cutoff,
    ))
    best, best_d = None, DUP_RADIUS_KM
    for c in candidates:
        d = distance_km(report.lat, report.lng, c.lat, c.lng)
        if d <= best_d:
            best, best_d = c, d
    return best


def reports_near(db: Session, lat: float, lng: float, km: float, hours: int) -> list[tuple[Report, float]]:
    cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)
    rows = db.scalars(select(Report).where(
        Report.status.notin_((S.draft, S.rejected)), Report.created_at >= cutoff))
    out = [(r, distance_km(lat, lng, r.lat, r.lng)) for r in rows]
    return sorted([x for x in out if x[1] <= km], key=lambda x: x[1])
