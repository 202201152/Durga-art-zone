'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api/client';

interface AdminStats {
    totalProducts: number;
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState<AdminStats>({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/auth/login');
                return;
            }

            if (user.role !== 'admin') {
                router.push('/');
                return;
            }
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAdminStats();
        }
    }, [user]);

    const fetchAdminStats = async () => {
        try {
            const response = await apiClient.get('/admin/stats');
            if (response.data?.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#d4a574]"></div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: '📊' },
        { name: 'Products', href: '/admin/products', icon: '📦' },
        { name: 'Orders', href: '/admin/orders', icon: '🛒' },
        { name: 'Users', href: '/admin/users', icon: '👥' },
        { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
        { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
                </div>
            )}

            {/* Sidebar */}
            <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex items-center justify-between h-16 px-6 border-b">
                    <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <nav className="mt-6">
                    <div className="px-3">
                        {navigation.map((item) => {
                            const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors
                    ${isActive
                                            ? 'bg-[#d4a574] text-white'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }
                  `}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Admin Stats Summary */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Products:</span>
                            <span className="font-medium">{stats.totalProducts}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Users:</span>
                            <span className="font-medium">{stats.totalUsers}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Orders:</span>
                            <span className="font-medium">{stats.totalOrders}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Revenue:</span>
                            <span className="font-medium">${stats.totalRevenue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:ml-64">
                {/* Top bar */}
                <div className="bg-white shadow-sm border-b">
                    <div className="flex items-center justify-between h-16 px-6">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            ☰
                        </button>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Welcome, {user.name}
                            </span>
                            <Link
                                href="/"
                                className="text-sm text-[#d4a574] hover:text-[#c49560]"
                            >
                                View Store
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
