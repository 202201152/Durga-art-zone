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

  /* ================= EMPTY CART ================= */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Cart
          </h1>
          <p className="text-black mb-8">Your cart is empty</p>

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

  /* ================= CART PAGE ================= */
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
                        sizes="(max-width: 640px) 100vw, 128px"
                        className="object-cover"
                        onError={(e) => {
                          console.error('Cart image failed to load:', item.image);
                          // Fallback to placeholder
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}

                    {/* Fallback placeholder */}
                    <div className={`w-full h-full flex items-center justify-center text-gray-400 ${item.image ? 'hidden' : ''}`}>
                      <div className="text-center">
                        <div className="text-2xl mb-1">📦</div>
                        <div className="text-xs">No Image</div>
                      </div>
                    </div>
                  </div>

                  {/* Product Info + Controls */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      {item.material && (
                        <p className="text-sm text-black">
                          Material: {item.material}
                        </p>
                      )}

                      {item.size && (
                        <p className="text-sm text-black">
                          Size: {item.size}
                        </p>
                      )}

                      <p className="text-lg font-bold text-black mt-2">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          item.quantity <= 1
                            ? removeFromCart(item.productId, item.size)
                            : updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center text-black hover:border-gray-600 transition"
                      >
                        −
                      </button>

                      <span className="min-w-[24px] text-center font-medium text-black">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center text-black hover:border-gray-600 transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove + Item Total */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          removeFromCart(item.productId, item.size)
                        }
                        className="text-red-600 hover:text-red-700 transition"
                      >
                        🗑
                      </button>

                      <p className="text-lg font-bold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

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
                <h2 className="text-xl font-bold text-black mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-black">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-black">
                    <span>Shipping</span>
                    <span>{total >= 1000 ? 'Free' : '₹50.00'}</span>
                  </div>

                  <div className="border-t pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      ₹{(total >= 1000 ? total : total + 50).toFixed(2)}
                    </span>
                  </div>
                </div>

                {total < 1000 && (
                  <p className="text-sm text-black mb-4">
                    Add ₹{(1000 - total).toFixed(2)} more for free shipping!
                  </p>
                )}

                <Link
                  href="/checkout"
                  className="block text-center text-black font-semibold py-3 px-6 bg-[#d4a574] rounded-lg transition"
                >
                  Proceed to Checkout
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
