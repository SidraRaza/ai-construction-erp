import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(2, "Supplier name required"),
  contact: z.string().min(3, "Contact info required"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  category: z.string().default("General Construction Materials"),
  rating: z.number().optional(),
});

export const createPurchaseOrderSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  projectId: z.string().optional(),
  materialId: z.string().min(1, "Material is required"),
  qty: z.number().positive("Quantity must be positive").optional(),
  quantity: z.number().positive("Quantity must be positive").optional(),
  unitPrice: z.number().positive("Unit price must be positive").optional(),
  totalAmount: z.number().positive("Total amount must be positive").optional(),
  notes: z.string().optional(),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type CreatePurchaseOrderInput = z.infer<typeof createPurchaseOrderSchema>;
