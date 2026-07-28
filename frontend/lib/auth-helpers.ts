import { NextRequest } from "next/server";
import { Role } from "@/lib/rbac";

export function getAuthContext(req: NextRequest) {
  const companyId = req.headers.get("x-company-id") || "cl_default_company";
  const userId = req.headers.get("x-user-id") || "cl_default_user";
  const userRole = (req.headers.get("x-user-role") as Role) || "ADMIN";

  return { companyId, userId, userRole };
}
