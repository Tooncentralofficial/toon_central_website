"use server";
import { jwtVerify, SignJWT } from "jose";
import { jwtKey } from "@/envs";
export async function generateToken(data: any): Promise<string> {
  const token = await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(new TextEncoder().encode(jwtKey));
  return token;
  // .setExpirationTime("1 minute")
  // .setExpirationTime("7 days")
  // .setExpirationTime("1 week from now")
}
