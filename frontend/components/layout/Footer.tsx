'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#faf8f5] border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* DG Jewelry Column */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">DG Jewelry</h3>
            <p className="text-gray-600 text-sm">
              Everyday elegance for the modern woman. Crafted with care, worn with confidence.
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop?category=bracelet" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=earrings" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=chains" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Chains
                </Link>
              </li>
              <li>
                <Link href="/shop?category=rings" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/gift-sets" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Gift Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/care-guide" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Care Guide
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Connect</h3>
            <p className="text-gray-600 text-sm mb-3">Follow us for daily inspiration</p>
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="white" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Facebook"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              {/* Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Twitter"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © 2025 DG Jewelry. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


