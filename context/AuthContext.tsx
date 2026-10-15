'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // 1. Ambil sesi aktif saat pertama kali dimuat
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Pengguna',
          email: session.user.email || '',
        });
      } else {
        setUser(null);
      }
    });

    // 2. Dengarkan perubahan status auth secara real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Pengguna',
          email: session.user.email || '',
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data.user) {
      setUser({
        id: data.user.id,
        name: data.user.user_metadata?.name || email.split('@')[0],
        email: data.user.email || email,
      });
    }

    return { success: true };
  };

  const register = async (name: string, email: string, pass: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { name },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data.user) {
      setUser({
        id: data.user.id,
        name,
        email,
      });
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Instruksi pemulihan kata sandi telah dikirim ke email kamu.' };
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    if (!user?.email) return { success: false, message: 'Belum login.' };

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPass,
    });

    if (signInError) {
      return { success: false, message: 'Kata sandi lama salah.' };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPass,
    });

    if (updateError) {
      return { success: false, message: updateError.message };
    }

    return { success: true, message: 'Kata sandi berhasil diperbarui!' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};