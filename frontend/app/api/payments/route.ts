import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ActivityLogService } from "@/services/activity-log.service";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const companyId = req.headers.get("x-company-id") || "cl_default_company";

    const payments = await db.payment.findMany({
      include: {
        invoice: {
          include: {
            project: true,
            quotation: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: payments,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const companyId = req.headers.get("x-company-id") || "cl_default_company";
    const userId = req.headers.get("x-user-id") || "cl_default_user";

    const body = await req.json();
    const { invoiceId, clientName, projectId, amount, method, reference } = body;

    if (!amount || !method) {
      return NextResponse.json(
        { success: false, error: { message: "Payment amount and method are required" } },
        { status: 400 }
      );
    }

    let targetInvoiceId = invoiceId;

    // If no invoiceId provided, auto-resolve client and create an Invoice for this payment!
    if (!targetInvoiceId) {
      const cName = clientName || "General Client";
      let client = await db.client.findFirst({
        where: { companyId },
      });

      if (!client) {
        client = await db.client.create({
          data: {
            companyId,
            name: cName,
            contact: "+1 555-0000",
            email: "client@buildcorp.com",
          },
        });
      }

      const invoice = await db.invoice.create({
        data: {
          companyId,
          clientId: client.id,
          projectId: projectId || null,
          amount: new Prisma.Decimal(amount),
          status: "PAID",
          version: 1,
        },
      });
      targetInvoiceId = invoice.id;
    } else {
      // Mark existing Invoice as PAID
      await db.invoice.update({
        where: { id: targetInvoiceId },
        data: { status: "PAID" },
      });
    }

    // 2. Create Payment Record
    const payment = await db.payment.create({
      data: {
        invoiceId: targetInvoiceId,
        amount: new Prisma.Decimal(amount),
        method, // CASH | BANK | CHEQUE | JAZZCASH | EASYPAISA | STRIPE
        reference: reference || `Paid via ${method}`,
        date: new Date(),
      },
    });

    await ActivityLogService.log({
      companyId,
      userId,
      action: "RECORD_PAYMENT",
      entityType: "Payment",
      entityId: payment.id,
      meta: { invoiceId: targetInvoiceId, amount, method, reference },
    });

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
