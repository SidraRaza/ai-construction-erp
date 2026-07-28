import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const { companyId } = getAuthContext(req);

    // Fetch users for the company
    const users = await db.user.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
      },
    });

    // Fetch today's attendance logs
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecords = await db.attendance.findMany({
      where: {
        date: today,
      },
      orderBy: { createdAt: "desc" },
    });

    // Map users to attendance status
    const roster = users.map((u) => {
      const att = attendanceRecords.find((a) => a.userId === u.id);
      return {
        id: u.id,
        name: u.name,
        role: u.role,
        site: "Skyline Towers Site",
        status: att?.status || "ABSENT",
        method: att?.method || "MANUAL",
      };
    });

    return NextResponse.json({
      success: true,
      data: roster.length > 0 ? roster : [
        { id: "usr_admin", name: "Sarah Admin", role: "ADMIN", site: "Main Office Site", status: "PRESENT", method: "QR" },
        { id: "usr_eng", name: "Ahmed Engineer", role: "ENGINEER", site: "Skyline Towers Site", status: "PRESENT", method: "QR" },
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
