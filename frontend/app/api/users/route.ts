import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ActivityLogService } from "@/services/activity-log.service";
import { getAuthContext } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const { companyId } = getAuthContext(req);

    const users = await db.user.findMany({
      where: { companyId },
      select: {
        id: true,
        companyId: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        avatarUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { companyId, userId } = getAuthContext(req);
    const body = await req.json();
    const { name, email, phone, role } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: { message: "Name and email are required" } },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await db.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existing) {
      if (existing.companyId === companyId) {
        const { passwordHash: _, ...safeUser } = existing;
        return NextResponse.json({
          success: true,
          data: safeUser,
          message: "User profile already registered in your company",
        });
      } else {
        return NextResponse.json(
          { success: false, error: { message: "A user with this email address is already registered in another account." } },
          { status: 409 }
        );
      }
    }

    const newUser = await db.user.create({
      data: {
        companyId,
        name,
        email: trimmedEmail,
        phone: phone || null,
        role: role || "CLIENT",
        status: "ACTIVE",
      },
      select: {
        id: true,
        companyId: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    await ActivityLogService.log({
      companyId,
      userId: userId || newUser.id,
      action: "REGISTER_USER",
      entityType: "User",
      entityId: newUser.id,
      meta: { name, email: trimmedEmail, role: newUser.role },
    });

    return NextResponse.json({
      success: true,
      data: newUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

