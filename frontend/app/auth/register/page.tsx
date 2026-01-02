'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function RegisterPage() {
    const router = useRouter();
    const { register, refreshUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register({ name, email, password });
            toast.success('Account created');
            router.push('/');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = () => {
        // Open popup for OAuth flow
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        let popup: Window | null = null;
        try {
            popup = window.open(
                `${API_URL}/auth/google`,
                'google_oauth',
                `width=${width},height=${height},left=${left},top=${top}`
            );
        } catch (err) {
            popup = null;
        }

        // If popup blocked, fallback to redirect
        if (!popup) {
            window.location.href = `${API_URL}/auth/google`;
            return;
        }

        // Listen for postMessage from popup
        const onMessage = (e: MessageEvent) => {
            try {
                if (e.origin !== window.location.origin) return;
            } catch (err) {
                return;
            }

            if ((e as any).data?.type === 'oauth') {
                if ((e as any).data.status === 'success') {
                    toast.success('Logged in via Google');
                    // Refresh user state
                    refreshUser().then(() => router.push('/'));
                } else {
                    toast.error('Google sign-in failed');
                }
                window.removeEventListener('message', onMessage);
            }
        };

        window.addEventListener('message', onMessage);

        // Close listener when popup closes
        const checkPopup = setInterval(() => {
            if (!popup || popup.closed) {
                clearInterval(checkPopup);
                window.removeEventListener('message', onMessage);
            }
        }, 500);

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8">
                <div className="text-center mb-6">
                    <img src="/logo.svg" alt="Durga Art Zone" className="mx-auto w-14 h-14 mb-3" />
                    <h1 className="text-2xl font-semibold mt-2">Create your account</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        aria-label="name"
                        placeholder="Full name"
                        className="w-full rounded-md p-4 bg-white shadow-sm border border-transparent focus:outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        aria-label="email"
                        placeholder="Email"
                        className="w-full rounded-md p-4 bg-white shadow-sm border border-transparent focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        aria-label="password"
                        type="password"
                        placeholder="Password"
                        className="w-full rounded-md p-4 bg-white shadow-sm border border-transparent focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <p className="text-xs text-gray-400">By creating an account, you agree to our terms and privacy policy</p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-400 text-white py-3 rounded-lg shadow-sm hover:opacity-95"
                    >
                        {loading ? 'Creating...' : 'Create Account'}
                    </button>

                    <div className="flex items-center my-4">
                        <div className="flex-1 h-px bg-gray-200" />
                        <div className="px-3 text-gray-400">or</div>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogle}
                        aria-label="Sign up with Google"
                        className="w-full bg-white rounded-full py-3 px-4 border border-gray-100 shadow-sm flex items-center justify-center space-x-3"
                    >
                        <picture>
                            <source srcSet="/google-logo.png" type="image/png" />
                            <img src="/google-logo.svg" alt="Google" className="w-5 h-5" />
                        </picture>
                        <span className="text-gray-700 font-medium">Sign up with Google</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
