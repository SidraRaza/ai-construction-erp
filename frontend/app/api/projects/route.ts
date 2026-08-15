import { NextResponse } from "next/server";
import { createProjectSchema } from "@/validations/project.validation";
import { ProjectService } from "@/services/project.service";
import { getAuthContext } from "@/lib/auth-helpers";
import { ApiResponse } from "@/types/api";

export async function GET(req: Request) {
  try {
    const { companyId, userId, userRole } = getAuthContext(req);

    const projects = await ProjectService.getProjects(companyId, userId, userRole);

    return NextResponse.json<ApiResponse<typeof projects>>({
      success: true,
      data: projects,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch projects";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "FETCH_FAILED", message } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { companyId, userId, userRole } = getAuthContext(req);

    const body = await req.json();
    const validated = createProjectSchema.parse(body);

    const project = await ProjectService.createProject(companyId, userId, userRole, validated);


    return NextResponse.json<ApiResponse<typeof project>>(
      { success: true, data: project },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "CREATE_FAILED", message } },
      { status: 400 }
    );
  }
}
