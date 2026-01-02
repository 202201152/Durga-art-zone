'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import apiClient from '../lib/api/client';

type User = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role?: string;
    profilePicture?: string;
};

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    login: (payload: { email: string; password: string }) => Promise<void>;
    register: (payload: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const refreshRef = useRef<Promise<void> | null>(null);

    const refreshUser = async () => {
        // Deduplicate concurrent refresh requests: reuse in-flight promise
        if (refreshRef.current) return refreshRef.current;

        const p = (async () => {
            try {
                const res = await apiClient.get('/auth/me');
                if (res?.data?.success) {
                    setUser(res.data.data);
                } else {
                    setUser(null);
                }
            } catch (err: any) {
                // If 401, do not trigger a redirect here; just clear user
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();

        refreshRef.current = p;
        try {
            await p;
        } finally {
            refreshRef.current = null;
        }

        return p;
    };

    const pathname = usePathname();

    useEffect(() => {
        // Avoid making /auth/me calls on auth pages (login/register/callback/forgot)
        if (pathname && pathname.startsWith('/auth')) {
            // If we're on an auth page we don't need to pre-fetch user data
            setLoading(false);
            return;
        }

        // If we already have a user, no need to refresh
        if (user) {
            setLoading(false);
            return;
        }

        // Call once when entering a non-auth route
        refreshUser();
    }, [pathname]);

    const login = async (payload: { email: string; password: string }) => {
        const res = await apiClient.post('/auth/login', payload);
        if (res?.data?.success) {
            // Server sets HttpOnly cookie; refresh user profile
            await refreshUser();
        } else {
            throw new Error(res?.data?.message || 'Login failed');
        }
    };

    const register = async (payload: { name: string; email: string; password: string; phone?: string }) => {
        const res = await apiClient.post('/auth/register', payload);
        if (res?.data?.success) {
            // Server sets HttpOnly cookie; refresh user profile
            await refreshUser();
        } else {
            throw new Error(res?.data?.message || 'Registration failed');
        }
    };

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (err) {
            // ignore
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
