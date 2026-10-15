'use server';

import prisma from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { AssetType } from '@prisma/client';

// Ambil semua daftar dompet/aset
export async function getAssets() {
  return await prisma.asset.findMany({
    orderBy: { name: 'asc' },
  });
}

// Tambah dompet baru
export async function addAsset(formData: FormData) {
  const name = formData.get('name') as string;
  const assetType = formData.get('assetType') as AssetType;
  const initialBalance = parseFloat(formData.get('currentBalance') as string) || 0;

  if (!name) {
    throw new Error('Nama dompet wajib diisi');
  }

  await prisma.asset.create({
    data: {
      name,
      assetType: assetType || 'CASH',
      currentBalance: initialBalance,
    },
  });

  revalidatePath('/');
  revalidatePath('/assets');
}