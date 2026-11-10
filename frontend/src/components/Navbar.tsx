// frontend/src/components/Navbar.tsx
'use client';

import React, { useState } from 'react';
import { Bell, Bookmark, Moon, Sun } from 'lucide-react';
import { AppNotification } from '@/types';
import { NotificationPanel } from '@/components/NotificationPanel';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  bookmarkCount: number;
  isBookmarkView: boolean;
  onBookmarkClick: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
  onNavigateNotification: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDark,
  onToggleTheme,
  bookmarkCount,
  isBookmarkView,
  onBookmarkClick,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClearNotifications,
  onNavigateNotification,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-[#070C1E]/95 backdrop-blur-md border-b border-blue-900/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-2 flex items-center justify-between">
        
        {/* Brand Logo & Teks Proporsional */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <img
            src="/kesempatankita-icon.png"
            alt="KesempatanKita Icon"
            className="h-11 w-11 object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col justify-center">
            <span className="text-xl font-black text-white tracking-tight leading-none">
              Kesempatan<span className="text-amber-400">Kita</span>
            </span>
            <span className="text-[11px] font-bold text-blue-300/90 mt-1 tracking-wide">
              Jelajahi Peluang, Raih Masa Depan
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-3">
          {/* Bookmark Button */}
          <button
            onClick={onBookmarkClick}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition ${
              isBookmarkView
                ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300/40'
                : 'bg-blue-950/80 text-slate-200 border border-blue-900/50 hover:bg-slate-800 hover:text-amber-400'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Bookmark</span>
            {bookmarkCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 text-amber-400 font-black">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Notification Trigger & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2.5 rounded-xl bg-blue-950/80 text-slate-200 border border-blue-900/50 hover:bg-slate-800 hover:text-amber-400 transition relative"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center justify-center ring-2 ring-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>

            <NotificationPanel
              isOpen={notifOpen}
              onClose={() => setNotifOpen(false)}
              notifications={notifications}
              onMarkRead={onMarkRead}
              onMarkAllRead={onMarkAllRead}
              onClear={onClearNotifications}
              onNavigate={onNavigateNotification}
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl bg-blue-950/80 text-slate-200 border border-blue-900/50 hover:bg-slate-800 hover:text-amber-400 transition"
            aria-label="Ganti Tema"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-300" />}
          </button>

          {/* Profil Mahasiswa Badge */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-blue-900/60">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center ring-2 ring-amber-400/40">
              EU
            </div>
            <span className="text-xs font-extrabold text-slate-200">Mahasiswa Aktif</span>
          </div>
        </div>

      </div>
    </header>
  );
};