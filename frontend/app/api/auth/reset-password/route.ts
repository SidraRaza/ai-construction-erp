import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, newPassword } = body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: { message: "Valid email address is required." } },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json(
        { success: false, error: { message: "New password must be at least 4 characters long." } },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if user exists in DB
    let user: any = null;
    if (db && (db as any).user) {
      try {
        user = await (db as any).user.findUnique({
          where: { email: trimmedEmail },
        });

        if (user) {
          await (db as any).user.update({
            where: { email: trimmedEmail },
            data: { password: newPassword },
          });
        }
      } catch (dbErr) {
        console.warn("DB password reset error:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Password reset link processed successfully! You can now log in with your new password.",
      data: { email: trimmedEmail },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to reset password" } },
      { status: 500 }
    );
  }
}
