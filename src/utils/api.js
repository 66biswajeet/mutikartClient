/**
 * Utility functions for API calls
 */

/**
 * Base API URL
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Fetch wrapper with error handling
 */
export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/**
 * Get products with pagination
 */
export async function getProducts(params = {}) {
  const queryParams = new URLSearchParams({
    page: params.page || "1",
    limit: params.limit || "12",
    ...(params.search && { search: params.search }),
    ...(params.category && { category: params.category }),
  });

  return fetchAPI(`/api/products?${queryParams}`);
}

/**
 * Get product by ID or slug
 */
export async function getProduct(idOrSlug) {
  return fetchAPI(`/api/products/${idOrSlug}`);
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit = 8) {
  return fetchAPI(`/api/products?featured=true&limit=${limit}`);
}

/**
 * Get products by category
 */
export async function getProductsByCategory(categorySlug, params = {}) {
  const queryParams = new URLSearchParams({
    page: params.page || "1",
    limit: params.limit || "12",
    category: categorySlug,
  });

  return fetchAPI(`/api/products?${queryParams}`);
}

/**
 * Search products
 */
export async function searchProducts(query, params = {}) {
  const queryParams = new URLSearchParams({
    search: query,
    page: params.page || "1",
    limit: params.limit || "12",
  });

  return fetchAPI(`/api/products?${queryParams}`);
}
