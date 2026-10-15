'use client';

import { useState, useTransition, useRef } from 'react';
import { 
  X, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowLeftRight,
  ChevronDown, 
  ChevronUp, 
  Loader2 
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  currentBalance: number;
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  addTransactionAction: (formData: FormData) => Promise<void>;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  assets = [],
  addTransactionAction
}: AddTransactionModalProps) {
  const [transactionType, setTransactionType] = useState<'INCOME' | 'EXPENSE' | 'TRANSFER'>('EXPENSE');
  const [displayAmount, setDisplayAmount] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [fromAsset, setFromAsset] = useState('');
  const [toAsset, setToAsset] = useState('');
  const [showExtra, setShowExtra] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setRawAmount(val);
    if (val) {
      setDisplayAmount(Number(val).toLocaleString('id-ID'));
    } else {
      setDisplayAmount('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    formData.set('amount', rawAmount);

    if (transactionType === 'TRANSFER') {
      if (!fromAsset || !toAsset) {
        alert('Silakan pilih dompet asal dan dompet tujuan!');
        return;
      }

      if (fromAsset === toAsset) {
        alert('Dompet asal dan dompet tujuan tidak boleh sama!');
        return;
      }

      formData.set('walletId', fromAsset);
      formData.set('fromAssetId', fromAsset);
      formData.set('targetWalletId', toAsset);
      formData.set('toAssetId', toAsset);
    }

    startTransition(async () => {
      await addTransactionAction(formData);
      formRef.current?.reset();
      setDisplayAmount('');
      setRawAmount('');
      setFromAsset('');
      setToAsset('');
      setShowExtra(false);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 transition-all">
        
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tambah Transaksi</h2>
          <button 
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-3 gap-1.5 p-1 border rounded-2xl bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setTransactionType('EXPENSE')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold text-[11px] transition-all ${
                transactionType === 'EXPENSE' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('INCOME')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold text-[11px] transition-all ${
                transactionType === 'INCOME' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" /> Pemasukan
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('TRANSFER')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold text-[11px] transition-all ${
                transactionType === 'TRANSFER' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> Transfer
            </button>
            <input type="hidden" name="type" value={transactionType} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nominal (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">Rp</span>
              <input 
                type="text" 
                value={displayAmount}
                onChange={handleAmountChange}
                required 
                placeholder="0"
                className="w-full border rounded-2xl pl-12 pr-4 py-3 text-lg font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input type="hidden" name="amount" value={rawAmount} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Judul / Nama Transaksi</label>
            <input 
              type="text" 
              name="description" 
              required={transactionType !== 'TRANSFER'}
              placeholder={transactionType === 'TRANSFER' ? 'Transfer Antar Dompet' : 'Contoh: Makan Siang / Gaji Bulanan'}
              defaultValue={transactionType === 'TRANSFER' ? 'Transfer Antar Dompet' : ''}
              className="w-full border rounded-2xl px-4 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {transactionType === 'TRANSFER' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dari Dompet</label>
                <select 
                  name="fromAssetId" 
                  required
                  value={fromAsset}
                  onChange={(e) => setFromAsset(e.target.value)}
                  className="w-full border rounded-2xl px-3.5 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="" disabled>-- Pilih Dompet Asal --</option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>{asset.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ke Dompet</label>
                <select 
                  name="toAssetId" 
                  required
                  value={toAsset}
                  onChange={(e) => setToAsset(e.target.value)}
                  className="w-full border rounded-2xl px-3.5 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="" disabled>-- Pilih Dompet Tujuan --</option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>{asset.name}</option>
                  ))}
                </select>
              </div>
              <input type="hidden" name="category" value="Transfer" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dompet / Sumber</label>
                <select 
                  name="fromAssetId" 
                  required
                  defaultValue=""
                  className="w-full border rounded-2xl px-3.5 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="" disabled>-- Pilih Dompet --</option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>{asset.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Kategori</label>
                <select 
                  name="category" 
                  required
                  defaultValue=""
                  className="w-full border rounded-2xl px-3.5 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="" disabled>-- Pilih Kategori --</option>
                  <option value="Makanan & Minuman">Makanan & Minuman</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Belanja">Belanja</option>
                  <option value="Gaji">Gaji</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowExtra(!showExtra)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-dashed rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 transition-all cursor-pointer mt-2"
          >
            {showExtra ? (
              <><ChevronUp className="w-4 h-4" /> Sembunyikan Detail Tambahan</>
            ) : (
              <><ChevronDown className="w-4 h-4" /> + Tambahkan Toko, Lokasi, Waktu & Tag</>
            )}
          </button>

          {showExtra && (
            <div className="space-y-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 animate-in fade-in duration-200">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Alasan / Catatan Detail</label>
                <textarea 
                  name="notes" 
                  rows={2}
                  placeholder="Catatan rinci kenapa transaksi ini dilakukan..."
                  className="w-full border rounded-xl px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Toko / Merchant</label>
                  <input name="merchant" type="text" placeholder="Contoh: Tokopedia, Indomaret" className="w-full border rounded-xl px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Lokasi</label>
                  <input name="location" type="text" placeholder="Contoh: Yogyakarta, Online" className="w-full border rounded-xl px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tanggal</label>
                  <input name="date" type="date" defaultValue={today} className="w-full border rounded-xl px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Jam</label>
                  <input name="time" type="time" defaultValue={nowTime} className="w-full border rounded-xl px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tag / Label (Pisahkan koma)</label>
                <input name="tags" type="text" placeholder="Contoh: meeting, kado, liburan" className="w-full border rounded-xl px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
              </div>
            </div>
          )}

          {assets.length === 0 && (
            <p className="text-xs text-rose-500 font-medium text-center">
              *Tidak bisa menyimpan: Kamu harus memiliki setidaknya 1 dompet.
            </p>
          )}

          <button 
            type="submit"
            disabled={isPending || assets.length === 0}
            className={`w-full text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg text-sm mt-4 cursor-pointer flex items-center justify-center gap-2 ${
              transactionType === 'TRANSFER'
                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                : transactionType === 'INCOME'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'
            }`}
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
            ) : (
              'Simpan Transaksi'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}