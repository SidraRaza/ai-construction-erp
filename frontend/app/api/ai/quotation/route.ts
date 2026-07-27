import { NextResponse } from "next/server";
import { AIService } from "@/services/ai.service";
import { ApiResponse } from "@/types/api";
import { Role } from "@/lib/rbac";
import { z } from "zod";

const aiQuotationSchema = z.object({
  clientId: z.string().min(1, "Client ID required"),
  description: z.string().min(3, "Scope description required"),
  projectId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const companyId = req.headers.get("x-company-id") || "cl_default_company";
    const userId = req.headers.get("x-user-id") || "cl_default_user";
    const userRole = (req.headers.get("x-user-role") as Role) || "ADMIN";

    const body = await req.json();
    const { clientId, description, projectId } = aiQuotationSchema.parse(body);

    const draftQuotation = await AIService.generateDraftQuotation(
      companyId,
      userId,
      userRole,
      clientId,
      description,
      projectId
    );

    return NextResponse.json<ApiResponse<typeof draftQuotation>>(
      { success: true, data: draftQuotation },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI quotation draft generation failed";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "AI_QUOTATION_FAILED", message } },
      { status: 400 }
    );
  }
}
