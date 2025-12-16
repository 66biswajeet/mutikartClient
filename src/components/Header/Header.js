"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

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

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
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

  return (
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
          <button className={styles.iconButton} aria-label="Wishlist">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.badge}>0</span>
          </button>

          <button className={styles.iconButton} aria-label="Shopping Cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 2L6.5 6M15 2l2.5 4M6 6h12l-1.5 9H7.5L6 6zM8 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM16 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.badge}>0</span>
          </button>

          <button className={styles.profileButton}>
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
        </div>
      </div>
    </header>
  );
}
