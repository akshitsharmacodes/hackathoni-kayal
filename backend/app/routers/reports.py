"""/api/reports: analyse → submit → track → manage (PRD §13)."""
import logging
import os
from datetime import datetime

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from sarvamai.errors import BadRequestError
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.config import settings
from app.db import get_db
from app.models import Category, Place, Report, ReportStatus, StatusEvent
from app.schemas import AnalyzeOut, Language, ReportDetail, ReportOut, StatusIn, SubmitIn, SubmitOut
from app.services import sarvam, storage, tts
from app.services.geo import find_place_in_text, local_name, mask_phone, nearest_place, normalize_phone
from app.services.messages import confirmation
from app.services.reports import TRANSITIONS, find_possible_duplicate

router = APIRouter(prefix="/api/reports", tags=["reports"])
log = logging.getLogger("kayal.reports")


def to_out(r: Report, model=ReportOut, **extra):
    out = model.model_validate({**{k: getattr(r, k) for k in ReportOut.model_fields}, **extra})
    out.reporter_phone = mask_phone(r.reporter_phone)  # NFR-5
    return out


def upstream(what: str, fn, *args):
    """Run an AI call; turn failures into a friendly 502 (PRD §13 errors)."""
    try:
        return fn(*args)
    except BadRequestError as e:  # Sarvam rejected the input (e.g. audio too long / unreadable)
        log.warning("%s rejected input: %s", what, getattr(e, "body", e))
        raise HTTPException(400, "We could not understand that recording. Please speak for under 25 seconds and try again.") from e
    except Exception as e:
        log.exception("%s failed", what)
        raise HTTPException(502, f"{what} is not responding right now. Please try again.") from e


def read_upload(f: UploadFile | None) -> tuple[bytes, str, str] | None:
    if f is None or not f.filename:
        return None
    data = f.file.read()
    # Phones send e.g. "audio/webm;codecs=opus"; Sarvam only accepts the bare type ("audio/webm").
    content_type = (f.content_type or "application/octet-stream").split(";")[0].strip().lower()
    return (data, f.filename, content_type) if data else None


# ---------- 1. Analyse (creates a draft) ----------
@router.post("/analyze", response_model=AnalyzeOut)
def analyze(
    lat: float = Form(...),
    lng: float = Form(...),
    language: Language = Form("ml-IN"),
    text: str = Form(""),
    audio: UploadFile | None = File(None),
    photo: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    audio_in, photo_in = read_upload(audio), read_upload(photo)
    if not (audio_in or photo_in or text.strip()):
        raise HTTPException(400, "Send a voice note, a photo or some text.")

    transcript = text.strip()
    if audio_in:
        transcript, _ = upstream("Speech recognition", sarvam.transcribe, *audio_in, language)
    info = upstream("Report analysis", sarvam.classify, transcript, photo_in[0] if photo_in else None, language)

    photo_url = storage.upload(settings.photo_bucket, photo_in[0], ".jpg", "image/jpeg") if photo_in else None
    audio_url = None
    if audio_in:
        ext = os.path.splitext(audio_in[1])[1] or ".webm"
        audio_url = storage.upload(settings.audio_bucket, audio_in[0], ext, audio_in[2])

    place = find_place_in_text(db, transcript, info["place"]) or nearest_place(db, lat, lng)
    report = Report(
        status=ReportStatus.draft, lat=lat, lng=lng,
        place_id=place.id if place else None,
        place_name=place.name_en if place else (info["place"] or "Alappuzha"),
        language=language, transcript=transcript,
        ai_category=Category(info["category"]), category=Category(info["category"]),
        severity=info["severity"], summary_en=info["summary_en"], summary_local=info["summary_local"],
        photo_url=photo_url, audio_url=audio_url,
    )
    db.add(report)
    db.commit()

    return AnalyzeOut(
        draft_id=report.id, transcript=transcript, language=language,
        ai_category=report.ai_category, severity=report.severity,
        place_name=local_name(place, language, report.place_name),
        summary_local=report.summary_local, summary_en=report.summary_en, photo_url=photo_url,
    )


# ---------- 2. Submit (citizen confirmed / corrected the category) ----------
@router.post("/{report_id}/submit", response_model=SubmitOut)
def submit(report_id: int, body: SubmitIn, db: Session = Depends(get_db)):
    r = db.get(Report, report_id)
    if r is None:
        raise HTTPException(404, "No such report")
    if r.status != ReportStatus.draft:
        raise HTTPException(409, "This report was already sent")

    if body.phone:
        phone = normalize_phone(body.phone)
        if phone is None:
            raise HTTPException(400, "Please enter a 10-digit mobile number")
        r.reporter_phone = phone

    r.category = body.category
    r.category_corrected = body.category != r.ai_category
    r.status = ReportStatus.open
    db.add(StatusEvent(report_id=r.id, from_status=ReportStatus.draft, to_status=ReportStatus.open, note="Submitted"))
    dup = find_possible_duplicate(db, r)
    r.possible_duplicate_of = dup.id if dup else None
    db.commit()

    place = db.get(Place, r.place_id) if r.place_id else None
    text = confirmation(r.language, r.id, r.category.value, local_name(place, r.language, r.place_name))
    try:
        audio = tts.speak(text, r.language)
    except Exception:
        log.exception("TTS failed")
        audio = ""  # the screen still shows the text
    return SubmitOut(report=to_out(r), possible_duplicate_of=r.possible_duplicate_of, reply_text=text, reply_audio=audio)


# ---------- 3. Lists ----------
@router.get("", response_model=list[ReportOut])
def list_reports(
    since: datetime | None = None,
    status: ReportStatus | None = None,
    category: Category | None = None,
    date_from: datetime | None = Query(None, alias="from"),
    date_to: datetime | None = Query(None, alias="to"),
    db: Session = Depends(get_db),
):
    q = select(Report).where(Report.status != ReportStatus.draft)
    if since:
        q = q.where(Report.updated_at >= since)
    if status:
        q = q.where(Report.status == status)
    if category:
        q = q.where(Report.category == category)
    if date_from:
        q = q.where(Report.created_at >= date_from)
    if date_to:
        q = q.where(Report.created_at <= date_to)
    return [to_out(r) for r in db.scalars(q.order_by(Report.created_at.desc()).limit(500))]


@router.get("/mine", response_model=list[ReportDetail])
def my_reports(phone: str, db: Session = Depends(get_db)):
    p = normalize_phone(phone)
    if p is None:
        raise HTTPException(400, "Please enter a 10-digit mobile number")
    rows = db.scalars(select(Report).options(selectinload(Report.events))
                      .where(Report.reporter_phone == p, Report.status != ReportStatus.draft)
                      .order_by(Report.created_at.desc()))
    return [to_out(r, ReportDetail, events=r.events, duplicate_count=0) for r in rows]


@router.get("/{report_id}", response_model=ReportDetail)
def get_report(report_id: int, db: Session = Depends(get_db)):
    r = db.get(Report, report_id, options=[selectinload(Report.events)])
    if r is None or r.status == ReportStatus.draft:
        raise HTTPException(404, "No such report")
    dup_count = db.scalar(select(func.count()).where(Report.duplicate_of == r.id)) or 0
    return to_out(r, ReportDetail, events=r.events, duplicate_count=dup_count)


# ---------- 4. Official changes status ----------
@router.patch("/{report_id}/status", response_model=ReportOut)
def change_status(report_id: int, body: StatusIn, db: Session = Depends(get_db)):
    r = db.get(Report, report_id)
    if r is None or r.status == ReportStatus.draft:
        raise HTTPException(404, "No such report")
    if body.status not in TRANSITIONS[r.status]:
        raise HTTPException(409, f"Cannot move a report from {r.status.value} to {body.status.value}")

    if body.status == ReportStatus.duplicate:
        original = db.get(Report, body.duplicate_of) if body.duplicate_of else None
        if original is None or original.id == r.id:
            raise HTTPException(400, "Choose the original report this duplicates")
        r.duplicate_of = original.id
    elif body.status == ReportStatus.open:
        r.duplicate_of = None

    db.add(StatusEvent(report_id=r.id, from_status=r.status, to_status=body.status, note=body.note))
    r.status = body.status
    db.commit()
    return to_out(r)
