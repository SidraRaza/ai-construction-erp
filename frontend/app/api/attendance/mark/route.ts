import { NextResponse } from "next/server";
import { markAttendanceSchema } from "@/validations/attendance.validation";
import { AttendanceService } from "@/services/attendance.service";
import { getAuthContext } from "@/lib/auth-helpers";
import { ApiResponse } from "@/types/api";

export async function POST(req: Request) {
  try {
    const { companyId, userId, userRole } = getAuthContext(req);

    const body = await req.json();
    const validated = markAttendanceSchema.parse(body);

    const record = await AttendanceService.markAttendance(companyId, userId, userRole, validated);


    return NextResponse.json<ApiResponse<typeof record>>(
      { success: true, data: record },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to mark attendance";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "ATTENDANCE_FAILED", message } },
      { status: 400 }
    );
  }
}
