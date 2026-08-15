import { NextRequest } from "next/server";
import { Role } from "@/lib/rbac";

function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  cookieHeader.split(";").forEach((pair) => {
    const [key, val] = pair.trim().split("=");
    if (key && val) cookies[key] = decodeURIComponent(val);
  });
  return cookies;
}

export function getAuthContext(req: Request | NextRequest) {
  // 1. Try NextRequest cookie API
  let cookieCompanyId: string | undefined;
  let cookieRole: string | undefined;
  let cookieUserId: string | undefined;

  if ("cookies" in req && typeof (req as NextRequest).cookies?.get === "function") {
    cookieCompanyId = (req as NextRequest).cookies.get("x-company-id")?.value;
    cookieRole = (req as NextRequest).cookies.get("erp_role")?.value;
    cookieUserId = (req as NextRequest).cookies.get("x-user-id")?.value;
  } else {
    // 2. Parse raw Cookie header on standard Request
    const rawCookie = req.headers.get("cookie");
    const parsed = parseCookies(rawCookie);
    cookieCompanyId = parsed["x-company-id"];
    cookieRole = parsed["erp_role"];
    cookieUserId = parsed["x-user-id"];
  }

  // Header fallbacks (for internal micro-service / SSR headers)
  const headerCompanyId = req.headers.get("x-company-id");
  const headerUserId = req.headers.get("x-user-id");
  const headerUserRole = req.headers.get("x-user-role");

  const companyId = cookieCompanyId || headerCompanyId || "cl_default_company";
  const userId = cookieUserId || headerUserId || "cl_default_user";
  const userRole = ((cookieRole || headerUserRole) as Role) || "ADMIN";

  return { companyId, userId, userRole };
}

