import { NextResponse } from "next/server";

const ADMIN_API_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000";

// GET - Get single address
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const response = await fetch(`${ADMIN_API_URL}/api/address/${id}`, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Get address error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch address",
      },
      { status: 500 },
    );
  }
}

// PUT - Update address
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const response = await fetch(`${ADMIN_API_URL}/api/address/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update address",
      },
      { status: 500 },
    );
  }
}

// DELETE - Delete address
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const response = await fetch(`${ADMIN_API_URL}/api/address/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete address",
      },
      { status: 500 },
    );
  }
}
