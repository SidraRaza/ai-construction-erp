import { NextResponse } from "next/server";
import { createMaterialSchema } from "@/validations/material.validation";
import { MaterialService } from "@/services/material.service";
import { ApiResponse } from "@/types/api";
import { Role } from "@/lib/rbac";

export async function GET(req: Request) {
  try {
    const companyId = req.headers.get("x-company-id") || "cl_default_company";
    const materials = await MaterialService.getMaterials(companyId);

    return NextResponse.json<ApiResponse<typeof materials>>({
      success: true,
      data: materials,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch materials";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "FETCH_FAILED", message } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const companyId = req.headers.get("x-company-id") || "cl_default_company";
    const userId = req.headers.get("x-user-id") || "cl_default_user";
    const userRole = (req.headers.get("x-user-role") as Role) || "ADMIN";

    const body = await req.json();
    const validated = createMaterialSchema.parse(body);

    const material = await MaterialService.createMaterial(companyId, userId, userRole, validated);

    return NextResponse.json<ApiResponse<typeof material>>(
      { success: true, data: material },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create material";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "CREATE_FAILED", message } },
      { status: 400 }
    );
  }
}
