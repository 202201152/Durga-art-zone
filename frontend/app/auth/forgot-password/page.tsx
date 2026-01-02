'use client';

import { useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api/client';
import toast from 'react-hot-toast';
import Logo from '@/components/auth/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/forgotpassword', { email });
      
      // In development, show reset token
      if (process.env.NEXT_PUBLIC_ENV === 'development' && response.data.resetToken) {
        toast.success('Password reset link sent! Check the console for reset token.');
        console.log('Reset Token:', response.data.resetToken);
        console.log('Reset URL:', response.data.resetUrl);
      } else {
        toast.success('If an account exists with this email, a password reset link has been sent.');
      }
      
      setSuccess(true);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send reset email. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <Logo />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Check your email</h1>
          <p className="text-gray-600 mb-8">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <Link
            href="/auth/login"
            className="text-[#d4a574] font-medium hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Logo />
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Forgot password?
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className="text-center mt-6">
          <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}

