"use server";

import { postRequest } from "@/app/utils/queries/requests";
import { cookieName } from "@/envs";
import { generateToken } from "@/lib/session/generateToken";
import { cookies } from "next/headers";

export async function LoginUser(data: any, url: string) {
  const remember = data?.remembered;
  const res = await postRequest(data, "/onboard/login");
  if (res?.success && remember) {
    let payload = {
      userType: res?.data?.userType,
      user: res?.data?.profile,
      token: res?.data?.accessToken,
    };
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const token = await generateToken(payload);
    cookies().set(cookieName, token, { expires: expires, httpOnly: true });
    // console.log("logintoken", token);
  }
  return res;
}
