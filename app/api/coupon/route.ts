import { NextRequest, NextResponse } from "next/server";

/**
 * API Route for generating Otaku Connect coupon codes
 *
 * Required Environment Variable:
 * - OTAKU_PASSCODE: Authentication passcode for the Otaku API
 *   Add to .env.local: OTAKU_PASSCODE=tA9vsi/pqM4xU2_
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const passCode = process.env.OTAKU_PASSCODE;
    console.log(passCode);
    

    if (!passCode) {
      return NextResponse.json(
        { error: "PassCode not configured" },
        { status: 500 }
      );
    }

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
    console.log(data);
    return NextResponse.json({ success: true, coupon: data });
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
