"""Create the public Supabase Storage buckets (D37, D38) and test an upload.

Run from backend/:   uv run python -m scripts.setup_storage
"""
import httpx

from app.config import settings
from app.services import storage

base = settings.supabase_url.rstrip("/")
headers = {"apikey": settings.supabase_service_key, "Authorization": f"Bearer {settings.supabase_service_key}"}

for bucket in (settings.photo_bucket, settings.audio_bucket):
    r = httpx.post(f"{base}/storage/v1/bucket", headers=headers, timeout=20,
                   json={"id": bucket, "name": bucket, "public": True})
    exists = r.status_code in (400, 409) and "exist" in r.text.lower()
    print(f"bucket {bucket}: {r.status_code} {'already exists' if exists else r.text[:160]}")

url = storage.upload(settings.photo_bucket, b"kayal storage test", ".txt", "text/plain")
print("upload:", url)
print("public read:", httpx.get(url, timeout=20).status_code)
