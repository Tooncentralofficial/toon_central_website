import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { cookieName } from "./envs";
import { verifyToken } from "./lib/session/verifyToken";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(cookieName)?.value;
  const { pathname } = request.nextUrl;

  const userAgent = request.headers.get("user-agent") || "";
  const isSocialCrawler =
    userAgent.includes("facebookexternalhit") ||
    userAgent.includes("Twitterbot") ||
    userAgent.includes("LinkedInBot") ||
    userAgent.includes("WhatsApp") ||
    userAgent.includes("Slackbot") ||
    userAgent.includes("TelegramBot");

  // Allow all social media crawlers to access any page without redirects
  if (isSocialCrawler) {
    console.log(`Social crawler accessing: ${pathname}`);
    return NextResponse.next();
  }

  // Redirect unauthenticated users away from protected routes
  const checkProtectedRoutes = () => {
    if (
      pathname.startsWith("/comics") ||
      pathname.startsWith("/user") ||
      pathname.startsWith("/creator/dashboard")
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  };

  if (token) {
    const userVerified = await verifyToken(token).catch((err) => {
      console.log("middleware err verifyin user", err);
      return null;
    });

    if (userVerified) {
      // Authenticated: keep them off /auth, allow everything else
      if (pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
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
