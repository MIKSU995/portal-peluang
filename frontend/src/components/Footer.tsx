'use client';

import React from 'react';
import { ShieldCheck, Github, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-[#040714] border-t border-blue-900/40 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Branding & Deskripsi */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-slate-950 text-lg shadow-md shadow-amber-500/20">
              K
            </div>
            <span className="font-bold text-lg text-white">KesempatanKita</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Portal agregator peluang karir, beasiswa, kompetisi, dan program MBKM terintegrasi untuk mahasiswa Indonesia.
          </p>
        </div>

        {/* Kategori Peluang */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Kategori Peluang</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-amber-400 transition">Program MBKM &amp; Kampus Merdeka</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Beasiswa Dalam &amp; Luar Negeri</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Magang Industri &amp; Korporat</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Kompetisi &amp; Lomba Mahasiswa</a></li>
          </ul>
        </div>

        {/* Fitur Utama */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Fitur Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-amber-400 transition">Jelajah Peluang Karir</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Pelacak Status Lamaran (Tracker)</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Cari Teman Tim Kolaborasi</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Integrasi Kalender Deadline</a></li>
          </ul>
        </div>

        {/* Hubungi Kami */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Kontak &amp; Komunitas</h4>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            Punya saran atau peluang resmi yang ingin dipublikasikan?
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/MIKSU995"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="mailto:support@kesempatankita.id"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition"
              title="Email Support"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Strip */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>© {new Date().getFullYear()} KesempatanKita. Dibuat untuk Mahasiswa Indonesia.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Sumber Terverifikasi
          </span>
        </div>
      </div>
    </footer>
  );
}