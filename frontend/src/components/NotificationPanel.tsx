// frontend/src/components/NotificationPanel.tsx
'use client';

import React from 'react';
import { Flame, Sparkles, RefreshCw, Bell, Info, X } from 'lucide-react';
import { AppNotification } from '@/types';

interface NotificationPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClear?: () => void;
  onClearNotifications?: () => void;
  onNavigate?: (opportunityId: string) => void;
  onNavigateNotification?: (opportunityId: string) => void;
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; bg: string }> = {
  DEADLINE: {
    icon: <Flame className="w-4 h-4" />,
    bg: 'bg-red-500/10 text-red-500 border border-red-500/20',
  },
  NEW: {
    icon: <Sparkles className="w-4 h-4" />,
    bg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  },
  UPDATE: {
    icon: <RefreshCw className="w-4 h-4" />,
    bg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  },
  REMINDER: {
    icon: <Bell className="w-4 h-4" />,
    bg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  },
  INFO: {
    icon: <Info className="w-4 h-4" />,
    bg: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
  },
};

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClear,
  onClearNotifications,
  onNavigate,
  onNavigateNotification,
}) => {
  if (isOpen === false) return null;

  const handleClear = onClear || onClearNotifications;
  const handleNavigate = onNavigate || onNavigateNotification;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header Dropdown */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Notifikasi
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950">
              {unreadCount} baru
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onMarkAllRead}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Tandai Dibaca
          </button>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <button
            onClick={handleClear}
            className="text-[11px] font-semibold text-slate-400 hover:text-red-400 transition"
          >
            Hapus
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-200 transition ml-1"
              aria-label="Tutup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* List Notifikasi */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {notifications.length > 0 ? (
          notifications.map((n) => {
            const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.INFO;

            return (
              <div
                key={n.id}
                onClick={() => {
                  onMarkRead(n.id);
                  if (n.opportunityId) handleNavigate?.(n.opportunityId);
                  onClose?.();
                }}
                className={`p-3.5 cursor-pointer transition flex items-start gap-3 ${
                  n.isRead
                    ? 'bg-white dark:bg-slate-900 opacity-60 hover:opacity-100'
                    : 'bg-slate-50/80 dark:bg-slate-800/40'
                } hover:bg-slate-100 dark:hover:bg-slate-800/80`}
              >
                <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${config.bg}`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">
            Tidak ada notifikasi saat ini
          </div>
        )}
      </div>
    </div>
  );
};