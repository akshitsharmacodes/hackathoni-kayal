"""Places, distances and phone helpers."""
import math
import re

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Place


def distance_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Haversine distance in km."""
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = math.radians(lat2 - lat1), math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * 6371 * math.asin(math.sqrt(a))


def all_places(db: Session) -> list[Place]:
    return list(db.scalars(select(Place)))


def nearest_place(db: Session, lat: float, lng: float) -> Place | None:
    places = all_places(db)
    return min(places, key=lambda p: distance_km(lat, lng, p.lat, p.lng)) if places else None


def find_place_in_text(db: Session, *texts: str) -> Place | None:
    """Match any known spelling (any language) inside the given texts."""
    hay = " ".join(t for t in texts if t).lower()
    if not hay:
        return None
    for p in all_places(db):
        for term in [p.name_en, *(p.match_terms or [])]:
            if term and term.lower() in hay:
                return p
    return None


def local_name(place: Place | None, language: str, fallback: str = "") -> str:
    if place is None:
        return fallback
    return {"ml-IN": place.name_ml, "hi-IN": place.name_hi, "ta-IN": place.name_ta}.get(language, place.name_en)


def normalize_phone(raw: str | None) -> str | None:
    """'98470 12345' -> '+919847012345'. Returns None if it doesn't look like a phone number."""
    if not raw:
        return None
    digits = re.sub(r"\D", "", raw)
    if len(digits) == 10:
        return "+91" + digits
    if len(digits) == 12 and digits.startswith("91"):
        return "+" + digits
    return None


def mask_phone(phone: str | None) -> str | None:
    if not phone:
        return None
    return phone[:5] + "•" * (len(phone) - 8) + phone[-3:]
