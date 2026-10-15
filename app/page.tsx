'use client';

import React, { useState } from 'react';
import { useFinanceContext } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext'; // Panggil AuthContext untuk cek user
import AddTransactionModal from '@/components/transactions/AddTransactionModal';
import LandingPage from '@/components/layout/LandingPage';

export default function HomePage() {
  const { wallets, transactions, addTransaction } = useFinanceContext();
  const { user } = useAuth(); // Ambil status user dari AuthContext (sesuaikan jika propertinya userEmail)
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSummary, setActiveSummary] = useState<'INCOME' | 'EXPENSE'>('INCOME');

  // --- 1. JIKA BELUM LOGIN / USER KOSONG, TAMPILKAN LANDING PAGE ---
  if (!user) {
    return <LandingPage />;
  }

  // --- 2. JIKA SUDAH LOGIN, TAMPILKAN DASHBOARD ---
  const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0);
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const formattedAssets = wallets.map((w) => ({
    id: w.id,
    name: w.name,
    currentBalance: w.balance,
  }));

  const handleAddTransaction = async (formData: FormData) => {
    const txType = formData.get('type') as 'INCOME' | 'EXPENSE' | 'TRANSFER';
    
    const newTx = {
      id: crypto.randomUUID(),
      type: txType,
      amount: Number(formData.get('amount')),
      walletId: formData.get('fromAssetId') as string,
      targetWalletId: (formData.get('toAssetId') as string) || undefined,
      category: formData.get('category') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      description: formData.get('description') as string,
      notes: formData.get('notes') as string,
      merchant: formData.get('merchant') as string,
      location: formData.get('location') as string,
      tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    addTransaction(newTx);
  };

  const regularWallets = wallets.filter((w) => w.assetType !== 'INVESTMENT');
  const investmentWallets = wallets.filter((w) => w.assetType === 'INVESTMENT');

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Manajemen Keuangan</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pantau arus kas dan saldo dompet kamu.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3.5 sm:py-3 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex justify-center items-center gap-2 text-sm active:scale-95 cursor-pointer"
          >
            <span className="text-lg leading-none">+</span> Tambah Transaksi
          </button>
        </div>

        {/* KARTU RINGKASAN SALDO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl dark:bg-slate-900 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold relative z-10">Total Saldo</p>
            <h2 className="text-3xl font-black mt-2 relative z-10 break-words">
              Rp {totalBalance.toLocaleString('id-ID')}
            </h2>
          </div>

          <div className="hidden md:grid grid-cols-2 md:grid-cols-1 md:col-span-2 gap-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
              <p className="text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold">Pemasukan</p>
              <h2 className="text-lg sm:text-2xl font-extrabold mt-1 text-emerald-600 dark:text-emerald-400 break-words">
                +Rp {totalIncome.toLocaleString('id-ID')}
              </h2>
            </div>
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
              <p className="text-[11px] sm:text-xs text-rose-600 dark:text-rose-400 uppercase tracking-wider font-semibold">Pengeluaran</p>
              <h2 className="text-lg sm:text-2xl font-extrabold mt-1 text-rose-600 dark:text-rose-400 break-words">
                -Rp {totalExpense.toLocaleString('id-ID')}
              </h2>
            </div>
          </div>

          <div className="md:hidden flex flex-col gap-3">
            <div className="flex p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl">
              <button
                onClick={() => setActiveSummary('INCOME')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeSummary === 'INCOME' 
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setActiveSummary('EXPENSE')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeSummary === 'EXPENSE' 
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-rose-600 dark:text-rose-400' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Pengeluaran
              </button>
            </div>

            {activeSummary === 'INCOME' && (
              <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40 shadow-sm flex flex-col justify-center">
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold">Total Pemasukan</p>
                <h2 className="text-2xl font-extrabold mt-1 text-emerald-600 dark:text-emerald-400 break-words">
                  +Rp {totalIncome.toLocaleString('id-ID')}
                </h2>
              </div>
            )}

            {activeSummary === 'EXPENSE' && (
              <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800/40 shadow-sm flex flex-col justify-center">
                <p className="text-[11px] text-rose-600 dark:text-rose-400 uppercase tracking-wider font-semibold">Total Pengeluaran</p>
                <h2 className="text-2xl font-extrabold mt-1 text-rose-600 dark:text-rose-400 break-words">
                  -Rp {totalExpense.toLocaleString('id-ID')}
                </h2>
              </div>
            )}
          </div>
        </div>

        {/* DOMPET & REKENING */}
        <div>
          <h3 className="font-bold text-lg mb-4 px-1">Dompet & Rekening</h3>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden px-1 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:pb-0">
            {regularWallets.map((w) => (
              <div
                key={w.id}
                className="flex-none w-[75%] sm:w-auto snap-center sm:snap-align-none p-5 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between min-h-[120px] shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    💳
                  </div>
                  <span className="font-semibold text-sm text-slate-600 dark:text-slate-400 truncate">{w.name}</span>
                </div>
                <div>
                  <span className="font-bold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
                    Rp {w.balance.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIWAYAT TRANSAKSI TERAKHIR */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mt-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Aktivitas Terakhir</h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {transactions.length} Transaksi
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Belum ada transaksi. Klik tombol &quot;+ Tambah Transaksi&quot; untuk memulai.
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.slice(0, 5).map((tx) => {
                const walletName = wallets.find((w) => w.id === tx.walletId)?.name || 'Dompet';
                const targetWalletName = wallets.find((w) => w.id === tx.targetWalletId)?.name || 'Dompet Tujuan';
                const isIncome = tx.type === 'INCOME';
                const isTransfer = tx.type === 'TRANSFER';

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-[1rem] flex items-center justify-center font-bold text-lg ${
                          isIncome
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                            : isTransfer
                              ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isIncome ? '↓' : isTransfer ? '⇄' : '↑'}
                      </div>

                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                          {isTransfer ? `${walletName} ➔ ${targetWalletName}` : (tx.description || tx.category)}
                        </p>
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                          <span className="font-semibold">{tx.category}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                          <span>{walletName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-bold text-sm sm:text-base ${
                        isIncome 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : isTransfer 
                            ? 'text-indigo-600 dark:text-indigo-400' 
                            : 'text-slate-900 dark:text-white'
                      }`}>
                        {isIncome ? '+' : isTransfer ? '' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">
                        {tx.date}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        assets={formattedAssets}
        addTransactionAction={handleAddTransaction}
      />
    </main>
  );
}