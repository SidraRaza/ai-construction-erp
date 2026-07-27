import { db } from "@/lib/db";

export type LogActivityParams = {
  companyId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  meta?: Record<string, unknown>;
};

export class ActivityLogService {
  static async log({ companyId, userId, action, entityType, entityId, meta }: LogActivityParams) {
    try {
      return await db.activityLog.create({
        data: {
          companyId,
          userId,
          action,
          entityType,
          entityId,
          meta: meta ? JSON.stringify(meta) : null,
        },
      });
    } catch (error) {
      console.error("[ActivityLogService] Failed to write log:", error);
    }
  }

  static async getCompanyLogs(companyId: string, limit = 50) {
    return db.activityLog.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
