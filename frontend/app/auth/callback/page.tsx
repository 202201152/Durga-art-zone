'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import Logo from '@/components/auth/Logo';

/**
 * OAuth Callback Page
 * Handles Google OAuth callback and sets token
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Store token
      Cookies.set('token', token, { expires: 7 });
      toast.success('Login successful!');
      router.push('/');
    } else {
      // No token, redirect to login
      toast.error('Authentication failed');
      router.push('/auth/login');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
      <div className="text-center">
        <Logo />
        <p className="text-gray-600 mt-4">Completing sign in...</p>
      </div>
    </div>
  );
}
