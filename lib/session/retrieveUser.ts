"use server";
import { cookieName } from "@/envs";
import { cookies } from "next/headers";
import { verifyToken } from "./verifyToken";

export async function retrieveUser() {
  try {
    // Get the local JWT token from cookie (contains minimal user data)
    const token = cookies().get(cookieName)?.value;
    console.log("retrieveUser - token exists:", !!token);

    if (token) {
      // Verify and decode the local JWT to extract minimal user data
      const userVerified = await verifyToken(token).catch((err) => {
        console.log("err verifying user in retrieveUser", err);
        return null;
      });

      if (userVerified) {
        // Extract payload from verified token
        const payload = userVerified?.payload;
        console.log("user verified in retrieveUser, payload:", payload);

        // Return the payload with user, token, and userType for Redux state
        return {
          user: payload?.user,
          token: payload?.token, // backend accessToken
          userType: payload?.userType,
        };
      } else {
        console.log("Token verification failed in retrieveUser");
        return null;
      }
    } else {
      console.log("No token found in retrieveUser");
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
    const userVerified = await verifyToken(token).catch((err) => {
      console.log("err verifyin user", err);
    });
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