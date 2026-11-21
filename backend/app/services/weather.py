"""Rain forecast from Open-Meteo (free, no key)."""
import logging
from datetime import datetime, timedelta, timezone

import httpx

log = logging.getLogger("kayal.weather")
IST = timezone(timedelta(hours=5, minutes=30))


def rain_next_hours(lat: float, lng: float, hours: int = 12) -> float | None:
    try:
        r = httpx.get("https://api.open-meteo.com/v1/forecast", timeout=5, params={
            "latitude": lat, "longitude": lng, "hourly": "precipitation",
            "forecast_days": 2, "timezone": "Asia/Kolkata"})
        values = r.json()["hourly"]["precipitation"]
        start = datetime.now(IST).hour  # list starts at 00:00 today IST
        return round(sum(v or 0 for v in values[start:start + hours]), 1)
    except Exception as e:
        log.warning("rain lookup failed: %s", e)
        return None
