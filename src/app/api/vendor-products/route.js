import { NextResponse } from "next/server";

const ADMIN_API_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000";

/**
 * GET /api/vendor-products - Proxy endpoint for vendor products from admin backend
 * Handles combined vendor slugs and routes to admin vendor-products API
 */
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Forward all query params to admin API
    const queryParams = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      queryParams.set(key, value);
    }

    // Fetch from admin API
    const adminUrl = `${ADMIN_API_URL.replace(/\/$/, "")}/api/vendor-products?${queryParams.toString()}`;
    console.log("[vendor-proxy] forwarding to admin URL:", adminUrl);

    const response = await fetch(adminUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error("Failed to fetch vendor products from admin API");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[vendor-proxy] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
