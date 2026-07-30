import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const companies = await db.company.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        projects: {
          select: {
            id: true,
            name: true,
            budget: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const allUsers = await db.user.findMany({
      include: {
        company: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const usersToday = allUsers.filter(
      (u) => new Date(u.createdAt).toISOString().split("T")[0] === todayStr
    ).length;

    const usersThisMonth = allUsers.filter((u) => {
      const d = new Date(u.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    // Format Users with Time, Day, Month, Year
    const formattedUserLedger = allUsers.map((u) => {
      const d = new Date(u.createdAt);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || "N/A",
        role: u.role,
        status: u.status,
        companyName: u.company?.name || "Independent",
        country: u.company?.country || "Pakistan",
        rawDate: u.createdAt,
        formattedTime: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        dayOfWeek: d.toLocaleDateString("en-US", { weekday: "long" }),
        monthName: d.toLocaleDateString("en-US", { month: "long" }),
        year: d.getFullYear(),
        formattedFullDate: d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      };
    });

    const totalProjects = await db.project.count();
    const totalQuotations = await db.quotation.count();
    const totalInvoices = await db.invoice.count();

    return NextResponse.json({
      success: true,
      data: {
        companies,
        userLedger: formattedUserLedger,
        platformMetrics: {
          totalTenantAccounts: companies.length,
          totalRegisteredUsers: allUsers.length,
          usersRegisteredToday: usersToday,
          usersRegisteredThisMonth: usersThisMonth,
          totalActiveProjects: totalProjects,
          totalQuotations,
          totalInvoices,
          dataIsolation: "100% Strictly Isolated Tenant Databases",
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
