'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  assetType?: string;
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  walletId: string;
  targetWalletId?: string;
  category: string;
  date: string;
  time?: string;
  description: string;
  notes?: string;
  merchant?: string;
  location?: string;
  tags?: string[];
}

interface FinanceContextType {
  wallets: Wallet[];
  transactions: Transaction[];
  addTransaction: (transaction: any) => Promise<void>;
  updateTransaction: (id: string, updatedTx: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addWallet: (wallet: Wallet) => Promise<void>;
  updateWallet: (id: string, updatedFields: Partial<Wallet>) => Promise<void>;
  deleteWallet: (id: string) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const cleanDefaultWallets: Wallet[] = [
    { id: '1', name: 'M-Banking / Utama', balance: 0, assetType: 'BANK' },
    { id: '2', name: 'E-Wallet', balance: 0, assetType: 'EWALLET' },
  ];

  const [wallets, setWallets] = useState<Wallet[]>(cleanDefaultWallets);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Ambil data dari Supabase berdasarkan user yang sedang login
  useEffect(() => {
    if (!user) {
      setWallets(cleanDefaultWallets);
      setTransactions([]);
      setIsLoaded(true);
      return;
    }

    const fetchCloudData = async () => {
      // 1. Ambil data aset/dompet khusus user yang login (difilter otomatis oleh RLS Supabase)
      const { data: walletsData, error: walletsError } = await supabase
        .from('asset')
        .select('*');

      if (walletsError) {
        console.error('Gagal memuat dompet:', walletsError.message);
      }

      if (walletsData && walletsData.length > 0) {
        setWallets(
          walletsData.map((w: any) => ({
            id: w.id,
            name: w.name,
            balance: Number(w.currentBalance),
            assetType: w.assetType,
          }))
        );
      } else {
        // Jika akun baru belum punya aset, masukkan aset default dengan menyertakan user.id
        const defaultAssets = cleanDefaultWallets.map((w) => ({
          user_id: user.id,
          name: w.name,
          currentBalance: w.balance,
          assetType: w.assetType,
        }));

        const { error: insertWalletErr } = await supabase
          .from('asset')
          .insert(defaultAssets);

        if (!insertWalletErr) {
          setWallets(cleanDefaultWallets);
        }
      }

      // 2. Ambil data transaksi khusus user yang login
      const { data: txData, error: txError } = await supabase
        .from('transaction')
        .select('*')
        .order('transactionDate', { ascending: false });

      if (txError) {
        console.error('Gagal memuat transaksi:', txError.message);
      }

      if (txData) {
        setTransactions(
          txData.map((t: any) => ({
            id: t.id,
            type: t.type,
            amount: Number(t.amount),
            walletId: t.fromAssetId,
            targetWalletId: t.toAssetId,
            category: t.category,
            date: t.transactionDate ? t.transactionDate.split('T')[0] : '',
            time: t.transactionDate ? t.transactionDate.split('T')[1]?.slice(0, 5) : '',
            description: t.description,
            notes: t.notes,
            merchant: t.merchant,
            location: t.location,
            tags: t.tags,
          }))
        );
      }

      setIsLoaded(true);
    };

    fetchCloudData();
  }, [user]);

  // Tambah Aset/Dompet dengan user_id eksplisit
  const addWallet = async (newWallet: Wallet) => {
    if (!user) return;

    const payload = {
      user_id: user.id,
      name: newWallet.name,
      currentBalance: newWallet.balance,
      assetType: newWallet.assetType || 'CASH',
    };

    const { data, error } = await supabase.from('asset').insert([payload]).select();
    if (error) {
      console.error('Gagal menambah dompet:', error.message);
      return;
    }

    if (data && data[0]) {
      const createdWallet: Wallet = {
        id: data[0].id,
        name: data[0].name,
        balance: Number(data[0].currentBalance),
        assetType: data[0].assetType,
      };
      setWallets((prev) => [...prev, createdWallet]);
    }
  };

  // Update Aset/Dompet
  const updateWallet = async (id: string, updatedFields: Partial<Wallet>) => {
    if (!user) return;

    const dbPayload: any = {};
    if (updatedFields.name !== undefined) dbPayload.name = updatedFields.name;
    if (updatedFields.balance !== undefined) dbPayload.currentBalance = updatedFields.balance;
    if (updatedFields.assetType !== undefined) dbPayload.assetType = updatedFields.assetType;

    const { error } = await supabase
      .from('asset')
      .update(dbPayload)
      .eq('id', id)
      .eq('user_id', user.id); // Pengaman tambahan agar hanya bisa update milik sendiri

    if (error) {
      console.error('Gagal memperbarui dompet:', error.message);
      return;
    }

    setWallets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updatedFields } : w))
    );
  };

  // Hapus Aset/Dompet
  const deleteWallet = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('asset')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Gagal menghapus dompet:', error.message);
      return;
    }

    setWallets((prev) => prev.filter((w) => w.id !== id));
  };

  // Tambah Transaksi dengan user_id eksplisit
  const addTransaction = async (newTx: Transaction & { fromAssetId?: string; toAssetId?: string }) => {
    if (!user) return;

    const resolvedWalletId = newTx.walletId || newTx.fromAssetId;
    const resolvedTargetWalletId = newTx.targetWalletId || newTx.toAssetId;

    const normalizedTx: Transaction = {
      ...newTx,
      id: newTx.id || crypto.randomUUID(),
      walletId: resolvedWalletId as string,
      targetWalletId: resolvedTargetWalletId,
    };

    const dbPayload = {
      id: normalizedTx.id,
      user_id: user.id, // Pengaman kepemilikan data
      type: normalizedTx.type,
      amount: normalizedTx.amount,
      category: normalizedTx.category,
      transactionDate: normalizedTx.date ? new Date(normalizedTx.date).toISOString() : new Date().toISOString(),
      fromAssetId: normalizedTx.walletId || null,
      toAssetId: normalizedTx.targetWalletId || null,
      description: normalizedTx.description || null,
      notes: normalizedTx.notes || null,
      merchant: normalizedTx.merchant || null,
      location: normalizedTx.location || null,
      tags: normalizedTx.tags || null,
    };

    // 1. Simpan transaksi ke tabel 'transaction'
    const { error: txError } = await supabase.from('transaction').insert([dbPayload]);
    if (txError) {
      console.error('Gagal menambah transaksi:', txError.message);
      return;
    }

    setTransactions((prev) => [normalizedTx, ...prev]);

    // 2. Hitung perubahan saldo aset
    const updatedWallets = wallets.map((w) => {
      if (normalizedTx.type === 'TRANSFER') {
        if (w.id === resolvedWalletId) return { ...w, balance: w.balance - normalizedTx.amount };
        if (w.id === resolvedTargetWalletId) return { ...w, balance: w.balance + normalizedTx.amount };
        return w;
      }

      if (w.id === resolvedWalletId) {
        const updatedBalance =
          normalizedTx.type === 'INCOME'
            ? w.balance + normalizedTx.amount
            : w.balance - normalizedTx.amount;
        return { ...w, balance: updatedBalance };
      }
      return w;
    });

    setWallets(updatedWallets);

    // 3. Update saldo aset di database Supabase secara paralel dengan validasi user_id
    for (const w of updatedWallets) {
      await supabase
        .from('asset')
        .update({ currentBalance: w.balance })
        .eq('id', w.id)
        .eq('user_id', user.id);
    }
  };

  const updateTransaction = async (id: string, updatedFields: Partial<Transaction>) => {
    const oldTx = transactions.find((t) => t.id === id);
    if (!oldTx) return;

    await deleteTransaction(id);
    const newTx = { ...oldTx, ...updatedFields } as Transaction;
    await addTransaction(newTx);
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    const targetTx = transactions.find((t) => t.id === id);
    if (!targetTx) return;

    // 1. Hapus transaksi dari tabel 'transaction' dengan validasi user_id
    const { error } = await supabase
      .from('transaction')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Gagal menghapus transaksi:', error.message);
      return;
    }

    // 2. Kembalikan saldo aset
    const revertedWallets = wallets.map((w) => {
      if (targetTx.type === 'TRANSFER') {
        if (w.id === targetTx.walletId) return { ...w, balance: w.balance + targetTx.amount };
        if (w.id === targetTx.targetWalletId) return { ...w, balance: w.balance - targetTx.amount };
        return w;
      }

      if (w.id === targetTx.walletId) {
        const updatedBalance =
          targetTx.type === 'INCOME'
            ? w.balance - targetTx.amount
            : w.balance + targetTx.amount;
        return { ...w, balance: updatedBalance };
      }
      return w;
    });

    setWallets(revertedWallets);
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    // 3. Perbarui saldo aset di Supabase
    for (const w of revertedWallets) {
      await supabase
        .from('asset')
        .update({ currentBalance: w.balance })
        .eq('id', w.id)
        .eq('user_id', user.id);
    }
  };

  if (!isLoaded) return null;

  return (
    <FinanceContext.Provider
      value={{
        wallets,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addWallet,
        updateWallet,
        deleteWallet,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const useFinanceContext = useFinance;