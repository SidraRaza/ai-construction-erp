import { NextResponse } from "next/server";
import { AIService } from "@/services/ai.service";
import { getAuthContext } from "@/lib/auth-helpers";
import { ApiResponse } from "@/types/api";
import { z } from "zod";

const chatSchema = z.object({
  projectId: z.string().min(1, "Project ID required"),
  question: z.string().min(1, "Question required"),
});

export async function POST(req: Request) {
  try {
    const { companyId } = getAuthContext(req);
    const body = await req.json();
    const { projectId, question } = chatSchema.parse(body);

    const chatResponse = await AIService.chatAssistant(companyId, projectId, question);


    return NextResponse.json<ApiResponse<typeof chatResponse>>(
      { success: true, data: chatResponse },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI chat response failed";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "AI_CHAT_FAILED", message } },
      { status: 400 }
    );
  }
}
