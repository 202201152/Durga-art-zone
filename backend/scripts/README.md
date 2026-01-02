# Database Seeding Scripts

## Seed Products

Adds sample products to the database based on your jewelry collection.

### Usage

```bash
cd backend
npm run seed:products
```

### What it does:

1. Connects to MongoDB
2. Adds 17 sample products including:
   - Anklets (4 products)
   - Earrings (2 products)
   - Rings (5 products)
   - Necklaces/Chains (6 products)

### Product Details:

- **Categories**: bracelet, earrings, rings, chains
- **Materials**: Gold, Silver
- **Pricing**: $75 - $199
- **Stock**: 6-22 items per product
- **Featured products**: Some marked as featured

### Customizing Products:

1. Edit `scripts/seedProducts.js`
2. Modify the `products` array
3. Update image paths (currently using `/images/...` - replace with actual URLs)
4. Run the script again

### Note on Images:

The script uses placeholder image paths like `/images/anklet-evil-eye-silver.jpg`. 

**To use your actual images:**

1. Upload images to your server/CDN
2. Update the `images` array in each product object with full URLs
3. Or place images in `frontend/public/images/` and use paths like `/images/filename.jpg`

### Example Image URL Update:

```javascript
images: ["https://your-cdn.com/images/anklet-evil-eye-silver.jpg"]
// OR if in public folder:
images: ["/images/anklet-evil-eye-silver.jpg"]
```

---

**Run the script and your products will be available in the shop!**


