'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Wallet, ArrowRight, PieChart, Lock, User, Mail, CheckCircle2, AlertCircle, X, Sun, Moon } from 'lucide-react';

export default function LandingPage() {
  const { login, register, resetPassword } = useAuth();
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot' | null>(null);

  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State untuk Mode Gelap / Terang Landing Page
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Cek preferensi awal / sinkronisasi dengan class html
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-300">
      
      {/* NAVBAR LANDING (Diselaraskan ke kiri secara profesional dengan padding optimal) */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 sticky top-0 z-40">
        <div className="w-full px-6 sm:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              F
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              Finance<span className="text-emerald-500">App</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Tombol Toggle Tema (Gelap/Terang) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center justify-center"
              title="Ganti Tema"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={() => { setAuthModalMode('login'); setStatusMsg(null); }}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            >
              Masuk
            </button>
            <button
              onClick={() => { setAuthModalMode('register'); setStatusMsg(null); }}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              Daftar Gratis <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide animate-pulse">
            <ShieldCheck className="w-4 h-4" /> Platform Manajemen Keuangan Profesional &amp; Aman
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
            Kendalikan Keuanganmu, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-400 dark:to-teal-200">
              Raih Kebebasan Finansial.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Catat pemasukan, atur pengeluaran multi-dompet, transfer antar rekening secara instan, dan pantau arus kas harian dalam satu platform modern berstandar perbankan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => { setAuthModalMode('register'); setStatusMsg(null); }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Mulai Kelola Keuangan <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setAuthModalMode('login'); setStatusMsg(null); }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all cursor-pointer"
            >
              Sudah punya akun? Masuk
            </button>
          </div>

          {/* FITUR UNGGULAN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Multi-Dompet &amp; Transfer</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Kelola rekening bank, e-wallet, dan tunai secara terpisah dengan fitur transfer antar dompet otomatis.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Analisis Arus Kas</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Pantau ringkasan pemasukan dan pengeluaran secara real-time dengan filter kategori dan periode waktu.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Keamanan Terjamin</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Sistem autentikasi aman dengan enkripsi lokal dan kemudahan ubah kata sandi berkala.</p>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-900 text-center text-xs text-slate-500">
        <p>© 2026 FinanceApp. All rights reserved. Platform Keuangan Profesional.</p>
      </footer>

      {/* MODAL AUTH (LOGIN / REGISTER / FORGOT) */}
      {authModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setAuthModalMode(null)}
              className="absolute right-5 top-5 p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                {authModalMode === 'login' ? <User className="w-6 h-6" /> : authModalMode === 'register' ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {authModalMode === 'login' ? 'Masuk ke FinanceApp' : authModalMode === 'register' ? 'Buat Akun Baru' : 'Pulihkan Kata Sandi'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {authModalMode === 'login' ? 'Kelola keuanganmu dengan aman dan profesional.' : authModalMode === 'register' ? 'Daftar dan mulai catat transaksi keuanganmu.' : 'Masukkan email terdaftar untuk reset sandi.'}
              </p>
            </div>

            {statusMsg && (
              <div className={`p-3.5 mb-4 rounded-2xl text-xs font-medium flex items-center gap-2 ${
                statusMsg.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}>
                {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                {statusMsg.text}
              </div>
            )}

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                setStatusMsg(null);
                if (authModalMode === 'login') {
                  const res = await login(emailInput, passInput);
                  if (res.success) {
                    setAuthModalMode(null);
                    setEmailInput('');
                    setPassInput('');
                  } else {
                    setStatusMsg({ type: 'error', text: res.message || 'Gagal login' });
                  }
                } else if (authModalMode === 'register') {
                  if (passInput.length < 6) {
                    setStatusMsg({ type: 'error', text: 'Kata sandi minimal 6 karakter.' });
                    return;
                  }
                  const res = await register(nameInput, emailInput, passInput);
                  if (res.success) {
                    setAuthModalMode(null);
                    setNameInput('');
                    setEmailInput('');
                    setPassInput('');
                  } else {
                    setStatusMsg({ type: 'error', text: res.message || 'Gagal registrasi' });
                  }
                } else if (authModalMode === 'forgot') {
                  const res = await resetPassword(emailInput);
                  if (res.success) {
                    setStatusMsg({ type: 'success', text: res.message || 'Instruksi terkirim.' });
                  } else {
                    setStatusMsg({ type: 'error', text: res.message || 'Email tidak ditemukan.' });
                  }
                }
              }} 
              className="space-y-4 text-xs"
            >
              {authModalMode === 'register' && (
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Alex Supriyanto"
                    className="w-full border rounded-2xl px-4 py-3 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="nama@example.com"
                    className="w-full border rounded-2xl pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {authModalMode !== 'forgot' && (
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Kata Sandi</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type="password"
                      required
                      value={passInput}
                      onChange={(e) => setPassInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border rounded-2xl pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {authModalMode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setAuthModalMode('forgot'); setStatusMsg(null); }}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {authModalMode === 'login' ? 'Masuk Sekarang' : authModalMode === 'register' ? 'Daftar Akun' : 'Kirim Instruksi'} <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                {authModalMode === 'login' ? (
                  <p className="text-slate-600 dark:text-slate-400">
                    Belum punya akun?{' '}
                    <button type="button" onClick={() => { setAuthModalMode('register'); setStatusMsg(null); }} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                      Buat akun
                    </button>
                  </p>
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">
                    Sudah punya akun?{' '}
                    <button type="button" onClick={() => { setAuthModalMode('login'); setStatusMsg(null); }} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                      Masuk
                    </button>
                  </p>
                )}
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}