import { NextResponse } from "next/server";
import { ContractService } from "@/services/contract.service";
import { ApiResponse } from "@/types/api";
import { Role } from "@/lib/rbac";
import { z } from "zod";

const contractSchema = z.object({
  projectId: z.string().min(1, "Project ID required"),
  subcontractorName: z.string().min(2, "Subcontractor name required"),
  tradeScope: z.string().min(2, "Trade scope required"),
  contractValue: z.number().positive("Contract value must be positive"),
});

export async function GET(req: Request) {
  try {
    const companyId = req.headers.get("x-company-id") || "cl_default_company";
    const contracts = await ContractService.getContracts(companyId);

    return NextResponse.json<ApiResponse<typeof contracts>>({
      success: true,
      data: contracts,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch contracts";
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
    const validated = contractSchema.parse(body);

    const contract = await ContractService.createContract(companyId, userId, userRole, validated);

    return NextResponse.json<ApiResponse<typeof contract>>(
      { success: true, data: contract },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create contract";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "CREATE_FAILED", message } },
      { status: 400 }
    );
  }
}
