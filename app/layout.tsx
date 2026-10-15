import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { FinanceProvider } from '@/context/FinanceContext';
import AppLayout from '@/components/layout/AppLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'FinanceApp - Platform Manajemen Keuangan Profesional',
  description: 'Catat pemasukan, pengeluaran multi-dompet, dan pantau arus kas harianmu.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <FinanceProvider>
            <AppLayout>{children}</AppLayout>
          </FinanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}