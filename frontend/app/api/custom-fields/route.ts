import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const companyId = req.headers.get("x-company-id") || "cl_default_company";

    const customFields = await db.customField.findMany({
      where: { companyId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: customFields,
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
    const companyId = req.headers.get("x-company-id") || "cl_default_company";
    const body = await req.json();
    const { fieldName, fieldType, options, isRequired } = body;

    if (!fieldName || !fieldType) {
      return NextResponse.json(
        { success: false, error: { message: "Field Name and Field Type are required" } },
        { status: 400 }
      );
    }

    const created = await db.customField.create({
      data: {
        companyId,
        fieldName,
        fieldType, // TEXT | NUMBER | DATE | SELECT | CHECKBOX
        options: options ? JSON.stringify(options) : null,
        isRequired: Boolean(isRequired),
      },
    });

    return NextResponse.json({
      success: true,
      data: created,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const companyId = req.headers.get("x-company-id") || "cl_default_company";
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: { message: "Field ID required" } },
        { status: 400 }
      );
    }

    await db.customField.deleteMany({
      where: { id, companyId },
    });

    return NextResponse.json({ success: true, message: "Field deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
