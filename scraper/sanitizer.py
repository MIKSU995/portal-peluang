# scraper/sanitizer.py
import re
import hashlib
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from config import settings

def sanitize_html(raw_html: str) -> str:
    """
    Membersihkan HTML dari potensi XSS, tag script, iframe, dan style berbahaya.
    Menghasilkan teks rapi yang aman disimpan dan ditampilkan di web.
    """
    if not raw_html:
        return ""
    
    soup = BeautifulSoup(raw_html, "html.parser")
    
    # Hapus tag berbahaya
    for tag in soup(["script", "style", "iframe", "object", "embed", "svg", "form"]):
        tag.decompose()
        
    # Hapus atribut berbahaya seperti onclick, onload, javascript: uri
    for tag in soup.find_all(True):
        tag.attrs = {
            attr: val for attr, val in tag.attrs.items()
            if not attr.startswith("on") and not (isinstance(val, str) and "javascript:" in val.lower())
        }
        
    text = soup.get_text(separator="\n")
    # Bersihkan multiple blank lines
    cleaned = re.sub(r'\n\s*\n', '\n\n', text).strip()
    return cleaned

def compute_content_hash(title: str, organizer: str, deadline_iso: str) -> str:
    """
    Menghasilkan SHA-256 fingerprint unik untuk deteksi duplikasi.
    Jika ada perubahan tanggal atau judul yang identik, hash akan mendeteksinya.
    """
    normalized = f"{title.lower().strip()}_{organizer.lower().strip()}_{deadline_iso.strip()}"
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()

def extract_domain(url: str) -> str:
    """Ekstraksi domain utama dari URL sumber"""
    parsed = urlparse(url)
    domain = parsed.netloc.lower()
    if domain.startswith("www."):
        domain = domain[4:]
    return domain

def is_official_verified_source(url: str) -> bool:
    """
    Validasi URL sumber resmi:
    - Domain pemerintah Indonesia (.go.id)
    - Domain universitas terakreditasi (.ac.id)
    - Domain resmi mitra terdaftar di config
    """
    domain = extract_domain(url)
    
    if domain.endswith(".go.id") or domain.endswith(".ac.id"):
        return True
        
    for trusted in settings.TRUSTED_OFFICIAL_DOMAINS:
        if domain == trusted or domain.endswith("." + trusted):
            return True
            
    return False

