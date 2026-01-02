'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/auth/Logo';
import GoogleButton from '@/components/auth/GoogleButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      // Redirect handled by AuthContext after successful login
    } catch (error) {
      // Error handled by AuthContext toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Logo />

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Welcome back
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Daily-wear jewelry, made effortless
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-transparent text-gray-900 placeholder-gray-400"
            />
            <Link
              href="/auth/forgot-password"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google Button */}
        <GoogleButton />

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-gray-900 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Help Icon */}
      <Link
        href="/help"
        className="fixed bottom-6 right-6 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors"
      >
        <span className="text-white text-lg font-bold">?</span>
      </Link>
    </div>
  );
}
