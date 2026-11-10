// frontend/src/components/OpportunityModal.tsx
'use client';

import React, { useState } from 'react';
import { Opportunity } from '@/types';
import {
  X, ExternalLink, Calendar, MapPin, Building2,
  CheckCircle2, Award, Bookmark, Users, ChevronDown, Download
} from 'lucide-react';
import { getGoogleCalendarUrl, downloadIcsFile as downloadICalFile } from '@/lib/calendar';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onOpenTeamFinder?: (oppId: string) => void;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({
  opportunity: opp,
  onClose,
  onOpenTeamFinder,
}) => {
  const [calDropdownOpen, setCalDropdownOpen] = useState(false);

  if (!opp) return null;

  const rewardText = opp.reward || opp.stipendOrPrize;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0A122E] border border-blue-900/60 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Modal */}
        <div className="p-6 border-b border-blue-900/50 flex items-start justify-between gap-4 bg-blue-950/30">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-lg text-xs font-black bg-blue-950 text-cyan-300 border border-blue-800">
                {opp.category}
              </span>
              {opp.isVerified && (
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-emerald-950/60 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sumber Resmi
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-snug">{opp.title}</h2>
            <p className="text-xs font-semibold text-blue-300/80 flex items-center gap-1.5 mt-1">
              <Building2 className="w-3.5 h-3.5 text-blue-400" /> {opp.organizer}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-blue-900/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Batas Waktu</span>
              <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {opp.deadline}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-blue-900/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Lokasi</span>
              <span className="text-xs font-extrabold text-white flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {opp.location}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-blue-900/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Benefit</span>
              <span className="text-xs font-extrabold text-amber-200 flex items-center gap-1 truncate">
                <Award className="w-3.5 h-3.5 text-amber-400" /> {rewardText || 'Sertifikat'}
              </span>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Tentang Program</h4>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/50 border border-blue-900/40 p-4 rounded-2xl">
              {opp.description}
            </p>
          </div>

          {/* Persyaratan */}
          {opp.requirements && opp.requirements.length > 0 && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Persyaratan</h4>
              <ul className="space-y-2">
                {opp.requirements.map((req, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Relevansi Jurusan */}
          {opp.majors && opp.majors.length > 0 && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Relevansi Jurusan</h4>
              <div className="flex flex-wrap gap-2">
                {opp.majors.map((m, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-slate-200 border border-blue-900/60">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-5 bg-slate-950/80 border-t border-blue-900/50 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            {/* Dropdown Simpan ke Kalender */}
            <div className="relative">
              <button
                onClick={() => setCalDropdownOpen(!calDropdownOpen)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-slate-200 border border-blue-900/60 hover:text-amber-400 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" /> Simpan ke Kalender <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {calDropdownOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-52 bg-slate-900 border border-blue-900/60 rounded-xl shadow-2xl p-1.5 z-20 space-y-1">
                  <a
                    href={getGoogleCalendarUrl(opp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setCalDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:bg-blue-950 hover:text-amber-400 transition"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> Google Calendar
                  </a>
                  <button
                    onClick={() => {
                      downloadICalFile(opp);
                      setCalDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:bg-blue-950 hover:text-cyan-400 transition text-left"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" /> Unduh file iCal (.ics)
                  </button>
                </div>
              )}
            </div>

            {/* Tombol Cari Teman Tim */}
            {onOpenTeamFinder && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTeamFinder(opp.id);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-slate-200 border border-blue-900/60 hover:text-amber-400 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Users className="w-4 h-4 text-amber-400" /> Cari Teman Tim
              </button>
            )}
          </div>

          {/* Tombol Daftar Sekarang */}
          <a
            href={opp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition shadow-lg flex items-center gap-2"
          >
            Daftar Sekarang <ExternalLink className="w-4 h-4" />
          </a>

        </div>

      </div>
    </div>
  );
};