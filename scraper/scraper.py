# scraper/scraper.py
import time
import logging
from datetime import datetime, timedelta
from urllib.robotparser import RobotFileParser
from urllib.parse import urljoin
import httpx
from config import settings
from models import ScrapedOpportunity
from sanitizer import sanitize_html, compute_content_hash, extract_domain, is_official_verified_source

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("KesempatanKitaScraper")

class EthicalScraperPipeline:
    def __init__(self):
        self.client = httpx.Client(
            headers={"User-Agent": settings.USER_AGENT},
            timeout=settings.REQUEST_TIMEOUT,
            follow_redirects=True,
        )
        self.robot_parsers: dict[str, RobotFileParser] = {}

    def can_fetch(self, url: str) -> bool:
        """Pemeriksaan kepatuhan robots.txt target domain"""
        domain = extract_domain(url)
        robots_url = f"https://{domain}/robots.txt"

        if domain not in self.robot_parsers:
            rp = RobotFileParser()
            try:
                rp.set_url(robots_url)
                rp.read()
                self.robot_parsers[domain] = rp
            except Exception as e:
                logger.warning(f"Gagal membaca robots.txt dari {robots_url}: {e}. Melanjutkan dengan aturan sopan.")
                return True

        return self.robot_parsers[domain].can_fetch(settings.USER_AGENT, url)

    def fetch_with_throttling(self, url: str) -> str:
        """Mengambil halaman web dengan throttling etis"""
        if not self.can_fetch(url):
            logger.warning(f"Robots.txt melarang crawling pada URL: {url}")
            return ""

        time.sleep(settings.REQUEST_DELAY_SECONDS)
        try:
            response = self.client.get(url)
            response.raise_for_status()
            return response.text
        except httpx.HTTPError as err:
            logger.error(f"Error fetching {url}: {err}")
            return ""

    def simulate_mock_crawler(self) -> list[dict]:
        """
        Simulasi crawler ekstraksi data lapangan dari berbagai sumber peluang mahasiswa
        (Mengakomodasi data nyata untuk testing dan integrasi awal).
        """
        logger.info("Memulai ekstraksi peluang dari target feeds...")
        
        # Tanggal dinamis masa depan
        now = datetime.utcnow()
        return [
            {
                "title": "Data Science & AI Fellowship 2026",
                "organizer": "Telkom Indonesia (Astra x Indigo)",
                "category": "MAGANG",
                "raw_html_desc": "<p>Program intensif Data Science dan Generative AI dengan bimbingan mentor industri.</p><script>alert('xss')</script>",
                "requirements": ["Mahasiswa semester 5-8 Jurusan STEM", "Menguasai Python & SQL", "Portofolio GitHub aktif"],
                "location": "Bandung (Hybrid)",
                "stipend_or_prize": "Rp 5.500.000 / bulan",
                "source_url": "https://telkom.co.id/careers/fellowship-data-2026",
                "deadline": now + timedelta(days=7),
                "majors": ["Teknik Informatika / Ilmu Komputer", "Sistem Informasi"],
            },
            {
                "title": "Beasiswa Unggulan Bank Indonesia 2026",
                "organizer": "Bank Indonesia",
                "category": "BEASISWA",
                "raw_html_desc": "<div>Bantuan biaya pendidikan penuh dan program pengembangan kepemimpinan GenBI.</div>",
                "requirements": ["IPK minimal 3.25", "Mahasiswa aktif semester 3 ke atas", "Aktif dalam kegiatan sosial kemasyarakatan"],
                "location": "Nasional",
                "stipend_or_prize": "Rp 1.200.000 / bulan + Leadership Bootcamp",
                "source_url": "https://kemdikbud.go.id/beasiswa-bi-2026",
                "deadline": now + timedelta(days=14),
                "majors": ["Manajemen & Bisnis", "Akuntansi", "Semua Jurusan (Multi-disiplin)"],
            },
            {
                "title": "National Hackathon: Green Tech & Sustainability",
                "organizer": "Kementerian ESDM x Tech Startup Indo",
                "category": "LOMBA",
                "raw_html_desc": "<span>Kompetisi solusi teknologi ramah lingkungan dan efisiensi energi terbarukan.</span>",
                "requirements": ["Tim 2-4 mahasiswa aktif", "Membuat MVP aplikasi atau perangkat IoT", "Video demo 3 menit"],
                "location": "Jakarta (Grand Final)",
                "stipend_or_prize": "Total Hadiah Rp 100.000.000 + Funding Inkubasi",
                "source_url": "https://pusatprestasinasional.kemdikbud.go.id/greentech-2026",
                "deadline": now + timedelta(days=3),  # H-3 Urgent
                "majors": ["Teknik Informatika / Ilmu Komputer", "Teknik Elektro & Robotika"],
            }
        ]

    def process_and_ingest(self):
        """Pipeline utama: Crawl -> Sanitize -> Deduplication Check -> Ingest ke Backend API"""
        raw_items = self.simulate_mock_crawler()
        logger.info(f"Ditemukan {len(raw_items)} item untuk diproses.")

        ingested_count = 0
        skipped_count = 0

        for raw in raw_items:
            try:
                # 1. Sanitasi teks HTML dan cegah XSS
                clean_description = sanitize_html(raw["raw_html_desc"])
                
                # 2. Ekstraksi dan Validasi Domain
                source_url = raw["source_url"]
                domain = extract_domain(source_url)
                is_verified = is_official_verified_source(source_url)

                # 3. Hitung SHA-256 Content Hash untuk Deteksi Duplikasi
                deadline_iso = raw["deadline"].isoformat()
                content_hash = compute_content_hash(raw["title"], raw["organizer"], deadline_iso)

                # 4. Validasi Skema Data dengan Pydantic
                item = ScrapedOpportunity(
                    title=raw["title"],
                    organizer=raw["organizer"],
                    category=raw["category"],
                    description=clean_description,
                    requirements=raw["requirements"],
                    location=raw.get("location", "Remote"),
                    stipend_or_prize=raw.get("stipend_or_prize"),
                    source_url=source_url,
                    source_domain=domain,
                    content_hash=content_hash,
                    deadline=raw["deadline"],
                    is_verified=is_verified,
                    majors=raw.get("majors", ["Semua Jurusan (Multi-disiplin)"])
                )

                # 5. Kirim ke Endpoint Ingestion Backend
                payload = item.model_dump(mode="json")
                response = self.client.post(
                    settings.API_INGEST_URL,
                    json=payload,
                    headers={"X-Internal-Secret": settings.API_INTERNAL_SECRET}
                )

                if response.status_code == 201:
                    logger.info(f"✅ Berhasil mengimpor: {item.title}")
                    ingested_count += 1
                elif response.status_code == 409:
                    logger.info(f"⏭️ Duplikasi terdeteksi (Dilewati): {item.title} [Hash: {content_hash[:8]}...]")
                    skipped_count += 1
                else:
                    logger.warning(f"⚠️ Gagal menyimpan [{response.status_code}]: {response.text}")

            except Exception as e:
                logger.error(f"❌ Kesalahan pemrosesan item: {e}")

        logger.info(f"🏁 Pipeline Scraper Selesai. Masuk: {ingested_count}, Duplikat Dilewati: {skipped_count}")

if __name__ == "__main__":
    pipeline = EthicalScraperPipeline()
    pipeline.process_and_ingest()

