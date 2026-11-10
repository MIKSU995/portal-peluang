'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Compass, BarChart2, Users, ChevronDown } from 'lucide-react';

export type NavTab = 'explore' | 'tracker' | 'teams';

interface NavDropdownProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  trackerCount?: number;
}

export default function NavDropdown({
  activeTab,
  onTabChange,
  trackerCount = 2,
}: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navOptions = [
    { id: 'explore' as NavTab, label: 'Jelajah Peluang', icon: Compass },
    { id: 'tracker' as NavTab, label: 'Tracker Lamaran', icon: BarChart2, badge: trackerCount },
    { id: 'teams' as NavTab, label: 'Cari Teman Tim', icon: Users },
  ];

  // Tutup dropdown saat mengeklik di luar elemen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = navOptions.find((opt) => opt.id === activeTab) || navOptions[0];
  const ActiveIcon = activeOption.icon;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Tombol Utama Dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md bg-amber-400 hover:bg-amber-500 text-slate-950 border border-amber-300 focus:outline-none"
      >
        <ActiveIcon className="w-4.5 h-4.5 text-slate-950" />
        <span>{activeOption.label}</span>
        {activeOption.badge !== undefined && (
          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-950 text-amber-400">
            {activeOption.badge}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 ml-1 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Menu List Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-[#0f172a] border border-slate-700/70 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="py-2">
            {navOptions.map((option) => {
              const Icon = option.icon;
              const isActive = option.id === activeTab;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    onTabChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-400/10 text-amber-400 font-semibold border-l-4 border-amber-400'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{option.label}</span>
                  </div>
                  {option.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                        isActive
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {option.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}