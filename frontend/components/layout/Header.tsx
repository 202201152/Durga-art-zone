'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { getWishlistCount } = useWishlist();
  const router = useRouter();
  const cartItemsCount = getTotalItems();
  const wishlistItemsCount = getWishlistCount();

  const handleAccountClick = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            DG Jewelry
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-gray-700 hover:text-gray-900 transition-colors">
              Shop
            </Link>
            <Link href="/wishlist" className="text-gray-700 hover:text-gray-900 transition-colors relative">
              Wishlist
              {wishlistItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#d4a574] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItemsCount > 9 ? '9+' : wishlistItemsCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Account */}
            <button
              onClick={handleAccountClick}
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Account"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={() => router.push('/cart')}
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative"
              aria-label="Shopping Cart"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d4a574] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

