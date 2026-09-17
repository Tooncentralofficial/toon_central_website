"use server";
import { cookieName } from "@/envs";
import { cookies } from "next/headers";
import { verifyToken } from "./verifyToken";

export async function retrieveUser() {
  try {
    // Get the local JWT token from cookie (contains minimal user data)
    const token = cookies().get(cookieName)?.value;

    if (token) {
      // Verify and decode the local JWT to extract minimal user data
      const userVerified = await verifyToken(token).catch(() => null);

      if (userVerified) {
        const payload = userVerified?.payload;

        return {
          user: payload?.user,
          token: payload?.token, // backend accessToken
          userType: payload?.userType,
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error in retrieveUser:", error);
    return null;
  }
}

export async function retrieveCredits() {
  const token = cookies().get(cookieName)?.value;
  if (token) {
    const userVerified = await verifyToken(token).catch(() => null);
    if (userVerified) {
      return userVerified?.payload;
    }
  }
  return null;
}


export async function getToken() {
  const token = cookies().get(cookieName)?.value;
  return token;
}