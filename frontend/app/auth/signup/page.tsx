'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/auth/Logo';
import GoogleButton from '@/components/auth/GoogleButton';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(name, email, password);
      // Redirect handled by AuthContext after successful registration
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
          Create your account
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Start your jewelry journey today
        </p>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          <div>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={50}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

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
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Terms Text */}
          <p className="text-sm text-gray-500 text-center">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-gray-700 hover:underline">
              terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-gray-700 hover:underline">
              privacy policy
            </Link>
            .
          </p>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
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

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-gray-900 font-medium hover:underline">
            Log in
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

