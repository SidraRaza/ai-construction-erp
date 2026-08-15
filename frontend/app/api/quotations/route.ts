import { NextResponse } from "next/server";
import { createQuotationSchema } from "@/validations/financials.validation";
import { FinancialsService } from "@/services/financials.service";
import { getAuthContext } from "@/lib/auth-helpers";
import { ApiResponse } from "@/types/api";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { companyId } = getAuthContext(req);

    const quotations = await db.quotation.findMany({
      where: { companyId },
      include: {
        project: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: quotations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { companyId, userId, userRole } = getAuthContext(req);

    const body = await req.json();
    const validated = createQuotationSchema.parse(body);

    const quotation = await FinancialsService.createQuotation(companyId, userId, userRole, validated);


    return NextResponse.json<ApiResponse<typeof quotation>>(
      { success: true, data: quotation },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create quotation";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "CREATE_QUOTATION_FAILED", message } },
      { status: 400 }
    );
  }
}
