"""/api/alerts: official alerts posted from the dashboard (FR-20)."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Alert, Place
from app.schemas import AlertIn, AlertOut, AlertPatch

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("", response_model=list[AlertOut])
def list_alerts(db: Session = Depends(get_db)):
    return list(db.scalars(select(Alert).order_by(Alert.created_at.desc())))


@router.post("", response_model=AlertOut, status_code=201)
def create_alert(body: AlertIn, db: Session = Depends(get_db)):
    lat, lng = body.lat, body.lng
    if body.place_id:
        place = db.get(Place, body.place_id)
        if place is None:
            raise HTTPException(400, "Unknown place")
        lat, lng = place.lat, place.lng
    if lat is None or lng is None:
        raise HTTPException(400, "Choose a place or give coordinates")
    alert = Alert(**body.model_dump(exclude={"lat", "lng"}), lat=lat, lng=lng)
    db.add(alert)
    db.commit()
    return alert


@router.patch("/{alert_id}", response_model=AlertOut)
def update_alert(alert_id: int, body: AlertPatch, db: Session = Depends(get_db)):
    alert = db.get(Alert, alert_id)
    if alert is None:
        raise HTTPException(404, "No such alert")
    alert.active = body.active
    db.commit()
    return alert
