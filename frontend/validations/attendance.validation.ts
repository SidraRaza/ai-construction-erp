import { z } from "zod";

const attendanceStatusEnum = z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY"]);

export const markAttendanceSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  projectId: z.string().min(1, "Project ID is required"),
  date: z.string().or(z.date()).default(() => new Date()),
  status: attendanceStatusEnum,
  method: z.enum(["QR", "MANUAL"]).default("MANUAL"),
});

export const bulkAttendanceSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  date: z.string().or(z.date()).default(() => new Date()),
  records: z.array(
    z.object({
      userId: z.string().min(1, "User ID is required"),
      status: attendanceStatusEnum,
      method: z.enum(["QR", "MANUAL"]).default("MANUAL"),
    })
  ).min(1, "At least one attendance record is required"),
});

export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;
export type BulkAttendanceInput = z.infer<typeof bulkAttendanceSchema>;
