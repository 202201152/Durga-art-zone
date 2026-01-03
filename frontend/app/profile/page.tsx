'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api/client';

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'user' | 'admin' | 'delivery_partner';
    createdAt: string;
    lastLogin?: string;
    isActive?: boolean;
}

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading: authLoading, logout } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    });

    useEffect(() => {
        if (!authLoading && user) {
            fetchProfile();
        }
    }, [user, authLoading]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/auth/me');
            if (response.data?.success) {
                setProfile(response.data.data);
                setFormData({
                    name: response.data.data.name,
                    phone: response.data.data.phone || '',
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await apiClient.put('/auth/updatedetails', formData);
            if (response.data?.success) {
                setProfile(response.data.data);
                setEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleCancelEdit = () => {
        if (profile) {
            setFormData({
                name: profile.name,
                phone: profile.phone || '',
            });
        }
        setEditing(false);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4a574]"></div>
            </div>
        );
    }

    if (!user) {
        router.push('/auth/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    {/* Header */}
                    <div className="bg-[#d4a574] px-4 py-5 sm:px-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg leading-6 font-medium text-white">
                                User Profile
                            </h3>

                            <div className="flex items-center gap-3">
                                {/* Admin Dashboard Button */}
                                {user.role === 'admin' && (
                                    <button
                                        onClick={() => router.push('/admin')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#d4a574] bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                                    >
                                        📊 Admin Dashboard
                                    </button>
                                )}

                                {/* Logout Button */}
                                <button
                                    onClick={() => {
                                        logout();
                                        router.push('/');
                                    }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Profile Information */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                                        Profile Information
                                    </h4>

                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {editing ? (
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                                                    />
                                                ) : (
                                                    profile?.name
                                                )}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{profile?.email}</dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {editing ? (
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                                                        placeholder="Add phone number"
                                                    />
                                                ) : (
                                                    profile?.phone || 'Not provided'
                                                )}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Role</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${profile?.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                    profile?.role === 'delivery_partner' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                    {profile?.role === 'admin' ? 'Administrator' :
                                                        profile?.role === 'delivery_partner' ? 'Delivery Partner' :
                                                            'Customer'}
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>

                                    {/* Edit Actions */}
                                    <div className="flex space-x-3 pt-4">
                                        {editing ? (
                                            <>
                                                <button
                                                    onClick={handleUpdateProfile}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#d4a574] hover:bg-[#c49560] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4a574]"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4a574]"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setEditing(true)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#d4a574] hover:bg-[#c49560] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4a574]"
                                            >
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                                        Account Information
                                    </h4>

                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Account Status</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${profile?.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {profile?.isActive !== false ? 'Active' : 'Inactive'}
                                                </span>
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Last Login</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'N/A'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Quick Actions */}
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                                        Quick Actions
                                    </h4>

                                    <div className="space-y-3">
                                        {user.role === 'admin' && (
                                            <button
                                                onClick={() => router.push('/admin')}
                                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#d4a574] hover:bg-[#c49560] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4a574]"
                                            >
                                                📊 Go to Admin Dashboard
                                            </button>
                                        )}

                                        <button
                                            onClick={() => router.push('/shop')}
                                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4a574]"
                                        >
                                            🛍️ Browse Shop
                                        </button>

                                        <button
                                            onClick={() => router.push('/orders')}
                                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4a574]"
                                        >
                                            📦 View Orders
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Admin Notice */}
                        {user.role === 'admin' && (
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <span className="text-blue-400">ℹ️</span>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800">
                                            Admin Access
                                        </h3>
                                        <div className="mt-2 text-sm text-blue-700">
                                            <p>You have administrator privileges. You can access the admin dashboard to manage products, users, and view analytics.</p>
                                            <div className="mt-2">
                                                <button
                                                    onClick={() => router.push('/admin')}
                                                    className="text-blue-800 underline hover:text-blue-600"
                                                >
                                                    Go to Admin Dashboard →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
