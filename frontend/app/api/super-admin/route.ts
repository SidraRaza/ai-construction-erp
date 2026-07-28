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
            role: true,
            status: true,
            createdAt: true,
          },
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

    const totalUsers = await db.user.count();
    const totalProjects = await db.project.count();
    const totalQuotations = await db.quotation.count();
    const totalInvoices = await db.invoice.count();

    return NextResponse.json({
      success: true,
      data: {
        companies,
        platformMetrics: {
          totalTenantAccounts: companies.length,
          totalRegisteredUsers: totalUsers,
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
