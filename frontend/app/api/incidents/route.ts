import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-helpers";
import { z } from "zod";

const createIncidentSchema = z.object({
  projectId: z.string().min(1, "Project ID required"),
  title: z.string().min(3, "Incident title must be at least 3 characters"),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  category: z.enum(["PPE_VIOLATION", "EQUIPMENT_HAZARD", "STRUCTURAL_RISK", "NEAR_MISS", "ACCIDENT"]).default("PPE_VIOLATION"),
  location: z.string().min(2, "Location is required"),
  description: z.string().min(5, "Description is required"),
  reportedBy: z.string().default("Site Engineer"),
  photoUrl: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { companyId } = getAuthContext(req);

    const incidents = await (db as any).siteIncident.findMany({
      where: { companyId },
      include: {
        project: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: incidents,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to fetch incidents" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { companyId, userId } = getAuthContext(req);
    const body = await req.json();
    const validated = createIncidentSchema.parse(body);

    const incident = await (db as any).siteIncident.create({
      data: {
        companyId,
        projectId: validated.projectId,
        title: validated.title,
        severity: validated.severity,
        category: validated.category,
        location: validated.location,
        description: validated.description,
        reportedBy: validated.reportedBy || userId,
        photoUrl: validated.photoUrl || null,
        status: "OPEN",
      },
    });

    return NextResponse.json({
      success: true,
      data: incident,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { message: error.message || "Failed to log site safety incident" },
      },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { companyId } = getAuthContext(req);
    const body = await req.json();
    const { id, status } = body;

    const existing = await (db as any).siteIncident.findFirst({
      where: { id, companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { message: "Incident record not found in your company" } },
        { status: 404 }
      );
    }

    const updated = await (db as any).siteIncident.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { message: error.message || "Failed to update incident status" },
      },
      { status: 400 }
    );
  }
}

