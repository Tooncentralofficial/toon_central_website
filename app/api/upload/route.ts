"use server";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import {  uploadToCloudinary } from "./cloudinaryUpload";
import { arrayBuffer } from "stream/consumers";
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
    const comicImages: any = [];
    Array.from(data.entries()).forEach(([key, value]) => {
      if (key.startsWith("comicImage") && typeof value !== "string") {
        comicImages.push(value);
      }
    });
 
    const resultArray = await Promise.all(
      comicImages.map(async (comicImage: File) => {
        const result = await uploadToCloudinary(comicImage);
        return result.secure_url;
      })
    );


    return NextResponse.json({ message: resultArray });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { error: error, apikey: process.env.CLOUDINARY_API_KEY },
      { status: 500 }
    );
  }
  
}

