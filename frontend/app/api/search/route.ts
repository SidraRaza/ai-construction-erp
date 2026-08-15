import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-helpers";
import { ApiResponse } from "@/types/api";

export async function GET(req: Request) {
  try {
    const { companyId } = getAuthContext(req);
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";


    if (!query || query.trim().length < 2) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: { projects: [], clients: [], materials: [], invoices: [] },
      });
    }

    const q = query.trim();

    const [projects, clients, materials, invoices] = await Promise.all([
      db.project.findMany({
        where: {
          companyId,
          name: { contains: q },
        },
        take: 5,
      }),
      db.client.findMany({
        where: {
          companyId,
          name: { contains: q },
        },
        take: 5,
      }),
      db.material.findMany({
        where: {
          companyId,
          name: { contains: q },
        },
        take: 5,
      }),
      db.invoice.findMany({
        where: {
          companyId,
          id: { contains: q },
        },
        take: 5,
      }),
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        projects,
        clients,
        materials,
        invoices,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { code: "SEARCH_FAILED", message } },
      { status: 500 }
    );
  }
}
