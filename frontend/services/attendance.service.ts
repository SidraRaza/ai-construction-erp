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

    const existing = await db.attendance.findFirst({
      where: {
        workerId: data.userId,
        date: attendanceDate,
      },
    });

    if (existing) {
      if (markedById === data.userId) {
        throw new Error("Attendance already recorded for today");
      }
      const updated = await db.attendance.update({
        where: { id: existing.id },
        data: { status: data.status },
      });
      return updated;
    }


    const record = await db.attendance.create({
      data: {
        workerId: data.userId,
        date: attendanceDate,
        status: data.status,
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

    const createdRecords = [];

    for (const rec of data.records) {
      const existing = await db.attendance.findFirst({
        where: {
          workerId: rec.userId,
          date: attendanceDate,
        },
      });

      if (existing) {
        const updated = await db.attendance.update({
          where: { id: existing.id },
          data: { status: rec.status },
        });
        createdRecords.push(updated);
      } else {
        const created = await db.attendance.create({
          data: {
            workerId: rec.userId,
            date: attendanceDate,
            status: rec.status,
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
    const companyUsers = await db.user.findMany({
      where: { companyId },
      select: { id: true },
    });
    const userIds = companyUsers.map((u) => u.id);

    const whereClause: Record<string, unknown> = {
      workerId: { in: userIds },
    };
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
