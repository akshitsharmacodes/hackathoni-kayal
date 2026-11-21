"""Seed places, demo reports, simulated gauges and one alert.

Run from backend/:   uv run python -m scripts.seed            (adds data if tables are empty)
                     uv run python -m scripts.seed --reset    (wipes reports/alerts/gauges first)
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

# place, category, severity, summary_en, summary_ml, hours_ago, status
REPORTS = [
    ("Kainakary", "water_hyacinth", 4, "Thick water hyacinth blocking the canal; boats cannot pass.", "കനാലിൽ പോള നിറഞ്ഞ് വള്ളങ്ങൾക്ക് പോകാൻ കഴിയുന്നില്ല.", 3, "open"),
    ("Kainakary", "water_hyacinth", 3, "Weed spreading near the ferry point.", "ഫെറി കടവിന് സമീപം പോള പടരുന്നു.", 9, "in_progress"),
    ("Kainakary", "flooding", 4, "Water entering houses on the low road, knee deep.", "താഴ്ന്ന റോഡിലെ വീടുകളിൽ മുട്ടോളം വെള്ളം കയറി.", 2, "open"),
    ("Kainakary", "flooding", 3, "Paddy bund leaking; water level rising slowly.", "പാടശേഖരത്തിന്റെ ബണ്ടിൽ ചോർച്ച, വെള്ളം ഉയരുന്നു.", 5, "open"),
    ("Punnamada", "plastic", 3, "Plastic bottles piling up near the houseboat jetty.", "ഹൗസ്ബോട്ട് ജെട്ടിക്ക് സമീപം പ്ലാസ്റ്റിക് കുപ്പികൾ കൂമ്പാരം.", 6, "open"),
    ("Punnamada", "plastic", 2, "Food packets thrown into the lake.", "ഭക്ഷണ പാക്കറ്റുകൾ കായലിലേക്ക് എറിയുന്നു.", 20, "resolved"),
    ("Punnamada", "oil", 4, "Oil film on the water behind a houseboat.", "ഹൗസ്ബോട്ടിന് പിന്നിൽ വെള്ളത്തിൽ എണ്ണപ്പാട.", 12, "open"),
    ("Pallathuruthy", "oil", 3, "Diesel smell and rainbow sheen near the boat yard.", "ബോട്ട് യാർഡിന് സമീപം ഡീസൽ മണവും എണ്ണപ്പാടയും.", 30, "in_progress"),
    ("Nedumudi", "broken_jetty", 4, "Jetty planks broken; unsafe for school children.", "ജെട്ടിയുടെ പലകകൾ തകർന്നു, കുട്ടികൾക്ക് അപകടം.", 26, "open"),
    ("Champakulam", "plastic", 2, "Plastic waste stuck along the bank after rain.", "മഴയ്ക്ക് ശേഷം കരയിൽ പ്ലാസ്റ്റിക് മാലിന്യം.", 40, "rejected"),
    ("Champakulam", "water_hyacinth", 3, "Hyacinth covering the canal near the church.", "പള്ളിക്ക് സമീപത്തെ കനാൽ പോള മൂടി.", 15, "open"),
    ("Kavalam", "flooding", 5, "Road cut off by flood water; elderly people stuck.", "വെള്ളപ്പൊക്കത്തിൽ റോഡ് മുങ്ങി, പ്രായമായവർ ഒറ്റപ്പെട്ടു.", 4, "in_progress"),
    ("Pulinkunnu", "broken_jetty", 3, "Jetty railing missing.", "ജെട്ടിയുടെ കൈവരി ഇല്ല.", 50, "resolved"),
    ("Mankombu", "flooding", 3, "Water logging near the market.", "മാർക്കറ്റിന് സമീപം വെള്ളക്കെട്ട്.", 8, "open"),
    ("Alappuzha", "plastic", 3, "Canal near the beach road full of plastic.", "ബീച്ച് റോഡിന് സമീപത്തെ കനാലിൽ പ്ലാസ്റ്റിക് നിറഞ്ഞു.", 18, "open"),
]

# name, lat, lng, warning_m, danger_m, start_m, rise_per_reading_m
GAUGES = [
    ("Nedumudi (demo)", 9.4395, 76.4030, 1.45, 1.75, 1.10, 0.025),
    ("Champakulam (demo)", 9.4145, 76.4150, 1.50, 1.80, 1.05, 0.015),
    ("Pallathuruthy (demo)", 9.4755, 76.3575, 1.40, 1.70, 0.95, 0.005),
    ("Thottappally spillway (demo)", 9.3170, 76.3830, 2.10, 2.50, 1.60, 0.010),
]


def main(reset: bool):
    random.seed(7)
    now = datetime.now(timezone.utc)
    with SessionLocal() as db:
        if reset:
            for model in (StatusEvent, Report, Alert, GaugeReading, GaugeStation, Place):
                db.execute(delete(model))
            db.commit()

        if not db.scalar(select(Place.id).limit(1)):
            for en, ml, hi, ta, terms, lat, lng in PLACES:
                db.add(Place(name_en=en, name_ml=ml, name_hi=hi, name_ta=ta, match_terms=terms, lat=lat, lng=lng))
            db.commit()
        places = {p.name_en: p for p in db.scalars(select(Place))}

        if not db.scalar(select(Report.id).limit(1)):
            for place, cat, sev, en, ml, hrs, status in REPORTS:
                p = places[place]
                created = now - timedelta(hours=hrs)
                r = Report(
                    created_at=created, updated_at=created, status=ReportStatus(status),
                    lat=p.lat + random.uniform(-0.005, 0.005), lng=p.lng + random.uniform(-0.005, 0.005),
                    place_id=p.id, place_name=p.name_en, language="ml-IN", transcript=ml,
                    ai_category=Category(cat), category=Category(cat), severity=sev,
                    summary_en=en, summary_local=ml,
                )
                db.add(r)
                db.flush()
                db.add(StatusEvent(report_id=r.id, from_status=ReportStatus.draft, to_status=ReportStatus.open,
                                   note="Submitted", created_at=created))
                if status != "open":
                    db.add(StatusEvent(report_id=r.id, from_status=ReportStatus.open, to_status=ReportStatus(status),
                                       note="Panchayat update", created_at=created + timedelta(hours=1)))
            db.commit()

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
            k = places["Kainakary"]
            db.add(Alert(title="Kainakary ferry suspended",
                         message="Ferry service to Kainakary is suspended until the water level drops. Use the road route.",
                         place_id=k.id, lat=k.lat, lng=k.lng, radius_km=4, severity="warning",
                         expires_at=now + timedelta(hours=24)))
            db.commit()
    print("Seed complete.")


if __name__ == "__main__":
    main(reset="--reset" in sys.argv)
