import { NextResponse } from "next/server";
import { loginSchema } from "@/validations/auth.validation";
import { AuthService } from "@/services/auth.service";
import { ApiResponse } from "@/types/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const user = await AuthService.validateCredentials(validated);

    return NextResponse.json<ApiResponse<typeof user>>(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: "UNAUTHENTICATED",
          message,
        },
      },
      { status: 401 }
    );
  }
}
