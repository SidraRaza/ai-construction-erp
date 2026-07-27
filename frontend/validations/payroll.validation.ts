import { z } from "zod";

export const calculatePayrollSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  month: z.string().default("2026-07"),
  monthlySalary: z.number().positive("Salary must be positive"),
  totalDaysInMonth: z.number().default(30),
  presentDays: z.number().nonnegative(),
  lateDays: z.number().nonnegative().default(0),
  halfDays: z.number().nonnegative().default(0),
});

export type CalculatePayrollInput = z.infer<typeof calculatePayrollSchema>;
