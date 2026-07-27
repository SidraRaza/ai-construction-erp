import { z } from "zod";

export const quotationItemSchema = z.object({
  description: z.string().min(1, "Item description required"),
  quantity: z.number().positive("Quantity must be positive"),
  unitRate: z.number().positive("Unit rate must be positive"),
});

export const createQuotationSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  projectId: z.string().optional(),
  items: z.array(quotationItemSchema).min(1, "At least one item is required"),
  gstPct: z.number().nonnegative().default(17),
  discount: z.number().nonnegative().default(0),
  notes: z.string().optional(),
});

export const createInvoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  projectId: z.string().optional(),
  quotationId: z.string().optional(),
  amount: z.number().positive("Invoice amount must be positive"),
  dueDate: z.string().or(z.date()).optional(),
});

export type CreateQuotationInput = z.infer<typeof createQuotationSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
