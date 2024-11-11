"use server";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import {  uploadToCloudinary } from "./cloudinaryUpload";
import { arrayBuffer } from "stream/consumers";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  console.log("hello world");
  return NextResponse.json({ message: "hello world" });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data = await req.formData();
    const comicImages: any = [];
    Array.from(data.entries()).forEach(([key, value]) => {
      if (key.startsWith("comicImage")) {
        comicImages.push(value);
      }
    });
    // const resultArray = await Promise.all(
    //   comicImages.map(async (comicImage: File) => {
    //    const arrayBuffer = await comicImage.arrayBuffer()
    //    const buffer = new Uint32Array(arrayBuffer)
    //     const result = await cloudinaryUpload(buffer, comicImage.name);
    //     return result;
    //   })
    // );
    const resultArray = await Promise.all(
      comicImages.map(async (comicImage: File) => {
        const result = await uploadToCloudinary(comicImage);
        return result.secure_url;
      })
    );
    console.log(resultArray);

    return NextResponse.json({ message: resultArray });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { error: error, apikey: process.env.CLOUDINARY_API_KEY },
      { status: 500 }
    );
  }
  
}
