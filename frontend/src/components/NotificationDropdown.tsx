// frontend/src/components/NotificationDropdown.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Flame, 
  Sparkles, 
  CheckCheck, 
  Clock, 
  Trash2, 
  ExternalLink,
  Info
} from 'lucide-react';

import {AppNotification as NotificationItem } from '@/types';

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  // Mendukung nama prop standar dan alias callback Navbar
  onMarkAsRead?: (id: string) => void;
  onMarkRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
  onClearNotifications?: () => void;
  onSelectNotification?: (opportunityId?: string) => void;
  onNavigateNotification?: (opportunityId: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications = [],
  onMarkAsRead,
  onMarkRead,
  onMarkAllAsRead,
  onMarkAllRead,
  onClearAll,
  onClearNotifications,
  onSelectNotification,
  onNavigateNotification,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fallback handlers agar cocok dengan prop dari Navbar
  const handleMarkAsRead = (id: string) => {
    if (onMarkAsRead) onMarkAsRead(id);
    else if (onMarkRead) onMarkRead(id);
  };

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) onMarkAllAsRead();
    else if (onMarkAllRead) onMarkAllRead();
  };

  const handleClearAll = () => {
    if (onClearAll) onClearAll();
    else if (onClearNotifications) onClearNotifications();
  };

  const handleSelectNotification = (opportunityId?: string) => {
    if (!opportunityId) return;
    if (onSelectNotification) onSelectNotification(opportunityId);
    else if (onNavigateNotification) onNavigateNotification(opportunityId);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    return true;
  });

  const getNotificationIcon = (type: NotificationItem['type'] | string) => {
    switch (type) {
      case 'DEADLINE':
        return (
          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
        );
      case 'NEW':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        );
      case 'REMINDER':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tombol Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Buka Notifikasi"
        className="relative p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-slate-200 dark:border-dark-border z-50 overflow-hidden animate-in fade-in duration-150">
          {/* Header Popover */}
          <div className="p-4 border-b border-slate-100 dark:border-dark-border bg-slate-50/70 dark:bg-dark-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-navy-900 dark:text-white">Notifikasi</h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300">
                    {unreadCount} baru
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Tandai dibaca
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-navy-900 dark:bg-slate-700 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                Semua ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeTab === 'unread'
                    ? 'bg-navy-900 dark:bg-slate-700 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                Belum Dibaca ({unreadCount})
              </button>
            </div>
          </div>

          {/* List Item Notifikasi */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-dark-border">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.isRead) handleMarkAsRead(notif.id);
                    if (notif.opportunityId) {
                      handleSelectNotification(notif.opportunityId);
                      setIsOpen(false);
                    }
                  }}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    notif.isRead
                      ? 'bg-white dark:bg-dark-card hover:bg-slate-50 dark:hover:bg-dark-cardHover opacity-80'
                      : 'bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30'
                  }`}
                >
                  {getNotificationIcon(notif.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className={`text-xs font-bold truncate ${
                        notif.isRead ? 'text-navy-900 dark:text-slate-200' : 'text-emerald-700 dark:text-emerald-400'
                      }`}>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-1.5">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                      <span>{notif.timestamp || (notif as unknown as { createdAt?: string }).createdAt || ''}</span>
                      {notif.opportunityId && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-0.5">
                          Buka detail <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 px-4 text-center">
                <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Tidak ada notifikasi {activeTab === 'unread' ? 'belum dibaca' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Footer Popover */}
          {notifications.length > 0 && (
            <div className="p-2.5 border-t border-slate-100 dark:border-dark-border bg-slate-50 dark:bg-dark-card text-center">
              <button
                onClick={handleClearAll}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-1.5 w-full py-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Bersihkan Riwayat Notifikasi
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};