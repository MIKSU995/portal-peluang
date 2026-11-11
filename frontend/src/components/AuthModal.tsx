'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, GraduationCap, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: any) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('Universitas Esa Unggul');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const endpoint = mode === 'login' ? `${apiUrl}/auth/login` : `${apiUrl}/auth/register`;

    const payload =
      mode === 'login'
        ? { email, password }
        : { email, password, name, university, role: 'STUDENT' };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat autentikasi.');
      }

      // Simpan token ke localStorage & update state induk
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.data.user));

      onSuccess(data.data.token, data.data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0b1329] border border-blue-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20 mb-3">
            K
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {mode === 'login' ? 'Selamat Datang Kembali!' : 'Buat Akun Mahasiswa'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Masuk ke akun KesempatanKita untuk melacak lamaran & bookmark'
              : 'Daftar sekarang untuk mengakses rekomendasi peluang karir & beasiswa'}
          </p>
        </div>

        {/* Alert Error */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form Auth */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Fahmi Hartanto"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Perguruan Tinggi</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="Universitas Esa Unggul"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Mahasiswa</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mahasiswa@esaunggul.ac.id"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Memproses...' : mode === 'login' ? 'Masuk Akun' : 'Daftar Sekarang'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch Mode */}
        <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Daftar Akun Baru
              </button>
            </p>
          ) : (
            <p>
              Sudah memiliki akun?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Masuk di Sini
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}