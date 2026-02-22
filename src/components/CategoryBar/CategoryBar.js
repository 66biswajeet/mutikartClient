"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./CategoryBar.module.css";

const API_BASE = (
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

export default function CategoryBar({ onMenuClick }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [loadingSubcategories, setLoadingSubcategories] = useState({});
  const categoryBarRef = useRef(null);
  const offsetTop = useRef(0);
  const dropdownTimerRef = useRef(null);
  const categoryRefs = useRef({});
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  // Fetch categories from admin API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/category?type=product&status=1&parent_id=null&limit=20&include_subcategories=true`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        if (data.success && data.data) {
          // Transform categories and their subcategories
          const transformedCategories = data.data.map((cat) => ({
            id: cat._id || cat.id,
            name: cat.display_name || cat.name,
            slug: cat.slug,
            hasSubcategories: cat.subcategories && cat.subcategories.length > 0,
          }));

          // Store subcategories immediately from the response
          const subcategoriesMap = {};
          data.data.forEach((cat) => {
            if (cat.subcategories && cat.subcategories.length > 0) {
              subcategoriesMap[cat._id || cat.id] = cat.subcategories.map(
                (subcat) => ({
                  id: subcat._id || subcat.id,
                  name: subcat.display_name || subcat.name,
                  slug: subcat.slug,
                })
              );
            }
          });

          setCategories(transformedCategories);
          setSubcategories(subcategoriesMap);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Recalculate dropdown position on scroll/resize while dropdown is open
  useEffect(() => {
    if (!activeDropdown) return;

    const updatePos = () => {
      const el = categoryRefs.current[activeDropdown];
      if (el && typeof el.getBoundingClientRect === "function") {
        const rect = el.getBoundingClientRect();
        const top = Math.round(rect.bottom);
        const left = Math.round(rect.left);
        const viewportWidth =
          window.innerWidth || document.documentElement.clientWidth;
        const minWidth = 240;
        const rightOverflow = left + minWidth - viewportWidth;
        const adjustedLeft =
          rightOverflow > 0 ? Math.max(8, left - rightOverflow) : left;
        setDropdownPos({ top, left: adjustedLeft });
      }
    };

    updatePos();
    window.addEventListener("scroll", updatePos, { passive: true });
    window.addEventListener("resize", updatePos);

    return () => {
      window.removeEventListener("scroll", updatePos);
      window.removeEventListener("resize", updatePos);
    };
  }, [activeDropdown]);

  // Handle category hover
  const handleCategoryMouseEnter = (categoryId, hasSubcategories) => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }

    if (hasSubcategories) {
      // compute and set dropdown coordinates based on the category element
      const el = categoryRefs.current[categoryId];
      if (el && typeof el.getBoundingClientRect === "function") {
        const rect = el.getBoundingClientRect();
        // rect.bottom/left are viewport coordinates -> use for fixed positioning
        const top = Math.round(rect.bottom);
        const left = Math.round(rect.left);
        // adjust left if dropdown would overflow viewport (basic)
        const viewportWidth =
          window.innerWidth || document.documentElement.clientWidth;
        const minWidth = 240; // matches CSS min-width
        const rightOverflow = left + minWidth - viewportWidth;
        const adjustedLeft =
          rightOverflow > 0 ? Math.max(8, left - rightOverflow) : left;
        setDropdownPos({ top, left: adjustedLeft });
      }
      setActiveDropdown(categoryId);
    }
  };

  // Handle category mouse leave
  const handleCategoryMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  // Handle dropdown mouse enter (keep it open)
  const handleDropdownMouseEnter = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
  };

  // Handle dropdown mouse leave
  const handleDropdownMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimerRef.current) {
        clearTimeout(dropdownTimerRef.current);
      }
    };
  }, []);

  // Handle sticky behavior
  useEffect(() => {
    const categoryBar = categoryBarRef.current;
    if (!categoryBar) return;

    // Get the initial offset position
    const updateOffset = () => {
      offsetTop.current = categoryBar.offsetTop;
    };
    updateOffset();

    const handleScroll = () => {
      const shouldBeSticky = window.scrollY >= offsetTop.current;
      setIsSticky(shouldBeSticky);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateOffset);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateOffset);
    };
  }, []);

  return (
    <>
      {isSticky && <div style={{ height: "var(--category-bar-height)" }} />}
      <div
        ref={categoryBarRef}
        className={`${styles.categoryBar} ${isSticky ? styles.sticky : ""}`}
      >
        <div className={styles.container}>
          {/* Menu Button */}
          <button
            className={styles.menuButton}
            onClick={onMenuClick}
            aria-label="Open categories menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 10h14M3 5h14M3 15h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>Shop by Category</span>
          </button>

          {/* Category Links */}
          <nav className={styles.categoryNav}>
            <ul className={styles.categoryList}>
              {loading ? (
                <li
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    padding: "8px 16px",
                  }}
                >
                  Loading categories...
                </li>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <li
                    key={category.id}
                    ref={(el) => (categoryRefs.current[category.id] = el)}
                    className={styles.categoryItem}
                    onMouseEnter={() =>
                      handleCategoryMouseEnter(
                        category.id,
                        category.hasSubcategories
                      )
                    }
                    onMouseLeave={handleCategoryMouseLeave}
                  >
                    <a
                      href={`/category/${category.slug}`}
                      className={styles.categoryLink}
                    >
                      {category.name}
                      {category.hasSubcategories && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          className={styles.arrowIcon}
                        >
                          <path
                            d="M3 4.5L6 7.5L9 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </a>

                    {/* Subcategories Dropdown */}
                    {category.hasSubcategories &&
                      activeDropdown === category.id && (
                        <div
                          className={styles.dropdown}
                          onMouseEnter={handleDropdownMouseEnter}
                          onMouseLeave={handleDropdownMouseLeave}
                          style={{
                            position: "fixed",
                            top: dropdownPos.top + "px",
                            left: dropdownPos.left + "px",
                          }}
                        >
                          <div className={styles.dropdownContent}>
                            {loadingSubcategories[category.id] ? (
                              <div className={styles.dropdownLoading}>
                                <div className={styles.miniSpinner}></div>
                                <span>Loading...</span>
                              </div>
                            ) : subcategories[category.id]?.length > 0 ? (
                              <ul className={styles.subcategoryList}>
                                {subcategories[category.id].map((subcat) => (
                                  <li key={subcat.id}>
                                    <a
                                      href={`/category/${subcat.slug}`}
                                      className={styles.subcategoryLink}
                                    >
                                      {subcat.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className={styles.dropdownEmpty}>
                                No subcategories
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                  </li>
                ))
              ) : (
                <li
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    padding: "8px 16px",
                  }}
                >
                  No categories available
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
