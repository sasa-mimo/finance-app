'use client';

import React, { useState, useMemo } from 'react';
import { useFinanceContext, Transaction, Wallet as WalletType } from '@/context/FinanceContext';
import { 
  Search, X, Calendar, Wallet, Tag,
  Building, ShoppingBag, Coffee, Utensils, Car,
  Trash2, Edit3, Save, AlertTriangle,
  Store, Info, ArrowLeftRight
} from 'lucide-react';

const getCategoryConfig = (category: string, type: 'INCOME' | 'EXPENSE' | 'TRANSFER') => {
  if (type === 'TRANSFER') {
    return { icon: ArrowLeftRight, bg: 'bg-indigo-500/10 text-indigo-500' };
  }

  const configs: Record<string, { icon: React.ElementType, bg: string }> = {
    'Pekerjaan': { icon: Building, bg: 'bg-emerald-500/10 text-emerald-500' },
    'Gaji': { icon: Building, bg: 'bg-emerald-500/10 text-emerald-500' },
    'Kebutuhan': { icon: ShoppingBag, bg: 'bg-rose-500/10 text-rose-500' },
    'Belanja': { icon: ShoppingBag, bg: 'bg-amber-500/10 text-amber-500' },
    'Gaya Hidup': { icon: Coffee, bg: 'bg-amber-500/10 text-amber-500' },
    'Makanan & Minuman': { icon: Utensils, bg: 'bg-rose-500/10 text-rose-500' },
    'Transportasi': { icon: Car, bg: 'bg-blue-500/10 text-blue-500' },
  };
  
  if (!category || !configs[category]) {
    return type === 'INCOME' 
      ? { icon: Wallet, bg: 'bg-emerald-500/10 text-emerald-500' }
      : { icon: Tag, bg: 'bg-rose-500/10 text-rose-500' };
  }
  return configs[category];
};

export default function TransactionsPage() {
  const { transactions = [], updateTransaction, deleteTransaction, wallets = [] } = useFinanceContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'INCOME' | 'EXPENSE' | 'TRANSFER'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const [mobileFilterTab, setMobileFilterTab] = useState<'month' | 'category'>('month');

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  const getWalletName = (walletId?: string) => {
    if (!walletId) return 'Dompet';
    const found = wallets.find((w: WalletType) => w.id === walletId);
    return found ? found.name : walletId;
  };

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

  const filteredTransactions = useMemo(() => {
    let result = transactions.filter((tx: Transaction) => {
      const description = tx.description || '';
      const category = tx.category || '';
      const merchant = tx.merchant || '';
      const notes = tx.notes || '';

      const matchesSearch = 
        description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notes.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'ALL' || tx.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory;
      
      const txMonth = tx.date ? tx.date.substring(0, 7) : '';
      const matchesMonth = selectedMonth === 'all' || txMonth === selectedMonth;

      return matchesSearch && matchesType && matchesCategory && matchesMonth;
    });

    result = result.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
      return dateB - dateA;
    });

    return result;
  }, [transactions, searchQuery, selectedType, selectedCategory, selectedMonth]);

  const categories = useMemo<string[]>(() => {
    const list = transactions
      .map((t: Transaction) => t.category)
      .filter((cat): cat is string => Boolean(cat));
    return Array.from(new Set(list));
  }, [transactions]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleOpenEdit = () => {
    if (!selectedTx) return;
    setEditForm(selectedTx);
    setIsEditing(true);
    setShowDeleteConfirm(false);
  };

  const handleSaveEdit = () => {
    if (!selectedTx) return;
    if (updateTransaction) {
      updateTransaction(selectedTx.id, editForm);
    }
    setSelectedTx({ ...selectedTx, ...editForm } as Transaction);
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    if (!selectedTx) return;
    if (deleteTransaction) {
      deleteTransaction(selectedTx.id);
    }
    setSelectedTx(null);
    setShowDeleteConfirm(false);
  };

  const handleCloseModal = () => {
    setSelectedTx(null);
    setIsEditing(false);
    setShowDeleteConfirm(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER HALAMAN */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Riwayat Transaksi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cari, filter, dan ubah rincian arus kas uangmu.
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari transaksi, toko, atau alasan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border rounded-2xl pl-11 pr-4 py-3 text-sm font-medium bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/50 focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex md:hidden p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl">
            <button
              onClick={() => setMobileFilterTab('month')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mobileFilterTab === 'month' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              Filter Waktu {selectedMonth !== 'all' && '• (Aktif)'}
            </button>
            <button
              onClick={() => setMobileFilterTab('category')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mobileFilterTab === 'category' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-indigo-500" />
              Filter Kategori {selectedCategory !== 'all' && '• (Aktif)'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`relative ${mobileFilterTab !== 'month' ? 'hidden md:block' : 'block animate-in fade-in duration-200'}`}>
              <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full border rounded-2xl pl-11 pr-4 py-3 text-sm font-medium bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/50 text-slate-900 dark:text-white outline-none cursor-pointer appearance-none"
              >
                <option value="all">📅 Semua Waktu / Bulan</option>
                {availableMonths.map(month => (
                  <option key={month} value={month}>{formatMonthYear(month)}</option>
                ))}
              </select>
            </div>

            <div className={`relative ${mobileFilterTab !== 'category' ? 'hidden md:block' : 'block animate-in fade-in duration-200'}`}>
              <Tag className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border rounded-2xl pl-11 pr-4 py-3 text-sm font-medium bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/50 text-slate-900 dark:text-white outline-none cursor-pointer appearance-none"
              >
                <option value="all">🏷️ Semua Kategori</option>
                {categories.map((cat: string) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* TAB FILTER TIPE TRANSAKSI */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {(['ALL', 'INCOME', 'EXPENSE', 'TRANSFER'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                  selectedType === type
                    ? type === 'INCOME' 
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                      : type === 'EXPENSE' 
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                        : type === 'TRANSFER'
                          ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                          : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {type === 'ALL' ? 'Semua' : type === 'INCOME' ? 'Pemasukan' : type === 'EXPENSE' ? 'Pengeluaran' : 'Transfer'}
              </button>
            ))}
          </div>
        </div>

        {/* DAFTAR TRANSAKSI */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 flex flex-col items-center justify-center gap-3">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-700" />
              <p className="text-sm">Tidak ada transaksi yang cocok dengan filter.</p>
            </div>
          ) : (
            filteredTransactions.map((tx: Transaction) => {
              const { icon: IconComponent, bg: iconBg } = getCategoryConfig(tx.category, tx.type);
              const isIncome = tx.type === 'INCOME';
              const isTransfer = tx.type === 'TRANSFER';

              return (
                <div 
                  key={tx.id}
                  onClick={() => { setSelectedTx(tx); setIsEditing(false); setShowDeleteConfirm(false); }}
                  className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-2xl ${iconBg} transition-transform group-hover:scale-105`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors line-clamp-1">
                        {isTransfer 
                          ? `${getWalletName(tx.walletId)} ➔ ${getWalletName(tx.targetWalletId)}`
                          : tx.description
                        }
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                        <span>{tx.date}</span>
                        {tx.time && <span>{tx.time}</span>}
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium text-[10px]">
                          {isTransfer ? 'Transfer Dompet' : getWalletName(tx.walletId)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`text-base font-bold block ${
                      isIncome 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : isTransfer 
                          ? 'text-indigo-600 dark:text-indigo-400' 
                          : 'text-slate-900 dark:text-white'
                    }`}>
                      {isIncome ? `+${formatRupiah(tx.amount)}` : formatRupiah(tx.amount)}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {tx.category}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* POP-UP DETAIL MODAL */}
        {selectedTx && (
          <div 
            onClick={handleCloseModal}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative transition-all max-h-[90vh] overflow-y-auto cursor-default"
            >
              <button 
                onClick={handleCloseModal}
                className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {showDeleteConfirm ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Hapus Transaksi Ini?</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
                      Transaksi sebesar <span className="font-semibold text-slate-900 dark:text-white">{formatRupiah(selectedTx.amount)}</span> akan dihapus permanen dan saldo dompet akan dikembalikan seperti semula.
                    </p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={handleConfirmDelete}
                      className="flex-1 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
                    >
                      Ya, Hapus
                    </button>
                  </div>
                </div>
              ) : isEditing ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-emerald-500" />
                    Edit Detail Transaksi
                  </h2>
                  
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-500 mb-1">Judul / Keterangan</label>
                      <input 
                        type="text" 
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full border rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-500 mb-1">Nominal (Rp)</label>
                        <input 
                          type="number" 
                          value={editForm.amount || ''}
                          onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                          className="w-full border rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-500 mb-1">Dompet Asal</label>
                        <select 
                          value={editForm.walletId || ''}
                          onChange={(e) => setEditForm({ ...editForm, walletId: e.target.value })}
                          className="w-full border rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none cursor-pointer"
                        >
                          {wallets.map((w: WalletType) => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {editForm.type === 'TRANSFER' && (
                      <div>
                        <label className="block font-semibold text-slate-500 mb-1">Dompet Tujuan</label>
                        <select 
                          value={editForm.targetWalletId || ''}
                          onChange={(e) => setEditForm({ ...editForm, targetWalletId: e.target.value })}
                          className="w-full border rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none cursor-pointer"
                        >
                          {wallets.map((w: WalletType) => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={handleSaveEdit}
                      className="flex-[2] py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> Simpan Perubahan
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center pt-2 pb-5 border-b border-slate-100 dark:border-slate-800/80">
                    <div className={`w-14 h-14 mx-auto rounded-3xl flex items-center justify-center mb-3 ${getCategoryConfig(selectedTx.category, selectedTx.type).bg}`}>
                      {React.createElement(getCategoryConfig(selectedTx.category, selectedTx.type).icon, { className: 'w-7 h-7' })}
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2 ${
                      selectedTx.type === 'INCOME' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : selectedTx.type === 'TRANSFER'
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}>
                      {selectedTx.type === 'INCOME' ? 'Pemasukan' : selectedTx.type === 'TRANSFER' ? 'Transfer Antar Dompet' : 'Pengeluaran'}
                    </span>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {selectedTx.type === 'INCOME' ? `+${formatRupiah(selectedTx.amount)}` : formatRupiah(selectedTx.amount)}
                    </h2>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">{selectedTx.description}</p>
                  </div>

                  {/* KOTAK CATATAN / ALASAN (JIKA ADA) */}
                  {selectedTx.notes && (
                    <div className="my-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <Info className="w-4 h-4" /> Alasan / Catatan Transaksi:
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 pl-5">{selectedTx.notes}</p>
                    </div>
                  )}

                  <div className="py-2 space-y-3 text-xs">
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/50">
                      <span className="text-slate-500 flex items-center gap-2">
                        <Store className="w-4 h-4 text-emerald-500" /> Toko / Merchant
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedTx.merchant || '-'}</span>
                    </div>

                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/50">
                      <span className="text-slate-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-500" /> Waktu Lengkap
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedTx.date} {selectedTx.time ? `• ${selectedTx.time}` : ''}</span>
                    </div>

                    {selectedTx.type === 'TRANSFER' ? (
                      <>
                        <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/50">
                          <span className="text-slate-500 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-indigo-500" /> Dari Dompet
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">{getWalletName(selectedTx.walletId)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/50">
                          <span className="text-slate-500 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-indigo-500" /> Ke Dompet
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">{getWalletName(selectedTx.targetWalletId)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/50">
                        <span className="text-slate-500 flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-emerald-500" /> Dompet / Rekening
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">{getWalletName(selectedTx.walletId)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-slate-500 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-indigo-500" /> Kategori
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedTx.category}</span>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                    <button 
                      onClick={handleOpenEdit}
                      className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" /> Edit Detail
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex-1 py-3 rounded-2xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        )}

      </div>
    </main>
  );
}