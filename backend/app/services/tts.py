"""Text -> speech: smallest.ai first, Sarvam Bulbul as fallback (D24). Returns base64 WAV."""
import base64
import logging

from app.config import settings
from app.services import sarvam

log = logging.getLogger("kayal.tts")

_SMALLEST_LANG = {"ml-IN": "ml", "en-IN": "en", "hi-IN": "hi", "ta-IN": "ta"}


def _voice_for(language: str) -> str:
    return {
        "ml-IN": settings.smallest_voice_ml,
        "en-IN": settings.smallest_voice_en,
        "hi-IN": settings.smallest_voice_hi,
        "ta-IN": settings.smallest_voice_ta,
    }.get(language, "")


def speak(text: str, language: str) -> str:
    voice = _voice_for(language)
    if settings.smallest_api_key and voice:
        try:
            from smallestai import SmallestAI

            model = settings.smallest_model_ml if language == "ml-IN" else settings.smallest_model_other
            chunks = SmallestAI(api_key=settings.smallest_api_key).waves.synthesize_tts(
                text=text, voice_id=voice, model=model,
                language=_SMALLEST_LANG[language], sample_rate=24000, output_format="wav")
            return base64.b64encode(b"".join(chunks)).decode()
        except Exception as e:  # any failure -> Sarvam
            log.warning("smallest.ai TTS failed (%s); using Sarvam", e)
    return sarvam.speak(text, language)
