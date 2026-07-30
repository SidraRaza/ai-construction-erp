import { NextRequest } from "next/server";

/**
 * Tenant Data Isolation Security Helper
 */
export function getTenantCompanyId(req: NextRequest): string {
  // Extract companyId from request header or cookie
  const headerId = req.headers.get("x-company-id");
  if (headerId && headerId !== "null" && headerId !== "undefined") {
    return headerId;
  }

  const cookieId = req.cookies.get("x-company-id")?.value;
  if (cookieId && cookieId !== "null" && cookieId !== "undefined") {
    return cookieId;
  }

  // Fallback to default company
  return "cl_default_company";
}

/**
 * Generate a clean Unique User ID
 */
export function generateUniqueUserId(): string {
  return `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}
