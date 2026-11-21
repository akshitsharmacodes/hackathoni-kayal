"""Smoke test against a running backend.  Run from backend/:  uv run python tests/smoke.py"""
import os

import httpx

B = os.environ.get("API", "http://localhost:8000/api")
c = httpx.Client(timeout=120)


def show(name, r, keys=None):
    d = r.json()
    if keys and isinstance(d, dict):
        d = {k: d.get(k) for k in keys}
    print(f"{name}: {r.status_code} {str(d)[:400]}")
    return r.json()


show("health", c.get(f"{B}/health"))

with open("tests/fixtures/sample_ml.wav", "rb") as f:
    a = show("analyze", c.post(f"{B}/reports/analyze", data={"lat": 9.4872, "lng": 76.3912, "language": "ml-IN"},
                               files={"audio": ("voice.wav", f, "audio/wav")}))
s = show("submit", c.post(f"{B}/reports/{a['draft_id']}/submit", json={"category": "water_hyacinth", "phone": "98470 12345"}),
         ["possible_duplicate_of", "reply_text"])
show("mine", c.get(f"{B}/reports/mine", params={"phone": "9847012345"}))
show("status->in_progress", c.patch(f"{B}/reports/{a['draft_id']}/status", json={"status": "in_progress", "note": "Boat sent"}), ["status"])
show("bad transition", c.patch(f"{B}/reports/{a['draft_id']}/status", json={"status": "draft"}))
show("detail", c.get(f"{B}/reports/{a['draft_id']}"), ["status", "events", "duplicate_count"])
show("en ask", c.post(f"{B}/ask", data={"text": "Is water rising in Kainakary?", "language": "en-IN"}),
     ["question", "place", "answer", "sources"])
show("hi ask", c.post(f"{B}/ask", data={"text": "क्या कैनकरी में पानी बढ़ रहा है?", "language": "hi-IN"}),
     ["place", "answer"])
show("stats", c.get(f"{B}/stats"))
show("gauges", c.get(f"{B}/gauges"))
print("reports:", len(c.get(f"{B}/reports").json()), "alerts:", len(c.get(f"{B}/alerts").json()))
