'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Logo from '@/components/auth/Logo';

/**
 * Payment Success Page
 * Displayed after successful Razorpay payment
 */
export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCart();

    useEffect(() => {
        const orderId = searchParams.get('orderId');

        if (!orderId) {
            // No order ID, redirect to home
            router.push('/');
            return;
        }

        // Clear cart after successful payment
        clearCart();
    }, [searchParams, router, clearCart]);

    return (
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* Logo */}
                <Logo />

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">
                    Payment Successful!
                </h1>
                <p className="text-gray-600 mb-8">
                    Your payment has been processed successfully and your order has been confirmed.
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={() => router.push('/orders')}
                        className="w-full bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        View My Orders
                    </button>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-white border border-gray-200 text-gray-900 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}
