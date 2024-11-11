import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import {Readable} from "stream"
import { buffer } from "stream/consumers";

export async function uploadToCloudinary(
  file: File,
  preset: string = "nextjs-server-actions-upload"
): Promise<any> {
  // Convert the file to a Buffer for upload
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          tags: ["nextjs-server-actions-comics"],
          
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(buffer); // Send the buffer to Cloudinary
  });
}