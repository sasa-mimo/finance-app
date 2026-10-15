'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Fungsi untuk Mengambil Riwayat Transaksi
export async function getTransactions() {
  try {
    return await prisma.transaction.findMany({
      orderBy: { transactionDate: 'desc' },
      include: {
        fromAsset: true,
        toAsset: true,
      },
    });
  } catch (error) {
    console.error('Gagal mengambil data transaksi:', error);
    return [];
  }
}

// Fungsi Tambah Transaksi (Versi Optimal)
export async function addTransaction(formData: FormData) {
  const type = formData.get('type') as 'INCOME' | 'EXPENSE';
  const amount = parseFloat(formData.get('amount') as string);
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const assetId = formData.get('assetId') as string;

  if (!amount || amount <= 0) {
    throw new Error('Nominal harus lebih dari 0');
  }

  if (!assetId) {
    throw new Error('Pilih dompet/aset terlebih dahulu');
  }

  await prisma.$transaction(async (tx) => {
    // 1. Catat Transaksi (Pemasukan masuk ke toAssetId, Pengeluaran keluar dari fromAssetId)
    await tx.transaction.create({
      data: {
        type,
        amount,
        category: category || 'Lain-lain',
        description: description || null,
        transactionDate: new Date(),
        toAssetId: type === 'INCOME' ? assetId : null,
        fromAssetId: type === 'EXPENSE' ? assetId : null,
      },
    });

    // 2. Update Saldo Langsung (Otomatis & Efisien)
    await tx.asset.update({
      where: { id: assetId },
      data: {
        currentBalance: type === 'INCOME' 
          ? { increment: amount } 
          : { decrement: amount },
      },
    });
  });

  revalidatePath('/');
  revalidatePath('/assets');
  revalidatePath('/transactions');
}