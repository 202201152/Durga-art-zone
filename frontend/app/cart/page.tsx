'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart,
  } = useCart();

  const router = useRouter();
  const total = getTotalPrice();

  // ================= EMPTY CART =================
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Cart
          </h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>

          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold rounded-lg transition"
          >
            Continue Shopping
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  // ================= CART PAGE =================
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ================= CART ITEMS ================= */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size || 'default'}`}
                  className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 relative bg-gray-100 rounded-lg overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info + Controls */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      {item.material && (
                        <p className="text-sm text-gray-600">
                          Material: {item.material}
                        </p>
                      )}

                      {item.size && (
                        <p className="text-sm text-gray-600">
                          Size: {item.size}
                        </p>
                      )}

                      <p className="text-lg font-bold text-gray-900 mt-2">
                        ${item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="
                          w-9 h-9 rounded-full
                          border border-gray-400
                          flex items-center justify-center
                          text-gray-800
                          hover:border-gray-600 hover:text-black
                          disabled:opacity-40 disabled:cursor-not-allowed
                          transition
                        "
                      >
                        −
                      </button>

                      <span className="min-w-[24px] text-center font-medium text-gray-900">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="
                          w-9 h-9 rounded-full
                          border border-gray-400
                          flex items-center justify-center
                          text-gray-800
                          hover:border-gray-600 hover:text-black
                          transition
                        "
                      >
                        +
                      </button>

                      <button
                        onClick={() =>
                          removeFromCart(item.productId, item.size)
                        }
                        aria-label="Remove item"
                        className="text-gray-500 hover:text-red-600 p-2 transition"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear Cart
              </button>
            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <div>
              <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{total >= 100 ? 'Free' : '$10.00'}</span>
                  </div>

                  <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span>
                      ${(total >= 100 ? total : total + 10).toFixed(2)}
                    </span>
                  </div>
                </div>

                {total < 100 && (
                  <p className="text-sm text-gray-600 mb-4">
                    Add ${(100 - total).toFixed(2)} more for free shipping!
                  </p>
                )}

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold py-3 rounded-lg transition mb-4"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/shop"
                  className="block text-center text-sm text-gray-600 hover:text-gray-900"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
