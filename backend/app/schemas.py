"""Pydantic schemas = the JSON shapes the API accepts and returns (PRD §13)."""
from datetime import datetime, timezone
from typing import Annotated, Literal

from pydantic import AfterValidator, BaseModel, ConfigDict, Field

from app.models import Category, ReportStatus

Language = Literal["ml-IN", "en-IN", "hi-IN", "ta-IN"]

# Always send timezone-aware UTC timestamps (SQLite in dev returns naive ones).
UTC = Annotated[datetime, AfterValidator(lambda d: d if d.tzinfo else d.replace(tzinfo=timezone.utc))]


class ORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # lets us return SQLAlchemy objects directly


class StatusEventOut(ORM):
    id: int
    from_status: ReportStatus | None
    to_status: ReportStatus
    note: str
    created_at: UTC


class ReportOut(ORM):
    id: int
    created_at: UTC
    updated_at: UTC
    status: ReportStatus
    lat: float
    lng: float
    place_name: str
    language: str
    transcript: str
    ai_category: Category
    category: Category
    category_corrected: bool
    severity: int
    summary_en: str
    summary_local: str
    photo_url: str | None
    audio_url: str | None
    reporter_phone: str | None  # masked before sending (NFR-5)
    possible_duplicate_of: int | None
    duplicate_of: int | None


class ReportDetail(ReportOut):
    events: list[StatusEventOut]
    duplicate_count: int


class AnalyzeOut(BaseModel):
    draft_id: int
    transcript: str
    language: str
    ai_category: Category
    severity: int
    place_name: str
    summary_local: str
    summary_en: str
    photo_url: str | None


class SubmitIn(BaseModel):
    category: Category
    phone: str | None = None


class SubmitOut(BaseModel):
    report: ReportOut
    possible_duplicate_of: int | None
    reply_text: str
    reply_audio: str  # base64 WAV


class StatusIn(BaseModel):
    status: ReportStatus
    note: str = ""
    duplicate_of: int | None = None


class AskSources(BaseModel):
    reports: int
    rain_mm_12h: float | None
    alerts: list[str]
    gauges: list[dict]


class AskOut(BaseModel):
    question: str
    language: str
    place: str
    answer: str
    answer_audio: str
    sources: AskSources


class AlertIn(BaseModel):
    title: str
    message: str
    place_id: int | None = None
    lat: float | None = None
    lng: float | None = None
    radius_km: float = 5
    severity: Literal["info", "warning", "danger"] = "warning"
    expires_at: datetime | None = None


class AlertOut(ORM):
    id: int
    title: str
    message: str
    place_id: int | None
    lat: float
    lng: float
    radius_km: float
    severity: str
    active: bool
    created_at: UTC
    expires_at: UTC | None


class AlertPatch(BaseModel):
    active: bool


class GaugeOut(BaseModel):
    id: int
    name: str
    lat: float
    lng: float
    level_m: float | None
    recorded_at: UTC | None
    warning_level_m: float
    danger_level_m: float
    state: Literal["normal", "warning", "danger", "unknown"]
    is_demo: bool
    history: list[dict] = Field(default_factory=list)


class PlaceOut(ORM):
    id: int
    name_en: str
    name_ml: str
    name_hi: str
    name_ta: str
    lat: float
    lng: float
