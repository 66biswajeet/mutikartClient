"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import styles from "./wishlist.module.css";
 
import CategoryBar from "@/components/CategoryBar/CategoryBar";

export default function WishlistPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { wishlist, wishlistCount, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recently-added");
  const [viewMode, setViewMode] = useState("grid"); // 'list' or 'grid'

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/";
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    // Use real wishlist data from context
    setFilteredItems(wishlist);
  }, [wishlist]);

  useEffect(() => {
    // Filter and sort
    let items = [...wishlist];

    // Search filter
    if (searchQuery) {
      items = items.filter((item) =>
        item.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "recently-added":
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "price-low-high":
        items.sort((a, b) => parseFloat(a.sale_price || a.price) - parseFloat(b.sale_price || b.price));
        break;
      case "price-high-low":
        items.sort((a, b) => parseFloat(b.sale_price || b.price) - parseFloat(a.sale_price || a.price));
        break;
    }

    setFilteredItems(items);
  }, [searchQuery, sortBy, wishlist]);

  if (authLoading || wishlistLoading) {
    return (
      <>
        <CategoryBar />
        <div style={{ padding: "100px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "18px", color: "#6b7280" }}>Loading...</div>
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleRemoveFromWishlist = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleAddToCart = (item) => {
    // TODO: Add to cart
    console.log("Adding to cart:", item);
  };

  return (
    <>
      <CategoryBar />
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.profileAvatar}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className={styles.profileInfo}>
              <h3>{user?.name || "User"}</h3>
              <p>{user?.email || ""}</p>
            </div>
          </div>

          <nav className={styles.nav}>
            <a href="/profile" className={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M16 17v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              My Profile
            </a>
            <a href="/addresses" className={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M17.5 8.333c0 5-7.5 10-7.5 10s-7.5-5-7.5-10a7.5 7.5 0 1 1 15 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="10"
                  cy="8.333"
                  r="1.667"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Addresses
            </a>
            <a href="/wishlist" className={styles.navItemActive}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M17.367 3.842a4.375 4.375 0 0 0-6.184 0L10 5.025 8.817 3.842a4.375 4.375 0 0 0-6.184 6.183L10 17.392l7.367-7.367a4.375 4.375 0 0 0 0-6.183z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              My wishlist
            </a>
            <a href="/orders" className={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M6.667 1.667v3.333m6.666-3.333v3.333M5.833 8.333h8.334M3.333 18.333h13.334a1.667 1.667 0 0 0 1.666-1.666V5.833a1.667 1.667 0 0 0-1.666-1.666H3.333a1.667 1.667 0 0 0-1.666 1.666v10.834a1.667 1.667 0 0 0 1.666 1.666z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              My Orders
            </a>
            <a href="/payment-methods" className={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect
                  x="1.667"
                  y="4.167"
                  width="16.666"
                  height="11.666"
                  rx="1.667"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M1.667 8.333h16.666"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Payment methods
            </a>
          </nav>

          <button className={styles.logoutBtn}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 17.5h-3.333a1.667 1.667 0 0 1-1.667-1.667V4.167a1.667 1.667 0 0 1 1.667-1.667H7.5M13.333 14.167l4.167-4.167-4.167-4.167M17.5 10h-10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Logout
          </button>
        </aside>

        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>My Wishlist</h1>
            <p className={styles.itemCount}>
              There are {filteredItems.length} product
              {filteredItems.length !== 1 ? "s" : ""} in your Wish List
            </p>
          </div>

          {wishlist.length === 0 ? (
            <div className={styles.emptyState}>
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M104.202 23.053a26.25 26.25 0 0 0-37.102 0L60 30.15l-7.1-7.097a26.25 26.25 0 0 0-37.102 37.097L60 104.352l44.202-44.202a26.25 26.25 0 0 0 0-37.097z"
                  stroke="#CBD5E1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2>Your wishlist is empty</h2>
              <p>
                Start adding products to your wishlist and they will appear here
              </p>
              <a href="/" className={styles.continueBtn}>
                Continue Shopping
              </a>
            </div>
          ) : (
            <>
              <div className={styles.controls}>
                <div className={styles.searchBox}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18.333 18.333l-4.35-4.35"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="What are you looking for today?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className={styles.actions}>
                  <select
                    className={styles.sortSelect}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="recently-added">Recently Added</option>
                    <option value="price-low-high">Price (Low to High)</option>
                    <option value="price-high-low">Price (High to Low)</option>
                  </select>

                  <div className={styles.viewToggle}>
                    <button
                      className={viewMode === "list" ? styles.viewActive : ""}
                      onClick={() => setViewMode("list")}
                      title="List View"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <rect
                          x="2"
                          y="4"
                          width="16"
                          height="3"
                          rx="1"
                          fill="currentColor"
                        />
                        <rect
                          x="2"
                          y="9"
                          width="16"
                          height="3"
                          rx="1"
                          fill="currentColor"
                        />
                        <rect
                          x="2"
                          y="14"
                          width="16"
                          height="3"
                          rx="1"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                    <button
                      className={viewMode === "grid" ? styles.viewActive : ""}
                      onClick={() => setViewMode("grid")}
                      title="Grid View"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="7"
                          height="7"
                          rx="1"
                          fill="currentColor"
                        />
                        <rect
                          x="11"
                          y="2"
                          width="7"
                          height="7"
                          rx="1"
                          fill="currentColor"
                        />
                        <rect
                          x="2"
                          y="11"
                          width="7"
                          height="7"
                          rx="1"
                          fill="currentColor"
                        />
                        <rect
                          x="11"
                          y="11"
                          width="7"
                          height="7"
                          rx="1"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={
                  viewMode === "grid" ? styles.productGrid : styles.productList
                }
              >
                {filteredItems.map((item) => {
                  const price = parseFloat(item.sale_price || item.price || 0);
                  const originalPrice = item.sale_price ? parseFloat(item.price || 0) : null;
                  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
                  
                  return (
                    <div key={item.productId || item.id} className={styles.productCard}>
                      <button
                        className={styles.removeBtn}
                        onClick={() => handleRemoveFromWishlist(item.productId)}
                        title="Remove from wishlist"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M12 4L4 12M4 4l8 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>

                      <div className={styles.productImage}>
                        <img 
                          src={item.product_thumbnail_image?.url || item.product_thumbnail_image || '/carousel/1.jpg'} 
                          alt={item.product_name || 'Product'} 
                        />
                        {discount > 0 && (
                          <span className={styles.recentlyAdded}>
                            {discount}% OFF
                          </span>
                        )}
                      </div>

                      <div className={styles.productInfo}>
                        <h3 className={styles.productName}>{item.product_name || 'Unnamed Product'}</h3>
                        <div className={styles.productRating}>
                          <div className={styles.stars}>
                            {"★".repeat(Math.floor(item.rating_count || 4))}
                            {"☆".repeat(5 - Math.floor(item.rating_count || 4))}
                          </div>
                          <span>{item.rating_count || 4}</span>
                        </div>
                        <div className={styles.productPrice}>
                          <span className={styles.currentPrice}>
                            ₹{price.toFixed(2)}
                          </span>
                          {originalPrice && (
                            <span className={styles.originalPrice}>
                              ₹{originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <button
                          className={styles.addToCartBtn}
                          onClick={() => handleAddToCart(item)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
