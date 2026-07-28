import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ActivityLogService } from "@/services/activity-log.service";

export async function GET(req: NextRequest) {
  try {
    const companyId = req.headers.get("x-company-id") || "cl_default_company";

    const users = await db.user.findMany({
      where: { companyId },
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
    const companyId = req.headers.get("x-company-id") || "cl_default_company";
    const body = await req.json();
    const { name, email, phone, role } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: { message: "Name and email are required" } },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await db.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        data: existing,
        message: "User profile already registered",
      });
    }

    const newUser = await db.user.create({
      data: {
        companyId,
        name,
        email,
        phone: phone || null,
        role: role || "CLIENT",
        status: "ACTIVE",
      },
    });

    await ActivityLogService.log({
      companyId,
      userId: newUser.id,
      action: "REGISTER_USER",
      entityType: "User",
      entityId: newUser.id,
      meta: { name, email, role: newUser.role },
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
