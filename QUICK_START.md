# Quick Start Guide - Product Integration

## Prerequisites

- Node.js 18+ installed
- Admin backend running
- Products added in admin panel

## 5-Minute Setup

### Step 1: Configure Environment (30 seconds)

```bash
cd client
echo "NEXT_PUBLIC_ADMIN_API_URL=http://localhost:3000" > .env.local
```

### Step 2: Install Dependencies (2 minutes)

```bash
npm install
```

### Step 3: Start Admin Backend (30 seconds)

```bash
# In a new terminal
cd ../admin/multikart
npm run dev
```

**Admin should start on:** http://localhost:3000

### Step 4: Add Products (1 minute)

1. Go to http://localhost:3000/product
2. Click "Add Product"
3. Fill in product details:
   - Product Name (required)
   - Category (required)
   - Upload at least one image
   - Set status to "active"
4. Save product

### Step 5: Start Client (30 seconds)

```bash
# Back in client terminal
npm run dev
```

**Client starts on:** http://localhost:3001

### Step 6: View Products (10 seconds)

1. Open http://localhost:3001
2. Scroll to "Discover Products" section
3. Your admin products should appear! 🎉

## Verification Checklist

- [ ] Admin backend running on port 3000
- [ ] At least 1 product added with status "active"
- [ ] Product has an image uploaded
- [ ] Client running on port 3001
- [ ] `.env.local` file created with correct URL
- [ ] Products visible in "Discover Products" section

## Troubleshooting

### Products Not Showing?

**Check #1:** Admin Backend Running?

```bash
curl http://localhost:3000/api/product
# Should return JSON with products
```

**Check #2:** Products Exist?

- Go to http://localhost:3000/product
- Should see your products listed
- Check status is "active"

**Check #3:** Environment Variable?

```bash
cat .env.local
# Should show: NEXT_PUBLIC_ADMIN_API_URL=http://localhost:3000
```

**Check #4:** Browser Console

- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### Still Not Working?

1. **Restart both servers**

   ```bash
   # Kill both terminals (Ctrl+C)
   # Start admin first, then client
   ```

2. **Clear Next.js cache**

   ```bash
   cd client
   rm -rf .next
   npm run dev
   ```

3. **Check for port conflicts**
   ```bash
   # Admin must be on 3000, client on 3001
   # If ports are taken, change them in package.json
   ```

## What You Should See

### Admin Panel (localhost:3000)

- Product list with your products
- Each product showing image, name, price
- Status indicators (active/inactive)

### Client Site (localhost:3001)

- Modern homepage with hero section
- "Discover Products" section showing your products
- Product cards with:
  - Product image
  - Product name
  - Description
  - Price
  - "Buy Now" button
  - Badges (New/Sale if applicable)

## Next Steps

Now that integration is working:

1. **Add More Products**

   - Go to admin panel
   - Add 10-15 products for better display
   - Use different categories

2. **Test Pagination**

   - Add 12+ products
   - Click "Load More" button
   - Should load next page

3. **Customize Badge Logic**

   - Edit `/api/products/route.js`
   - Modify `getBadge()` function
   - Add custom badge types

4. **Add Features**
   - Product search
   - Category filtering
   - Product detail pages
   - Wishlist
   - Shopping cart

## Common Issues

### Issue: "Failed to fetch products"

**Solution:** Admin backend not running or wrong URL

```bash
# Verify admin is running
curl http://localhost:3000/api/product

# Check .env.local has correct URL
cat .env.local
```

### Issue: Images not displaying

**Solution:** Check image URLs in admin

- Images should be uploaded via admin panel
- Check `media` array exists in product data
- Verify image URLs are accessible

### Issue: Products showing but no "Load More"

**Solution:** Not enough products

- Need 12+ products for pagination
- Add more products in admin

### Issue: CORS errors in console

**Solution:** Add CORS headers to admin

```js
// In admin/multikart/next.config.js
async headers() {
  return [{
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' },
    ],
  }]
}
```

## Support Files

- **Full Documentation:** [PRODUCT_INTEGRATION.md](PRODUCT_INTEGRATION.md)
- **Integration Summary:** [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md)
- **Main README:** [README.md](README.md)

## Success Indicators

✅ Admin backend running without errors  
✅ Products visible in admin panel  
✅ Client site loads without errors  
✅ Products display in "Discover Products"  
✅ Images showing correctly  
✅ "Load More" works (with 12+ products)  
✅ Loading states work properly

---

**Estimated Setup Time:** 5 minutes  
**Difficulty Level:** Beginner-friendly  
**Last Updated:** December 14, 2025
