'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Wallet, ArrowLeftRight, BarChart3 } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutGrid },
    { name: 'Dompet & Aset', href: '/assets', icon: Wallet },
    { name: 'Riwayat', href: '/transactions', icon: ArrowLeftRight },
    { name: 'Analisis', href: '/analytics', icon: BarChart3 }, // <-- MENU BARU DITAMBAHKAN
  ];

  return (
    /* PERBAIKAN: Menggunakan `fixed top-0 left-0 z-40` agar sidebar terkunci diam di kiri */
    <aside className="hidden md:flex fixed top-0 left-0 w-64 h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300 flex-col justify-between p-6 z-40">
      <div>
        {/* Header/Logo Sidebar */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-emerald-500 rounded-2xl text-slate-950 shadow-md shadow-emerald-500/20">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white leading-none">FinanceApp</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Professional MVP</span>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all font-semibold text-sm ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profil User di Bagian Bawah */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm shadow-sm">
            N
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 dark:text-white">Pengguna</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Personal Account</span>
          </div>
        </div>
      </div>
    </aside>
  );
}