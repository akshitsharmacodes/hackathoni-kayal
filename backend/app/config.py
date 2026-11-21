"""App settings, read from backend/.env by pydantic-settings (D45).

Each field maps to an env var with the same name in UPPER_CASE, e.g. sarvam_api_key <- SARVAM_API_KEY.
"""
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Pasted env values often carry a trailing newline/space (e.g. into a host's dashboard),
    # which silently corrupts URLs and keys — strip everything.
    @field_validator("*", mode="before")
    @classmethod
    def _strip(cls, v):
        return v.strip() if isinstance(v, str) else v

    sarvam_api_key: str
    smallest_api_key: str = ""

    # Supabase Postgres (session pooler URI, with the postgresql+psycopg:// prefix).
    # The sqlite default only exists so the app can boot before Supabase is configured.
    database_url: str = "sqlite:///./dev.db"

    # Supabase Storage. If empty, files are saved to ./uploads and served by FastAPI (local dev only).
    supabase_url: str = ""
    supabase_service_key: str = ""
    photo_bucket: str = "report-photos"
    audio_bucket: str = "report-audio"

    # smallest.ai voice per language. Empty = go straight to the Sarvam fallback (D24).
    # Malayalam uses the premium Pro pool; the other languages use the standard pool,
    # whose voices are multilingual (tested 22 Nov: hi/ta/en with "srishti").
    smallest_voice_ml: str = "parvathy"
    smallest_voice_en: str = "srishti"
    smallest_voice_hi: str = "srishti"
    smallest_voice_ta: str = "srishti"
    smallest_model_ml: str = "lightning_v3.1_pro"
    smallest_model_other: str = "lightning_v3.1"  # standard pool; retires 30 Nov 2026 (after the demo)


settings = Settings()
