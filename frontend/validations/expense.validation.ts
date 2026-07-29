import { z } from "zod";

export const createExpenseSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.number().positive("Expense amount must be positive"),
  date: z.string().or(z.date()).optional(),
  note: z.string().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type RecordExpenseInput = CreateExpenseInput;
