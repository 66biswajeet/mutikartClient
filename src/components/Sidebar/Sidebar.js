"use client";

import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";

const API_BASE = (
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3002"
).replace(/\/$/, "");

export default function Sidebar({ isOpen, onClose }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/category?type=product&status=1&parent_id=null&limit=50&include_subcategories=true`
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        if (data && data.success && Array.isArray(data.data)) {
          setCategories(
            data.data.map((cat) => ({
              id: cat._id || cat.id,
              name: cat.display_name || cat.name,
              slug: cat.slug,
              subcategories: Array.isArray(cat.subcategories)
                ? cat.subcategories.map((s) => ({
                    id: s._id || s.id,
                    name: s.display_name || s.name,
                    slug: s.slug,
                  }))
                : [],
            }))
          );
        }
      } catch (err) {
        console.error("Sidebar: error fetching categories", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    const handleBodyScroll = () => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    document.addEventListener("keydown", handleEscape);
    handleBodyScroll();

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.visible : ""}`}
        onClick={handleOverlayClick}
        aria-hidden={!isOpen}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.headerContent}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 17v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <h3>Hello, Guest</h3>
              <button className={styles.signInLink}>Sign In / Register</button>
            </div>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <button className={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 18l-8-8 8-8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Back to Main Menu</span>
        </button>

        <nav className={styles.navigation}>
          {loading ? (
            <div style={{ padding: 16, color: "var(--text-secondary)" }}>
              Loading categories...
            </div>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onClose={onClose}
              />
            ))
          ) : (
            <div style={{ padding: 16, color: "var(--text-secondary)" }}>
              No categories available
            </div>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <h4>Help & Settings</h4>
          <ul className={styles.footerLinks}>
            <li>
              <a href="/account">My Account</a>
            </li>
            <li>
              <a href="/customer-service">Customer Service</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

function CategoryItem({ category, onClose }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.categoryItem}>
      <button
        className={styles.categoryButton}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className={styles.categoryIcon} aria-hidden>
          {category.name ? category.name.charAt(0).toUpperCase() : "#"}
        </span>
        <span className={styles.categoryName}>{category.name}</span>
        <svg
          className={`${styles.expandIcon} ${
            isExpanded ? styles.expanded : ""
          }`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M6 8l4 4 4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isExpanded && (
        <ul className={styles.subcategoryList}>
          {category.subcategories && category.subcategories.length > 0 ? (
            category.subcategories.map((s) => (
              <li key={s.id}>
                <a
                  href={`/category/${
                    s.slug || (s.name || "").toLowerCase().replace(/\s+/g, "-")
                  }`}
                  onClick={onClose}
                >
                  {s.name}
                </a>
              </li>
            ))
          ) : (
            <li>
              <a href={`/category/${category.slug}`} onClick={onClose}>
                View products
              </a>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
