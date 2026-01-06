# Razorpay Payment Integration Setup

## 🚀 Complete Setup Guide

### 1. Get Razorpay API Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or login to your account
3. Go to **Settings** → **API Keys**
4. Click **Generate Key** to create a new key pair
5. Copy **Key ID** and **Key Secret**

### 2. Update Environment Variables

#### Backend (.env file):
```env
RAZORPAY_KEY_ID=your-razorpay-key-id-here
RAZORPAY_KEY_SECRET=your-razorpay-key-secret-here
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret-here
```

#### Frontend (.env.local file):
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id-here
```

### 3. Configure Webhooks (Optional but Recommended)

1. In Razorpay Dashboard, go to **Settings** → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/v1/payments/webhook`
3. Select events to capture:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
4. Copy the webhook secret and add to `RAZORPAY_WEBHOOK_SECRET`

### 4. Test Mode vs Live Mode

#### Test Mode (Development):
- Use test keys provided by Razorpay
- No real money transactions
- Use test card numbers from Razorpay docs

#### Live Mode (Production):
- Use live keys from Razorpay
- Real money transactions
- Must activate account for live payments

## 🔄 Payment Flow

### User Experience:
1. User adds items to cart
2. User proceeds to checkout
3. User selects "Razorpay (Card/UPI/Net Banking)"
4. User clicks "Place Order"
5. Razorpay modal opens with payment options
6. User completes payment
7. Payment verified and order confirmed

### Technical Flow:
1. **Frontend**: Create Razorpay order → `/api/v1/payments/create-order`
2. **Backend**: Generate Razorpay order ID
3. **Frontend**: Open Razorpay checkout modal
4. **User**: Completes payment
5. **Frontend**: Verify payment → `/api/v1/payments/verify`
6. **Backend**: Verify signature and update order
7. **Frontend**: Redirect to order confirmation

## 🧪 Testing

### Test Card Numbers:
- **Successful Payment**: `4111 1111 1111 1111`
- **Failed Payment**: `4000 0000 0000 0002`
- **Any Expiry**: Future date (e.g., 12/25)
- **Any CVV**: 3 digits (e.g., 123)

### Test UPI:
- Use any UPI ID in format: `username@bankname`

## 📱 Payment Methods Supported

- **Credit/Debit Cards** (Visa, Mastercard, Rupay)
- **UPI** (All UPI apps)
- **Net Banking** (Major Indian banks)
- **Wallets** (Paytm, PhonePe, etc.)

## 🔧 Features Implemented

### ✅ Backend:
- Razorpay order creation
- Payment verification with signature validation
- Webhook handling for payment events
- Order status updates
- Comprehensive error handling

### ✅ Frontend:
- Razorpay modal integration
- Payment success/failure pages
- Real-time payment verification
- User-friendly error messages
- Responsive design

### ✅ Security:
- Signature verification
- Webhook signature validation
- Input validation
- Error handling

## 🚨 Important Notes

1. **Environment Variables**: Never commit API keys to Git
2. **HTTPS Required**: Razorpay requires HTTPS in production
3. **Currency**: Currently configured for INR only
4. **Amount**: Must be in paise (multiply by 100)
5. **Webhooks**: Configure for production reliability

## 🎯 Ready to Test

Once you've added the environment variables:

1. Start both backend and frontend servers
2. Add items to cart
3. Go to checkout
4. Select "Razorpay (Card/UPI/Net Banking)"
5. Click "Place Order"
6. Complete payment with test card

**🎉 Razorpay integration is now complete and ready for testing!**
