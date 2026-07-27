import { NextResponse } from "next/server";
import { AIService } from "@/services/ai.service";
import { ApiResponse } from "@/types/api";
import { z } from "zod";

const estimateSchema = z.object({
  description: z.string().min(3, "Project description required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description } = estimateSchema.parse(body);

    const estimate = await AIService.estimateProjectCost(description);

    return NextResponse.json<ApiResponse<typeof estimate>>(
      { success: true, data: estimate },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI cost estimation failed";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "AI_ESTIMATE_FAILED", message } },
      { status: 400 }
    );
  }
}
