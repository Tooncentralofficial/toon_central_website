import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { uploadToCloudinary } from "../cloudinaryUpload";
import { apiKey, apiSecret, cloundName } from "@/envs";
cloudinary.config({
  cloud_name: cloundName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ message: "hello world" });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data = await req.formData();
    const short = data.get("short") as File;

    const result = await uploadToCloudinary(short, "nextjs-server-actions-upload", "video");
    

    return NextResponse.json({ message: result.secure_url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { error: error, apikey: process.env.CLOUDINARY_API_KEY },
      { status: 500 }
    );
  }
}
