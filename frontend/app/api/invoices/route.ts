import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const { companyId } = getAuthContext(req);

    const invoices = await db.invoice.findMany({
      where: { companyId },
      include: {
        project: true,
        quotation: true,
      },
      orderBy: { createdAt: "desc" },
    });


    return NextResponse.json({
      success: true,
      data: invoices,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
