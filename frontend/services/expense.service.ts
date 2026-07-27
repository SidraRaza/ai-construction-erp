import { db } from "@/lib/db";
import { CreateExpenseInput } from "@/validations/expense.validation";
import { ActivityLogService } from "@/services/activity-log.service";
import { requirePermission } from "@/services/rbac-guard";
import { Role } from "@/lib/rbac";
import { Prisma } from "@prisma/client";

export class ExpenseService {
  static ENGINEER_EXPENSE_CAP = 10000;

  static async createExpense(
    companyId: string,
    addedById: string,
    userRole: Role,
    data: CreateExpenseInput
  ) {
    requirePermission(userRole, "record:expenses");

    if (userRole === "ENGINEER") {
      if (data.amount > this.ENGINEER_EXPENSE_CAP) {
        throw new Error(
          `Forbidden: Engineer expense entry capped at $${this.ENGINEER_EXPENSE_CAP}. Admin approval required for larger amounts.`
        );
      }

      const teamRecord = await db.projectTeam.findFirst({
        where: { projectId: data.projectId, userId: addedById },
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

    const expenseDate = data.date ? new Date(data.date) : new Date();

    const expense = await db.expense.create({
      data: {
        companyId,
        projectId: data.projectId,
        category: data.category,
        amount: new Prisma.Decimal(data.amount),
        date: expenseDate,
        addedById,
        note: data.note,
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

  static async getExpenses(companyId: string, projectId?: string, category?: string) {
    const whereClause: Record<string, unknown> = { companyId };
    if (projectId) whereClause.projectId = projectId;
    if (category) whereClause.category = category;

    return db.expense.findMany({
      where: whereClause,
      include: { project: true },
      orderBy: { date: "desc" },
    });
  }
}
