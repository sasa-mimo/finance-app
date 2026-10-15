'use client';

import React, { useState, useMemo } from 'react';
import { useFinanceContext, Transaction } from '@/context/FinanceContext';
import { 
  TrendingUp, 
  Calendar, 
  PieChart, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock,
  AlertCircle
} from 'lucide-react';

export default function AnalyticsPage() {
  const { transactions = [] } = useFinanceContext();
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [viewType, setViewType] = useState<'ALL' | 'EXPENSE' | 'INCOME'>('ALL');

  // 1. Generate daftar bulan (Format: "YYYY-MM")
  const availableMonths = useMemo(() => {
    const months = transactions
      .filter(t => t.date)
      .map(t => t.date.substring(0, 7));
    return Array.from(new Set(months)).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const formatMonthYear = (YYYY_MM: string) => {
    if (!YYYY_MM) return '';
    const [year, month] = YYYY_MM.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
  };

  // 2. Filter transaksi berdasarkan bulan
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx: Transaction) => {
      if (selectedMonth === 'all') return true;
      const txMonth = tx.date ? tx.date.substring(0, 7) : '';
      return txMonth === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  // 3. Kalkulasi Total
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const netCashFlow = totalIncome - totalExpense;

  // 4. Hitung Rata-Rata Pengeluaran Harian
  const dailyAverageExpense = useMemo(() => {
    if (totalExpense === 0) return 0;
    
    if (selectedMonth !== 'all') {
      const [year, month] = selectedMonth.split('-').map(Number);
      const daysInMonth = new Date(year, month, 0).getDate();
      return totalExpense / daysInMonth;
    }

    const uniqueDates = new Set(filteredTransactions.filter(t => t.type === 'EXPENSE').map(t => t.date));
    const dayCount = uniqueDates.size || 30;
    return totalExpense / dayCount;
  }, [totalExpense, selectedMonth, filteredTransactions]);

  // 5. Breakdown Pengeluaran per Kategori
  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTransactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        const cat = t.category || 'Lainnya';
        map[cat] = (map[cat] || 0) + t.amount;
      });

    return Object.entries(map)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions, totalExpense]);

  const topExpenseCategory = expenseByCategory.length > 0 ? expenseByCategory[0] : null;

  // 6. Breakdown Pemasukan per Kategori
  const incomeByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTransactions
      .filter(t => t.type === 'INCOME')
      .forEach(t => {
        const cat = t.category || 'Lainnya';
        map[cat] = (map[cat] || 0) + t.amount;
      });

    return Object.entries(map)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions, totalIncome]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 pb-28 pt-2">
      
      {/* HEADER & FILTER PERIODE */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" /> Analisis Keuangan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Statistik dan alokasi arus kas uangmu.
          </p>
        </div>

        <div className="relative">
          <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded-2xl pl-8 pr-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 outline-none cursor-pointer appearance-none shadow-sm focus:border-emerald-500"
          >
            <option value="all">📅 Semua Waktu</option>
            {availableMonths.map(month => (
              <option key={month} value={month}>{formatMonthYear(month)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB FILTER (SEMUA / PENGELUARAN / PEMASUKAN) */}
      <div className="flex p-1 bg-slate-200/60 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setViewType('ALL')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            viewType === 'ALL'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setViewType('EXPENSE')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            viewType === 'EXPENSE'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-rose-500'
          }`}
        >
          Pengeluaran
        </button>
        <button
          onClick={() => setViewType('INCOME')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            viewType === 'INCOME'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500'
          }`}
        >
          Pemasukan
        </button>
      </div>

      {/* HERO CARD: RINGKASAN ARUS KAS (NET) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Sisa Arus Kas (Net)</span>
            <span className={`text-xl sm:text-2xl font-extrabold ${netCashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {netCashFlow >= 0 ? `+${formatRupiah(netCashFlow)}` : formatRupiah(netCashFlow)}
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
            netCashFlow >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            {netCashFlow >= 0 ? 'Surplus' : 'Defisit'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1 flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" /> Total Pemasukan
            </span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 block truncate">
              +{formatRupiah(totalIncome)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" /> Total Pengeluaran
            </span>
            <span className="text-sm sm:text-base font-extrabold text-rose-600 dark:text-rose-400 block truncate">
              -{formatRupiah(totalExpense)}
            </span>
          </div>
        </div>
      </div>

      {/* 2-KOLOM BERDAMPINGAN: RATA-RATA HARIAN & TERBOROS */}
      {(viewType === 'ALL' || viewType === 'EXPENSE') && (
        <div className="grid grid-cols-2 gap-3">
          {/* Rata-Rata Harian */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500 flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">Rata-Rata / Hari</span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white block truncate mt-0.5">
                {formatRupiah(dailyAverageExpense)}
              </span>
            </div>
          </div>

          {/* Kategori Terboros */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500 flex-shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">Terbesar ({topExpenseCategory ? `${topExpenseCategory.percentage.toFixed(0)}%` : '0%'})</span>
              <span className="text-xs sm:text-sm font-extrabold text-rose-600 dark:text-rose-400 block truncate mt-0.5">
                {topExpenseCategory ? topExpenseCategory.category : '-'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ALOKASI PENGELUARAN */}
      {(viewType === 'ALL' || viewType === 'EXPENSE') && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-rose-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Alokasi Pengeluaran</h3>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {expenseByCategory.length} Kategori
            </span>
          </div>

          {expenseByCategory.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              Belum ada data pengeluaran.
            </div>
          ) : (
            <div className="space-y-3.5">
              {expenseByCategory.map((item, index) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{item.category}</span>
                      {index === 0 && (
                        <span className="px-1.5 py-0.2 bg-rose-500/10 text-rose-500 font-bold text-[9px] rounded-md">
                          Tertinggi
                        </span>
                      )}
                    </div>
                    <div className="text-right font-medium">
                      <span className="font-bold text-slate-900 dark:text-white">{formatRupiah(item.amount)}</span>
                      <span className="text-slate-400 text-[10px] ml-1.5">({item.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-800/60">
                    <div 
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUMBER PEMASUKAN */}
      {(viewType === 'ALL' || viewType === 'INCOME') && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Sumber Pemasukan</h3>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {incomeByCategory.length} Sumber
            </span>
          </div>

          {incomeByCategory.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              Belum ada data pemasukan.
            </div>
          ) : (
            <div className="space-y-3.5">
              {incomeByCategory.map((item) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{item.category}</span>
                    <div className="text-right font-medium">
                      <span className="font-bold text-slate-900 dark:text-white">+{formatRupiah(item.amount)}</span>
                      <span className="text-slate-400 text-[10px] ml-1.5">({item.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-800/60">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}