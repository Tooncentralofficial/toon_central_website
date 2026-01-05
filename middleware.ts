import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { cookieName } from "./envs";
import { verifyToken } from "./lib/session/verifyToken";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // In middleware, we MUST use request.cookies, not cookies() from next/headers
  const allCookies = request.cookies.getAll();
  const token = request.cookies.get(cookieName)?.value;

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

  // Check if route is protected
  const isProtectedRoute = () => {
    return (
      pathname.startsWith("/comics") ||
      pathname.startsWith("/user") ||
      pathname.startsWith("/creator/dashboard")
    );
  };

  // Redirect unauthenticated users away from protected routes
  const redirectToLogin = () => {
    if (isProtectedRoute()) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  };

  if (token) {
    // Verify the local JWT token (contains minimal user data)
    const userVerified = await verifyToken(token).catch((err) => {
      console.log("middleware err verifying user", err);
      return null;
    });

    if (userVerified) {
      // Token verified successfully - user is authenticated
      // Redirect away from auth pages, allow everything else
      if (pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    } else {
      // Token exists but verification failed (e.g., expired local JWT)
      // Still allow access - let the API handle authentication
      // Only redirect from auth pages if we have a token (even if invalid)
      if (pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next(); // Allow access, API will eventually 401 and cause logout
    }
  }

  // No token - redirect to login if trying to access protected route
  if (!token) {
    return redirectToLogin();
  }

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
