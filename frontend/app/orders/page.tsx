'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
    };
}

interface Order {
    _id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    totalAmount: number;
    items: OrderItem[];
    orderDate: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
}

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login?redirect=/orders');
            return;
        }

        if (user) {
            fetchOrders();
        }
    }, [user, authLoading, currentPage, statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10'
            });

            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }

            const response = await apiClient.get(`/orders?${params.toString()}`);

            if (response.data?.success) {
                setOrders(response.data.data);
                setTotalPages(response.data.pagination.pages);
            }
        } catch (error: any) {
            console.error('Error fetching orders:', error);
            setError(error.response?.data?.message || 'Failed to load orders');
        } finally {
            setLoading(false);
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

    const handleViewOrder = (orderId: string) => {
        router.push(`/orders/${orderId}`);
    };

    const handleCancelOrder = async (orderId: string) => {
        const reason = prompt('Please provide a reason for cancellation:');
        if (!reason) return;

        try {
            const response = await apiClient.put(`/orders/${orderId}/cancel`, { reason });
            if (response.data?.success) {
                // Update the order in the list
                setOrders(prev => prev.map(order =>
                    order._id === orderId
                        ? { ...order, status: 'cancelled' }
                        : order
                ));
            }
        } catch (error: any) {
            console.error('Error cancelling order:', error);
            alert(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4a574]"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">
                        Track and manage your orders
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => {
                                    setStatusFilter(status);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === status
                                        ? 'bg-[#d4a574] text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {status === 'all' ? 'All Orders' : getStatusText(status)}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4a574]"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="text-red-500 text-6xl mb-4">❌</div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Orders</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={fetchOrders}
                            className="px-4 py-2 bg-[#d4a574] hover:bg-[#c49560] text-white font-medium rounded-md transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📦</div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h2>
                        <p className="text-gray-600 mb-6">
                            {statusFilter === 'all'
                                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                                : `No ${statusFilter} orders found.`
                            }
                        </p>
                        <button
                            onClick={() => router.push('/shop')}
                            className="px-6 py-3 bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold rounded-lg transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Orders List */}
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    {/* Order Header */}
                                    <div className="bg-gray-50 px-6 py-4 border-b">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Order #{order.orderNumber}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Placed on {new Date(order.orderDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                                                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-6">
                                        <div className="space-y-4 mb-6">
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

                                        {/* Order Footer */}
                                        <div className="border-t pt-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <div className="mb-4 sm:mb-0">
                                                    <p className="text-sm text-gray-600">
                                                        Total Amount: <span className="font-semibold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                                                    </p>
                                                    {order.trackingNumber && (
                                                        <p className="text-sm text-gray-600">
                                                            Tracking: <span className="font-medium">{order.trackingNumber}</span>
                                                        </p>
                                                    )}
                                                    {order.estimatedDelivery && (
                                                        <p className="text-sm text-gray-600">
                                                            Est. Delivery: <span className="font-medium">
                                                                {new Date(order.estimatedDelivery).toLocaleDateString()}
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleViewOrder(order._id)}
                                                        className="px-4 py-2 bg-[#d4a574] hover:bg-[#c49560] text-white text-sm font-medium rounded-md transition-colors"
                                                    >
                                                        View Details
                                                    </button>
                                                    {['pending', 'confirmed'].includes(order.status) && (
                                                        <button
                                                            onClick={() => handleCancelOrder(order._id)}
                                                            className="px-4 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-md hover:bg-red-50 transition-colors"
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${currentPage === page
                                                    ? 'bg-[#d4a574] text-white border-[#d4a574]'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
