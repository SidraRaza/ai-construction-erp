import { NextResponse } from "next/server";
import { assignTeamMemberSchema } from "@/validations/project.validation";
import { ProjectService } from "@/services/project.service";
import { getAuthContext } from "@/lib/auth-helpers";
import { ApiResponse } from "@/types/api";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { companyId, userId, userRole } = getAuthContext(req);

    const body = await req.json();
    const validated = assignTeamMemberSchema.parse(body);


    const teamMember = await ProjectService.assignTeamMember(
      companyId,
      userId,
      userRole,
      projectId,
      validated
    );

    return NextResponse.json<ApiResponse<typeof teamMember>>(
      { success: true, data: teamMember },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to assign team member";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "ASSIGN_FAILED", message } },
      { status: 400 }
    );
  }
}
