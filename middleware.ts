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



  const checkProtectedRoutes = () => {
    if (pathname.startsWith("/comics") || pathname.startsWith("/user") || pathname.startsWith("/creator/dashboard")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/creator/dashboard"))
      return NextResponse.redirect(new URL("/auth/login", request.url));
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