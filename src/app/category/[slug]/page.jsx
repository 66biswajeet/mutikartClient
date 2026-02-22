"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./CategoryPage.module.css";

const API_BASE = (
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCategoryAndSubcategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the category with its subcategories
        const response = await fetch(
          `${API_BASE}/api/category?slug=${slug}&type=product&include_subcategories=true`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch category");
        }

        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
          const categoryData = data.data[0];
          setCategory(categoryData);

          // Extract subcategories from the response
          const subs = categoryData.subcategories || [];
          setSubcategories(subs);
        } else {
          setError("Category not found");
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(err.message || "Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndSubcategories();
  }, [slug]);

  const handleSubcategoryClick = (subcategorySlug) => {
    // Navigate to products page with the subcategory
    router.push(`/products?category=${subcategorySlug}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Loading category...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          <p>{error || "Category not found"}</p>
          <button
            onClick={() => router.push("/")}
            className={styles.backButton}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{category.display_name || category.name}</h1>
        {category.description && (
          <p className={styles.description}>{category.description}</p>
        )}
      </div>

      {subcategories && subcategories.length > 0 ? (
        <div className={styles.subcategoriesGrid}>
          <h2 className={styles.subcategoriesTitle}>Browse by Subcategory</h2>
          <div className={styles.cardGrid}>
            {subcategories.map((subcategory) => (
              <div
                key={subcategory._id || subcategory.id}
                className={styles.card}
                onClick={() => handleSubcategoryClick(subcategory.slug)}
              >
                <div className={styles.cardContent}>
                  <h3>{subcategory.display_name || subcategory.name}</h3>
                  {subcategory.description && (
                    <p className={styles.cardDescription}>
                      {subcategory.description.substring(0, 100)}
                      {subcategory.description.length > 100 ? "..." : ""}
                    </p>
                  )}
                  {subcategory.product_count !== undefined && (
                    <span className={styles.productCount}>
                      {subcategory.product_count} products
                    </span>
                  )}
                  <div className={styles.viewMore}>View Products →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No subcategories available</p>
          <button
            onClick={() => router.push("/")}
            className={styles.backButton}
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
