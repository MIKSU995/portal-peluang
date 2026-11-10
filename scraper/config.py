# scraper/config.py
import os
from pydantic_settings import BaseSettings

class ScraperSettings(BaseSettings):
    USER_AGENT: str = "KesempatanKitaBot/1.0 (+https://kesempatankita.id/bot; support@kesempatankita.id)"
    REQUEST_DELAY_SECONDS: float = 2.0  # Throttling antar request
    REQUEST_TIMEOUT: int = 15           # Timeout dalam detik
    
    # Ingestion API Backend Target
    API_INGEST_URL: str = os.getenv("API_INGEST_URL", "http://localhost:5000/api/v1/opportunities/ingest")
    API_INTERNAL_SECRET: str = os.getenv("API_INTERNAL_SECRET", "super-secret-internal-ingest-key-2026")

    # Domain Resmi Terpercaya (Otomatis mendapatkan Badge Verified)
    TRUSTED_OFFICIAL_DOMAINS: list[str] = [
        "kemdikbud.go.id",
        "kampusmerdeka.kemdikbud.go.id",
        "pusatprestasinasional.kemdikbud.go.id",
        "djarumbeasiswaplus.org",
        "careers.go-to.com",
        "telkom.co.id",
        "unicef.org",
        "kominfo.go.id"
    ]

settings = ScraperSettings()

