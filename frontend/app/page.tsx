'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">
              Durga Art Zone
            </h1>
            <div className="flex gap-4 items-center">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">
                    Welcome, <strong>{user?.name}</strong>
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 bg-[#d4a574] hover:bg-[#c49560] text-white rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">
              Premium Jewelry E-commerce Platform
            </p>
            <p className="text-gray-500 mb-8">
              {isAuthenticated
                ? 'Authentication is working! Ready to build more features.'
                : 'Please sign in to continue.'}
            </p>

            {isAuthenticated && (
              <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Your Account</h2>
                <div className="text-left space-y-2">
                  <p><strong>Email:</strong> {user?.email}</p>
                  {user?.phone && <p><strong>Phone:</strong> {user.phone}</p>}
                  <p><strong>Role:</strong> {user?.role}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


