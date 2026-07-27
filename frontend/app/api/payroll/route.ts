import { NextResponse } from "next/server";
import { calculatePayrollSchema } from "@/validations/payroll.validation";
import { PayrollService } from "@/services/payroll.service";
import { ApiResponse } from "@/types/api";
import { Role } from "@/lib/rbac";

export async function POST(req: Request) {
  try {
    const companyId = req.headers.get("x-company-id") || "cl_default_company";
    const userId = req.headers.get("x-user-id") || "cl_default_user";
    const userRole = (req.headers.get("x-user-role") as Role) || "ADMIN";

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
