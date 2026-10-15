'use client';

import { Wallet, PlusCircle, ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  currentBalance: number;
}

interface DashboardClientProps {
  assets: Asset[];
  totalBalance: number;
  addTransactionAction: (formData: FormData) => Promise<void>;
}

export default function DashboardClient({ assets, totalBalance, addTransactionAction }: DashboardClientProps) {
  return (
    <div className="min-h-screen transition-colors duration-300 text-slate-900 dark:text-slate-100">

      {/* KONTEN UTAMA */}
      <main className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 py-8">
        
        {/* JUDUL HALAMAN SEDERHANA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ringkasan Keuangan</h1>
            <p className="text-xs sm:text-sm mt-1 text-slate-600 dark:text-slate-400">
              Pantau aset dan catat mutasi transaksi harianmu dengan cepat.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs px-3.5 py-2 rounded-xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Sistem Aman & Real-time</span>
          </div>
        </div>

        {/* KARTU TOTAL SALDO UTAMA */}
        <div className="relative overflow-hidden border rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 bg-gradient-to-br from-white via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800/80 shadow-slate-200/50 dark:shadow-emerald-950/20">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                <div className="p-2 bg-emerald-500/15 text-emerald-500 rounded-xl">
                  <Wallet className="w-4 h-4" />
                </div>
                Total Kekayaan Bersih (Net Worth)
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-emerald-500">
                Rp {totalBalance.toLocaleString('id-ID')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Akumulasi dari seluruh dompet, rekening bank, dan aset terdaftar.</p>
            </div>

            <div className="flex items-center gap-3 border p-4 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80">
              <div className="text-right">
                <span className="text-xs block text-slate-500 dark:text-slate-400">Total Dompet Aktif</span>
                <span className="text-lg font-bold">{assets.length} Akun</span>
              </div>
            </div>
          </div>
        </div>

        {/* GRID UTAMA: FORM INPUT & INFORMASI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* KOLOM KIRI: FORM INPUT TRANSAKSI */}
          <div className="lg:col-span-7 border rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm transition-colors duration-300 bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/15 text-emerald-500 rounded-2xl">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Catat Transaksi Baru</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pilih jenis transaksi dan masukkan nominal dengan akurat.</p>
              </div>
            </div>
            
            <form action={addTransactionAction} className="space-y-5">
              
              {/* Pilihan Tipe Transaksi */}
              <div className="grid grid-cols-2 gap-3 p-1.5 border rounded-2xl bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800/80">
                <label className="relative flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl cursor-pointer transition-all group">
                  <input type="radio" name="type" value="INCOME" defaultChecked className="peer sr-only" />
                  <span className="flex items-center gap-2 text-xs font-bold transition text-slate-600 dark:text-slate-400 peer-checked:text-emerald-600 dark:peer-checked:text-emerald-400">
                    <ArrowDownLeft className="w-4 h-4 text-emerald-500" /> Pemasukan
                  </span>
                  <div className="absolute inset-0 border border-transparent rounded-xl transition-all pointer-events-none peer-checked:border-emerald-400 dark:peer-checked:border-emerald-500/50 peer-checked:bg-emerald-50/80 dark:peer-checked:bg-emerald-500/10" />
                </label>

                <label className="relative flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl cursor-pointer transition-all group">
                  <input type="radio" name="type" value="EXPENSE" className="peer sr-only" />
                  <span className="flex items-center gap-2 text-xs font-bold transition text-slate-600 dark:text-slate-400 peer-checked:text-rose-600 dark:peer-checked:text-rose-400">
                    <ArrowUpRight className="w-4 h-4 text-rose-500" /> Pengeluaran
                  </span>
                  <div className="absolute inset-0 border border-transparent rounded-xl transition-all pointer-events-none peer-checked:border-rose-400 dark:peer-checked:border-rose-500/50 peer-checked:bg-rose-50/80 dark:peer-checked:bg-rose-500/10" />
                </label>
              </div>

              {/* Input Nominal */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold block text-slate-700 dark:text-slate-300">Nominal (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span>
                  <input 
                    type="number" 
                    name="amount" 
                    required 
                    step="any"
                    placeholder="0"
                    className="w-full border rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 transition bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Pilih Dompet Sumber */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold block text-slate-700 dark:text-slate-300">Pilih Dompet / Rekening Sumber</label>
                <select 
                  name="fromAssetId" 
                  required
                  defaultValue=""
                  className="w-full border rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 transition bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-emerald-500"
                >
                  <option value="" disabled className="text-slate-500">-- Pilih Dompet Tujuan/Sumber --</option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} (Saldo: Rp {asset.currentBalance.toLocaleString('id-ID')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Kategori (Dropdown Pilihan) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold block text-slate-700 dark:text-slate-300">Kategori Transaksi</label>
                <select 
                  name="category" 
                  required
                  defaultValue=""
                  className="w-full border rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 transition bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-emerald-500"
                >
                  <option value="" disabled className="text-slate-500">-- Pilih Kategori --</option>
                  <option value="Makanan & Minuman">Makanan & Minuman</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Belanja">Belanja</option>
                  <option value="Tagihan & Utilitas">Tagihan & Utilitas</option>
                  <option value="Hiburan">Hiburan</option>
                  <option value="Gaji">Gaji</option>
                  <option value="Investasi">Investasi</option>
                  <option value="Bonus">Bonus / Hadiah</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Catatan Tambahan */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold block text-slate-700 dark:text-slate-300">Catatan Tambahan (Opsional)</label>
                <input 
                  type="text" 
                  name="description" 
                  placeholder="Contoh: Makan siang bersama klien"
                  className="w-full border rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 transition bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-emerald-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 text-sm tracking-wide mt-2 cursor-pointer"
              >
                Simpan Transaksi
              </button>
            </form>
          </div>

          {/* KOLOM KANAN: INFORMASI & TIPS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl transition-colors duration-300 bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800/80">
              <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Tips Pengelolaan Keuangan
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Catat setiap pengeluaran sekecil apa pun untuk menjaga transparansi anggaran bulananmu. Saldo dompet akan otomatis terpotong atau bertambah secara real-time.
              </p>
            </div>
            
            <div className="border rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl transition-colors duration-300 bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800/80">
              <h3 className="font-bold text-base mb-4">⚡ Status Integrasi Sistem</h3>
              <div className="space-y-3.5 text-sm">
                <div className="flex items-center justify-between p-3 rounded-2xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/60 text-slate-600 dark:text-slate-400">
                  <span>Database Prisma</span>
                  <span className="text-emerald-500 font-semibold flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Terhubung
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/60 text-slate-600 dark:text-slate-400">
                  <span>Mutasi Otomatis</span>
                  <span className="text-emerald-500 font-semibold flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}