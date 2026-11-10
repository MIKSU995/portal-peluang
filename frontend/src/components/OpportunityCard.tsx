// frontend/src/components/OpportunityCard.tsx
'use client';

import React from 'react';
import {
  Calendar, Bookmark, CheckCircle2,
  GraduationCap, Award, Briefcase, BookOpen, Coins,
  Flame, ChevronRight, Trophy, Sparkles
} from 'lucide-react';
import { Opportunity } from '@/types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onBookmarkToggle?: (id: string, newStatus: boolean) => void;
  onOpenDetails?: (opportunity: Opportunity) => void;
}

function getDaysLeft(deadline: string) {
  const target = new Date(deadline).getTime();
  const now = Date.now();
  if (isNaN(target)) return 0;
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

interface CategoryStyle {
  badge: string;
  icon: React.ReactNode;
  label: string;
}

const CATEGORY_CONFIG: Record<string, CategoryStyle> = {
  MAGANG: {
    badge: 'bg-blue-950/80 text-blue-300 border-blue-700/60',
    icon: <Briefcase className="w-3 h-3 mr-1 text-blue-400" />,
    label: 'Magang',
  },
  BEASISWA: {
    badge: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    icon: <Award className="w-3 h-3 mr-1 text-amber-400" />,
    label: 'Beasiswa',
  },
  LOMBA: {
    badge: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    icon: <Trophy className="w-3 h-3 mr-1 text-amber-400" />,
    label: 'Kompetisi',
  },
  KOMPETISI: {
    badge: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    icon: <Trophy className="w-3 h-3 mr-1 text-amber-400" />,
    label: 'Kompetisi',
  },
  MBKM: {
    badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-600/50',
    icon: <BookOpen className="w-3 h-3 mr-1 text-cyan-400" />,
    label: 'MBKM',
  },
};

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity: opp,
  onBookmarkToggle,
  onOpenDetails,
}) => {
  const daysLeft = getDaysLeft(opp.deadline);
  
  const normalizedCategory = (opp.category || '').toString().toUpperCase();
  const catCfg: CategoryStyle = CATEGORY_CONFIG[normalizedCategory] || CATEGORY_CONFIG.MAGANG;
  
  const rewardText = opp.reward || opp.stipendOrPrize;
  const isOfficialVerified = opp.isVerified || opp.isOfficial;

  const deadlineBadge = (() => {
    if (daysLeft < 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400">
          <Calendar className="w-3 h-3" />
          Ditutup
        </span>
      );
    }
    if (daysLeft <= 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-red-600 text-white animate-pulse">
          <Flame className="w-3 h-3 fill-current" />
          H-{daysLeft} Mendesak
        </span>
      );
    }
    if (daysLeft <= 7) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
          <Calendar className="w-3 h-3 text-amber-400" />
          H-{daysLeft} Tersisa
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800/80 text-blue-200 border border-blue-900/50">
        <Calendar className="w-3 h-3 text-blue-400" />
        H-{daysLeft}
      </span>
    );
  })();

  return (
    <article
      onClick={() => onOpenDetails?.(opp)}
      className="
        group cursor-pointer bg-slate-900/90 dark:bg-slate-900/90
        border border-blue-900/40 dark:border-blue-900/40
        rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-900/20
        hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between
      "
    >
      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        {/* Badges + Bookmark */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold border ${catCfg.badge}`}>
              {catCfg.icon}{catCfg.label}
            </span>
            {isOfficialVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-extrabold bg-blue-950/60 text-cyan-300 border border-cyan-500/30">
                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                Resmi
              </span>
            )}
            {opp.matchScore !== undefined && opp.matchScore >= 75 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-black bg-amber-400 text-slate-950 shadow-sm">
                <Sparkles className="w-3 h-3 text-slate-950" />
                {opp.matchScore}% Sangat Relevan
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle?.(opp.id, !opp.isBookmarked);
            }}
            aria-label="Simpan"
            className={`p-2 rounded-xl transition-colors ${
              opp.isBookmarked
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                : 'text-slate-400 hover:bg-slate-800 hover:text-amber-400'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${opp.isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Judul + Organizer */}
        <div>
          <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {opp.title}
          </h3>
          <p className="text-xs font-semibold text-blue-300/80 mt-0.5">{opp.organizer}</p>
        </div>

        {/* Deskripsi */}
        {opp.description && (
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed flex-1">
            {opp.description}
          </p>
        )}

        {/* Benefit */}
        {rewardText && (
          <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-slate-950/60 border border-blue-950">
            <Coins className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-xs font-bold text-amber-200 truncate">{rewardText}</span>
          </div>
        )}

        {/* Jurusan */}
        {opp.majors && opp.majors.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <GraduationCap className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            {opp.majors.slice(0, 2).map((m, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-200 border border-blue-900/40">
                {m}
              </span>
            ))}
            {opp.majors.length > 2 && (
              <span className="text-[11px] text-amber-400 font-bold">+{opp.majors.length - 2}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-950/80 border-t border-blue-900/40 flex items-center justify-between rounded-b-2xl">
        {deadlineBadge}
        <span className="text-xs font-extrabold text-amber-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
          Detail <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};