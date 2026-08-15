import { NextResponse } from "next/server";
import { createExpenseSchema } from "@/validations/expense.validation";
import { ExpenseService } from "@/services/expense.service";
import { getAuthContext } from "@/lib/auth-helpers";
import { ApiResponse } from "@/types/api";

export async function GET(req: Request) {
  try {
    const { companyId } = getAuthContext(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const category = searchParams.get("category") || undefined;

    const expenses = await ExpenseService.getExpenses(companyId, projectId, category);

    return NextResponse.json<ApiResponse<typeof expenses>>({
      success: true,
      data: expenses,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch expenses";
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
    const validated = createExpenseSchema.parse(body);

    const expense = await ExpenseService.createExpense(companyId, userId, userRole, validated);


    return NextResponse.json<ApiResponse<typeof expense>>(
      { success: true, data: expense },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to record expense";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "RECORD_FAILED", message } },
      { status: 400 }
    );
  }
}
