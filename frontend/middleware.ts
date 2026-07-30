import { NextRequest, NextResponse } from "next/server";

/**
 * Global Edge Security Middleware for Multi-Tenant Route Protection
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Define public paths that bypass route security
  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon.ico");

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for company ID cookie or active session header
  const companyCookie = req.cookies.get("x-company-id")?.value;
  const companyHeader = req.headers.get("x-company-id");

  const hasAccessCredential = companyCookie || companyHeader;

  // Protect internal modules (/admin, /engineer, /client)
  const isProtectedArea =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/engineer") ||
    pathname.startsWith("/client");

  if (isProtectedArea && !hasAccessCredential) {
    // If accessing Super Admin password gatekeeper page directly, allow loading client gatekeeper
    if (pathname === "/admin/super-admin") {
      return NextResponse.next();
    }

    // Redirect unauthenticated visitors to landing page with security warning
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("auth", "required");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/engineer/:path*",
    "/client/:path*",
  ],
};
