import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ActivityLogService } from "@/services/activity-log.service";
import { Prisma } from "@prisma/client";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const companyId = req.headers.get("x-company-id") || "cl_default_company";
    const userId = req.headers.get("x-user-id") || "cl_default_user";

    const body = await req.json();
    const { status, amount, notes } = body;

    const existing = await db.quotation.findFirst({
      where: { id, companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { message: "Quotation not found" } },
        { status: 404 }
      );
    }

    let updatedItems = existing.items;
    if (amount) {
      updatedItems = JSON.stringify([
        { description: "Updated Site Estimation", quantity: 1, unitRate: Number(amount), amount: Number(amount) },
      ]);
    }

    const updated = await db.quotation.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes ? { notes } : {}),
        items: updatedItems,
      },
    });

    await ActivityLogService.log({
      companyId,
      userId,
      action: "UPDATE_QUOTATION",
      entityType: "Quotation",
      entityId: id,
      meta: { previousStatus: existing.status, newStatus: updated.status, amount },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
