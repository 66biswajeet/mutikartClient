"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";

export default function RelatedProducts({ currentProductId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);

        // Use a relative URL so the request goes to the same Next.js server
        // regardless of environment — avoids cross-origin issues in the browser.
        const response = await fetch(
          `/api/vendor-products?paginate=5&sortBy=desc`,
          { credentials: "include" },
        );

        if (!mounted) return;

        if (response.ok) {
          const data = await response.json();
          if (mounted && data.success && data.data) {
            // Deduplicate by master_product_id and filter out current product
            const seen = new Set();
            const filtered = [];
            for (const p of data.data) {
              const key = String(p.master_product_id || p._id);
              if (
                key !== String(currentProductId) &&
                String(p._id) !== String(currentProductId) &&
                !seen.has(key)
              ) {
                seen.add(key);
                filtered.push(p);
              }
              if (filtered.length >= 4) break;
            }
            setProducts(filtered);
          }
        }
      } catch (error) {
        if (mounted) {
          console.error("Error fetching related products:", error);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRelatedProducts();

    return () => {
      mounted = false;
    };
  }, [currentProductId]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
            >
              <div className="aspect-square bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
