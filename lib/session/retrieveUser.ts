"use server";
import { cookieName } from "@/envs";
import { cookies } from "next/headers";
import { verifyToken } from "./verifyToken";

export async function retrieveUser() {
  const token = cookies().get(cookieName)?.value;
  if (token) {
    const userVerified = await verifyToken(token).catch((err) => {
      console.log("err verifyin user", err);
    });
    if (userVerified) {
      console.log("user verif", userVerified?.payload);
      return userVerified?.payload;
    }
    return null;
  }
  return null;
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
