'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';

export default function WishlistPage() {
    const { user } = useAuth();
    const { wishlist, removeFromWishlist, clearWishlist, getWishlistCount } = useWishlist();
    const [loading, setLoading] = useState(false);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
                    <p className="text-gray-600 mb-8">You need to be logged in to view your wishlist.</p>
                    <Link
                        href="/auth/login"
                        className="inline-block px-6 py-3 bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold rounded-lg transition-colors"
                    >
                        Login to Continue
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                    <p className="text-gray-600 mt-2">
                        {getWishlistCount()} {getWishlistCount() === 1 ? 'item' : 'items'} in your wishlist
                    </p>
                </div>

                {/* Wishlist Content */}
                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg
                                className="mx-auto h-24 w-24"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0-7.78z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-600 mb-6">
                            Start adding items you love to your wishlist and they'll appear here.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-block px-6 py-3 bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold rounded-lg transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((item) => (
                            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                                {/* Product Image */}
                                <div className="relative">
                                    <Link href={`/shop/${item._id}`}>
                                        <div className="aspect-square overflow-hidden bg-gray-100">
                                            {item.images && item.images.length > 0 ? (
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                    <span className="text-gray-400 text-4xl">📦</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Wishlist Actions */}
                                    <button
                                        onClick={() => removeFromWishlist(item._id)}
                                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                        aria-label="Remove from wishlist"
                                    >
                                        <svg
                                            className="w-5 h-5 text-red-500 hover:text-red-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                {/* Product Details */}
                                <div className="p-4">
                                    <div className="space-y-2">
                                        {/* Product Name */}
                                        <Link href={`/shop/${item._id}`}>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-[#d4a574] transition-colors line-clamp-2">
                                                {item.name}
                                            </h3>
                                        </Link>

                                        {/* Category */}
                                        <p className="text-sm text-gray-500 capitalize">
                                            {item.category}
                                        </p>

                                        {/* Price */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-lg font-bold text-gray-900">
                                                    ${item.price}
                                                </span>
                                                {item.originalPrice && item.originalPrice > item.price && (
                                                    <span className="ml-2 text-sm text-gray-500 line-through">
                                                        ${item.originalPrice}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Stock Status */}
                                            <div className="text-right">
                                                {item.stock > 0 ? (
                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                        In Stock
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                        Out of Stock
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Added Date */}
                                        <p className="text-xs text-gray-400 mt-2">
                                            Added {new Date(item.addedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="p-4 pt-0 border-t border-gray-100">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/shop/${item._id}`}
                                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#d4a574] hover:bg-[#c49560] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4a574]"
                                        >
                                            View Details
                                        </Link>

                                        {item.stock > 0 && (
                                            <button
                                                onClick={() => {
                                                    // Add to cart logic here
                                                    console.log('Add to cart:', item._id);
                                                }}
                                                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4a574]"
                                            >
                                                Add to Cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Clear Wishlist Button */}
                {wishlist.length > 0 && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={clearWishlist}
                            className="inline-flex items-center px-6 py-3 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Clear Wishlist
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
