'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { isAdminEmail } from '../lib/admin';

export function normalizeEmail(email: string): string {
  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2) return email.trim().toLowerCase();
  let [local, domain] = parts;
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    local = local.split('+')[0].replace(/\./g, '');
    domain = 'gmail.com';
  }
  return `${local}@${domain}`;
}

interface User {
  _id?: string;
  id: string;
  username: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt?: Date | string;
  role: 'admin' | 'user';
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (username: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  checkAuthSession: () => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (password: string, token: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthSession = async () => {
    try {
      const response = await api.get('/auth/session');
      if (response.data?.user) {
        setUser({
          id: response.data.user.id,
          _id: response.data.user.id,
          username: response.data.user.name || response.data.user.email.split('@')[0],
          name: response.data.user.name || response.data.user.email.split('@')[0],
          email: response.data.user.email,
          image: response.data.user.image,
          createdAt: response.data.user.createdAt,
          role: isAdminEmail(response.data.user.email) ? 'admin' : 'user',
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const normalizedEmail = normalizeEmail(email);
      const response = await api.post('/auth/sign-in/email', {
        email: normalizedEmail,
        password,
      });
      if (response.data.success) {
        await checkAuthSession();
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Invalid email or password' };
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Invalid email or password';
      return { success: false, message: msg };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const normalizedEmail = normalizeEmail(email);
      const response = await api.post('/auth/sign-up/email', {
        name: username,
        email: normalizedEmail,
        password,
      });

      if (response.data.success) {
        await checkAuthSession();
        return { success: true };
      }

      const message = response.data.message?.toLowerCase().includes('already')
        ? 'An account with this email already exists.'
        : response.data.message || 'Please check your details and try again.';

      return { success: false, message };
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Email already exists or invalid details';
      return { success: false, message: msg };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const normalizedEmail = normalizeEmail(email);
      const response = await api.post('/auth/forgot-password', {
        email: normalizedEmail,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (response.data.error) {
        return { success: false, message: response.data.error.message };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Could not send verification email' };
    }
  };

  const resetPassword = async (password: string, token: string) => {
    try {
      const response = await api.post('/auth/reset-password', {
        newPassword: password,
        token,
      });
      if (response.data.error) {
        return { success: false, message: response.data.error.message };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Could not reset password' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/sign-out');
    } catch (err) {
      console.error('Logout request error:', err);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        checkAuthSession,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
export type { User };
