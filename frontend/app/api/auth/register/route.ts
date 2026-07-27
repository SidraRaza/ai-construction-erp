import { NextResponse } from "next/server";
import { registerSchema } from "@/validations/auth.validation";
import { AuthService } from "@/services/auth.service";
import { ApiResponse } from "@/types/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const result = await AuthService.registerCompanyAndAdmin(validated);

    return NextResponse.json<ApiResponse<typeof result>>(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: "REGISTRATION_FAILED",
          message,
        },
      },
      { status: 400 }
    );
  }
}
