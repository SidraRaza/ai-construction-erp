import { NextResponse } from "next/server";
import { bulkAttendanceSchema } from "@/validations/attendance.validation";
import { AttendanceService } from "@/services/attendance.service";
import { getAuthContext } from "@/lib/auth-helpers";
import { ApiResponse } from "@/types/api";

export async function POST(req: Request) {
  try {
    const { companyId, userId, userRole } = getAuthContext(req);

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
