import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for fetching products with pagination
 */
export function useProducts(initialParams = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 12,
  });

  const fetchProducts = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);

        const API_BASE = (
          process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000"
        ).replace(/\/$/, "");

        const queryParams = new URLSearchParams({
          page: params.page || initialParams.page || "1",
          paginate: params.limit || initialParams.limit || "12",
          ...(params.search && { search: params.search }),
          ...(params.category && { category: params.category }),
        });

        const response = await fetch(`${API_BASE}/api/product?${queryParams}`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        // Admin API returns: { current_page, last_page, total, per_page, data }
        if (data.data) {
          // Transform products to match expected format
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
          }));

          // If loading more (page > 1), append to existing products
          if (params.append && params.page > 1) {
            setProducts((prev) => [...prev, ...transformedProducts]);
          } else {
            setProducts(transformedProducts);
          }
          setPagination({
            currentPage: data.current_page || 1,
            lastPage: data.last_page || 1,
            total: data.total || 0,
            perPage: data.per_page || 12,
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
    },
    [initialParams]
  );

  const loadMore = useCallback(() => {
    if (pagination.currentPage < pagination.lastPage && !loading) {
      fetchProducts({
        ...initialParams,
        page: pagination.currentPage + 1,
        append: true,
      });
    }
  }, [pagination, loading, fetchProducts, initialParams]);

  const refresh = useCallback(() => {
    fetchProducts({ ...initialParams, page: 1 });
  }, [fetchProducts, initialParams]);

  useEffect(() => {
    fetchProducts(initialParams);
  }, []); // Only run on mount

  return {
    products,
    loading,
    error,
    pagination,
    loadMore,
    refresh,
    fetchProducts,
  };
}

/**
 * Custom hook for fetching a single product
 */
export function useProduct(idOrSlug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idOrSlug) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/products/${idOrSlug}`);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        if (data.success) {
          setProduct(data.data);
        } else {
          throw new Error(data.message || "Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [idOrSlug]);

  return { product, loading, error };
}
