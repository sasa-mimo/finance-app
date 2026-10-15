'use client';

import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  CreditCard, 
  Landmark, 
  Banknote, 
  ShieldCheck, 
  PiggyBank,
  Wallet,
  Pencil,
  Trash2,
  Save,
  X,
  AlertTriangle 
} from 'lucide-react';
import { useFinanceContext } from '@/context/FinanceContext';

export default function AssetsPage() {
  const { wallets, addWallet, updateWallet, deleteWallet } = useFinanceContext();

  // State Form Input
  const [name, setName] = useState('');
  const [assetType, setAssetType] = useState('BANK');
  const [balance, setBalance] = useState('');
  
  // State untuk mode edit
  const [editingId, setEditingId] = useState<string | null>(null);

  // State untuk mengatur Pop-up Modal Hapus
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, wallet: any }>({
    isOpen: false,
    wallet: null
  });

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); 
    const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); 
    setBalance(formatted);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'BANK': 
        return <Landmark className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
      case 'EWALLET': 
        return <CreditCard className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
      case 'INVESTMENT': 
        return <PiggyBank className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
      default: 
        return <Banknote className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalBalance = wallets.reduce((acc, curr) => acc + curr.balance, 0);

  // --- KELOMPOKKAN DOMPET PER KATEGORI ---
  const groupedWallets = useMemo(() => {
    const groups: Record<string, any[]> = {
      BANK: [],
      EWALLET: [],
      CASH: [],
      INVESTMENT: []
    };
    wallets.forEach((w) => {
      const type = w.assetType || 'BANK';
      if (!groups[type]) groups[type] = [];
      groups[type].push(w);
    });
    return groups;
  }, [wallets]);

  const categoryLabels: Record<string, { label: string, desc: string }> = {
    BANK: { label: 'Rekening Bank', desc: 'Akun tabungan & perbankan' },
    EWALLET: { label: 'E-Wallet', desc: 'Dompet digital online' },
    CASH: { label: 'Tunai / Cash', desc: 'Uang fisik di dompet' },
    INVESTMENT: { label: 'Portofolio Investasi', desc: 'Saham, reksa dana & aset masa depan' },
  };

  const handleEditClick = (wallet: any) => {
    setEditingId(wallet.id);
    setName(wallet.name);
    setAssetType(wallet.assetType || 'BANK');
    const formatted = wallet.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    setBalance(formatted);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setAssetType('BANK');
    setBalance('');
  };

  const confirmDelete = () => {
    if (deleteWallet && deleteModal.wallet) {
      deleteWallet(deleteModal.wallet.id);
      if (editingId === deleteModal.wallet.id) {
        handleCancelEdit();
      }
    }
    setDeleteModal({ isOpen: false, wallet: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const rawBalance = Number(balance.replace(/\./g, '')) || 0;

    if (editingId && updateWallet) {
      updateWallet(editingId, {
        name,
        assetType,
        balance: rawBalance,
      });
    } else if (addWallet) {
      addWallet({
        id: crypto.randomUUID(),
        name,
        assetType,
        balance: rawBalance,
      });
    }

    handleCancelEdit();
  };

  return (
    <>
      <div className="space-y-8 pb-12">
        {/* HEADER HALAMAN */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Kelola Dompet & Aset
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Atur tempat penyimpanan uangmu secara terorganisir per kategori.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs px-3.5 py-2 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Keamanan Terenkripsi</span>
          </div>
        </div>

        {/* BANNER TOTAL ASET */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100 block mb-1">
              Total Kekayaan & Aset
            </span>
            <div className="text-3xl sm:text-4xl font-black tracking-tight">
              {formatRupiah(totalBalance)}
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md text-xs font-medium text-emerald-50 border border-white/10">
            <Wallet className="w-4 h-4 text-emerald-300" />
            <span>{wallets.length} Sumber Dompet Terhubung</span>
          </div>
        </div>

        {/* GRID UTAMA (FORM & DAFTAR KATEGORI ASET) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* KOLOM KIRI: FORM TAMBAH/EDIT DOMPET (Tanpa kelas sticky agar tidak ngambang) */}
          <div className={`lg:col-span-4 p-6 rounded-3xl border shadow-sm transition-colors ${editingId ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${editingId ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {editingId ? <Pencil className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {editingId ? 'Edit Dompet' : 'Tambah Dompet'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {editingId ? 'Perbarui informasi dompet.' : 'Masukkan rincian akun baru.'}
                  </p>
                </div>
              </div>
              
              {editingId && (
                <button onClick={handleCancelEdit} className="p-2 text-slate-400 hover:text-rose-500 bg-white dark:bg-slate-800 rounded-full shadow-sm transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Nama Dompet / Rekening
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  placeholder="Contoh: BCA, GoPay, Dompet Saku"
                  className="w-full border rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Kategori / Tipe Aset
                </label>
                <select 
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  className="w-full border rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 cursor-pointer"
                >
                  <option value="CASH">Cash / Tunai</option>
                  <option value="BANK">Bank Account</option>
                  <option value="EWALLET">E-Wallet</option>
                  <option value="INVESTMENT">Investasi</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Saldo Saat Ini (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span>
                  <input 
                    type="text" 
                    value={balance}
                    onChange={handleBalanceChange}
                    placeholder="0"
                    required
                    className="w-full border rounded-2xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-emerald-500"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className={`w-full font-bold py-3.5 rounded-2xl transition-all text-sm tracking-wide mt-2 flex items-center justify-center gap-2 shadow-md ${
                  editingId 
                    ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/20' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                {editingId ? (
                  <><Save className="w-4 h-4" /> Simpan Perubahan</>
                ) : (
                  <><PlusCircle className="w-4 h-4" /> Simpan Dompet</>
                )}
              </button>
            </form>
          </div>

          {/* KOLOM KANAN: DAFTAR ASET PER KATEGORI DENGAN HORIZONTAL SCROLL */}
          <div className="lg:col-span-8 space-y-6">
            {wallets.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
                Belum ada dompet yang ditambahkan. Silakan tambah dompet di sebelah kiri!
              </div>
            ) : (
              Object.entries(groupedWallets).map(([type, items]) => {
                if (items.length === 0) return null;
                const info = categoryLabels[type] || { label: type, desc: 'Daftar aset' };

                return (
                  <div key={type} className="space-y-3">
                    {/* Header Kategori */}
                    <div className="flex items-center justify-between px-1">
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            {getIcon(type)}
                          </div>
                          {info.label}
                        </h4>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {items.length} Akun
                      </span>
                    </div>

                    {/* Container Geser Kesamping (Horizontal Scroll Carousel) */}
                    <div className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden px-1">
                      {items.map((asset) => (
                        <div 
                          key={asset.id} 
                          className={`flex-none w-[260px] sm:w-[280px] snap-center p-5 rounded-3xl bg-white dark:bg-slate-900 border shadow-sm transition-all flex flex-col justify-between gap-4 ${
                            editingId === asset.id 
                              ? 'border-indigo-500 dark:border-indigo-500 ring-4 ring-indigo-500/10' 
                              : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                                {getIcon(asset.assetType || 'BANK')}
                              </div>
                              <div className="overflow-hidden">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate" title={asset.name}>
                                  {asset.name}
                                </h4>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mt-0.5">
                                  {asset.assetType || 'DOMPET'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-end justify-between">
                            <div>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Saldo</span>
                              <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                                {formatRupiah(asset.balance)}
                              </span>
                            </div>
                            
                            {/* Tombol Aksi: Edit & Hapus */}
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => handleEditClick(asset)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors"
                                title="Edit Dompet"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setDeleteModal({ isOpen: true, wallet: asset })}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                                title="Hapus Dompet"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>

      {/* --- POP-UP MODAL HAPUS --- */}
      {deleteModal.isOpen && deleteModal.wallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-[400px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl">
            
            {/* Tombol X (Close) */}
            <button 
              onClick={() => setDeleteModal({ isOpen: false, wallet: null })}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Ikon Warning Merah */}
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 rounded-2xl flex items-center justify-center mb-5 mt-2">
              <AlertTriangle className="w-8 h-8" />
            </div>

            {/* Teks Konfirmasi */}
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Hapus Dompet Ini?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 px-2">
              Dompet &quot;{deleteModal.wallet.name}&quot; sebesar <strong className="text-slate-900 dark:text-white font-bold">{formatRupiah(deleteModal.wallet.balance)}</strong> akan dihapus permanen.
            </p>

            {/* Tombol Aksi */}
            <div className="flex w-full gap-3">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, wallet: null })}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-sm font-bold rounded-2xl transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-2xl transition-colors shadow-lg shadow-rose-500/20"
              >
                Ya, Hapus
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}