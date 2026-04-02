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

async function applyLoginSuccess(res: any, remember: boolean) {
  const profile = res?.data?.profile;

  const minimalUser = {
    id: profile?.id,
    email: profile?.email,
    username: profile?.username,
    photo: profile?.photo,
    first_name: profile?.first_name,
    last_name: profile?.last_name,
    phone: profile?.phone,
  };

  const payload = {
    userType: res?.data?.userType,
    user: minimalUser,
    token: res?.data?.accessToken,
  };

  const expires = setExpiry(remember);
  const token = await generateToken(payload);
  console.log("Minimal JWT token generated, length:", token?.length);

  try {
    const cookieStore = cookies();
    cookieStore.set(cookieName, token, {
      expires: expires,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    const verifyCookie = cookieStore.get(cookieName);
    if (verifyCookie) {
      console.log("✅ Cookie set successfully:", cookieName);
      console.log("✅ Cookie value length:", verifyCookie.value?.length);
    } else {
      console.error("❌ Cookie was NOT set - verification failed");
    }
  } catch (error) {
    console.error("❌ Error setting cookie:", error);
  }
}

export async function LoginUser(data: any, url: string) {
  const remember = data?.remembered;

  const res = await postRequest(data, "/onboard/login");
  if (res?.success) {
    await applyLoginSuccess(res, remember);
  }
  return res;
}

/** Expects /onboard/google success payload to match /onboard/login: profile, accessToken, userType under res.data */
export async function GoogleLoginUser(
  credential: string,
  countryID: number,
  remembered: boolean,
) {
  const res = await postRequest(
    { google_token: credential, country_id: countryID },
    "/onboard/google",
  );
  if (res?.success) {
    await applyLoginSuccess(res, remembered);
  }
  return res;
}
export async function UpdateUser(payload: any, remember: boolean) {
  const expires = setExpiry(remember);

  // Extract user data from payload
  const user = payload?.user;

  // Create minimal user object with only essential fields
  const minimalUser = {
    id: user?.id,
    email: user?.email,
    username: user?.username,
    photo: user?.photo,
    first_name: user?.first_name,
    last_name: user?.last_name,
    phone: user?.phone,
  };

  // Create minimal payload with user, token, and userType
  const minimalPayload = {
    userType: payload?.userType,
    user: minimalUser,
    token: payload?.token, // backend accessToken
  };

  // Generate local JWT with minimal payload
  const token = await generateToken(minimalPayload);
  console.log(
    "UpdateUser - minimal JWT token generated, length:",
    token?.length
  );

  // Set cookie with local JWT containing minimal user data
  try {
    const cookieStore = cookies();
    cookieStore.set(cookieName, token, {
      expires: expires,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // Verify cookie was set
    const verifyCookie = cookieStore.get(cookieName);
    if (verifyCookie) {
      console.log("✅ Cookie updated successfully:", cookieName);
    } else {
      console.error("❌ Cookie was NOT updated - verification failed");
    }
  } catch (error) {
    console.error("❌ Error updating cookie:", error);
  }
}
