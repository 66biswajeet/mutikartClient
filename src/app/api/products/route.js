import { NextResponse } from "next/server";

const ADMIN_API_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000";

/**
 * GET /api/products - Fetch products from admin backend
 * This endpoint acts as a proxy to the admin API
 */
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Forward all incoming query params (including slug) to admin API
    const queryParams = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      // Map `limit` -> `paginate` for admin API compatibility
      if (key === "limit") {
        queryParams.set("paginate", value);
        continue;
      }
      if (key === "page") {
        queryParams.set("page", value);
        continue;
      }
      // If client passed a numeric/object id as `slug`, forward as `product_id`
      if (key === "slug") {
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(value);
        if (isObjectId) {
          queryParams.set("product_id", value);
          continue;
        }
      }
      queryParams.set(key, value);
    }

    // Fetch from admin API
    const adminUrl = `${ADMIN_API_URL.replace(/\/$/, "")}/api/product?${queryParams.toString()}`;
    // Debug: log the admin URL being requested so we can confirm forwarding
    console.log("[proxy] forwarding to admin URL:", adminUrl);
    const response = await fetch(adminUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      // Add cache control for better performance
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products from admin API");
    }

    const data = await response.json();

    // If the client requested a specific product via `slug`, return the
    // admin API response as-is (it contains full product details used by
    // the product detail page). For list requests, return the transformed
    // lightweight product objects used by product lists.
    if (searchParams.has("slug")) {
      return NextResponse.json(data);
    }

    // Transform the data to match client-side needs
    const transformedProducts =
      data.data?.map((product) => ({
        id: product._id || product.id,
        image: product.media?.[0]?.url || "/assets/images/placeholder.jpg",
        title: product.product_name,
        description:
          product.product_policies?.about_this_item ||
          product.product_policies?.key_features?.[0] ||
          "Quality product",
        slug: product.slug,
        category: product.category_id?.name || "Uncategorized",
        brand: product.brand_id?.name || null,
        status: product.status,
        masterProductCode: product.master_product_code,
        // Vendor offering details (use first active offering if available)
        ...(product.linked_vendor_offerings?.[0] && {
          price: product.linked_vendor_offerings[0].price,
          originalPrice: product.linked_vendor_offerings[0].original_price,
          stockQuantity: product.linked_vendor_offerings[0].stock_quantity,
          condition: product.linked_vendor_offerings[0].condition,
        }),
        // Badge logic based on product status and newness
        badge: getBadge(product),
        actionType: "buy", // Default action type
      })) || [];

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      pagination: {
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
        perPage: data.per_page,
      },
    });
  } catch (error) {
    console.error("Product API Error:", error);
    // Include admin URL in the error response to aid debugging
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error.message,
        adminUrl: ADMIN_API_URL,
      },
      { status: 500 },
    );
  }
}

/**
 * Determine badge based on product data
 */
function getBadge(product) {
  // Check if product is new (created within last 30 days)
  const createdDate = new Date(product.created_at);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  if (createdDate > thirtyDaysAgo) {
    return { text: "New", type: "new" };
  }

  // Check if there's a sale (original_price > price)
  const firstOffering = product.linked_vendor_offerings?.[0];
  if (firstOffering?.original_price && firstOffering?.price) {
    if (firstOffering.original_price > firstOffering.price) {
      return { text: "Sale", type: "sale" };
    }
  }

  // Check if product is trending (you can customize this logic)
  // For now, return null if no badge applies
  return null;
}
