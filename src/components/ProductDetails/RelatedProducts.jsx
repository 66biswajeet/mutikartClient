"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";

export default function RelatedProducts({ currentProductId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const API_URL =
          process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000";

        const response = await fetch(
          `${API_URL}/api/product?limit=4&status=1`,
          {
            credentials: "include",
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Filter out current product
            const filtered = data.data.filter(
              (p) => p._id !== currentProductId,
            );
            setProducts(filtered.slice(0, 4));
          }
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
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
