"use server";
import { cookieName } from "@/envs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function LogoutUser() {
  console.log("logginout");
  const res = cookies().delete(cookieName);
  redirect("/auth/login");
}
//TODO:save previous route