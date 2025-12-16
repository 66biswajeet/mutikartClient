# Product Integration Guide

## Overview

The client-side application now fetches real products from the admin backend instead of using mock data. This guide explains how the integration works.

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Client (3001)  │ ──────> │  Client API      │ ──────> │  Admin API      │
│  ProductFeed    │  Fetch  │  /api/products   │  Proxy  │  (3000)         │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the client folder:

```bash
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:3000
```

**Important:** Update this URL to match your admin backend URL (e.g., production URL when deployed).

### 2. Admin Backend Requirements

The admin backend must be running and accessible at the configured URL. The client expects the following endpoint:

**Endpoint:** `GET /api/product`

**Query Parameters:**

- `page` - Page number (default: 1)
- `paginate` - Items per page (default: 10)
- `search` - Search query (optional)

**Expected Response Format:**

```json
{
  "current_page": 1,
  "last_page": 5,
  "total": 50,
  "per_page": 10,
  "data": [
    {
      "_id": "...",
      "product_name": "Product Name",
      "slug": "product-slug",
      "master_product_code": "UPID123",
      "status": "active",
      "category_id": {
        "name": "Category Name"
      },
      "brand_id": {
        "name": "Brand Name"
      },
      "media": [
        {
          "url": "https://...",
          "type": "image"
        }
      ],
      "product_policies": {
        "about_this_item": "Description...",
        "key_features": ["Feature 1", "Feature 2"]
      },
      "linked_vendor_offerings": [
        {
          "price": 199,
          "original_price": 299,
          "stock_quantity": 50,
          "condition": "new"
        }
      ],
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## API Endpoints

### Client-Side API

#### GET `/api/products`

Fetches products from the admin backend with caching and transformation.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `search` - Search query (optional)
- `category` - Category filter (optional)

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "lastPage": 5,
    "total": 50,
    "perPage": 12
  }
}
```

## Component Usage

### ProductFeed Component

The `ProductFeed` component automatically fetches and displays products:

```jsx
import ProductFeed from "@/components/ProductFeed/ProductFeed";

export default function HomePage() {
  return (
    <main>
      <ProductFeed />
    </main>
  );
}
```

### Using the useProducts Hook

For custom implementations:

```jsx
import { useProducts } from "@/hooks/useProducts";

function MyComponent() {
  const { products, loading, error, pagination, loadMore } = useProducts({
    page: 1,
    limit: 12,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.title}</div>
      ))}
      {pagination.currentPage < pagination.lastPage && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
}
```

### Using API Utilities

Direct API calls:

```jsx
import { getProducts, searchProducts } from "@/utils/api";

// Get products
const data = await getProducts({ page: 1, limit: 12 });

// Search products
const results = await searchProducts("laptop", { page: 1 });
```

## Data Transformation

The client API (`/api/products/route.js`) transforms admin data to client format:

**Admin Format → Client Format:**

| Admin Field                                 | Client Field        | Notes                         |
| ------------------------------------------- | ------------------- | ----------------------------- |
| `_id`                                       | `id`                | Product ID                    |
| `product_name`                              | `title`             | Product title                 |
| `product_policies.about_this_item`          | `description`       | Product description           |
| `media[0].url`                              | `image`             | Primary product image         |
| `linked_vendor_offerings[0].price`          | `price`             | Product price                 |
| `linked_vendor_offerings[0].original_price` | `originalPrice`     | Original price for sale badge |
| `master_product_code`                       | `masterProductCode` | Unique product code           |

### Badge Logic

Badges are automatically applied based on:

1. **New Badge:** Products created within last 30 days
2. **Sale Badge:** Products with `original_price > price`
3. **Custom:** Can be extended in `/api/products/route.js`

## Features

### ✅ Implemented

- [x] Real-time product fetching from admin API
- [x] Pagination with "Load More" functionality
- [x] Loading states with spinner
- [x] Error handling with retry button
- [x] Empty state display
- [x] Automatic badge generation (New, Sale)
- [x] Image fallback for missing product images
- [x] Responsive grid layout
- [x] Server-side caching (60-second revalidation)

### 🔄 Future Enhancements

- [ ] Search functionality integration
- [ ] Category filtering
- [ ] Sort options (price, newest, popular)
- [ ] Product detail pages
- [ ] Wishlist functionality
- [ ] Shopping cart integration
- [ ] Product reviews display
- [ ] Related products

## Troubleshooting

### Products Not Loading

1. **Check admin backend is running:**

   ```bash
   # In admin/multikart folder
   npm run dev
   ```

2. **Verify environment variable:**

   ```bash
   # Check .env.local
   echo $NEXT_PUBLIC_ADMIN_API_URL
   ```

3. **Check browser console for errors:**

   - Open DevTools → Console
   - Look for API errors

4. **Test admin API directly:**
   ```bash
   curl http://localhost:3000/api/product?page=1&paginate=10
   ```

### CORS Issues

If you encounter CORS errors, ensure the admin backend allows requests from the client origin:

```js
// In admin next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE" },
        ],
      },
    ];
  },
};
```

### Images Not Displaying

1. Check `media` array exists in product data
2. Verify image URLs are accessible
3. Check Next.js image domains in `next.config.js`:

```js
module.exports = {
  images: {
    domains: ["localhost", "your-cloudinary-domain.com"],
  },
};
```

## Performance Optimization

### Caching Strategy

The client API uses Next.js revalidation:

```js
fetch(url, {
  next: { revalidate: 60 }, // Cache for 60 seconds
});
```

### Image Optimization

Use Next.js Image component for automatic optimization:

```jsx
import Image from "next/image";

<Image
  src={product.image}
  alt={product.title}
  width={400}
  height={300}
  loading="lazy"
/>;
```

## Security Considerations

1. **Environment Variables:** Never commit `.env.local` to git
2. **API Rate Limiting:** Implement rate limiting on admin API
3. **Input Validation:** Sanitize search queries and parameters
4. **HTTPS:** Use HTTPS in production for all API calls

## Testing

### Manual Testing

1. Start admin backend: `cd admin/multikart && npm run dev`
2. Start client: `cd client && npm run dev`
3. Navigate to `http://localhost:3001`
4. Verify products load correctly
5. Test "Load More" button
6. Test with empty product list
7. Test error handling (stop admin backend)

### Automated Testing (Future)

```bash
# Run tests
npm test

# E2E tests
npm run test:e2e
```

## Support

For issues or questions:

1. Check console logs for errors
2. Verify admin API is running and accessible
3. Check network tab in DevTools
4. Review this documentation

---

**Last Updated:** December 14, 2025
