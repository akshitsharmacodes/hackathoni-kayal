"""File storage: Supabase Storage public buckets (D6, D37, D38).

Falls back to ./uploads (served at /uploads) only when Supabase is not configured yet.
"""
import uuid
from pathlib import Path

import httpx

from app.config import settings

LOCAL_DIR = Path("uploads")


def upload(bucket: str, data: bytes, ext: str, content_type: str) -> str:
    name = f"{uuid.uuid4().hex}{ext}"
    if settings.supabase_url and settings.supabase_service_key:
        base = settings.supabase_url.rstrip("/")
        r = httpx.post(
            f"{base}/storage/v1/object/{bucket}/{name}",
            content=data,
            headers={
                "Authorization": f"Bearer {settings.supabase_service_key}",
                "apikey": settings.supabase_service_key,
                "Content-Type": content_type,
            },
            timeout=30,
        )
        r.raise_for_status()
        return f"{base}/storage/v1/object/public/{bucket}/{name}"

    folder = LOCAL_DIR / bucket
    folder.mkdir(parents=True, exist_ok=True)
    (folder / name).write_bytes(data)
    return f"/uploads/{bucket}/{name}"
