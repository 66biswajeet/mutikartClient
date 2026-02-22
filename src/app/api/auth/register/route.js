import { NextResponse } from "next/server";

const ADMIN_API_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, country_code, phone } = body;

    // Validate inputs
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, and password are required",
        },
        { status: 400 }
      );
    }

    // Prepare user data with defaults for vendor registration
    const userData = {
      name,
      email: email.toLowerCase().trim(),
      password,
      country_code: country_code || "+1",
      phone: phone || "0000000000",
      // Default values to satisfy vendor registration requirements
      address: "N/A",
      city: "N/A",
      state: "N/A",
      country: "N/A",
      zip: "00000",
      store_name: name + "'s Store",
      store_description: "My online store",
    };

    // Register user via admin API
    const response = await fetch(`${ADMIN_API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle duplicate email
      if (response.status === 400 && data.message?.includes("already exists")) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already registered",
          },
          { status: 409 }
        );
      }
      return NextResponse.json(data, { status: response.status });
    }

    // After successful registration, return user data
    return NextResponse.json({
      success: true,
      message: "Registration successful. You can now login.",
      data: {
        user: data.data,
        email: userData.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
