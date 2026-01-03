'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';

interface AdminStats {
    totalProducts: number;
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: any[];
    topProducts: any[];
    lowStockProducts: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats>({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: [],
        topProducts: [],
        lowStockProducts: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/admin/dashboard');
            if (response.data?.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4a574]"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: '📦',
            color: 'bg-blue-500',
            change: '+12%',
            changeType: 'positive' as const,
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: '👥',
            color: 'bg-green-500',
            change: '+8%',
            changeType: 'positive' as const,
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: '🛒',
            color: 'bg-purple-500',
            change: '+23%',
            changeType: 'positive' as const,
        },
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: '💰',
            color: 'bg-yellow-500',
            change: '+15%',
            changeType: 'positive' as const,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome to your admin dashboard. Here's what's happening with your store today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.title} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <div className="flex items-center mt-2">
                                    <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {stat.change}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                                </div>
                            </div>
                            <div className={`${stat.color} p-3 rounded-full`}>
                                <span className="text-2xl">{stat.icon}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    </div>
                    <div className="p-6">
                        {stats.recentOrders.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No recent orders</p>
                        ) : (
                            <div className="space-y-4">
                                {stats.recentOrders.slice(0, 5).map((order) => (
                                    <div key={order._id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">Order #{order._id.slice(-8)}</p>
                                            <p className="text-sm text-gray-500">{order.user?.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">${order.totalAmount}</p>
                                            <p className="text-sm text-gray-500">{order.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
                    </div>
                    <div className="p-6">
                        {stats.lowStockProducts.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">All products are well stocked</p>
                        ) : (
                            <div className="space-y-4">
                                {stats.lowStockProducts.slice(0, 5).map((product) => (
                                    <div key={product._id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-sm text-gray-500">{product.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-yellow-600'
                                                }`}>
                                                {product.stock} left
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
                </div>
                <div className="p-6">
                    {stats.topProducts.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No sales data available</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stats.topProducts.slice(0, 6).map((product, index) => (
                                <div key={product._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#d4a574] text-white rounded-full flex items-center justify-center font-semibold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.sales} sold</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">${product.revenue}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
