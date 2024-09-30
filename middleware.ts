import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookieName } from "./envs";
import { verifyToken } from "./lib/session/verifyToken";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(cookieName)?.value;
  

  if (token) {
    const userVerified = await verifyToken(token).catch((err) => {
      console.log("middleware err verifyin user", err);
    });
    if (userVerified) {
     // console.log("user_middleware", userVerified);
    }
    // If user data is available, update Redux store and continue
    // dispatch(setUserData(JSON.parse(userData)));

    // if (userVerified) {
    //   // dispatch(setUserData(JSON.parse(userData)));
    //   return NextResponse.next();
    // } else {
    //   const url = request.nextUrl.clone();
    //   url.pathname = "/home";
    //   return NextResponse.redirect(url);
    // }
  }
  //  else {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/home";
  //   return NextResponse.redirect(url);
  // }
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/"],
};
