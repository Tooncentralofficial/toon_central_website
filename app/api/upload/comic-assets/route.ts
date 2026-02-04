import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { uploadToCloudinary } from "../cloudinaryUpload";
import { apiKey, apiSecret, cloundName } from "@/envs";

cloudinary.config({
  cloud_name: cloundName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data = await req.formData();
    const coverImage = data.get("coverImage") as File | null;
    const backgroundImage = data.get("backgroundImage") as File | null;

    const result: { coverImageUrl?: string; backgroundImageUrl?: string } = {};

    if (coverImage && coverImage instanceof File && coverImage.size > 0) {
      const uploadResult = await uploadToCloudinary(coverImage);
      result.coverImageUrl = uploadResult.secure_url;
    }

    if (
      backgroundImage &&
      backgroundImage instanceof File &&
      backgroundImage.size > 0
    ) {
      const uploadResult = await uploadToCloudinary(backgroundImage);
      result.backgroundImageUrl = uploadResult.secure_url;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error uploading comic assets to Cloudinary:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}
