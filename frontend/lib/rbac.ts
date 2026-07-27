export type Role = "SUPER_ADMIN" | "ADMIN" | "ENGINEER" | "LABOUR" | "CLIENT";

export type Permission =
  | "manage:companies"
  | "manage:users"
  | "manage:projects"
  | "assign:team"
  | "submit:daily_progress"
  | "upload:site_media"
  | "mark:own_attendance"
  | "mark:labour_attendance"
  | "create:financials"
  | "record:expenses"
  | "view:project_progress"
  | "download:invoices"
  | "view:payment_history"
  | "access:ai_tools";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "manage:companies",
    "manage:users",
    "view:project_progress",
    "access:ai_tools",
  ],
  ADMIN: [
    "manage:users",
    "manage:projects",
    "assign:team",
    "mark:labour_attendance",
    "create:financials",
    "record:expenses",
    "view:project_progress",
    "download:invoices",
    "view:payment_history",
    "access:ai_tools",
  ],
  ENGINEER: [
    "submit:daily_progress",
    "upload:site_media",
    "mark:own_attendance",
    "mark:labour_attendance",
    "record:expenses",
    "view:project_progress",
    "access:ai_tools",
  ],
  LABOUR: [
    "mark:own_attendance",
  ],
  CLIENT: [
    "view:project_progress",
    "download:invoices",
    "view:payment_history",
    "access:ai_tools",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function isRoleAllowedForRouteGroup(role: Role, routeGroup: string): boolean {
  switch (routeGroup) {
    case "admin":
      return role === "ADMIN" || role === "SUPER_ADMIN";
    case "engineer":
      return role === "ENGINEER";
    case "client":
      return role === "CLIENT";
    default:
      return true;
  }
}
