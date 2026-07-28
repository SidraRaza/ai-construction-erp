import { db } from "@/lib/db";
import { CreateQuotationInput, CreateInvoiceInput } from "@/validations/financials.validation";
import { ActivityLogService } from "@/services/activity-log.service";
import { requirePermission } from "@/services/rbac-guard";
import { Role } from "@/lib/rbac";
import { Prisma } from "@prisma/client";

export class FinancialsService {
  static async createQuotation(
    companyId: string,
    userId: string,
    userRole: Role,
    data: CreateQuotationInput,
    isAiDraft = false
  ) {
    requirePermission(userRole, "create:financials");

    // 1. Resolve Valid Client Entity ID to satisfy Foreign Key Constraint
    let targetClientId: string | undefined = data.clientId;

    if (targetClientId) {
      const existingClient = await db.client.findFirst({
        where: { id: targetClientId, companyId },
      });
      if (!existingClient) {
        targetClientId = undefined;
      }
    }

    if (!targetClientId) {
      let defaultClient = await db.client.findFirst({
        where: { companyId },
      });

      if (!defaultClient) {
        defaultClient = await db.client.create({
          data: {
            companyId,
            name: "General Corporate Client",
            contact: "+1 555-0000",
            email: "client@buildcorp.com",
          },
        });
      }
      targetClientId = defaultClient.id;
    }

    // 2. Resolve Valid Project Entity ID (Optional)
    let targetProjectId: string | undefined = data.projectId;
    if (targetProjectId) {
      const existingProject = await db.project.findFirst({
        where: { id: targetProjectId, companyId },
      });
      if (!existingProject) {
        targetProjectId = undefined;
      }
    }

    const status = isAiDraft ? "DRAFT" : "SENT";

    const quotation = await db.quotation.create({
      data: {
        companyId,
        clientId: targetClientId,
        projectId: targetProjectId || null,
        items: JSON.stringify(data.items),
        gstPct: new Prisma.Decimal(data.gstPct),
        discount: new Prisma.Decimal(data.discount),
        notes: data.notes,
        status,
        version: 1,
      },
    });

    await ActivityLogService.log({
      companyId,
      userId,
      action: isAiDraft ? "CREATE_AI_QUOTATION_DRAFT" : "CREATE_QUOTATION",
      entityType: "Quotation",
      entityId: quotation.id,
      meta: { clientId: targetClientId, isAiDraft, status },
    });

    return quotation;
  }

  static async approveQuotation(
    companyId: string,
    userId: string,
    userRole: Role,
    quotationId: string
  ) {
    requirePermission(userRole, "create:financials");

    const quotation = await db.quotation.findFirst({
      where: { id: quotationId, companyId },
    });

    if (!quotation) {
      throw new Error("Quotation not found");
    }

    const updated = await db.quotation.update({
      where: { id: quotationId },
      data: { status: "APPROVED" },
    });

    await ActivityLogService.log({
      companyId,
      userId,
      action: "APPROVE_QUOTATION",
      entityType: "Quotation",
      entityId: quotationId,
      meta: { previousStatus: quotation.status },
    });

    return updated;
  }

  static async createInvoice(
    companyId: string,
    userId: string,
    userRole: Role,
    data: CreateInvoiceInput
  ) {
    requirePermission(userRole, "create:financials");

    // 1. Resolve Valid Client Entity ID
    let targetClientId: string | undefined = data.clientId;
    if (targetClientId) {
      const existingClient = await db.client.findFirst({
        where: { id: targetClientId, companyId },
      });
      if (!existingClient) {
        targetClientId = undefined;
      }
    }

    if (!targetClientId) {
      let defaultClient = await db.client.findFirst({
        where: { companyId },
      });
      if (!defaultClient) {
        defaultClient = await db.client.create({
          data: {
            companyId,
            name: "General Corporate Client",
            contact: "+1 555-0000",
            email: "client@buildcorp.com",
          },
        });
      }
      targetClientId = defaultClient.id;
    }

    // 2. Resolve Valid Project Entity ID
    let targetProjectId: string | undefined = data.projectId;
    if (targetProjectId) {
      const existingProject = await db.project.findFirst({
        where: { id: targetProjectId, companyId },
      });
      if (!existingProject) {
        targetProjectId = undefined;
      }
    }

    const invoice = await db.invoice.create({
      data: {
        companyId,
        clientId: targetClientId,
        projectId: targetProjectId || null,
        quotationId: data.quotationId || null,
        amount: new Prisma.Decimal(data.amount),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        status: "PENDING",
        version: 1,
      },
    });

    await ActivityLogService.log({
      companyId,
      userId,
      action: "CREATE_INVOICE",
      entityType: "Invoice",
      entityId: invoice.id,
      meta: { amount: data.amount, version: 1 },
    });

    return invoice;
  }

  static async voidAndReissueInvoice(
    companyId: string,
    userId: string,
    userRole: Role,
    invoiceId: string,
    newAmount: number
  ) {
    requirePermission(userRole, "create:financials");

    const existingInvoice = await db.invoice.findFirst({
      where: { id: invoiceId, companyId },
    });

    if (!existingInvoice) {
      throw new Error("Invoice not found");
    }

    const newInvoice = await db.$transaction(async (tx) => {
      await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: "VOIDED" },
      });

      return tx.invoice.create({
        data: {
          companyId,
          clientId: existingInvoice.clientId,
          projectId: existingInvoice.projectId,
          quotationId: existingInvoice.quotationId,
          amount: new Prisma.Decimal(newAmount),
          status: "PENDING",
          version: existingInvoice.version + 1,
        },
      });
    });

    await ActivityLogService.log({
      companyId,
      userId,
      action: "VOID_AND_REISSUE_INVOICE",
      entityType: "Invoice",
      entityId: newInvoice.id,
      meta: { previousInvoiceId: invoiceId, oldVersion: existingInvoice.version, newVersion: newInvoice.version },
    });

    return newInvoice;
  }
}
