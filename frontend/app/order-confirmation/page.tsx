'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api/client';

interface Order {
    _id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    totalAmount: number;
    shippingAddress: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        phone: string;
    };
    items: Array<{
        name: string;
        price: number;
        quantity: number;
        size: string;
        image: string;
    }>;
    orderDate: string;
}

export default function OrderConfirmationPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
            return;
        }

        if (!orderId) {
            setError('Order ID is required');
            setLoading(false);
            return;
        }

        fetchOrder();
    }, [user, authLoading, orderId, router]);

    const fetchOrder = async () => {
        try {
            const response = await apiClient.get(`/orders/${orderId}`);
            if (response.data?.success) {
                setOrder(response.data.data);
            }
        } catch (error: any) {
            console.error('Error fetching order:', error);
            setError(error.response?.data?.message || 'Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const handleContinueShopping = () => {
        router.push('/shop');
    };

    const handleViewOrders = () => {
        router.push('/orders');
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4a574]"></div>
            </div>
        );
    }

    if (!user || error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {error || 'Order Not Found'}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {error || 'We couldn\'t find your order. Please check your order number.'}
                    </p>
                    <button
                        onClick={() => router.push('/shop')}
                        className="inline-block px-6 py-3 bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold rounded-lg transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Order...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Message */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-gray-600">
                        Thank you for your order. We've received it and will begin processing it shortly.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Details */}
                    <div className="space-y-6">
                        {/* Order Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order Number:</span>
                                    <span className="font-medium">{order.orderNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order Date:</span>
                                    <span className="font-medium">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-medium capitalize">
                                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order Status:</span>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                                                    order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Status:</span>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                                order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                            <div className="space-y-2">
                                <p className="font-medium">
                                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                </p>
                                <p className="text-gray-600">{order.shippingAddress.address}</p>
                                <p className="text-gray-600">
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                </p>
                                <p className="text-gray-600">{order.shippingAddress.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-gray-400 text-2xl">📦</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                                {item.name}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity} {item.size && `(${item.size})`}
                                            </p>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            ₹{item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Total */}
                            <div className="border-t pt-4 mt-6">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total Paid</span>
                                    <span>₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li>• You'll receive an order confirmation email shortly</li>
                                <li>• We'll process your order within 1-2 business days</li>
                                <li>• You'll receive tracking information once your order ships</li>
                                <li>• Expected delivery: 3-5 business days</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 text-center">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleContinueShopping}
                            className="px-6 py-3 bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold rounded-lg transition-colors"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={handleViewOrders}
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            View My Orders
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
