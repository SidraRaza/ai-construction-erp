import { NextRequest, NextResponse } from "next/server";

/**
 * Global Edge Security Middleware for Route & Tenant Protection
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Bypass public static assets, images, API auth routes, and public landing page
  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon.ico");

  if (isPublicPath) {
    return NextResponse.next();
  }

  // 2. Allow direct access to Super Admin login password gatekeeper page
  if (pathname === "/admin/super-admin") {
    return NextResponse.next();
  }

  // 3. Extract Session Cookies
  const erpSession = req.cookies.get("erp_session")?.value;
  const companyCookie = req.cookies.get("x-company-id")?.value;
  const companyHeader = req.headers.get("x-company-id");
  const roleCookie = req.cookies.get("erp_role")?.value;

  const hasValidCompany = Boolean(companyCookie || companyHeader);
  const isAuthenticated = Boolean(erpSession === "active" || hasValidCompany);

  // 4. Protect Internal Routes (/admin, /engineer, /client)
  const isProtectedArea =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/engineer") ||
    pathname.startsWith("/client");

  if (isProtectedArea && !isAuthenticated) {
    // Redirect unauthenticated visitors back to home page with auth=required parameter
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("auth", "required");
    return NextResponse.redirect(loginUrl);
  }

  // 5. Role-Based Access Control (RBAC) Route Guard
  if (pathname.startsWith("/admin") && roleCookie && roleCookie !== "ADMIN" && roleCookie !== "SUPER_ADMIN") {
    if (roleCookie === "ENGINEER") {
      return NextResponse.redirect(new URL("/engineer/dashboard", req.url));
    }
    if (roleCookie === "CLIENT") {
      return NextResponse.redirect(new URL("/client/dashboard", req.url));
    }
  }

  if (pathname.startsWith("/engineer") && roleCookie && roleCookie !== "ENGINEER" && roleCookie !== "ADMIN" && roleCookie !== "SUPER_ADMIN") {
    if (roleCookie === "CLIENT") {
      return NextResponse.redirect(new URL("/client/dashboard", req.url));
    }
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
