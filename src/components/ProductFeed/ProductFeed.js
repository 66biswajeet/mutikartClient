"use client";

import { useState, useEffect } from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductFeed.module.css";

const API_BASE = (process.env.NEXT_PUBLIC_ADMIN_API_URL || "").replace(
  /\/$/,
  ""
);

export default function ProductFeed() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  // Fetch products from API
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/api/product?page=${page}&paginate=12`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      // Admin API returns data directly with current_page, last_page, total, data
      if (data.data) {
        // Transform products to match ProductCard format
        const transformedProducts = data.data.map((product) => ({
          id: product._id || product.id,
          image:
            product.media && product.media[0]?.url
              ? product.media[0].url
              : "/assets/images/placeholder.jpg",
          title: product.product_name || "Product",
          description:
            product.seo_meta_description ||
            product.internal_notes ||
            "No description available",
          price:
            product.linked_vendor_offerings &&
            product.linked_vendor_offerings[0]?.price,
          originalPrice:
            product.linked_vendor_offerings &&
            product.linked_vendor_offerings[0]?.compare_price,
          badge:
            product.status === "active"
              ? null
              : { type: "info", text: product.status },
          actionType: "buy",
        }));

        // Append new products to existing ones when loading more
        if (page === 1) {
          setProducts(transformedProducts);
        } else {
          setProducts((prev) => [...prev, ...transformedProducts]);
        }
        setPagination({
          currentPage: data.current_page || 1,
          lastPage: data.last_page || 1,
          total: data.total || 0,
        });
      } else {
        throw new Error("Failed to load products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load initial products
  useEffect(() => {
    fetchProducts(1);
  }, []);

  // Load more products
  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.lastPage) {
      fetchProducts(pagination.currentPage + 1);
    }
  };

  // Show loading state on initial load
  if (loading && products.length === 0) {
    return (
      <section className={styles.feed}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>Discover Products</h2>
            <p>Find the perfect items curated just for you</p>
          </div>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading amazing products...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error && products.length === 0) {
    return (
      <section className={styles.feed}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>Discover Products</h2>
            <p>Find the perfect items curated just for you</p>
          </div>
          <div className={styles.error}>
            <p>⚠️ {error}</p>
            <button
              onClick={() => fetchProducts(1)}
              className={styles.retryBtn}
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (products.length === 0) {
    return (
      <section className={styles.feed}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>Discover Products</h2>
            <p>Find the perfect items curated just for you</p>
          </div>
          <div className={styles.empty}>
            <p>No products available at the moment.</p>
            <p>Check back soon for amazing deals!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.feed}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Discover Products</h2>
          <p>Find the perfect items curated just for you</p>
        </div>

        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        {pagination.currentPage < pagination.lastPage && (
          <div className={styles.loadMore}>
            <button
              className={styles.loadMoreBtn}
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className={styles.smallSpinner}></div>
                  Loading...
                </>
              ) : (
                <>
                  Load More Products
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 4v12M4 10h12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </>
              )}
            </button>
            <p className={styles.paginationInfo}>
              Showing {products.length} of {pagination.total} products
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
