// frontend/src/app/page.tsx
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { OpportunityCard } from '@/components/OpportunityCard';
import { OpportunityModal } from '@/components/OpportunityModal';
import { ApplicationTracker } from '@/components/ApplicationTracker';
import { TeamFinderModal } from '@/components/TeamFinderModal';
import NavDropdown, { NavTab } from '@/components/NavDropdown';
import { Footer } from '@/components/Footer';
import {
  Opportunity,
  FilterState,
  AppNotification,
  Theme,
  UserProfile,
  UserApplication,
  ApplicationStatus,
} from '@/types';
import {
  GraduationCap,
  Building2,
  Award,
} from 'lucide-react';
import { getInitialTheme, applyTheme } from '@/lib/theme';
import { calculateMatchScore } from '@/lib/recommendation';

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    slug: 'bangkit-academy-2026',
    title: 'Bangkit Academy 2026 by Google, Tokopedia, Gojek & Traveloka',
    organizer: 'Google & Kemendiktisaintek',
    category: 'MBKM',
    isOfficial: true,
    isVerified: true,
    isBookmarked: false,
    reward: 'Sertifikasi Global & Konversi 20 SKS',
    description: 'Program kesiapan karir teknologi tinggi dalam alur Machine Learning, Mobile Development (Android), dan Cloud Computing.',
    location: 'Online (Fully Remote)',
    requirements: ['Mahasiswa D3/D4/S1 Aktif', 'Komitmen 40 Jam/Minggu', 'Bahasa Inggris Dasar'],
    majors: ['Teknik Informatika / Ilmu Komputer', 'Sistem Informasi', 'Teknik Elektro & Robotika'],
    deadline: '2026-11-30',
    link: 'https://grow.google/bangkit/',
    sourceUrl: 'https://grow.google/bangkit/',
    viewsCount: 5120,
    createdAt: '2026-10-12T00:00:00.000Z',
  },
  {
    id: '2',
    slug: 'djarum-beasiswa-plus-2026',
    title: 'Djarum Beasiswa Plus 2026/2027',
    organizer: 'Djarum Beasiswa Plus',
    category: 'BEASISWA',
    isOfficial: true,
    isVerified: true,
    isBookmarked: true,
    reward: 'Dana Beasiswa & Soft Skills Training',
    description: 'Program beasiswa berprestasi untuk mahasiswa S1/D4 semester 4 yang memberikan tunjangan finansial serta pelatihan karakter intensif.',
    location: 'Indonesia',
    requirements: ['Mahasiswa S1/D4 Semester 4', 'IPK Min 3.00 pada Semester 3', 'Aktif Organisasi'],
    majors: ['Semua Jurusan (Multi-disiplin)'],
    deadline: '2026-11-12',
    link: 'https://djarumbeasiswaplus.org/',
    sourceUrl: 'https://djarumbeasiswaplus.org/',
    viewsCount: 2150,
    createdAt: '2026-10-10T00:00:00.000Z',
  },
  {
    id: '3',
    slug: 'beasiswa-lpdp-2026',
    title: 'Beasiswa LPDP Target S2/S3 Dalam & Luar Negeri',
    organizer: 'Lembaga Pengelola Dana Pendidikan',
    category: 'BEASISWA',
    isOfficial: true,
    isVerified: true,
    isBookmarked: false,
    reward: 'Full Tuitions & Living Allowance',
    description: 'Beasiswa penuh pemerintah Indonesia untuk studi lanjut jenjang magister dan doktor di berbagai perguruan tinggi unggulan dunia.',
    location: 'Dalam & Luar Negeri',
    requirements: ['Lulusan S1/D4', 'Sertifikat TOEFL/IELTS Valid', 'Surat Rekomendasi'],
    majors: ['Semua Jurusan (Multi-disiplin)'],
    deadline: '2026-12-31',
    link: 'https://lpdp.kemenkeu.go.id/',
    sourceUrl: 'https://lpdp.kemenkeu.go.id/',
    viewsCount: 4300,
    createdAt: '2026-10-15T00:00:00.000Z',
  },
  {
    id: '4',
    slug: 'beasiswa-kse-2026',
    title: 'Beasiswa Karya Salemba Empat (KSE) 2026/2027',
    organizer: 'Yayasan Karya Salemba Empat',
    category: 'BEASISWA',
    isOfficial: true,
    isVerified: true,
    isBookmarked: false,
    reward: 'Tunjangan Rp 750.000/Bulan & Leadership Program',
    description: 'Program bantuan finansial dan pembinaan kepemimpinan bagi mahasiswa PTN di seluruh Indonesia.',
    location: 'PTN Seluruh Indonesia',
    requirements: ['Mahasiswa Aktif Min. Semester 2', 'Belum Menikah', 'Kondisi Finansial Mendorong'],
    majors: ['Semua Jurusan (Multi-disiplin)'],
    deadline: '2026-12-10',
    link: 'https://kse.or.id/',
    sourceUrl: 'https://kse.or.id/',
    viewsCount: 1890,
    createdAt: '2026-10-08T00:00:00.000Z',
  },
  {
    id: '5',
    slug: 'idcamp-dicoding-2026',
    title: 'Indosat Ooredoo Hutchison Digital Camp (IDCamp) 2026',
    organizer: 'Indosat & Dicoding Indonesia',
    category: 'MBKM',
    isOfficial: true,
    isVerified: true,
    isBookmarked: false,
    reward: 'Beasiswa Coding & Sertifikasi Developer',
    description: 'Beasiswa belajar pemrograman online gratis dari tingkat dasar hingga profesional di platform Dicoding.',
    location: 'Online (Fully Remote)',
    requirements: ['Terbuka untuk Mahasiswa & Umum', 'Tanpa Batasan Usia'],
    majors: ['Teknik Informatika / Ilmu Komputer', 'Sistem Informasi', 'Teknik Elektro & Robotika'],
    deadline: '2026-11-25',
    link: 'https://idcamp.ioh.co.id/',
    sourceUrl: 'https://idcamp.ioh.co.id/',
    viewsCount: 3100,
    createdAt: '2026-10-14T00:00:00.000Z',
  },
  {
    id: '6',
    slug: 'gemastik-2026',
    title: 'GEMASTIK 2026 — Pagelaran Mahasiswa Nasional TIK',
    organizer: 'Direktorat Pembelajaran dan Kemahasiswaan Kemdiktisaintek',
    category: 'LOMBA',
    isOfficial: true,
    isVerified: true,
    isBookmarked: false,
    reward: 'Total Hadiah Rp 250.000.000 & Medali Nasional',
    description: 'Kompetisi TIK mahasiswa paling bergengsi tingkat nasional bidang UX Design, Data Mining, Cyber Security, dan Pengembangan Perangkat Lunak.',
    location: 'Hybrid / Kampus Penyelenggara',
    requirements: ['Mahasiswa Aktif S1/D4/D3', 'Tim 3 Orang', 'Surat Rekomendasi Perguruan Tinggi'],
    majors: ['Teknik Informatika / Ilmu Komputer', 'Sistem Informasi', 'Desain Komunikasi Visual (DKV)'],
    deadline: '2026-11-20',
    link: 'https://kemdiktisaintek.go.id/',
    sourceUrl: 'https://kemdiktisaintek.go.id/',
    viewsCount: 2890,
    createdAt: '2026-10-16T00:00:00.000Z',
  },
  {
    id: '7',
    slug: 'magang-pertamina-corporate-2026',
    title: 'Pertamina Student Internship & Professional Development Program 2026',
    organizer: 'PT Pertamina (Persero)',
    category: 'MAGANG',
    isOfficial: true,
    isVerified: true,
    isBookmarked: false,
    reward: 'Uang Saku Bulanan, Asuransi & Sertifikat',
    description: 'Program magang industri intensif di divisi Keuangan, Komunikasi Korporat, Manajemen SDM, dan IT Infrastructure.',
    location: 'Jakarta / Hybrid',
    requirements: ['Mahasiswa S1 Semester 6 - 8', 'IPK Min 3.25', 'Kemampuan Analitis & Komunikasi Bagus'],
    majors: ['Manajemen & Bisnis', 'Akuntansi', 'Ilmu Komunikasi', 'Teknik Informatika / Ilmu Komputer'],
    deadline: '2026-12-05',
    link: 'https://recruitment.pertamina.com/',
    sourceUrl: 'https://recruitment.pertamina.com/',
    viewsCount: 3640,
    createdAt: '2026-10-18T00:00:00.000Z',
  },
  {
    id: '8',
    slug: 'peksiminas-2026',
    title: 'Pekan Seni Mahasiswa Nasional (PEKSIMINAS) 2026',
    organizer: 'Kemdiktisaintek & BPSMI',
    category: 'KOMPETISI',
    isOfficial: true,
    isVerified: true,
    isBookmarked: false,
    reward: 'Trofi Presiden & Tunjangan Pembinaan',
    description: 'Ajang kompetisi kreativitas mahasiswa tingkat nasional bidang Fotografi, Desain Poster, Penulisan Lakon, dan Komunikasi Visual.',
    location: 'Indonesia',
    requirements: ['Mahasiswa Aktif PTN/PTS', 'Utusan Kontingen Wilayah', 'Portofolio Karya'],
    majors: ['Desain Komunikasi Visual (DKV)', 'Ilmu Komunikasi', 'Semua Jurusan (Multi-disiplin)'],
    deadline: '2026-12-15',
    link: 'https://kemdiktisaintek.go.id/',
    sourceUrl: 'https://kemdiktisaintek.go.id/',
    viewsCount: 1720,
    createdAt: '2026-10-20T00:00:00.000Z',
  },
];

const SAMPLE_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    type: 'DEADLINE',
    isRead: false,
    title: 'Peringatan Tenggat: Djarum Beasiswa Plus',
    message: 'Pendaftaran Djarum Beasiswa Plus 2026/2027 akan segera ditutup. Segera selesaikan pendaftaran melalui tautan resmi.',
    opportunityId: '2',
    timestamp: '15 menit lalu',
  },
  {
    id: 'n-2',
    type: 'NEW',
    isRead: false,
    title: 'Program Baru: Bangkit Academy 2026',
    message: 'Pendaftaran Bangkit Academy oleh Google & Kemdiktisaintek telah dibuka untuk mahasiswa jenjang D3/D4/S1.',
    opportunityId: '1',
    timestamp: '2 jam lalu',
  },
];

const ALL_MAJORS = [
  'Teknik Informatika / Ilmu Komputer',
  'Sistem Informasi',
  'Manajemen & Bisnis',
  'Akuntansi',
  'Desain Komunikasi Visual (DKV)',
  'Ilmu Komunikasi',
  'Teknik Elektro & Robotika',
  'Semua Jurusan (Multi-disiplin)',
];

const DEFAULT_FILTERS: FilterState = {
  q: '',
  category: '',
  major: '',
  sort: 'match_desc',
  isVerifiedOnly: false,
  onlyBookmarked: false,
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<NavTab>('explore');
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [notifications, setNotifications] = useState<AppNotification[]>(SAMPLE_NOTIFICATIONS);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [theme, setTheme] = useState<Theme>('dark');

  const [isTeamFinderOpen, setIsTeamFinderOpen] = useState(false);
  const [teamFinderOppId, setTeamFinderOppId] = useState<string | undefined>(undefined);

  const [userProfile] = useState<UserProfile>({
    major: 'Teknik Informatika / Ilmu Komputer',
    semester: 5,
    interests: ['MBKM', 'BEASISWA'],
  });

  const [userApplications, setUserApplications] = useState<Record<string, UserApplication>>({
    '1': { opportunityId: '1', status: 'preparing', updatedAt: new Date().toISOString() },
    '2': { opportunityId: '2', status: 'saved', updatedAt: new Date().toISOString() },
  });

  useEffect(() => {
    const t = getInitialTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      applyTheme(next);
      return next;
    });
  }, []);

  const opportunitiesWithScores = useMemo(() => {
    return opportunities.map((opp) => ({
      ...opp,
      matchScore: calculateMatchScore(opp, userProfile),
    }));
  }, [opportunities, userProfile]);

  const filtered = useMemo(() => {
    return opportunitiesWithScores
      .filter((o) => {
        if (filters.onlyBookmarked && !o.isBookmarked) return false;
        if (filters.category && o.category !== filters.category) return false;
        if (filters.major && !o.majors.includes(filters.major)) return false;
        if (filters.isVerifiedOnly && !o.isVerified) return false;
        if (filters.q.trim()) {
          const q = filters.q.toLowerCase();
          if (
            !o.title.toLowerCase().includes(q) &&
            !o.organizer.toLowerCase().includes(q) &&
            !o.description.toLowerCase().includes(q)
          )
            return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sort === 'match_desc') return (b.matchScore || 0) - (a.matchScore || 0);
        if (filters.sort === 'deadline_asc')
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [opportunitiesWithScores, filters]);

  const bookmarkCount = opportunities.filter((o) => o.isBookmarked).length;

  const handleUpdateAppStatus = (oppId: string, status: ApplicationStatus) => {
    setUserApplications((prev) => ({
      ...prev,
      [oppId]: { opportunityId: oppId, status, updatedAt: new Date().toISOString() },
    }));
  };

  const handleRemoveTrack = (oppId: string) => {
    setUserApplications((prev) => {
      const next = { ...prev };
      delete next[oppId];
      return next;
    });
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'teams') {
      setTeamFinderOppId(undefined);
      setIsTeamFinderOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-[#070C1E] text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar
        isDark={theme === 'dark'}
        onToggleTheme={toggleTheme}
        bookmarkCount={bookmarkCount}
        isBookmarkView={filters.onlyBookmarked}
        onBookmarkClick={() => setFilters((p) => ({ ...p, onlyBookmarked: !p.onlyBookmarked }))}
        notifications={notifications}
        onMarkRead={(id) => setNotifications((p) => p.map((n) => (n.id === id ? { ...n, isRead: true } : n)))}
        onMarkAllRead={() => setNotifications((p) => p.map((n) => ({ ...n, isRead: true })))}
        onClearNotifications={() => setNotifications([])}
        onNavigateNotification={(id) => {
          const opp = opportunities.find((o) => o.id === id);
          if (opp) setSelectedOpp(opp);
        }}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ── Hero Banner ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#17389E] via-[#122B7A] to-[#0A1747] border border-blue-800/60 text-white p-6 sm:p-10 mb-8 shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Watermark Logo */}
          <div className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 w-48 sm:w-72 h-48 sm:h-72 opacity-90 pointer-events-none select-none flex items-center justify-center">
            <img
              src="/kesempatankita-icon.png"
              alt="KesempatanKita Watermark"
              className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] transform rotate-6"
            />
          </div>

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3 text-white">
              Setiap kesempatan adalah langkah menuju masa depan yang lebih besar. Mulai perjalananmu bersama KesempatanKita
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed mb-6 font-medium">
              Waktunya Berkembang, Saatnya Meraih Peluang!
            </p>

            <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4 border-t border-blue-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-900/60 border border-blue-700/50 text-cyan-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-white">500+</div>
                  <div className="text-[11px] text-blue-200/80 font-bold">Peluang Aktif</div>
                </div>
              </div>

              <div className="h-7 w-px bg-blue-800/60" />

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-amber-400">100%</div>
                  <div className="text-[11px] text-blue-200/80 font-bold">Sumber Resmi</div>
                </div>
              </div>

              <div className="h-7 w-px bg-blue-800/60" />

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-900/60 border border-blue-700/50 text-cyan-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-white">20 SKS</div>
                  <div className="text-[11px] text-blue-200/80 font-bold">Konversi MBKM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dropdown Navigasi */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-blue-900/40">
          <NavDropdown
            activeTab={activeTab}
            onTabChange={handleTabChange}
            trackerCount={Object.keys(userApplications).length}
          />
        </div>

        {activeTab === 'explore' ? (
          <>
            <SearchAndFilter
              filters={filters}
              onFilterChange={(f) => setFilters((p) => ({ ...p, ...f }))}
              availableMajors={ALL_MAJORS}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filtered.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onBookmarkToggle={(id, status) => {
                    setOpportunities((prev) =>
                      prev.map((o) => (o.id === id ? { ...o, isBookmarked: status } : o))
                    );
                  }}
                  onOpenDetails={setSelectedOpp}
                />
              ))}
            </div>
          </>
        ) : (
          <ApplicationTracker
            opportunities={opportunitiesWithScores}
            applications={userApplications}
            onUpdateStatus={handleUpdateAppStatus}
            onRemoveTrack={handleRemoveTrack}
            onOpenDetails={setSelectedOpp}
          />
        )}
      </main>

      {/* Komponen Footer */}
      <Footer />

      <OpportunityModal
        opportunity={selectedOpp}
        onClose={() => setSelectedOpp(null)}
        onOpenTeamFinder={(oppId) => {
          setTeamFinderOppId(oppId);
          setIsTeamFinderOpen(true);
        }}
      />

      <TeamFinderModal
        isOpen={isTeamFinderOpen}
        onClose={() => setIsTeamFinderOpen(false)}
        opportunities={opportunities}
        initialOppId={teamFinderOppId}
      />
    </div>
  );
}