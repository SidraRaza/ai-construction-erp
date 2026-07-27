import { db } from "@/lib/db";
import { MarkAttendanceInput, BulkAttendanceInput } from "@/validations/attendance.validation";
import { ActivityLogService } from "@/services/activity-log.service";
import { requirePermission } from "@/services/rbac-guard";
import { Role } from "@/lib/rbac";

export class AttendanceService {
  static async markAttendance(
    companyId: string,
    markedById: string,
    userRole: Role,
    data: MarkAttendanceInput
  ) {
    if (markedById === data.userId) {
      requirePermission(userRole, "mark:own_attendance");
    } else {
      requirePermission(userRole, "mark:labour_attendance");
    }

    const attendanceDate = new Date(data.date);
    attendanceDate.setHours(0, 0, 0, 0);

    const project = await db.project.findFirst({
      where: { id: data.projectId, companyId },
    });

    if (!project) {
      throw new Error("Project not found in your company");
    }

    const existing = await db.attendance.findFirst({
      where: {
        userId: data.userId,
        projectId: data.projectId,
        date: attendanceDate,
      },
    });

    if (existing) {
      throw new Error("Attendance record already exists for this user on this date");
    }

    const record = await db.attendance.create({
      data: {
        userId: data.userId,
        projectId: data.projectId,
        date: attendanceDate,
        status: data.status,
        method: data.method,
        markedBy: markedById,
      },
    });

    await ActivityLogService.log({
      companyId,
      userId: markedById,
      action: "MARK_ATTENDANCE",
      entityType: "Attendance",
      entityId: record.id,
      meta: { targetUserId: data.userId, status: data.status, method: data.method },
    });

    return record;
  }

  static async markBulkAttendance(
    companyId: string,
    markedById: string,
    userRole: Role,
    data: BulkAttendanceInput
  ) {
    requirePermission(userRole, "mark:labour_attendance");

    const attendanceDate = new Date(data.date);
    attendanceDate.setHours(0, 0, 0, 0);

    const project = await db.project.findFirst({
      where: { id: data.projectId, companyId },
    });

    if (!project) {
      throw new Error("Project not found in your company");
    }

    const createdRecords = [];

    for (const rec of data.records) {
      const existing = await db.attendance.findFirst({
        where: {
          userId: rec.userId,
          projectId: data.projectId,
          date: attendanceDate,
        },
      });

      if (existing) {
        const updated = await db.attendance.update({
          where: { id: existing.id },
          data: { status: rec.status, method: rec.method, markedBy: markedById },
        });
        createdRecords.push(updated);
      } else {
        const created = await db.attendance.create({
          data: {
            userId: rec.userId,
            projectId: data.projectId,
            date: attendanceDate,
            status: rec.status,
            method: rec.method,
            markedBy: markedById,
          },
        });
        createdRecords.push(created);
      }
    }

    await ActivityLogService.log({
      companyId,
      userId: markedById,
      action: "BULK_MARK_ATTENDANCE",
      entityType: "Attendance",
      entityId: data.projectId,
      meta: { recordCount: createdRecords.length, date: data.date },
    });

    return createdRecords;
  }

  static async getAttendanceHistory(companyId: string, projectId?: string, date?: string) {
    const whereClause: Record<string, unknown> = {};
    if (projectId) whereClause.projectId = projectId;
    if (date) {
      const parsedDate = new Date(date);
      parsedDate.setHours(0, 0, 0, 0);
      whereClause.date = parsedDate;
    }

    return db.attendance.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      take: 100,
    });
  }
}
