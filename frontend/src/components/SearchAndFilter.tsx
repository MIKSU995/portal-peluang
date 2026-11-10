// frontend/src/components/SearchAndFilter.tsx
'use client';

import React from 'react';
import { Search, ShieldCheck, X } from 'lucide-react';
import { FilterState } from '@/types';

interface SearchAndFilterProps {
  filters: FilterState;
  onFilterChange: (f: Partial<FilterState>) => void;
  availableMajors: string[];
}

const CATEGORIES = [
  { label: 'Semua Peluang', value: '' },
  { label: '💼 Magang', value: 'MAGANG' },
  { label: '🎓 Beasiswa', value: 'BEASISWA' },
  { label: '🏆 Kompetisi', value: 'LOMBA' },
  { label: '🚀 MBKM', value: 'MBKM' },
];

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  filters, onFilterChange, availableMajors,
}) => {
  const hasActive = filters.q || filters.category || filters.major || filters.isVerifiedOnly;

  return (
    <div className="bg-white dark:bg-dark-card border border-slate-200/90 dark:border-dark-border rounded-3xl p-5 sm:p-6 shadow-card mb-8 space-y-4 transition-colors">
      
      {/* Search bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={filters.q}
          onChange={(e) => onFilterChange({ q: e.target.value })}
          placeholder="Cari magang, beasiswa, lomba, atau penyelenggara..."
          className="
            w-full pl-12 pr-10 py-3.5 rounded-2xl text-sm font-medium
            bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border
            text-navy-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-dark-card
            transition-all
          "
        />
        {filters.q && (
          <button onClick={() => onFilterChange({ q: '' })} className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onFilterChange({ category: cat.value })}
            className={`
              px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all
              ${filters.category === cat.value
                ? 'bg-navy-950 dark:bg-brand-500 text-white dark:text-navy-950 shadow-sm scale-[1.02]'
                : 'bg-slate-100 dark:bg-dark-surface text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-hover'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Advanced filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-dark-border">
        <select
          value={filters.major}
          onChange={(e) => onFilterChange({ major: e.target.value })}
          className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-navy-950 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">🎯 Semua Jurusan</option>
          {availableMajors.map((m, i) => <option key={i} value={m}>{m}</option>)}
        </select>

        <select
          value={filters.sort}
          onChange={(e) => onFilterChange({ sort: e.target.value as any })}
          className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-navy-950 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="deadline_asc">⏳ Tenggat Terdekat</option>
          <option value="deadline_desc">📅 Tenggat Terlama</option>
          <option value="newest">✨ Terbaru Ditambahkan</option>
          <option value="popular">🔥 Paling Populer</option>
        </select>

        <label className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border cursor-pointer hover:bg-slate-100 dark:hover:bg-dark-hover transition-colors">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-bold text-navy-950 dark:text-slate-200">Sumber Resmi</span>
          </div>
          <input
            type="checkbox"
            checked={filters.isVerifiedOnly}
            onChange={(e) => onFilterChange({ isVerifiedOnly: e.target.checked })}
            className="w-4 h-4 rounded accent-brand-500 cursor-pointer"
          />
        </label>
      </div>

      {/* Reset active filters */}
      {hasActive && (
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <span className="text-slate-500 dark:text-slate-400">Filter aktif diterapkan</span>
          <button
            onClick={() => onFilterChange({ q: '', category: '', major: '', sort: 'deadline_asc', isVerifiedOnly: false })}
            className="text-red-500 dark:text-red-400 font-bold hover:underline"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
};
