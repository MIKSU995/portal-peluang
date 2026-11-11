'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id?: string;
  name?: string;
  email?: string;
  university?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthModalOpen: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

// 1. Default fallback state agar tidak melempar Error saat Next.js Prerendering (SSG)
const defaultAuthContext: AuthContextType = {
  user: null,
  token: null,
  isAuthModalOpen: false,
  login: () => {},
  logout: () => {},
  openAuthModal: () => {},
  closeAuthModal: () => {},
};

// 2. Inisialisasi React Context dengan default value
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('kesempatankita_token');
    const savedUser = localStorage.getItem('kesempatankita_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Gagal memuat sesi user:', e);
      }
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('kesempatankita_token', newToken);
    localStorage.setItem('kesempatankita_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('kesempatankita_token');
    localStorage.removeItem('kesempatankita_user');
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthModalOpen,
        login,
        logout,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom Hook yang aman digunakan di mana saja tanpa menghentikan proses build
export function useAuth() {
  const context = useContext(AuthContext);
  return context || defaultAuthContext;
}