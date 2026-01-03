'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';

interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'user' | 'admin' | 'delivery_partner';
    isActive?: boolean;
    createdAt: string;
    lastLogin?: string;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, [searchTerm, filterRole, currentPage]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params: any = {
                page: currentPage,
                limit: 20,
            };

            if (searchTerm) params.search = searchTerm;
            if (filterRole) params.role = filterRole;

            const response = await apiClient.get('/admin/users', { params });
            if (response.data?.success) {
                setUsers(response.data.data);
                setTotalPages(response.data.pagination.pages);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        try {
            const response = await apiClient.put(`/admin/users/${userId}/role`, { role: newRole });
            if (response.data?.success) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const handleStatusToggle = async (userId: string) => {
        try {
            const response = await apiClient.put(`/admin/users/${userId}/status`);
            if (response.data?.success) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'delivery_partner': return 'bg-blue-100 text-blue-800';
            default: return 'bg-green-100 text-green-800';
        }
    };

    const getRoleBadgeText = (role: string) => {
        switch (role) {
            case 'admin': return 'Admin';
            case 'delivery_partner': return 'Delivery';
            default: return 'User';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                <p className="text-gray-600">Manage user accounts and permissions</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                    />

                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                    >
                        <option value="">All Roles</option>
                        <option value="user">Users</option>
                        <option value="admin">Admins</option>
                        <option value="delivery_partner">Delivery Partners</option>
                    </select>

                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFilterRole('');
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4a574]"></div>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No users found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                                {user.phone && (
                                                    <div className="text-sm text-gray-500">{user.phone}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer ${getRoleBadgeColor(user.role)}`}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                                <option value="delivery_partner">Delivery Partner</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleStatusToggle(user._id)}
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${user.isActive !== false
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                    }`}
                                            >
                                                {user.isActive !== false ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleStatusToggle(user._id)}
                                                className={`${user.isActive !== false
                                                        ? 'text-red-600 hover:text-red-900'
                                                        : 'text-green-600 hover:text-green-900'
                                                    }`}
                                            >
                                                {user.isActive !== false ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Page <span className="font-medium">{currentPage}</span> of{' '}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                                                        ? 'z-10 bg-[#d4a574] border-[#d4a574] text-white'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
