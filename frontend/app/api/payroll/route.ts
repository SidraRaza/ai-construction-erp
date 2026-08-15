import { NextResponse } from "next/server";
import { calculatePayrollSchema } from "@/validations/payroll.validation";
import { PayrollService } from "@/services/payroll.service";
import { getAuthContext } from "@/lib/auth-helpers";
import { ApiResponse } from "@/types/api";

export async function POST(req: Request) {
  try {
    const { companyId, userId, userRole } = getAuthContext(req);

    const body = await req.json();
    const validated = calculatePayrollSchema.parse(body);

    const result = await PayrollService.calculatePayroll(companyId, userId, userRole, validated);


    return NextResponse.json<ApiResponse<typeof result>>(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to calculate payroll";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "PAYROLL_FAILED", message } },
      { status: 400 }
    );
  }
}
