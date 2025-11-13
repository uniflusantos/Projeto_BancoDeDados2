'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getToken, setToken as saveToken, removeToken } from '@/lib/auth';
import { login, getCurrentUser } from '@/lib/api';
import type { UserWithRelations, UserCreate } from '@/lib/types';
import { createUser } from '@/lib/api';

interface AuthContextType {
  user: UserWithRelations | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          removeToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = async (username: string, password: string) => {
    const tokenData = await login(username, password);
    saveToken(tokenData.access_token);
    const userData = await getCurrentUser();
    setUser(userData);
  };

  const handleRegister = async (userData: UserCreate) => {
    await createUser(userData);
    // Auto-login after registration
    await handleLogin(userData.username, userData.password);
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

