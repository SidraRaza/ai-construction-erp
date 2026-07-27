import { db } from "@/lib/db";
import { CreateProjectInput, AssignTeamMemberInput } from "@/validations/project.validation";
import { ActivityLogService } from "@/services/activity-log.service";
import { requirePermission } from "@/services/rbac-guard";
import { Role } from "@/lib/rbac";
import { Prisma } from "@prisma/client";

export class ProjectService {
  static async createProject(
    companyId: string,
    userId: string,
    userRole: Role,
    data: CreateProjectInput
  ) {
    requirePermission(userRole, "manage:projects");

    const project = await db.project.create({
      data: {
        companyId,
        clientId: data.clientId,
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        budget: new Prisma.Decimal(data.budget),
        priority: data.priority,
        status: data.status,
      },
      include: {
        client: true,
      },
    });

    await ActivityLogService.log({
      companyId,
      userId,
      action: "CREATE_PROJECT",
      entityType: "Project",
      entityId: project.id,
      meta: { projectName: project.name, budget: data.budget },
    });

    return project;
  }

  static async getProjects(companyId: string, userId: string, userRole: Role) {
    if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
      return db.project.findMany({
        where: { companyId },
        include: { client: true, team: true },
        orderBy: { createdAt: "desc" },
      });
    }

    if (userRole === "ENGINEER") {
      return db.project.findMany({
        where: {
          companyId,
          team: {
            some: { userId },
          },
        },
        include: { client: true, team: true },
        orderBy: { createdAt: "desc" },
      });
    }

    if (userRole === "CLIENT") {
      const clientRecord = await db.client.findFirst({
        where: { companyId, email: userId },
      });

      if (!clientRecord) return [];

      return db.project.findMany({
        where: { companyId, clientId: clientRecord.id },
        include: { team: true },
        orderBy: { createdAt: "desc" },
      });
    }

    return [];
  }

  static async assignTeamMember(
    companyId: string,
    userId: string,
    userRole: Role,
    projectId: string,
    data: AssignTeamMemberInput
  ) {
    requirePermission(userRole, "assign:team");

    const project = await db.project.findFirst({
      where: { id: projectId, companyId },
    });

    if (!project) {
      throw new Error("Project not found in your company");
    }

    const teamMember = await db.projectTeam.upsert({
      where: {
        projectId_userId: {
          projectId,
          userId: data.userId,
        },
      },
      update: {
        roleOnProject: data.roleOnProject,
      },
      create: {
        projectId,
        userId: data.userId,
        roleOnProject: data.roleOnProject,
      },
    });

    await ActivityLogService.log({
      companyId,
      userId,
      action: "ASSIGN_TEAM_MEMBER",
      entityType: "ProjectTeam",
      entityId: teamMember.id,
      meta: { projectId, assignedUserId: data.userId, roleOnProject: data.roleOnProject },
    });

    return teamMember;
  }
}
