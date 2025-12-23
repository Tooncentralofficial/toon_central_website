import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { baseUrl } from "@/envs";

/**
 * API Route for generating Otaku Connect coupon codes
 *
 * Required Environment Variable:
 * - OTAKU_PASSCODE: Authentication passcode for the Otaku API
 *   Add to .env.local: OTAKU_PASSCODE=tA9vsi/pqM4xU2_
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Extract authentication token from request headers
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    console.log("token", token);

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const passCode = process.env.OTAKU_PASSCODE;
    if (!passCode) {
      return NextResponse.json(
        { error: "PassCode not configured" },
        { status: 500 }
      );
    }

    // Check for existing coupon in backend
    try {
      const existingCouponResponse = await axios.get(
        `${baseUrl}/api/v1/coupons`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      // If existing coupon found, return it
      if (
        existingCouponResponse.data?.status &&
        existingCouponResponse.data?.data?.coupon
      ) {
        return NextResponse.json({
          success: true,
          coupon: {
            coupon: existingCouponResponse.data.data.coupon,
          },
          existing: true,
        });
      }
    } catch (existingCouponError: any) {
      // If 404 or no coupon exists, continue to generate new one
      // If it's a different error (e.g., 401), we might want to handle it differently
      if (existingCouponError?.response?.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // For 404 or other errors, continue to generate new coupon
      console.log("No existing coupon found, proceeding to generate new one");
    }

    // Generate new coupon from external API
    const response = await fetch(
      "https://otakutv.co/.netlify/functions/generate-tooncentral-coupon",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passCode: passCode,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: errorData.message || "Failed to generate coupon",
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract coupon code from response
    const couponCode =
      data.coupon || data.code || data.data?.coupon || data?.data?.code;

    if (!couponCode) {
      return NextResponse.json(
        { error: "Coupon code not found in response" },
        { status: 500 }
      );
    }

    // Save coupon to backend
    try {
      await axios.post(
        `${baseUrl}/api/v1/coupons`,
        { coupon: couponCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
    } catch (saveError: any) {
      // Log error but don't fail the request - coupon was generated successfully
      console.error("Error saving coupon to backend:", saveError);
      // Still return the coupon even if save fails
    }

    return NextResponse.json({
      success: true,
      coupon: {
        coupon: couponCode,
      },
      existing: false,
    });
  } catch (error: any) {
    console.error("Error generating coupon:", error);
    return NextResponse.json(
      {
        error: error.message || "An error occurred while generating coupon",
      },
      { status: 500 }
    );
  }
}
