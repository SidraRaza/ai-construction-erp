import { NextResponse } from "next/server";
import { createMaterialSchema } from "@/validations/material.validation";
import { MaterialService } from "@/services/material.service";
import { getAuthContext } from "@/lib/auth-helpers";
import { ApiResponse } from "@/types/api";

export async function GET(req: Request) {
  try {
    const { companyId } = getAuthContext(req);
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
    const { companyId, userId, userRole } = getAuthContext(req);

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
