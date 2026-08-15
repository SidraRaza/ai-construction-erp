import { NextRequest } from "next/server";
import { getAuthContext } from "@/lib/auth-helpers";

/**
 * Tenant Data Isolation Security Helper
 */
export function getTenantCompanyId(req: Request | NextRequest): string {
  const { companyId } = getAuthContext(req);
  return companyId;
}


/**
 * Generate a clean Unique User ID
 */
export function generateUniqueUserId(): string {
  return `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}
