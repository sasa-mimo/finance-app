'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, ArrowLeftRight, BarChart3 } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Dompet', href: '/assets', icon: Wallet },
    { name: 'Analisis', href: '/analytics', icon: BarChart3 }, // <-- MENU BARU
    { name: 'Riwayat', href: '/transactions', icon: ArrowLeftRight },
  ];

  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-2.5 flex justify-around items-center z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`flex flex-col items-center text-[11px] font-semibold gap-1 transition-colors ${
              isActive 
                ? 'text-emerald-400 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}