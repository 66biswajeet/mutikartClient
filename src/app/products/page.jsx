// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import styles from "./ProductsPage.module.css";

// const API_BASE = (
//   process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000"
// ).replace(/\/$/, "");

// export default function ProductsPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const categorySlug = searchParams.get("category");

//   const [vendorProducts, setVendorProducts] = useState([]);
//   const [category, setCategory] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalVendorProducts, setTotalVendorProducts] = useState(0);
//   const [sort, setSort] = useState("desc");

//   useEffect(() => {
//     if (!categorySlug) {
//       setError("No category selected");
//       setLoading(false);
//       return;
//     }

//     const fetchProductsAndCategory = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // First, fetch the category to get its display information
//         const categoryResponse = await fetch(
//           `${API_BASE}/api/category?slug=${categorySlug}&type=product`,
//         );

//         if (!categoryResponse.ok) {
//           throw new Error("Failed to fetch category");
//         }

//         const categoryData = await categoryResponse.json();

//         if (
//           !categoryData.success ||
//           !categoryData.data ||
//           categoryData.data.length === 0
//         ) {
//           throw new Error("Category not found");
//         }

//         const categoryInfo = categoryData.data[0];
//         setCategory(categoryInfo);

//         // Fetch vendor products for this category (products from all vendors reselling this category)
//         const productsResponse = await fetch(
//           `${API_BASE}/api/vendor-products?category_slug=${categorySlug}&page=${page}&paginate=12&sortBy=${sort}`,
//         );

//         if (!productsResponse.ok) {
//           throw new Error("Failed to fetch products");
//         }

//         const productsData = await productsResponse.json();

//         if (productsData.success) {
//           setVendorProducts(productsData.data || []);
//           setTotalPages(productsData.last_page || 1);
//           setTotalVendorProducts(productsData.total || 0);
//         } else {
//           setVendorProducts([]);
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(err.message || "Failed to load products");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductsAndCategory();
//   }, [categorySlug, page, sort]);

//   const handleSortChange = (newSort) => {
//     setSort(newSort);
//     setPage(1);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   if (loading) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.loadingSpinner}>
//           <div className={styles.spinner}></div>
//           <p>Loading products...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.errorMessage}>
//           <p>{error}</p>
//           <button
//             onClick={() => router.push("/")}
//             className={styles.backButton}
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <div className={styles.titleSection}>
//           <button className={styles.backLink} onClick={() => router.back()}>
//             ← Back
//           </button>
//           <h1>{category?.display_name || category?.name || "Products"}</h1>
//           {vendorProducts.length > 0 && (
//             <p className={styles.productCount}>
//               {totalVendorProducts} products found from {vendorProducts.length}{" "}
//               vendor offerings
//             </p>
//           )}
//         </div>

//         <div className={styles.filtersSection}>
//           <div className={styles.sortControl}>
//             <label htmlFor="sort">Sort by:</label>
//             <select
//               id="sort"
//               value={sort}
//               onChange={(e) => handleSortChange(e.target.value)}
//               className={styles.select}
//             >
//               <option value="desc">Newest First</option>
//               <option value="asc">Oldest First</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {vendorProducts.length > 0 ? (
//         <>
//           <div className={styles.productsGrid}>
//             {vendorProducts.map((product) => (
//               <Link
//                 key={product._id || product.vendor_product_id}
//                 href={`/product/${product.slug || product._id}`}
//                 className={styles.productCard}
//               >
//                 <div className={styles.imageContainer}>
//                   <img
//                     src={
//                       product.product_thumbnail?.url ||
//                       product.media?.[0]?.url ||
//                       "/placeholder.png"
//                     }
//                     alt={product.product_name}
//                     className={styles.productImage}
//                   />
//                   {product.stock_quantity <= 0 && (
//                     <div className={styles.outOfStockBadge}>Out of Stock</div>
//                   )}
//                 </div>
//                 <div className={styles.productInfo}>
//                   <h3 className={styles.productName}>{product.product_name}</h3>
//                   <p className={styles.vendorName}>
//                     by {product.vendor_name || "Vendor"}
//                   </p>
//                   {product.description && (
//                     <p className={styles.productDescription}>
//                       {product.description.substring(0, 60)}...
//                     </p>
//                   )}
//                   <div className={styles.priceSection}>
//                     <span className={styles.price}>₹{product.price}</span>
//                     {product.stock_quantity > 0 && (
//                       <span className={styles.stock}>
//                         {product.stock_quantity} in stock
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className={styles.pagination}>
//               <button
//                 className={styles.paginationButton}
//                 onClick={() => handlePageChange(page - 1)}
//                 disabled={page === 1}
//               >
//                 Previous
//               </button>
//               <div className={styles.pageInfo}>
//                 Page {page} of {totalPages}
//               </div>
//               <button
//                 className={styles.paginationButton}
//                 onClick={() => handlePageChange(page + 1)}
//                 disabled={page === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className={styles.emptyState}>
//           <p>No products available from vendors in this category.</p>
//           <button
//             onClick={() => router.push("/")}
//             className={styles.backButton}
//           >
//             Back to Home
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


/////// Working 
"use client";

import { useState, useEffect, Suspense } from "react"; // 1. Added Suspense
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./ProductsPage.module.css";

const API_BASE = (
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

// 2. Move your main logic into a sub-component
function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");

  const [vendorProducts, setVendorProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVendorProducts, setTotalVendorProducts] = useState(0);
  const [sort, setSort] = useState("desc");

  useEffect(() => {
    if (!categorySlug) {
      setError("No category selected");
      setLoading(false);
      return;
    }

    const fetchProductsAndCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoryResponse = await fetch(
          `${API_BASE}/api/category?slug=${categorySlug}&type=product`,
        );

        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch category");
        }

        const categoryData = await categoryResponse.json();

        if (
          !categoryData.success ||
          !categoryData.data ||
          categoryData.data.length === 0
        ) {
          throw new Error("Category not found");
        }

        const categoryInfo = categoryData.data[0];
        setCategory(categoryInfo);

        const productsResponse = await fetch(
          `${API_BASE}/api/vendor-products?category_slug=${categorySlug}&page=${page}&paginate=12&sortBy=${sort}`,
        );

        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }

        const productsData = await productsResponse.json();

        if (productsData.success) {
          setVendorProducts(productsData.data || []);
          setTotalPages(productsData.last_page || 1);
          setTotalVendorProducts(productsData.total || 0);
        } else {
          setVendorProducts([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategory();
  }, [categorySlug, page, sort]);

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          <p>{error}</p>
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
        <div className={styles.titleSection}>
          <button className={styles.backLink} onClick={() => router.back()}>
            ← Back
          </button>
          <h1>{category?.display_name || category?.name || "Products"}</h1>
          {vendorProducts.length > 0 && (
            <p className={styles.productCount}>
              {totalVendorProducts} products found from {vendorProducts.length}{" "}
              vendor offerings
            </p>
          )}
        </div>

        <div className={styles.filtersSection}>
          <div className={styles.sortControl}>
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className={styles.select}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {vendorProducts.length > 0 ? (
        <>
          <div className={styles.productsGrid}>
            {vendorProducts.map((product) => (
              <Link
                key={product._id || product.vendor_product_id}
                href={`/product/${product.slug || product._id}`}
                className={styles.productCard}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={
                      product.product_thumbnail?.url ||
                      product.media?.[0]?.url ||
                      "/placeholder.png"
                    }
                    alt={product.product_name}
                    className={styles.productImage}
                  />
                  {product.stock_quantity <= 0 && (
                    <div className={styles.outOfStockBadge}>Out of Stock</div>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.product_name}</h3>
                  <p className={styles.vendorName}>
                    by {product.vendor_name || "Vendor"}
                  </p>
                  {product.description && (
                    <p className={styles.productDescription}>
                      {product.description.substring(0, 60)}...
                    </p>
                  )}
                  <div className={styles.priceSection}>
                    <span className={styles.price}>₹{product.price}</span>
                    {product.stock_quantity > 0 && (
                      <span className={styles.stock}>
                        {product.stock_quantity} in stock
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <div className={styles.pageInfo}>
                Page {page} of {totalPages}
              </div>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={styles.emptyState}>
          <p>No products available from vendors in this category.</p>
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

// 3. The default export is now wrapped in Suspense
export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
