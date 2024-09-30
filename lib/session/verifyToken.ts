"use server";
import { jwtKey } from "@/envs";
import { jwtVerify } from "jose";

export const verifyToken = async (token: string | any) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(jwtKey),
      {
        algorithms: ["HS256"],
      }
    );
    return verified;
  } catch (error) {
    throw new Error("Token expired. Login !");
  }
};

// export const getJWTSecret = () => {
//   if (!jwtKey || jwtKey?.length === 0) {
//     throw new Error("Secret not found");
//   }
//   return jwtKey;
// };
