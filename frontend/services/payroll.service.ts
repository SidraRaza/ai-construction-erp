import { db } from "@/lib/db";
import { CalculatePayrollInput } from "@/validations/payroll.validation";
import { ActivityLogService } from "@/services/activity-log.service";
import { requirePermission } from "@/services/rbac-guard";
import { Role } from "@/lib/rbac";

export class PayrollService {
  static async calculatePayroll(
    companyId: string,
    adminId: string,
    userRole: Role,
    data: CalculatePayrollInput
  ) {
    requirePermission(userRole, "manage:users");

    const dailyRate = data.monthlySalary / data.totalDaysInMonth;

    // Deductions: Late = 0.25 day pay, HalfDay = 0.5 day pay, Absent = 1 day pay
    const absentDays = data.totalDaysInMonth - (data.presentDays + data.halfDays * 0.5);
    const deductions = Math.round(
      absentDays * dailyRate + data.lateDays * (dailyRate * 0.25)
    );

    const netSalary = Math.max(0, Math.round(data.monthlySalary - deductions));

    const payrollRecord = {
      userId: data.userId,
      month: data.month,
      baseSalary: data.monthlySalary,
      dailyRate: Math.round(dailyRate),
      presentDays: data.presentDays,
      lateDays: data.lateDays,
      halfDays: data.halfDays,
      deductions,
      netSalary,
    };

    await ActivityLogService.log({
      companyId,
      userId: adminId,
      action: "CALCULATE_PAYROLL",
      entityType: "Payroll",
      entityId: `${data.userId}_${data.month}`,
      meta: payrollRecord,
    });

    return payrollRecord;
  }
}
