import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const { companyId } = getAuthContext(req);

    const entries = await db.customFieldEntry.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });

    const parsedEntries = entries.map((e) => ({
      ...e,
      fieldValues: e.fieldValues ? JSON.parse(e.fieldValues) : {},
    }));

    return NextResponse.json({
      success: true,
      data: parsedEntries,
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
    const { companyId } = getAuthContext(req);
    const body = await req.json();
    const { recordTitle, fieldValues } = body;


    if (!recordTitle || !fieldValues) {
      return NextResponse.json(
        { success: false, error: { message: "Record Title and Field Values are required" } },
        { status: 400 }
      );
    }

    const created = await db.customFieldEntry.create({
      data: {
        companyId,
        recordTitle,
        fieldValues: JSON.stringify(fieldValues),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...created,
        fieldValues,
      },
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
