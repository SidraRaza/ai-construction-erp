import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ActivityLogService } from "@/services/activity-log.service";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const companyId = req.headers.get("x-company-id") || "cl_default_company";

    if (!userId) {
      // Return default company/user if no header
      const user = await db.user.findFirst({
        where: { companyId },
        include: { company: true },
      });
      return NextResponse.json({ success: true, data: user });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, phone, companyName, country, taxNumber, address } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: { message: "User ID is required to update profile" } },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: { message: "User profile not found in database" } },
        { status: 404 }
      );
    }

    // Update User Record
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: name || existingUser.name,
        phone: phone !== undefined ? phone : existingUser.phone,
      },
    });

    // Update Company Record if provided
    let updatedCompany = existingUser.company;
    if (existingUser.companyId && (companyName || country || taxNumber !== undefined || address !== undefined)) {
      updatedCompany = await db.company.update({
        where: { id: existingUser.companyId },
        data: {
          name: companyName || existingUser.company.name,
          country: country || existingUser.company.country,
          taxNumber: taxNumber !== undefined ? taxNumber : existingUser.company.taxNumber,
          address: address !== undefined ? address : existingUser.company.address,
        },
      });
    }

    await ActivityLogService.log({
      companyId: existingUser.companyId,
      userId,
      action: "UPDATE_USER_PROFILE",
      entityType: "User",
      entityId: userId,
      meta: { name: updatedUser.name, companyName: updatedCompany.name, country: updatedCompany.country },
    });

    return NextResponse.json({
      success: true,
      data: {
        user: updatedUser,
        company: updatedCompany,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
