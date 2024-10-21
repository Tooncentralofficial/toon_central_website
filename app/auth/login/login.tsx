"use server";

import { postRequest } from "@/app/utils/queries/requests";
import { cookieName } from "@/envs";
import { generateToken } from "@/lib/session/generateToken";
import { cookies } from "next/headers";

const HRS24 = new Date(Date.now() + 24 * 60 * 60 * 1000);
const setExpiry = (remember: boolean) => {
  if (remember) {
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 2);
    return expires;
  }
  return HRS24;
};

export async function LoginUser(data: any, url: string) {
  const remember = data?.remembered;
  const res = await postRequest(data, "/onboard/login");
  if (res?.success) {
    let payload = {
      userType: res?.data?.userType,
      user: res?.data?.profile,
      token: res?.data?.accessToken,
    };
    const expires = setExpiry(remember);
    const token = await generateToken(payload);
    cookies().set(cookieName, token, { expires: expires, httpOnly: true });
  }
  return res;
}

export async function UpdateUser(payload: any, remember: boolean) {
  const expires = setExpiry(remember);
    //TODO:add remember to state
  const token = await generateToken(payload);
  cookies().set(cookieName, token, { expires: expires, httpOnly: true });
  console.log("cookie updated")
}
