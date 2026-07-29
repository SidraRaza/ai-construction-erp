import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { RecordExpenseInput } from "@/validations/expense.validation";
import { ActivityLogService } from "@/services/activity-log.service";
import { requirePermission } from "@/services/rbac-guard";
import { Role } from "@/lib/rbac";

export class ExpenseService {
  static async recordExpense(
    companyId: string,
    addedById: string,
    userRole: Role,
    data: RecordExpenseInput
  ) {
    if (userRole === "ENGINEER" && data.amount > 10000) {
      throw new Error("Forbidden: Site engineers cannot log single expenses exceeding $10,000 without admin approval");
    }

    if (userRole === "ENGINEER") {
      const teamRecord = await db.projectTeam.findFirst({
        where: {
          projectId: data.projectId,
          userId: addedById,
        },
      });

      if (!teamRecord) {
        throw new Error("Forbidden: You can only record expenses for your assigned site");
      }
    }

    const project = await db.project.findFirst({
      where: { id: data.projectId, companyId },
    });

    if (!project) {
      throw new Error("Project not found in your company");
    }

    const expense = await db.expense.create({
      data: {
        projectId: data.projectId,
        category: data.category,
        amount: new Prisma.Decimal(data.amount),
      },
    });

    await ActivityLogService.log({
      companyId,
      userId: addedById,
      action: "RECORD_EXPENSE",
      entityType: "Expense",
      entityId: expense.id,
      meta: { projectId: data.projectId, category: data.category, amount: data.amount },
    });

    return expense;
  }

  static createExpense = ExpenseService.recordExpense;

  static async getExpenses(companyId: string, projectId?: string, category?: string) {
    const whereClause: Record<string, unknown> = {
      project: { companyId },
    };
    if (projectId) whereClause.projectId = projectId;
    if (category) whereClause.category = category;

    return db.expense.findMany({
      where: whereClause,
      include: { project: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
