'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/auth/Logo';

/**
 * Payment Failed Page
 * Displayed when Razorpay payment fails
 */
export default function PaymentFailedPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const error = searchParams.get('error');

        if (error) {
            console.error('Payment failed:', error);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md text-center">
                {/* Error Icon */}
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                {/* Logo */}
                <Logo />

                {/* Error Message */}
                <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">
                    Payment Failed
                </h1>
                <p className="text-gray-600 mb-8">
                    We couldn't process your payment. Please try again or use a different payment method.
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={() => router.push('/checkout')}
                        className="w-full bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        Try Again
                    </button>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-white border border-gray-200 text-gray-900 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        Continue Shopping
                    </button>
                </div>

                {/* Help Section */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
                    <p className="text-sm text-gray-600">
                        If you continue to face payment issues, please contact our support team at support@durgaartzone.com
                    </p>
                </div>
            </div>
        </div>
    );
}
