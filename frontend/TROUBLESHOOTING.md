# Troubleshooting Guide

## Products Not Showing

### Issue: No products appear on the shop page

**Possible Causes:**

1. **No products in database**
   - Backend API is working but database is empty
   - Solution: Create products via admin panel or directly in MongoDB

2. **Backend server not running**
   - Frontend can't connect to API
   - Solution: Start backend server: `cd backend && npm run dev`

3. **API URL mismatch**
   - Frontend trying to connect to wrong URL
   - Solution: Check `frontend/.env.local` has correct `NEXT_PUBLIC_API_URL`

4. **CORS error**
   - Browser blocking API requests
   - Solution: Check backend CORS settings allow frontend URL

**How to Debug:**

1. Open browser console (F12)
2. Check Network tab for API calls to `/api/v1/products`
3. Look for errors:
   - `Failed to fetch` → Backend not running or CORS issue
   - `404` → API route not found
   - `500` → Backend error (check backend console)
   - `401` → Authentication issue (shouldn't block public products)

4. Check backend console for errors

**Quick Test:**

```bash
# Test backend API directly
curl http://localhost:5000/api/v1/products
```

Should return JSON with products array.

---

## Cart Page Issues

### Issue: Cart page shows errors or doesn't load

**Common Issues:**

1. **Cart context not available**
   - Solution: Make sure CartProvider is in Providers component ✅ (Already done)

2. **localStorage errors**
   - Solution: Cart uses localStorage - should work in browsers

3. **Cart items not persisting**
   - Solution: Check browser allows localStorage (not in incognito/private mode)

**How to Debug:**

1. Open browser console
2. Check for JavaScript errors
3. Check localStorage: `localStorage.getItem('cart')` in console
4. Verify CartProvider is wrapping the app

---

## API Connection Issues

### Backend not responding

1. **Check backend is running:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Check port 5000 is free:**
   ```bash
   netstat -ano | findstr :5000
   ```

3. **Check environment variables:**
   - Backend: `.env` file exists
   - Frontend: `.env.local` file exists with `NEXT_PUBLIC_API_URL`

4. **Test health endpoint:**
   - Visit: `http://localhost:5000/health`
   - Should return: `{"status":"OK",...}`

---

## Product Creation

To add products to database, you need to:

1. **Via Admin Panel** (when built)
2. **Via MongoDB directly**
3. **Via API** (using Postman with admin token)

Example product structure:
```json
{
  "name": "Silver Evil Eye Anklet",
  "description": "Delicate silver anklet with evil eye charm",
  "category": "bracelet",
  "material": "Silver",
  "price": 89,
  "images": ["/images/anklet1.jpg"],
  "stock": 10,
  "isActive": true
}
```

---

## Common Fixes

1. **Restart both servers:**
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend (new terminal)
   cd frontend && npm run dev
   ```

2. **Clear browser cache and localStorage:**
   - Open DevTools → Application → Clear Storage

3. **Check console errors:**
   - Frontend: Browser console (F12)
   - Backend: Terminal running `npm run dev`

---

**If issues persist, share:**
- Browser console errors
- Backend console output
- Network tab showing API calls



