import { NextResponse } from "next/server";
import { createSupplierSchema } from "@/validations/supplier.validation";
import { SupplierService } from "@/services/supplier.service";
import { getAuthContext } from "@/lib/auth-helpers";
import { ApiResponse } from "@/types/api";

export async function GET(req: Request) {
  try {
    const { companyId } = getAuthContext(req);
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
    const { companyId, userId, userRole } = getAuthContext(req);

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
