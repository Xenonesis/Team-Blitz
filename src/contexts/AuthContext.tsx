'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import NoSSR from '@/components/NoSSR';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        verifyToken(storedToken);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      // Try regular verify endpoint first
      let response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`,
          'Content-Type': 'application/json',
        },
      });

      // If regular verify fails, try simple verify (for super admin tokens)
      if (!response.ok) {
        response = await fetch('/api/auth/verify-simple', {
          headers: {
            'Authorization': `Bearer ${tokenToVerify}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(tokenToVerify);
      } else {
        // Token is invalid, remove it
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Check if this is the super admin - use login-simple for super admin only
      const isSuperAdmin = email.toLowerCase() === 'itisaddy7@gmail.com';
      const endpoint = isSuperAdmin ? '/api/auth/login-simple' : '/api/auth/login';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', data.token);
        }
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAdmin,
    isSuperAdmin,
  };

  return (
    <NoSSR fallback={<div className="min-h-screen bg-gradient-to-b from-[#2a3080] to-[#1e2464] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>}>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </NoSSR>
  );
};
