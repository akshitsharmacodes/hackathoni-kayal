"""Sarvam AI: speech-to-text, report classification (photo + text), question answering."""
import base64
import json

from sarvamai import SarvamAI

from app.config import settings
from app.models import Category

client = SarvamAI(api_subscription_key=settings.sarvam_api_key)

LANGUAGE_NAMES = {"ml-IN": "Malayalam", "en-IN": "English", "hi-IN": "Hindi", "ta-IN": "Tamil"}


# ---------- Speech -> text (saaras:v4, chosen language as hint: D48) ----------
def transcribe(audio: bytes, filename: str, content_type: str, language: str) -> tuple[str, str]:
    r = client.speech_to_text.transcribe(
        file=(filename, audio, content_type),
        model="saaras:v4",
        mode="transcribe",
        language_code=language,
    )
    return (r.transcript or "").strip(), (r.language_code or language)


# ---------- Classify a report (gemma4 sees the photo) ----------
CLASSIFY_PROMPT = """You sort citizen complaints about the Alappuzha backwaters in Kerala, India.
Categories:
- plastic: plastic or garbage in or near the water
- water_hyacinth: floating weed (African payal / pola) blocking water
- oil: oil, diesel or fuel film on the water
- flooding: water entering homes, roads or fields; rising water; bund breach
- broken_jetty: damaged boat jetty, landing steps or railing
- other: anything else
Use the complaint text (may be empty) and the photo if attached.
Reply ONLY with a JSON object with keys:
"category" (one of the six above), "severity" (integer 1 = minor .. 5 = dangerous/urgent),
"place" (place or village named in the complaint, in English, or ""),
"summary_en" (one short English sentence),
"summary_local" (the same sentence in {language})."""


def classify(text: str, photo: bytes | None, language: str) -> dict:
    lang_name = LANGUAGE_NAMES.get(language, "English")
    content: list[dict] = [{
        "type": "text",
        "text": CLASSIFY_PROMPT.replace("{language}", lang_name)
        + "\n\nComplaint text: " + (text or "(no speech, use the photo)"),
    }]
    if photo:
        b64 = base64.b64encode(photo).decode()
        content.append({"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}})

    r = client.chat.completions_v2(
        model="gemma4",
        messages=[{"role": "user", "content": content}],
        response_format={"type": "json_object"},
        max_tokens=600,
    )
    data = json.loads(r.choices[0].message.content)

    # FR-5: never trust model output blindly.
    valid = {c.value for c in Category}
    data["category"] = data.get("category") if data.get("category") in valid else "other"
    try:
        data["severity"] = max(1, min(5, int(data.get("severity", 3))))
    except (TypeError, ValueError):
        data["severity"] = 3
    for key in ("place", "summary_en", "summary_local"):
        data[key] = str(data.get(key) or "")
    return data


# ---------- Answer a question (sarvam-105b-conversations) ----------
ANSWER_SYSTEM = """You are Kayal, a calm, helpful voice assistant for people living around the Alappuzha backwaters.
Answer in simple spoken {language} in 2-3 short sentences. No markdown, no lists, no emojis.
Use ONLY the data provided. Gauge readings are simulated demo data; never claim they are official.
If the data is thin, say so honestly and give one practical safety tip."""


def answer(question: str, language: str, context: dict) -> str:
    lang_name = LANGUAGE_NAMES.get(language, "English")
    r = client.chat.completions_v2(
        model="sarvam-105b-conversations",
        messages=[
            {"role": "system", "content": ANSWER_SYSTEM.replace("{language}", lang_name)},
            {"role": "user", "content": f"Question: {question}\nData: {json.dumps(context, ensure_ascii=False, default=str)}"},
        ],
        max_tokens=350,
    )
    return (r.choices[0].message.content or "").strip()


# ---------- Text -> speech fallback (bulbul:v3) ----------
def speak(text: str, language: str) -> str:
    audio = client.text_to_speech.convert(
        text=text[:2400], language_code=language, model="bulbul:v3", speaker="priya")
    return audio.audios[0]
