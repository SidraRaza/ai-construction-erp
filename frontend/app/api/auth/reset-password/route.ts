import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { ActivityLogService } from "@/services/activity-log.service";

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

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: { message: "New password must be at least 6 characters long." } },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if user exists in DB
    const user = await db.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (user) {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await db.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });

      await ActivityLogService.log({
        companyId: user.companyId,
        userId: user.id,
        action: "PASSWORD_RESET",
        entityType: "User",
        entityId: user.id,
        meta: { email: trimmedEmail, timestamp: new Date().toISOString() },
      });
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
