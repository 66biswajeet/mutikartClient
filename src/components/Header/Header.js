"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";
import AuthModal from "@/components/Auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { wishlistCount } = useWishlist();
  const { cartCount, openCart } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Clear any pending timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Show header on scroll up, hide on scroll down
      if (currentScrollY < lastScrollY.current) {
        // Scrolling up - show immediately
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down - hide with slight delay
        scrollTimeout.current = setTimeout(() => {
          setIsVisible(false);
        }, 50);
      }

      // Always show at top
      if (currentScrollY < 10) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
    // TODO: Implement search functionality
  };

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = async () => {
    await logout();
    setShowProfileDropdown(false);
    window.location.href = "/";
  };

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView="login"
      />
      <header
        className={`${styles.header} ${
          isVisible ? styles.visible : styles.hidden
        }`}
      >
        <div className={styles.headerContainer}>
          {/* Logo */}
          <div className={styles.logo}>
            <a href="/">
              <span className={styles.logoText}>LOGO</span>
            </a>
          </div>

          {/* Search Bar */}
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="What are you looking for today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button
                type="submit"
                className={styles.searchButton}
                aria-label="Search"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className={styles.rightIcons}>
            <a
              href="/wishlist"
              className={styles.iconButton}
              aria-label="Wishlist"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {wishlistCount > 0 && (
                <span className={styles.badge}>{wishlistCount}</span>
              )}
            </a>

            <button
              className={styles.iconButton}
              aria-label="Shopping Cart"
              onClick={openCart}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 2L6.5 6M15 2l2.5 4M6 6h12l-1.5 9H7.5L6 6zM8 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM16 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {cartCount > 0 && (
                <span className={styles.badge}>{cartCount}</span>
              )}
            </button>

            {isAuthenticated ? (
              <div className={styles.userMenu} ref={dropdownRef}>
                <button
                  className={styles.profileButton}
                  onClick={handleProfileClick}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M16 17v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Hello, {user?.name?.split(" ")[0] || "User"}</span>
                </button>

                {showProfileDropdown && (
                  <div className={styles.profileDropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.userAvatar}>
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className={styles.userInfo}>
                        <div className={styles.userName}>
                          {user?.name || "User"}
                        </div>
                        <div className={styles.userEmail}>
                          {user?.email || ""}
                        </div>
                      </div>
                    </div>
                    <div className={styles.dropdownDivider}></div>
                    <ul className={styles.dropdownMenu}>
                      <li>
                        <a
                          href="/profile"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <path
                              d="M15 15.75v-1.5a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v1.5M9 8.25a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          My Profile
                        </a>
                      </li>
                      <li>
                        <a
                          href="/addresses"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <path
                              d="M15.75 7.5c0 4.5-6.75 9-6.75 9s-6.75-4.5-6.75-9a6.75 6.75 0 1 1 13.5 0z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle
                              cx="9"
                              cy="7.5"
                              r="1.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                          </svg>
                          Addresses
                        </a>
                      </li>
                      <li>
                        <a
                          href="/wishlist"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <path
                              d="M15.63 3.458a3.938 3.938 0 0 0-5.565 0L9 4.523l-1.065-1.065a3.938 3.938 0 0 0-5.565 5.565l1.065 1.065L9 15.653l5.565-5.565 1.065-1.065a3.938 3.938 0 0 0 0-5.565z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          My wishlist
                        </a>
                      </li>
                      <li>
                        <a
                          href="/orders"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <path
                              d="M6 1.5v3m6-3v3M5.25 7.5h7.5M3 16.5h12a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3a1.5 1.5 0 0 0-1.5 1.5V15A1.5 1.5 0 0 0 3 16.5z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          My Orders
                        </a>
                      </li>
                      <li>
                        <a
                          href="/payment-methods"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <rect
                              x="1.5"
                              y="3.75"
                              width="15"
                              height="10.5"
                              rx="1.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M1.5 7.5h15"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                          </svg>
                          Payment methods
                        </a>
                      </li>
                    </ul>
                    <div className={styles.dropdownDivider}></div>
                    <button
                      className={styles.dropdownLogout}
                      onClick={handleLogout}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          d="M6.75 15.75H3.75a1.5 1.5 0 0 1-1.5-1.5v-10.5a1.5 1.5 0 0 1 1.5-1.5h3M12 12.75l3.75-3.75L12 5.25M15.75 9h-9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className={styles.profileButton}
                onClick={handleAuthClick}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M16 17v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Hello, Guest</span>
                <span className={styles.signIn}>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
