import { z } from "zod";

export const createMaterialSchema = z.object({
  name: z.string().min(2, "Material name is required"),
  unit: z.string().min(1, "Unit of measurement is required (e.g. bags, tons, kg)"),
  stockQty: z.number().nonnegative("Stock quantity cannot be negative"),
  reorderLevel: z.number().nonnegative("Reorder level cannot be negative"),
  supplierId: z.string().optional(),
});

export const adjustStockSchema = z.object({
  adjustmentQty: z.number().describe("Positive for addition, negative for consumption"),
  reason: z.string().optional(),
});

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
