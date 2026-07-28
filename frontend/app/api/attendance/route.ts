import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const { companyId } = getAuthContext(req);

    // Fetch live users registered for this company
    const users = await db.user.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });

    // Fetch today's attendance records
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecords = await db.attendance.findMany({
      where: {
        date: {
          gte: today,
        },
      },
    });

    // Map users to attendance status
    const roster = users.map((u) => {
      const att = attendanceRecords.find((a) => a.workerId === u.id);
      return {
        id: u.id,
        name: u.name,
        trade: u.role || "Workforce",
        site: "Skyline Towers Phase 1",
        method: "QR",
        status: att ? att.status : "PRESENT",
      };
    });

    return NextResponse.json({
      success: true,
      data: roster,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
