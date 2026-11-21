"""Seed places, demo reports (7 days, 4 languages), simulated gauges and alerts.

Run from backend/:
  uv run python -m scripts.seed                     add data if tables are empty
  uv run python -m scripts.seed --reset             replace demo data (reports, alerts, gauges); places are kept
  uv run python -m scripts.seed --reset --keep 40   same, but keep report #40 (comma-separate several ids)

Places are never deleted on --reset, so their ids (and the API's in-memory place cache) stay valid.
"""
import random
import sys
from datetime import datetime, timedelta, timezone

from sqlalchemy import delete, select

from app.db import SessionLocal
from app.models import (Alert, Category, GaugeReading, GaugeStation, Place, Report, ReportStatus,
                        StatusEvent)

# name_en, name_ml, name_hi, name_ta, extra match terms, lat, lng  (coordinates approximate)
PLACES = [
    ("Alappuzha", "ആലപ്പുഴ", "आलप्पुझा", "ஆலப்புழா", ["alleppey", "ആലപ്പുഴ", "आलप्पुझा", "ஆலப்புழ"], 9.4981, 76.3388),
    ("Punnamada", "പുന്നമട", "पुन्नमडा", "புன்னமடா", ["punnamada", "പുന്നമട", "पुन्नमड", "புன்னமட"], 9.5106, 76.3536),
    ("Pallathuruthy", "പള്ളാത്തുരുത്തി", "पल्लाथुरुथी", "பள்ளாத்துருத்தி", ["pallathuruthi", "പള്ളാത്തുരുത്ത", "पल्लाथुरुथ", "பள்ளாத்துருத்த"], 9.4740, 76.3560),
    ("Kainakary", "കൈനകരി", "कैनकरी", "கைனகரி", ["kainakari", "കൈനകരി", "कैनकरी", "கைனகரி"], 9.4870, 76.3910),
    ("Nedumudi", "നെടുമുടി", "नेडुमुडी", "நெடுமுடி", ["നെടുമുട", "नेडुमुड", "நெடுமுட"], 9.4380, 76.4010),
    ("Champakulam", "ചമ്പക്കുളം", "चंपकुलम", "சம்பக்குளம்", ["champakkulam", "ചമ്പക്കുള", "चंपकुल", "சம்பக்குள"], 9.4130, 76.4130),
    ("Kavalam", "കാവാലം", "कावलम", "காவாலம்", ["കാവാല", "कावल", "காவால"], 9.4710, 76.4410),
    ("Pulinkunnu", "പുളിങ്കുന്ന്", "पुलिंकुन्नु", "புளிங்குன்னு", ["pulinkunnu", "പുളിങ്കുന്ന", "पुलिंकुन्न", "புளிங்குன்ன"], 9.4520, 76.4330),
    ("Mankombu", "മങ്കൊമ്പ്", "मंकोम्बु", "மங்கொம்பு", ["മങ്കൊമ്പ", "मंकोम्ब", "மங்கொம்ப"], 9.4320, 76.4280),
    ("Kuttanad", "കുട്ടനാട്", "कुट्टनाड", "குட்டநாடு", ["kuttanadu", "കുട്ടനാട", "कुट्टनाड", "குட்டநாட"], 9.4200, 76.4200),
]

# place, category, severity, language, summary_en, summary_local (also used as transcript), hours_ago, status
REPORTS = [
    # --- today / last 24 h ---
    ("Kainakary", "flooding", 4, "ml-IN", "Water entering houses on the low road, knee deep.", "താഴ്ന്ന റോഡിലെ വീടുകളിൽ മുട്ടോളം വെള്ളം കയറി.", 2, "open"),
    ("Kainakary", "water_hyacinth", 4, "ml-IN", "Thick water hyacinth blocking the canal; boats cannot pass.", "കനാലിൽ പോള നിറഞ്ഞ് വള്ളങ്ങൾക്ക് പോകാൻ കഴിയുന്നില്ല.", 3, "open"),
    ("Kavalam", "flooding", 5, "ml-IN", "Road cut off by flood water; elderly people stuck at home.", "വെള്ളപ്പൊക്കത്തിൽ റോഡ് മുങ്ങി, പ്രായമായവർ വീട്ടിൽ ഒറ്റപ്പെട്ടു.", 4, "in_progress"),
    ("Kainakary", "flooding", 3, "ml-IN", "Paddy bund leaking; water level rising slowly.", "പാടശേഖരത്തിന്റെ ബണ്ടിൽ ചോർച്ച, വെള്ളം പതുക്കെ ഉയരുന്നു.", 5, "open"),
    ("Punnamada", "plastic", 3, "hi-IN", "Plastic bottles piling up near the houseboat jetty.", "हाउसबोट जेट्टी के पास प्लास्टिक की बोतलों का ढेर लगा है।", 6, "open"),
    ("Mankombu", "flooding", 3, "ta-IN", "Water logging near the market; shops closed.", "மார்க்கெட் அருகே தண்ணீர் தேங்கியுள்ளது, கடைகள் மூடப்பட்டன.", 8, "open"),
    ("Kainakary", "water_hyacinth", 3, "ml-IN", "Weed spreading near the ferry point.", "ഫെറി കടവിന് സമീപം പോള പടരുന്നു.", 9, "in_progress"),
    ("Punnamada", "oil", 4, "en-IN", "Oil film on the water behind a houseboat.", "Oil film on the water behind a houseboat.", 12, "open"),
    ("Champakulam", "water_hyacinth", 3, "ml-IN", "Hyacinth covering the canal near the church.", "പള്ളിക്ക് സമീപത്തെ കനാൽ പോള മൂടി.", 15, "open"),
    ("Alappuzha", "plastic", 3, "ml-IN", "Canal near the beach road full of plastic.", "ബീച്ച് റോഡിന് സമീപത്തെ കനാലിൽ പ്ലാസ്റ്റിക് നിറഞ്ഞു.", 18, "open"),
    ("Nedumudi", "broken_jetty", 4, "ml-IN", "Jetty planks broken; unsafe for school children.", "ജെട്ടിയുടെ പലകകൾ തകർന്നു, സ്കൂൾ കുട്ടികൾക്ക് അപകടം.", 22, "in_progress"),
    # --- day 2 ---
    ("Pallathuruthy", "oil", 3, "hi-IN", "Diesel smell and rainbow sheen near the boat yard.", "बोट यार्ड के पास डीज़ल की गंध और पानी पर तेल की परत।", 28, "in_progress"),
    ("Pulinkunnu", "plastic", 2, "ta-IN", "Plastic covers stuck along the bank after rain.", "மழைக்குப் பிறகு கரையில் பிளாஸ்டிக் பைகள் சிக்கியுள்ளன.", 31, "resolved"),
    ("Kuttanad", "flooding", 4, "ml-IN", "Bund breach near the paddy field; pumping needed.", "പാടത്തിന് സമീപം ബണ്ട് പൊട്ടി, പമ്പിംഗ് വേണം.", 36, "in_progress"),
    ("Punnamada", "plastic", 2, "en-IN", "Food packets thrown into the lake by tourists.", "Food packets thrown into the lake by tourists.", 40, "resolved"),
    ("Champakulam", "plastic", 2, "ml-IN", "Plastic waste stuck along the bank after rain.", "മഴയ്ക്ക് ശേഷം കരയിൽ പ്ലാസ്റ്റിക് മാലിന്യം.", 44, "rejected"),
    # --- day 3 ---
    ("Kavalam", "water_hyacinth", 3, "ml-IN", "Weed mat near the boat stop; ferry delayed.", "ബോട്ട് സ്റ്റോപ്പിന് സമീപം പോള, ഫെറി വൈകുന്നു.", 52, "resolved"),
    ("Mankombu", "broken_jetty", 3, "hi-IN", "Jetty railing broken, risky at night.", "जेट्टी की रेलिंग टूटी है, रात में खतरा है।", 58, "open"),
    ("Pulinkunnu", "broken_jetty", 3, "ml-IN", "Jetty railing missing.", "ജെട്ടിയുടെ കൈവരി ഇല്ല.", 64, "resolved"),
    ("Kainakary", "other", 2, "ml-IN", "Street light near the canal not working.", "കനാലിന് സമീപത്തെ തെരുവുവിളക്ക് കത്തുന്നില്ല.", 70, "rejected"),
    # --- day 4 ---
    ("Alappuzha", "oil", 3, "ta-IN", "Black oil patches near the boat jetty.", "படகுத்துறை அருகே கருப்பு எண்ணெய் திட்டுகள்.", 78, "resolved"),
    ("Nedumudi", "water_hyacinth", 3, "ml-IN", "Hyacinth blocking the small canal to the school.", "സ്കൂളിലേക്കുള്ള ചെറിയ കനാൽ പോള മൂടി.", 86, "resolved"),
    ("Punnamada", "other", 2, "en-IN", "Loud speaker boats disturbing birds at night.", "Loud speaker boats disturbing birds at night.", 94, "rejected"),
    # --- day 5 ---
    ("Champakulam", "flooding", 3, "ml-IN", "Water on the road near the temple after rain.", "മഴയ്ക്ക് ശേഷം ക്ഷേത്രത്തിന് സമീപം റോഡിൽ വെള്ളം.", 104, "resolved"),
    ("Kuttanad", "plastic", 2, "hi-IN", "Plastic sacks floating in the canal.", "नहर में प्लास्टिक की बोरियाँ तैर रही हैं।", 112, "resolved"),
    ("Pallathuruthy", "water_hyacinth", 2, "ml-IN", "Small hyacinth patch near the resort.", "റിസോർട്ടിന് സമീപം ചെറിയ പോള കൂട്ടം.", 118, "resolved"),
    # --- day 6-7 ---
    ("Kavalam", "broken_jetty", 4, "ta-IN", "Jetty steps broken; elderly cannot board the boat.", "படகுத்துறை படிகள் உடைந்துள்ளன, முதியோர் ஏற முடியவில்லை.", 128, "resolved"),
    ("Kainakary", "plastic", 3, "ml-IN", "Plastic dumped near the canal bank.", "കനാൽ കരയിൽ പ്ലാസ്റ്റിക് മാലിന്യം തള്ളി.", 140, "resolved"),
    ("Alappuzha", "water_hyacinth", 2, "en-IN", "Hyacinth near the boat jetty.", "Hyacinth near the boat jetty.", 150, "resolved"),
    ("Mankombu", "oil", 3, "ml-IN", "Oil from a repair boat leaking into the canal.", "റിപ്പയർ ബോട്ടിൽ നിന്ന് എണ്ണ കനാലിലേക്ക് ഒഴുകുന്നു.", 160, "resolved"),
]
# Index (0-based) of a report that duplicates an earlier one -> index of the original.
DUPLICATES = {3: 0}

# name, lat, lng, warning_m, danger_m, start_m, rise_per_reading_m
GAUGES = [
    ("Nedumudi (demo)", 9.4395, 76.4030, 1.45, 1.75, 1.10, 0.025),
    ("Champakulam (demo)", 9.4145, 76.4150, 1.50, 1.80, 1.05, 0.015),
    ("Pallathuruthy (demo)", 9.4755, 76.3575, 1.40, 1.70, 0.95, 0.005),
    ("Thottappally spillway (demo)", 9.3170, 76.3830, 2.10, 2.50, 1.60, 0.010),
]

# place, title, message, radius_km, severity, hours_valid
ALERTS = [
    ("Kainakary", "Kainakary ferry suspended",
     "Ferry service to Kainakary is suspended until the water level drops. Use the road route.", 4, "warning", 24),
    ("Kavalam", "Flood warning: Kavalam",
     "Water is rising fast in Kavalam. Move elderly people and livestock to higher ground. Relief camp open at the school.", 3, "danger", 18),
    ("Punnamada", "Lake cleanup drive on Sunday",
     "Panchayat cleanup drive at Punnamada jetty, Sunday 7 am. Volunteers welcome; bags and gloves provided.", 2, "info", 72),
]


def parse_keep() -> set[int]:
    if "--keep" not in sys.argv:
        return set()
    i = sys.argv.index("--keep")
    return {int(x) for x in sys.argv[i + 1].split(",") if x.strip()} if i + 1 < len(sys.argv) else set()


def main(reset: bool, keep: set[int]):
    random.seed(7)
    now = datetime.now(timezone.utc)
    with SessionLocal() as db:
        if reset:
            drop = select(Report.id).where(Report.id.notin_(keep)) if keep else select(Report.id)
            # Clear duplicate links pointing at reports that are about to be deleted.
            for kept in db.scalars(select(Report).where(Report.id.in_(keep))):
                kept.possible_duplicate_of = None
                kept.duplicate_of = None
            db.flush()
            db.execute(delete(StatusEvent).where(StatusEvent.report_id.in_(drop)))
            db.execute(Report.__table__.update().where(Report.id.in_(drop)).values(possible_duplicate_of=None, duplicate_of=None))
            db.execute(delete(Report).where(Report.id.in_(drop)))
            for model in (Alert, GaugeReading, GaugeStation):
                db.execute(delete(model))
            db.commit()
            print(f"Removed demo/test data; kept reports: {sorted(keep) or 'none'}")

        if not db.scalar(select(Place.id).limit(1)):
            for en, ml, hi, ta, terms, lat, lng in PLACES:
                db.add(Place(name_en=en, name_ml=ml, name_hi=hi, name_ta=ta, match_terms=terms, lat=lat, lng=lng))
            db.commit()
        places = {p.name_en: p for p in db.scalars(select(Place))}

        demo_count = db.scalar(select(Report.id).where(Report.id.notin_(keep)).limit(1)) if keep else db.scalar(select(Report.id).limit(1))
        if not demo_count:
            created_ids: list[int] = []
            for i, (place, cat, sev, lang, en, local, hrs, status) in enumerate(REPORTS):
                p = places[place]
                created = now - timedelta(hours=hrs, minutes=random.randint(0, 50))
                manual = i % 7 == 3  # a few pins placed by hand, the rest GPS
                r = Report(
                    created_at=created, updated_at=created + timedelta(hours=2 if status != "open" else 0),
                    status=ReportStatus(status),
                    lat=p.lat + random.uniform(-0.003, 0.003), lng=p.lng + random.uniform(-0.003, 0.003),
                    location_source="manual" if manual else "gps",
                    location_accuracy_m=None if manual else round(random.uniform(4, 28), 1),
                    place_id=p.id, place_name=p.name_en, language=lang, transcript=local,
                    ai_category=Category(cat), category=Category(cat), severity=sev,
                    summary_en=en, summary_local=local,
                )
                db.add(r)
                db.flush()
                created_ids.append(r.id)
                db.add(StatusEvent(report_id=r.id, from_status=ReportStatus.draft, to_status=ReportStatus.open,
                                   note="Submitted", created_at=created))
                if status in ("resolved", "in_progress") and hrs > 6:
                    db.add(StatusEvent(report_id=r.id, from_status=ReportStatus.open, to_status=ReportStatus.in_progress,
                                       note="Panchayat team informed", created_at=created + timedelta(hours=1)))
                if status == "resolved":
                    db.add(StatusEvent(report_id=r.id, from_status=ReportStatus.in_progress, to_status=ReportStatus.resolved,
                                       note="Cleared by panchayat team", created_at=created + timedelta(hours=2)))
                if status == "rejected":
                    db.add(StatusEvent(report_id=r.id, from_status=ReportStatus.open, to_status=ReportStatus.rejected,
                                       note="Not a backwater issue / forwarded to KSEB", created_at=created + timedelta(hours=2)))
            for dup, orig in DUPLICATES.items():
                d = db.get(Report, created_ids[dup])
                d.possible_duplicate_of = created_ids[orig]
            db.commit()
            print(f"Seeded {len(REPORTS)} demo reports")

        if not db.scalar(select(GaugeStation.id).limit(1)):
            for name, lat, lng, warn, danger, start, rise in GAUGES:
                s = GaugeStation(name=name, lat=lat, lng=lng, warning_level_m=warn, danger_level_m=danger, is_demo=True)
                db.add(s)
                db.flush()
                for i in range(17):  # every 3 h for 48 h
                    level = start + rise * i + random.uniform(-0.01, 0.01)
                    db.add(GaugeReading(station_id=s.id, level_m=round(level, 2),
                                        recorded_at=now - timedelta(hours=48 - 3 * i)))
            db.commit()

        if not db.scalar(select(Alert.id).limit(1)):
            for place, title, message, radius, severity, hours in ALERTS:
                p = places[place]
                db.add(Alert(title=title, message=message, place_id=p.id, lat=p.lat, lng=p.lng, radius_km=radius,
                             severity=severity, expires_at=now + timedelta(hours=hours)))
            db.commit()
    print("Seed complete.")


if __name__ == "__main__":
    main(reset="--reset" in sys.argv, keep=parse_keep())
