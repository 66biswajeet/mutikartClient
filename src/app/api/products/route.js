import { NextResponse } from "next/server";

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;

/**
 * GET /api/products - Fetch products from admin backend
 * This endpoint acts as a proxy to the admin API
 */
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "12";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    // Build query params for admin API
    const queryParams = new URLSearchParams({
      page,
      paginate: limit,
      ...(search && { search }),
      ...(category && { category }),
    });

    // Fetch from admin API
    const response = await fetch(
      `${ADMIN_API_URL}/api/product?${queryParams}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache control for better performance
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products from admin API");
    }

    const data = await response.json();

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
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      },
      { status: 500 }
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
