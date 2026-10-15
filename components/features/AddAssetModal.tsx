'use client';

import { useState } from 'react';
import { X, Wallet } from 'lucide-react';
import { useFinanceContext } from '@/context/FinanceContext';

export default function AddAssetModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk menyimpan nilai yang sudah diformat dengan titik
  const [displayBalance, setDisplayBalance] = useState(''); 
  const { addWallet } = useFinanceContext();

  // Fungsi untuk memformat angka secara real-time saat kamu mengetik
  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Hapus semua selain angka
    const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Tambahkan titik otomatis
    setDisplayBalance(formatted);
  };

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    
    // Hapus titik sebelum disimpan menjadi Number murni ke database
    const rawBalance = Number(displayBalance.replace(/\./g, ''));

    addWallet({
      id: crypto.randomUUID(),
      name: formData.get('name') as string,
      assetType: formData.get('assetType') as string, // Simpan tipe aset
      balance: rawBalance
    });

    setIsLoading(false);
    setIsOpen(false);
    setDisplayBalance(''); // Kosongkan form input angka setelah berhasil disimpan
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 rounded-xl transition-all group text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700 group-hover:text-emerald-600">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Tambah Akun Aset</p>
            <p className="text-[11px] text-slate-500">Bank, E-Wallet, Tunai, dll</p>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              Tambah Aset Baru
            </h2>
            
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Aset</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" 
                  placeholder="BCA, Gopay, Uang Tunai..." 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipe Aset</label>
                <select 
                  name="assetType" 
                  required 
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                >
                  <option value="BANK">Bank</option>
                  <option value="EWALLET">E-Wallet</option>
                  <option value="CASH">Tunai</option>
                  <option value="INVESTMENT">Investasi</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Saldo Awal (Rp)</label>
                <div className="relative">
                  {/* Teks Rp Absolut di sebelah kiri */}
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    Rp
                  </span>
                  
                  {/* Input yang menampilkan angka dengan titik otomatis */}
                  <input
                    type="text"
                    required
                    value={displayBalance}
                    onChange={handleBalanceChange}
                    className="w-full pl-9 p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading || !displayBalance} 
                className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors mt-2"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Aset'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}