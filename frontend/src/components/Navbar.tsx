'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, LogOut, User as UserIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export interface AppNotification {
  id: string;
  title?: string;
  message?: string;
  read?: boolean;
  timestamp?: string;
  [key: string]: any;
}

export interface NavbarProps {
  isDark?: boolean;
  onToggleTheme?: () => void;
  bookmarkCount?: number;
  isBookmarkView?: boolean;
  onBookmarkClick?: () => void;
  notifications?: AppNotification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onClearNotifications?: () => void;
  onNavigateNotification?: (id: string) => void;
}

export function Navbar({
  isDark = false,
  onToggleTheme = () => {},
  bookmarkCount,
  isBookmarkView,
  onBookmarkClick,
}: NavbarProps = {}) {
  const { user, logout, openAuthModal } = useAuth();

  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* 1. Branding Logo Resmi */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-36 sm:w-44 flex items-center">
            <Image
              src="/kesempatankita-logo.png"
              alt="KesempatanKita Logo"
              width={160}
              height={36}
              className="object-contain h-9 w-auto group-hover:scale-105 transition-transform"
              priority
            />
          </div>
        </Link>

        {/* 2. Menu Aksi Kanan */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Switcher Mode Terang / Gelap dengan props yang sesuai */}
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

          {/* Tombol Bookmarks */}
          {onBookmarkClick ? (
            <button
              onClick={onBookmarkClick}
              className={`p-2 rounded-xl transition-all flex items-center gap-2 text-sm font-medium ${
                isBookmarkView
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                  : 'text-slate-600 hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
              title="Peluang Tersimpan"
            >
              <div className="relative">
                <Bookmark className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                {bookmarkCount !== undefined && bookmarkCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {bookmarkCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Bookmarks</span>
            </button>
          ) : (
            <Link
              href="/bookmarks"
              className="p-2 text-slate-600 hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all flex items-center gap-2 text-sm font-medium"
              title="Peluang Tersimpan"
            >
              <div className="relative">
                <Bookmark className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                {bookmarkCount !== undefined && bookmarkCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {bookmarkCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Bookmarks</span>
            </Link>
          )}

          {/* Menu Kondisional Autentikasi User */}
          {user ? (
            <>
              {/* Profile User Badge */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-2 pr-3 py-1.5 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  {user.name ? user.name[0].toUpperCase() : 'M'}
                </div>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 hidden sm:inline">
                  {user.name}
                </span>
              </div>

              {/* Tombol Logout */}
              <button
                onClick={logout}
                className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-colors"
                title="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm shadow-md shadow-amber-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserIcon className="w-4 h-4" />
              <span>Masuk / Daftar</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;