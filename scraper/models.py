# scraper/models.py
from datetime import datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, HttpUrl, field_validator

CategoryType = Literal["MAGANG", "BEASISWA", "LOMBA", "MBKM"]

class ScrapedOpportunity(BaseModel):
    title: str = Field(..., min_length=5, max_length=255)
    organizer: str = Field(..., min_length=2, max_length=150)
    category: CategoryType
    description: str = Field(..., min_length=20)
    requirements: List[str] = Field(default_factory=list)
    location: str = Field(default="Remote / Seluruh Indonesia")
    stipend_or_prize: Optional[str] = None
    source_url: HttpUrl
    source_domain: str
    content_hash: str
    deadline: datetime
    is_verified: bool = False
    majors: List[str] = Field(default_factory=lambda: ["Semua Jurusan (Multi-disiplin)"])

    @field_validator("title", "organizer", "description", mode="before")
    @classmethod
    def clean_text_whitespace(cls, v: str) -> str:
        if isinstance(v, str):
            return " ".join(v.split())
        return v

    @field_validator("deadline")
    @classmethod
    def ensure_future_deadline(cls, v: datetime) -> datetime:
        # Peringatan jika tenggat sudah kadaluarsa saat discrape
        if v.replace(tzinfo=None) < datetime.utcnow():
            raise ValueError(f"Tenggat waktu sudah lewat: {v}")
        return v

