import { NextResponse } from "next/server";

const ADMIN_API_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validate inputs
    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and OTP are required",
        },
        { status: 400 }
      );
    }

    // Verify OTP via admin API
    const response = await fetch(`${ADMIN_API_URL}/api/auth/verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, token: otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // After OTP verification, mark user as verified and auto-login
    // For now, return success - in production, you'd update the user's email_verified_at
    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      data: data.data,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
