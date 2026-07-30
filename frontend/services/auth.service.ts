import { db } from "@/lib/db";
import { RegisterInput, LoginInput } from "@/validations/auth.validation";
import { ActivityLogService } from "@/services/activity-log.service";
import { Role } from "@/lib/rbac";
import bcrypt from "bcryptjs";

export class AuthService {
  static async registerCompanyAndAdmin(data: RegisterInput) {
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const result = await db.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: data.companyName,
          status: "ACTIVE",
          subscriptionPlan: "FREE",
        },
      });

      const adminUser = await tx.user.create({
        data: {
          companyId: company.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          passwordHash,
          role: "ADMIN",
          status: "ACTIVE",
        },
      });

      return { company, user: adminUser };
    });

    await ActivityLogService.log({
      companyId: result.company.id,
      userId: result.user.id,
      action: "REGISTER_COMPANY_ADMIN",
      entityType: "Company",
      entityId: result.company.id,
      meta: { companyName: result.company.name, adminEmail: result.user.email },
    });

    return {
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role as Role,
        companyId: result.company.id,
      },
      company: {
        id: result.company.id,
        name: result.company.name,
      },
    };
  }

  static async validateCredentials(credentials: LoginInput) {
    const emailLower = credentials.email.toLowerCase().trim();

    // Sidra Super Admin Platform Owner Authentication Check
    if ((emailLower === "sidra" || emailLower === "sidra@admin.com" || emailLower === "sidra@buildcorp.com") && credentials.password === "87626") {
      return {
        id: "super_admin_sidra",
        name: "Sidra",
        email: "sidra@buildcorp.com",
        role: "SUPER_ADMIN" as Role,
        companyId: "cl_default_company",
        avatarUrl: null,
      };
    }

    const user = await db.user.findUnique({
      where: { email: credentials.email },
      include: { company: true },
    });

    if (!user || !user.passwordHash) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    if (user.status !== "ACTIVE" || user.company.status !== "ACTIVE") {
      throw new Error("Account or Company subscription is inactive");
    }

    await ActivityLogService.log({
      companyId: user.companyId,
      userId: user.id,
      action: "USER_LOGIN",
      entityType: "User",
      entityId: user.id,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      companyId: user.companyId,
      avatarUrl: user.avatarUrl,
    };
  }
}
