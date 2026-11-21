"""SQLAlchemy models = the database tables (PRD §12)."""
import enum
from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, DateTime, Enum, Float, ForeignKey, Integer, SmallInteger, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


def utcnow():
    return datetime.now(timezone.utc)


class ReportStatus(str, enum.Enum):
    draft = "draft"
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    rejected = "rejected"
    duplicate = "duplicate"


class Category(str, enum.Enum):
    plastic = "plastic"
    water_hyacinth = "water_hyacinth"
    oil = "oil"
    flooding = "flooding"
    broken_jetty = "broken_jetty"
    other = "other"


# native_enum=False stores enums as short strings: simpler migrations, same safety via Python.
StatusCol = Enum(ReportStatus, native_enum=False, length=20)
CategoryCol = Enum(Category, native_enum=False, length=20)


class Place(Base):
    __tablename__ = "places"
    id: Mapped[int] = mapped_column(primary_key=True)
    name_en: Mapped[str] = mapped_column(String(80))
    name_ml: Mapped[str] = mapped_column(String(80))
    name_hi: Mapped[str] = mapped_column(String(80))
    name_ta: Mapped[str] = mapped_column(String(80))
    match_terms: Mapped[list] = mapped_column(JSON, default=list)  # spellings to find in speech
    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)


class Report(Base):
    __tablename__ = "reports"
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
    status: Mapped[ReportStatus] = mapped_column(StatusCol, default=ReportStatus.draft, index=True)

    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)
    # D56: how trustworthy the pin is. source: gps | manual (citizen placed the pin) | none (draft only)
    location_accuracy_m: Mapped[float | None] = mapped_column(Float)
    location_source: Mapped[str] = mapped_column(String(10), default="gps")
    place_id: Mapped[int | None] = mapped_column(ForeignKey("places.id"))
    place_name: Mapped[str] = mapped_column(String(80), default="")

    language: Mapped[str] = mapped_column(String(8), default="ml-IN")
    transcript: Mapped[str] = mapped_column(Text, default="")
    ai_category: Mapped[Category] = mapped_column(CategoryCol, default=Category.other)
    category: Mapped[Category] = mapped_column(CategoryCol, default=Category.other, index=True)
    category_corrected: Mapped[bool] = mapped_column(Boolean, default=False)
    severity: Mapped[int] = mapped_column(SmallInteger, default=3)
    summary_en: Mapped[str] = mapped_column(Text, default="")
    summary_local: Mapped[str] = mapped_column(Text, default="")

    photo_url: Mapped[str | None] = mapped_column(Text)
    audio_url: Mapped[str | None] = mapped_column(Text)
    reporter_phone: Mapped[str | None] = mapped_column(String(20), index=True)

    possible_duplicate_of: Mapped[int | None] = mapped_column(ForeignKey("reports.id"))
    duplicate_of: Mapped[int | None] = mapped_column(ForeignKey("reports.id"))

    events: Mapped[list["StatusEvent"]] = relationship(
        back_populates="report", order_by="StatusEvent.created_at", cascade="all, delete-orphan")


class StatusEvent(Base):
    __tablename__ = "status_events"
    id: Mapped[int] = mapped_column(primary_key=True)
    report_id: Mapped[int] = mapped_column(ForeignKey("reports.id"), index=True)
    from_status: Mapped[ReportStatus | None] = mapped_column(StatusCol)
    to_status: Mapped[ReportStatus] = mapped_column(StatusCol)
    note: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    report: Mapped[Report] = relationship(back_populates="events")


class Alert(Base):
    __tablename__ = "alerts"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120))
    message: Mapped[str] = mapped_column(Text)
    place_id: Mapped[int | None] = mapped_column(ForeignKey("places.id"))
    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)
    radius_km: Mapped[float] = mapped_column(Float, default=5)
    severity: Mapped[str] = mapped_column(String(10), default="warning")  # info | warning | danger
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class GaugeStation(Base):
    __tablename__ = "gauge_stations"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)
    warning_level_m: Mapped[float] = mapped_column(Float)
    danger_level_m: Mapped[float] = mapped_column(Float)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True)  # D21: always labelled demo data
    readings: Mapped[list["GaugeReading"]] = relationship(order_by="GaugeReading.recorded_at")


class GaugeReading(Base):
    __tablename__ = "gauge_readings"
    id: Mapped[int] = mapped_column(primary_key=True)
    station_id: Mapped[int] = mapped_column(ForeignKey("gauge_stations.id"), index=True)
    level_m: Mapped[float] = mapped_column(Float)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
