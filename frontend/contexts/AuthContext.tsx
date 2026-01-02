'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import apiClient from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      setUser(response.data.data);
    } catch (error: any) {
      // Token invalid or expired
      Cookies.remove('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      // Store token in cookie
      Cookies.set('token', token, { expires: 7 }); // 7 days

      // Update user state
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        profilePicture: userData.profilePicture,
      });

      toast.success('Login successful!');
      router.push('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const response = await apiClient.post('/auth/register', {
        name,
        email,
        password,
        phone,
      });
      const { token, user: userData } = response.data;

      // Store token in cookie
      Cookies.set('token', token, { expires: 7 }); // 7 days

      // Update user state
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
      });

      toast.success('Account created successfully!');
      router.push('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((e: any) => e.message).join(', ');
        toast.error(errorMessages);
      } else {
        toast.error(message);
      }
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

