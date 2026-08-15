import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ActivityLogService } from "@/services/activity-log.service";
import { getAuthContext } from "@/lib/auth-helpers";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { companyId, userId } = getAuthContext(req);


    const body = await req.json();
    const { newId, projectId, status, amount, notes } = body;

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
        ...(newId ? { id: newId } : {}),
        ...(projectId !== undefined ? { projectId: projectId || null } : {}),
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
      entityId: updated.id,
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
