'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import LandingPage from './LandingPage';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import UserMenu from './UserMenu';
import { Sun, Moon } from 'lucide-react';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sinkronisasi tema dengan localStorage dan class 'dark' di HTML root
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Jika pengunjung belum login, tampilkan Landing Page Pengenalan
  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-30 border-b backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800/80 transition-colors duration-300 md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo Aplikasi */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              F
            </div>
            <span className="font-bold text-base tracking-tight">Finance<span className="text-emerald-500">App</span></span>
          </Link>

          {/* Bagian Kanan Header (Tombol Tema & User Menu) */}
          <div className="flex items-center gap-3">
            {/* Tombol Toggle Tema */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all shadow-sm cursor-pointer bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Menu Akun & Pop-up Profil */}
            <UserMenu />
          </div>

        </div>
      </header>

      {/* LAYOUT UTAMA (Sidebar & Konten Halaman) */}
      <div className="flex flex-1 flex-col md:flex-row md:pl-64">
        <Sidebar />
        <main className="flex-1 pb-24 md:pb-12 max-w-5xl mx-auto w-full p-4 md:p-8">
          {children}
        </main>
      </div>

      <MobileNav />

    </div>
  );
}