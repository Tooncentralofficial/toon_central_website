import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import {Readable} from "stream"
import { buffer } from "stream/consumers";
// export const fileToBuffer = (file: File): Promise<Buffer> => {
//   return new Promise((resolve, reject) => {
//     const bufferArray: Uint8Array[] = [];
//     const reader = new FileReaderSync(); // Use FileReaderSync instead for Node.js

//     try {
//       const result = reader.readAsArrayBuffer(file); // synchronous read
//       resolve(Buffer.from(result)); // Convert ArrayBuffer to Buffer
//     } catch (error) {
//       reject(error);
//     }
//   });
// };
// export const cloudinaryUpload = async (
//   imageBuffer: any,
//   name: string
// ): Promise<any> => {
//   try {
//     const uploadResponse = await cloudinary.uploader.upload(imageBuffer, {
//       resource_type: "auto", // Automatically detect the file type (e.g., image, video, etc.)
//       upload_preset: `${name}comic`,
//     });
//     console.log(uploadResponse);
//     return uploadResponse;
//   } catch (error) {
//     console.error("Cloudinary upload failed", error);
//   }
// };

// export const cloudinaryUpload = async (image:any,name:string):Promise<any> => {
//   try {
//     const uploadResponse =  await cloudinary.uploader.upload(image, {
//       upload_preset: `${name}comic`,
//     });
//     console.log(uploadResponse)
//     return uploadResponse
//   } catch (error) {
//     console.log(error)
//   }
// };
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