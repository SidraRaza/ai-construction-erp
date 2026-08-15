import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ActivityLogService } from "@/services/activity-log.service";
import { getAuthContext } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const { companyId, userId } = getAuthContext(req);

    const user = await db.user.findFirst({
      where: {
        ...(userId && userId !== "cl_default_user" ? { id: userId } : {}),
        companyId,
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
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            address: true,
            country: true,
            taxNumber: true,
            subscriptionPlan: true,
            status: true,
          },
        },
      },
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
    const { companyId, userId: sessionUserId } = getAuthContext(req);
    const body = await req.json();
    const { userId, name, phone, companyName, country, taxNumber, address } = body;

    const targetUserId = userId || sessionUserId;

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: { message: "User ID is required to update profile" } },
        { status: 400 }
      );
    }

    // Verify user strictly exists in requester's company scope
    const existingUser = await db.user.findFirst({
      where: { id: targetUserId, companyId },
      include: { company: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: { message: "User profile not found in your company" } },
        { status: 404 }
      );
    }

    // Update User Record
    const updatedUser = await db.user.update({
      where: { id: targetUserId },
      data: {
        name: name || existingUser.name,
        phone: phone !== undefined ? phone : existingUser.phone,
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
      userId: targetUserId,
      action: "UPDATE_USER_PROFILE",
      entityType: "User",
      entityId: targetUserId,
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

