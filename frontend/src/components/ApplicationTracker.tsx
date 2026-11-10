'use client';

import React from 'react';
import { Opportunity, UserApplication, ApplicationStatus } from '@/types';
import { Building2, Trash2 } from 'lucide-react';

interface ApplicationTrackerProps {
  opportunities: Opportunity[];
  applications: Record<string, UserApplication>;
  onUpdateStatus: (oppId: string, status: ApplicationStatus) => void;
  onRemoveTrack: (oppId: string) => void;
  onOpenDetails: (opp: Opportunity) => void;
}

const COLUMNS: { id: ApplicationStatus; title: string; badgeColor: string }[] = [
  { id: 'saved', title: 'Tersimpan', badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  { id: 'preparing', title: 'Persiapan Berkas', badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
  { id: 'applied', title: 'Sudah Mendaftar', badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' },
  { id: 'interview', title: 'Tahap Wawancara', badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' },
  { id: 'accepted', title: 'Diterima 🎉', badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
  { id: 'rejected', title: 'Belum Rezeki', badgeColor: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300' },
];

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  opportunities,
  applications,
  onUpdateStatus,
  onRemoveTrack,
  onOpenDetails,
}) => {
  const trackedOpps = opportunities.filter((opp) => applications[opp.id]);

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="flex gap-4 min-w-[1000px]">
        {COLUMNS.map((col) => {
          const colItems = trackedOpps.filter(
            (opp) => applications[opp.id]?.status === col.id
          );

          return (
            <div
              key={col.id}
              className="flex-1 bg-slate-100/70 dark:bg-dark-card/60 rounded-2xl p-4 border border-slate-200/80 dark:border-dark-border flex flex-col min-h-[500px]"
            >
              {/* Header Kolom */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-dark-border">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${col.badgeColor}`}>
                  {col.title}
                </span>
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
                  {colItems.length}
                </span>
              </div>

              {/* List Kartu Lamaran */}
              <div className="flex-1 space-y-3">
                {colItems.length > 0 ? (
                  colItems.map((opp) => (
                    <div
                      key={opp.id}
                      className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-3.5 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h4 
                            onClick={() => onOpenDetails(opp)}
                            className="text-xs font-bold text-navy-950 dark:text-white hover:text-emerald-500 cursor-pointer line-clamp-2"
                          >
                            {opp.title}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                          <Building2 className="w-3 h-3 flex-shrink-0" /> {opp.organizer}
                        </p>
                      </div>

                      {/* Selector Ubah Status */}
                      <div className="pt-2 border-t border-slate-100 dark:border-dark-border flex items-center justify-between gap-2">
                        <select
                          value={applications[opp.id].status}
                          onChange={(e) => onUpdateStatus(opp.id, e.target.value as ApplicationStatus)}
                          className="text-[10px] font-semibold bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              Pindah: {c.title}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => onRemoveTrack(opp.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition"
                          title="Hapus dari Pelacakan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-dark-border rounded-xl flex items-center justify-center text-[11px] text-slate-400 text-center p-3">
                    Kosong
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};