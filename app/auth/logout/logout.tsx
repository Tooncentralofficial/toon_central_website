"use server";
import { cookieName } from "@/envs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function LogoutUserBase() {
  const res = cookies().delete(cookieName);
  redirect(`/auth/login`);
}

export async function LogoutUser(previousUrl:string) {
  const res = cookies().delete(cookieName);
  const encodedPreviousUrl = encodeURIComponent(previousUrl);
  redirect(`/auth/login?previous=${encodedPreviousUrl}`);
}
