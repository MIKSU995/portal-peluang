// frontend/src/components/TeamFinderModal.tsx
'use client';

import React, { useState } from 'react';
import { X, Users, UserPlus, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { Opportunity, TeamPost } from '@/types';

interface TeamFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunities: Opportunity[];
  initialOppId?: string;
}

const SAMPLE_TEAM_POSTS: TeamPost[] = [
  {
    id: 'tp-1',
    opportunityId: '6',
    opportunityTitle: 'GEMASTIK 2026 — Pagelaran Mahasiswa Nasional TIK',
    leaderName: 'Fahmi Hartanto',
    leaderMajor: 'Teknik Informatika',
    neededRoles: ['UI/UX Designer', 'Frontend Developer'],
    description: 'Sedang membangun tim UX Design Gemastik 2026. Mencari 1 orang yang menguasai Figma dan 1 orang React/Next.js.',
    contactChannel: 'whatsapp',
    contactValue: '6281234567890',
    createdAt: '1 jam lalu',
  },
  {
    id: 'tp-2',
    opportunityId: '6',
    opportunityTitle: 'GEMASTIK 2026 — Pagelaran Mahasiswa Nasional TIK',
    leaderName: 'Budi Prasetyo',
    leaderMajor: 'Sistem Informasi',
    neededRoles: ['Data Analyst / Python'],
    description: 'Tim Divisi Data Mining kurang 1 anggota berpengalaman scikit-learn & pandas.',
    contactChannel: 'telegram',
    contactValue: 'budipras',
    createdAt: '3 jam lalu',
  },
];

const AVAILABLE_ROLES = [
  'UI/UX Designer',
  'Frontend Developer',
  'Backend Developer',
  'Mobile Developer',
  'Data Analyst / ML',
  'Copywriter / Pitcher',
];

export const TeamFinderModal: React.FC<TeamFinderModalProps> = ({
  isOpen,
  onClose,
  opportunities,
  initialOppId,
}) => {
  const [posts, setPosts] = useState<TeamPost[]>(SAMPLE_TEAM_POSTS);
  const [selectedOppFilter, setSelectedOppFilter] = useState<string>(initialOppId || 'ALL');
  const [isPosting, setIsPosting] = useState<boolean>(false);

  // Form State
  const [formOppId, setFormOppId] = useState<string>(initialOppId || opportunities[0]?.id || '');
  const [formName, setFormName] = useState('');
  const [formMajor, setFormMajor] = useState('Teknik Informatika');
  const [formRoles, setFormRoles] = useState<string[]>([]);
  const [formDesc, setFormDesc] = useState('');
  const [formContactChannel, setFormContactChannel] = useState<'whatsapp' | 'telegram' | 'linkedin'>('whatsapp');
  const [formContactValue, setFormContactValue] = useState('');

  if (!isOpen) return null;

  const filteredPosts = posts.filter((p) => {
    if (selectedOppFilter !== 'ALL' && p.opportunityId !== selectedOppFilter) return false;
    return true;
  });

  const handleToggleRole = (role: string) => {
    setFormRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDesc || !formContactValue || formRoles.length === 0) return;

    const targetOpp = opportunities.find((o) => o.id === formOppId);

    const newPost: TeamPost = {
      id: `tp-${Date.now()}`,
      opportunityId: formOppId,
      opportunityTitle: targetOpp?.title || 'Kompetisi',
      leaderName: formName,
      leaderMajor: formMajor,
      neededRoles: formRoles,
      description: formDesc,
      contactChannel: formContactChannel,
      contactValue: formContactValue,
      createdAt: 'Baru saja',
    };

    setPosts([newPost, ...posts]);
    setIsPosting(false);
    // Reset Form
    setFormDesc('');
    setFormContactValue('');
    setFormRoles([]);
  };

  const getContactUrl = (post: TeamPost) => {
    if (post.contactChannel === 'whatsapp') {
      const cleanNum = post.contactValue.replace(/[^0-9]/g, '');
      const text = encodeURIComponent(`Halo ${post.leaderName}, saya tertarik bergabung tim ${post.opportunityTitle} dari KesempatanKita!`);
      return `https://wa.me/${cleanNum}?text=${text}`;
    }
    if (post.contactChannel === 'telegram') {
      return `https://t.me/${post.contactValue.replace('@', '')}`;
    }
    return post.contactValue.startsWith('http') ? post.contactValue : `https://${post.contactValue}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0A122E] border border-blue-900/60 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-blue-900/50 flex items-center justify-between bg-blue-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Team Finder — Cari Teman Tim</h2>
              <p className="text-xs text-blue-300/80">Temukan rekan tim untuk kompetisi & hackathon</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filter */}
        <div className="p-4 bg-slate-900/60 border-b border-blue-900/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Kompetisi:</span>
            <select
              value={selectedOppFilter}
              onChange={(e) => setSelectedOppFilter(e.target.value)}
              className="bg-blue-950/80 text-amber-400 border border-blue-900/60 rounded-xl px-3 py-1.5 font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Lomba & MBKM</option>
              {opportunities.map((o) => (
                <option key={o.id} value={o.id}>{o.title}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsPosting(!isPosting)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-slate-950 hover:bg-amber-300 transition shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            {isPosting ? 'Batal Buat Post' : 'Pasang Lowongan Tim'}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isPosting ? (
            /* Form Buat Postingan Tim Baru */
            <form onSubmit={handleSubmitPost} className="bg-slate-900/90 border border-blue-900/60 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Form Lowongan Tim Baru
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Target Peluang / Lomba</label>
                  <select
                    value={formOppId}
                    onChange={(e) => setFormOppId(e.target.value)}
                    className="w-full bg-slate-950 border border-blue-900/60 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none"
                  >
                    {opportunities.map((o) => (
                      <option key={o.id} value={o.id}>{o.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Nama Ketua Tim</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-950 border border-blue-900/60 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Peran yang Dicari */}
              <div>
                <label className="block text-xs text-slate-400 font-bold mb-1.5">Peran yang Dibutuhkan</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_ROLES.map((role) => {
                    const isSelected = formRoles.includes(role);
                    return (
                      <button
                        type="button"
                        key={role}
                        onClick={() => handleToggleRole(role)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-300'
                            : 'bg-slate-950 text-slate-300 border-blue-900/50 hover:border-amber-400/50'
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs text-slate-400 font-bold mb-1">Deskripsi & Kriteria Tambahan</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan kebutuhan tim, target juara, dan kualifikasi yang dicari..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-blue-900/60 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Kontak */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Media Kontak</label>
                  <select
                    value={formContactChannel}
                    onChange={(e) => setFormContactChannel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-blue-900/60 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none"
                  >
                    <option value="whatsapp">WhatsApp (Nomor dengan 62)</option>
                    <option value="telegram">Telegram (Username)</option>
                    <option value="linkedin">LinkedIn (URL Profil)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Nomor / Username / Link</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: 6281234567890"
                    value={formContactValue}
                    onChange={(e) => setFormContactValue(e.target.value)}
                    className="w-full bg-slate-950 border border-blue-900/60 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Publikasikan Lowongan Tim
              </button>
            </form>
          ) : (
            /* List Postingan Teman Tim */
            filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="bg-slate-900/90 border border-blue-900/50 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-950 text-cyan-400 border border-blue-800 mb-1">
                        {post.opportunityTitle}
                      </span>
                      <h4 className="text-sm font-black text-white">{post.leaderName} ({post.leaderMajor})</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">{post.createdAt}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {post.neededRoles.map((r, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-amber-400/10 text-amber-400 border border-amber-400/30">
                        {r}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{post.description}</p>

                  <div className="pt-3 border-t border-blue-900/40 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Kontak Terverifikasi
                    </span>
                    <a
                      href={getContactUrl(post)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 font-black text-xs transition flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Hubungi Ketua Tim
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-xs text-slate-400 border border-dashed border-blue-900/40 rounded-2xl">
                Belum ada postingan tim untuk peluang ini. Jadilah yang pertama memasang lowongan!
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
};