'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/context/AuthContext';
import { KeyRound, LogOut, X, CheckCircle2, AlertCircle, ShieldCheck, User, Lock, Mail, ArrowRight } from 'lucide-react';

export default function UserMenu() {
  const { user, login, register, logout, resetPassword, changePassword } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot' | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form States
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  
  // Change Password States
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Jika belum login, tampilkan tombol Masuk
  if (!user) {
    return (
      <>
        <button
          onClick={() => { setAuthModalMode('login'); setStatusMsg(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <User className="w-4 h-4" /> Masuk
        </button>

        {/* MODAL AUTH (LOGIN / REGISTER / FORGOT) */}
        {authModalMode && mounted && createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
              
              <button 
                onClick={() => setAuthModalMode(null)}
                className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
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
                    <label className="block font-semibold text-slate-500 mb-1">Nama Lengkap</label>
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
                  <label className="block font-semibold text-slate-500 mb-1">Alamat Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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
                    <label className="block font-semibold text-slate-500 mb-1">Kata Sandi</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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
                      className="text-emerald-500 hover:underline font-semibold"
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
                    <p className="text-slate-500">
                      Belum punya akun?{' '}
                      <button type="button" onClick={() => { setAuthModalMode('register'); setStatusMsg(null); }} className="text-emerald-500 font-bold hover:underline">
                        Buat akun
                      </button>
                    </p>
                  ) : (
                    <p className="text-slate-500">
                      Sudah punya akun?{' '}
                      <button type="button" onClick={() => { setAuthModalMode('login'); setStatusMsg(null); }} className="text-emerald-500 font-bold hover:underline">
                        Masuk
                      </button>
                    </p>
                  )}
                </div>
              </form>

            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  // Handle Ubah Kata Sandi Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (newPass.length < 6) {
      setStatusMsg({ type: 'error', text: 'Kata sandi baru minimal 6 karakter.' });
      return;
    }

    if (newPass !== confirmPass) {
      setStatusMsg({ type: 'error', text: 'Konfirmasi kata sandi baru tidak cocok.' });
      return;
    }

    const res = await changePassword(oldPass, newPass);
    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message || 'Kata sandi berhasil diubah.' });
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setStatusMsg(null);
      }, 1500);
    } else {
      setStatusMsg({ type: 'error', text: res.message || 'Gagal mengubah kata sandi.' });
    }
  };

  return (
    <div className="relative">
      {/* Tombol Profil Nama Pengguna */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
      >
        <div className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-xs shadow-md shadow-emerald-500/20">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{user.name}</p>
        </div>
      </button>

      {/* Pop-up Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-3 mb-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Akun Terverifikasi
              </span>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => { setIsOpen(false); setShowPasswordModal(true); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
              >
                <KeyRound className="w-4 h-4 text-emerald-500" /> Pengaturan Kata Sandi
              </button>

              <button
                onClick={() => { setIsOpen(false); logout(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4 text-rose-500" /> Keluar (Logout)
              </button>
            </div>

          </div>
        </>
      )}

      {/* MODAL GANTI SANDI MENGGUNAKAN PORTAL KE DOCUMENT BODY */}
      {showPasswordModal && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setShowPasswordModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ubah Kata Sandi</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Amankan akun keuanganku secara berkala.</p>
              </div>
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

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  required
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border rounded-2xl px-4 py-3 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-500 mb-1">Kata Sandi Baru</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full border rounded-2xl px-4 py-3 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-500 mb-1">Konfirmasi Kata Sandi Baru</label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full border rounded-2xl px-4 py-3 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  Simpan Sandi
                </button>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}