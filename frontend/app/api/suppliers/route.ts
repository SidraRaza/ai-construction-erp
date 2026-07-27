import { NextResponse } from "next/server";
import { createSupplierSchema } from "@/validations/supplier.validation";
import { SupplierService } from "@/services/supplier.service";
import { ApiResponse } from "@/types/api";
import { Role } from "@/lib/rbac";

export async function GET(req: Request) {
  try {
    const companyId = req.headers.get("x-company-id") || "cl_default_company";
    const suppliers = await SupplierService.getSuppliers(companyId);

    return NextResponse.json<ApiResponse<typeof suppliers>>({
      success: true,
      data: suppliers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch suppliers";
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
    const validated = createSupplierSchema.parse(body);

    const supplier = await SupplierService.createSupplier(companyId, userId, userRole, validated);

    return NextResponse.json<ApiResponse<typeof supplier>>(
      { success: true, data: supplier },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create supplier";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "CREATE_FAILED", message } },
      { status: 400 }
    );
  }
}
