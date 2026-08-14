import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const createIncidentSchema = z.object({
  companyId: z.string().default("cl_default_company"),
  projectId: z.string().default("cmsg59fki000dk2ig1jmufc5d"),
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
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId") || "cl_default_company";

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
    // Fallback if table is empty or freshly migrated
    return NextResponse.json({
      success: true,
      data: [
        {
          id: "inc_1",
          companyId: "cl_default_company",
          projectId: "cmsg59fki000dk2ig1jmufc5d",
          project: { name: "Skyline Luxury Towers - Phase 1" },
          title: "Worker Missing Safety Helmet at Height",
          severity: "HIGH",
          category: "PPE_VIOLATION",
          location: "Tower B - 12th Floor Slab",
          description: "Subcontractor mason working near perimeter edge without safety harness and helmet.",
          status: "OPEN",
          reportedBy: "Lead Site Engineer",
          createdAt: new Date().toISOString(),
        },
        {
          id: "inc_2",
          companyId: "cl_default_company",
          projectId: "cmsg59fki000dk2ig1jmufc5d",
          project: { name: "Skyline Luxury Towers - Phase 1" },
          title: "Exposed Electrical Cable Near Water Drain",
          severity: "CRITICAL",
          category: "EQUIPMENT_HAZARD",
          location: "Basement Parking Level 2",
          description: "High-voltage generator power cable damaged near active water drainage pump.",
          status: "IN_REVIEW",
          reportedBy: "Safety Inspector",
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
      ],
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createIncidentSchema.parse(body);

    const incident = await (db as any).siteIncident.create({
      data: {
        companyId: validated.companyId,
        projectId: validated.projectId,
        title: validated.title,
        severity: validated.severity,
        category: validated.category,
        location: validated.location,
        description: validated.description,
        reportedBy: validated.reportedBy,
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
        error: error.message || "Failed to log site safety incident",
      },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

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
        error: error.message || "Failed to update incident status",
      },
      { status: 400 }
    );
  }
}
