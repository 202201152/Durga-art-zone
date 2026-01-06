'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import apiClient from '@/lib/api/client';
import Razorpay from 'razorpay';

/* ================= TYPES ================= */

interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface OrderItem {
  product: string;
  quantity: number;
  size?: string;
}

/* ================= COMPONENT ================= */

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Razorpay payment handler
  const handleRazorpayPayment = async (orderItems: OrderItem[]) => {
    try {
      // Create Razorpay order
      const total = getTotalPrice();
      const response = await apiClient.post('/payments/create-order', {
        amount: total,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      });

      if (!response.data?.success) {
        setErrors({ submit: 'Failed to create payment order. Please try again.' });
        return;
      }

      const { data: razorpayOrder } = response.data;

      // Initialize Razorpay
      const razorpay = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Durga Art Zone',
        description: 'Purchase of jewelry items',
        image: '/logo.png',
        order_id: razorpayOrder.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment with backend
            const verifyResponse = await apiClient.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data?.success) {
              // Create order after successful payment
              const orderResponse = await apiClient.post('/orders', {
                items: orderItems,
                shippingAddress,
                paymentMethod: 'razorpay',
                notes: notes || undefined,
                source: 'website',
                razorpayOrderId: response.razorpay_order_id
              });

              if (orderResponse.data?.success) {
                clearCart();
                router.push(`/order-confirmation?orderId=${orderResponse.data.data._id}`);
              } else {
                setErrors({ submit: 'Order creation failed after payment. Please contact support.' });
              }
            } else {
              setErrors({ submit: 'Payment verification failed. Please contact support.' });
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setErrors({ submit: 'Payment verification failed. Please try again.' });
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: shippingAddress.phone || ''
        },
        notes: {
          address: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}`
        },
        theme: {
          color: '#d4a574'
        },
        modal: {
          ondismiss: () => {
            console.log('Razorpay modal dismissed');
          },
          escape: true,
          backdropclose: false
        }
      });

      // Open Razorpay checkout
      razorpay.open();
    } catch (error) {
      console.error('Razorpay payment error:', error);
      setErrors({ submit: 'Payment failed. Please try again.' });
    }
  };

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
  });

  /* ================= EFFECTS ================= */

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        phone: user.phone || '',
      }));
    }
  }, [user, authLoading, items, router]);

  /* ================= PRICING ================= */

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + tax + shipping;

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!shippingAddress.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingAddress.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingAddress.address.trim()) newErrors.address = 'Address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= HANDLERS ================= */

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const orderItems: OrderItem[] = items.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        size: item.size || 'One Size',
      }));

      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment(orderItems);
      } else {
        // Handle COD and other payment methods
        const response = await apiClient.post('/orders', {
          items: orderItems,
          shippingAddress,
          paymentMethod,
          notes: notes || undefined,
          source: 'website',
        });

        if (response.data?.success) {
          clearCart();
          router.push(`/order-confirmation?orderId=${response.data.data._id}`);
        }
      }
    } catch (error: any) {
      setErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4a574]" />
      </div>
    );
  }

  if (!user || items.length === 0) return null;

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ========== SHIPPING FORM ========== */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Shipping Information</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={shippingAddress.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574] text-gray-800 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      disabled={loading}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={shippingAddress.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574] text-gray-800 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      disabled={loading}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-2">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={shippingAddress.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574] text-gray-800"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574] text-gray-800 ${errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                    disabled={loading}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="apartment" className="block text-sm font-medium text-gray-900 mb-2">
                    Apartment, suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={shippingAddress.apartment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574] text-gray-800"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-900 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574] text-gray-800 ${errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      disabled={loading}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-900 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574] text-gray-800 ${errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                      disabled={loading}
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-900 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574] text-gray-800 ${errors.postalCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                      disabled={loading}
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574] text-gray-800 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      disabled={loading}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-[#d4a574] focus:ring-[#d4a574]"
                        disabled={loading}
                      />
                      <span className="text-gray-900">Cash on Delivery (COD)</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-[#d4a574] focus:ring-[#d4a574]"
                        disabled={loading}
                      />
                      <span className="text-gray-900">Credit/Debit Card</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-[#d4a574] focus:ring-[#d4a574]"
                        disabled={loading}
                      />
                      <span className="text-gray-900">UPI</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-[#d4a574] focus:ring-[#d4a574]"
                        disabled={loading}
                      />
                      <span className="text-gray-900">Razorpay (Card/UPI/Net Banking)</span>
                    </label>
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574] text-gray-800"
                    placeholder="Special instructions for delivery..."
                    disabled={loading}
                  />
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600">{errors.submit}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4a574] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>

          {/* ========== ORDER SUMMARY ========== */}
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size || 'default'}`}
                  className="flex items-center space-x-4"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Checkout image failed to load:', item.image);
                          // Fallback to placeholder
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}

                    {/* Fallback placeholder */}
                    <div className={`w-full h-full flex items-center justify-center text-gray-400 ${item.image ? 'hidden' : ''}`}>
                      <div className="text-center">
                        <div className="text-xl">📦</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>

                  <div className="font-medium text-gray-900">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-900">Subtotal</span>
                <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900">Tax (10%)</span>
                <span className="text-gray-900">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900">Shipping</span>
                <span className="text-gray-900">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-lg text-gray-900">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {shipping === 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">
                  🎉 You've qualified for free shipping!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
