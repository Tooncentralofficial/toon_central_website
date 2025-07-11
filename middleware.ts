import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { cookieName } from "./envs";
import { verifyToken } from "./lib/session/verifyToken";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(cookieName)?.value;
  const { pathname } = request.nextUrl;

  const checkProtectedRoutes = () => {
    if (pathname.startsWith("/comics") || pathname.startsWith("/user")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/creator"))
      return NextResponse.redirect(new URL("/creator", request.url));
  };

  const checkUnProtectedRoutes = () => {
    if (pathname.startsWith("/auth"))
      return NextResponse.redirect(new URL("/", request.url));
  };
  

  if (token) {
    const userVerified = await verifyToken(token).catch((err) => {
      console.log("middleware err verifyin user", err);
    });

    if (userVerified) {
      return checkUnProtectedRoutes();
    } else {
      return checkProtectedRoutes();
    }
  }

  if (!token) return checkProtectedRoutes();

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/creator/:path*",
    "/user/:path*",
    "/comics/:path*",
  ],
};
// "/comics/:path*",