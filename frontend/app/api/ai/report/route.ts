import { NextResponse } from "next/server";
import { AIService } from "@/services/ai.service";
import { getAuthContext } from "@/lib/auth-helpers";
import { ApiResponse } from "@/types/api";
import { z } from "zod";

const reportSchema = z.object({
  projectId: z.string().min(1, "Project ID required"),
  rawInput: z.string().min(3, "Field report input required"),
});

export async function POST(req: Request) {
  try {
    const { companyId, userId } = getAuthContext(req);
    const body = await req.json();
    const { projectId, rawInput } = reportSchema.parse(body);

    const report = await AIService.generateDailyReport(companyId, projectId, userId, rawInput);

    return NextResponse.json<ApiResponse<typeof report>>(
      { success: true, data: report },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI report generation failed";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "AI_REPORT_FAILED", message } },
      { status: 400 }
    );
  }
}

