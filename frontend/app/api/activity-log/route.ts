import { NextResponse } from "next/server";
import { ActivityLogService } from "@/services/activity-log.service";
import { getAuthContext } from "@/lib/auth-helpers";
import { ApiResponse } from "@/types/api";

export async function GET(req: Request) {
  try {
    const { companyId } = getAuthContext(req);
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const logs = await ActivityLogService.getCompanyLogs(companyId, limit);


    return NextResponse.json<ApiResponse<typeof logs>>({
      success: true,
      data: logs,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch activity logs";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "FETCH_FAILED", message } },
      { status: 500 }
    );
  }
}
