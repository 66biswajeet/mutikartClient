import { NextResponse } from "next/server";

const ADMIN_API_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000";

// GET - Fetch all addresses
export async function GET(request) {
  try {
    const response = await fetch(`${ADMIN_API_URL}/api/address`, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Get addresses error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch addresses",
      },
      { status: 500 },
    );
  }
}

// POST - Create new address
export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(`${ADMIN_API_URL}/api/address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create address",
      },
      { status: 500 },
    );
  }
}
