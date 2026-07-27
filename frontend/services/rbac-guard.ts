import { Role, Permission, hasPermission } from "@/lib/rbac";

export function requirePermission(userRole: Role, permission: Permission) {
  if (!hasPermission(userRole, permission)) {
    throw new Error(`Forbidden: Role ${userRole} lacks permission '${permission}'`);
  }
}

export function requireRole(userRole: Role, allowedRoles: Role[]) {
  if (!allowedRoles.includes(userRole)) {
    throw new Error(`Forbidden: Role ${userRole} is not authorized for this operation`);
  }
}

export function requireCompanyMatch(userCompanyId: string, targetCompanyId: string) {
  if (userCompanyId !== targetCompanyId) {
    throw new Error("Forbidden: Cross-tenant operation blocked");
  }
}
