'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api/client';

interface OrderItem {
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
    product: {
        _id: string;
        name: string;
        images: string[];
        description?: string;
    };
}

interface Order {
    _id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    totalAmount: number;
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    items: OrderItem[];
    shippingAddress: {
        firstName: string;
        lastName: string;
        company?: string;
        address: string;
        apartment?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone: string;
    };
    orderDate: string;
    confirmedDate?: string;
    shippedDate?: string;
    deliveredDate?: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
    notes?: string;
    customerNotes?: string;
}

export default function OrderDetailsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const orderId = params.id as string;

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
            return;
        }

        if (orderId) {
            fetchOrder();
        }
    }, [user, authLoading, orderId, router]);

    const fetchOrder = async () => {
        try {
            const response = await apiClient.get(`/orders/${orderId}`);
            if (response.data?.success) {
                setOrder(response.data.data);
            }
        } catch (error: any) {
            console.error('Error fetching order:', error);
            if (error.response?.status === 404) {
                setError('Order not found');
            } else if (error.response?.status === 403) {
                setError('Access denied');
            } else {
                setError(error.response?.data?.message || 'Failed to load order details');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        const reason = prompt('Please provide a reason for cancellation:');
        if (!reason) return;

        try {
            const response = await apiClient.put(`/orders/${orderId}/cancel`, { reason });
            if (response.data?.success) {
                setOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
                alert('Order cancelled successfully');
            }
        } catch (error: any) {
            console.error('Error cancelling order:', error);
            alert(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-purple-100 text-purple-800';
            case 'shipped':
                return 'bg-indigo-100 text-indigo-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'confirmed':
                return 'Confirmed';
            case 'processing':
                return 'Processing';
            case 'shipped':
                return 'Shipped';
            case 'delivered':
                return 'Delivered';
            case 'cancelled':
                return 'Cancelled';
            case 'refunded':
                return 'Refunded';
            default:
                return status;
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
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
                        onClick={() => router.push('/orders')}
                        className="px-6 py-3 bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold rounded-lg transition-colors"
                    >
                        Back to Orders
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/orders')}
                        className="mb-4 text-[#d4a574] hover:text-[#c49560] font-medium flex items-center gap-2"
                    >
                        ← Back to Orders
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                    <p className="text-gray-600">Order #{order.orderNumber}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Order Status:</span>
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Payment Status:</span>
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-medium capitalize">
                                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Order Placed</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>

                                {order.confirmedDate && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Order Confirmed</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(order.confirmedDate).toLocaleDateString()} at {new Date(order.confirmedDate).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {order.shippedDate && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0014 7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Order Shipped</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(order.shippedDate).toLocaleDateString()} at {new Date(order.shippedDate).toLocaleTimeString()}
                                            </p>
                                            {order.trackingNumber && (
                                                <p className="text-sm text-gray-600">
                                                    Tracking: <span className="font-medium">{order.trackingNumber}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {order.deliveredDate && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Order Delivered</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(order.deliveredDate).toLocaleDateString()} at {new Date(order.deliveredDate).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                                        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
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
                                            <h4 className="text-base font-medium text-gray-900 mb-1">
                                                {item.name}
                                            </h4>
                                            <p className="text-sm text-gray-500 mb-2">
                                                {item.product.description && (
                                                    <span className="line-clamp-2">{item.product.description}</span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Size: {item.size} | Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-base font-medium text-gray-900">
                                                ₹{item.price * item.quantity}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                ₹{item.price} each
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                            <div className="space-y-2">
                                <p className="font-medium">
                                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                </p>
                                {order.shippingAddress.company && (
                                    <p className="text-gray-600">{order.shippingAddress.company}</p>
                                )}
                                <p className="text-gray-600">{order.shippingAddress.address}</p>
                                {order.shippingAddress.apartment && (
                                    <p className="text-gray-600">{order.shippingAddress.apartment}</p>
                                )}
                                <p className="text-gray-600">
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                </p>
                                <p className="text-gray-600">{order.shippingAddress.country}</p>
                                <p className="text-gray-600">{order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax</span>
                                    <span>₹{order.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span>₹{order.shipping.toFixed(2)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount</span>
                                        <span>-₹{order.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t pt-2">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span>₹{order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/shop')}
                                    className="w-full px-4 py-2 bg-[#d4a574] hover:bg-[#c49560] text-white font-medium rounded-md transition-colors"
                                >
                                    Continue Shopping
                                </button>
                                {['pending', 'confirmed'].includes(order.status) && (
                                    <button
                                        onClick={handleCancelOrder}
                                        className="w-full px-4 py-2 border border-red-300 text-red-700 font-medium rounded-md hover:bg-red-50 transition-colors"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {(order.notes || order.customerNotes) && (
                    <div className="mt-8 bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h2>
                        {order.customerNotes && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Customer Notes:</h3>
                                <p className="text-sm text-gray-600">{order.customerNotes}</p>
                            </div>
                        )}
                        {order.notes && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Admin Notes:</h3>
                                <p className="text-sm text-gray-600">{order.notes}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
