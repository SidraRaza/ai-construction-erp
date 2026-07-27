import { NextResponse } from "next/server";
import { bulkAttendanceSchema } from "@/validations/attendance.validation";
import { AttendanceService } from "@/services/attendance.service";
import { ApiResponse } from "@/types/api";
import { Role } from "@/lib/rbac";

export async function POST(req: Request) {
  try {
    const companyId = req.headers.get("x-company-id") || "cl_default_company";
    const userId = req.headers.get("x-user-id") || "cl_default_user";
    const userRole = (req.headers.get("x-user-role") as Role) || "ADMIN";

    const body = await req.json();
    const validated = bulkAttendanceSchema.parse(body);

    const records = await AttendanceService.markBulkAttendance(companyId, userId, userRole, validated);

    return NextResponse.json<ApiResponse<typeof records>>(
      { success: true, data: records },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to bulk mark attendance";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "BULK_ATTENDANCE_FAILED", message } },
      { status: 400 }
    );
  }
}
