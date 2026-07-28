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
            client: true,
            project: true,
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
    const { invoiceId, amount, method, reference } = body;

    if (!invoiceId || !amount || !method) {
      return NextResponse.json(
        { success: false, error: { message: "Invoice ID, amount, and payment method are required" } },
        { status: 400 }
      );
    }

    // 1. Create Payment Record
    const payment = await db.payment.create({
      data: {
        invoiceId,
        amount: new Prisma.Decimal(amount),
        method, // CASH | BANK | JAZZCASH | EASYPAISA | STRIPE
        reference: reference || "Receipt verified by Admin",
        date: new Date(),
      },
    });

    // 2. Mark Invoice as PAID
    await db.invoice.update({
      where: { id: invoiceId },
      data: { status: "PAID" },
    });

    await ActivityLogService.log({
      companyId,
      userId,
      action: "RECORD_PAYMENT",
      entityType: "Payment",
      entityId: payment.id,
      meta: { invoiceId, amount, method, reference },
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
