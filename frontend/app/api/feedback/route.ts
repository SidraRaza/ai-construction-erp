import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    if (!db || !(db as any).userFeedback) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const feedbacks = await (db as any).userFeedback.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: feedbacks,
    });
  } catch (error: any) {
    console.error("GET /api/feedback error:", error);
    return NextResponse.json({
      success: true,
      data: [],
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, email, message } = body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { success: false, error: { message: "Feedback message is required." } },
        { status: 400 }
      );
    }

    let newFeedback: any = {
      id: "fb_" + Date.now(),
      category: category || "FEATURE",
      email: email ? email.trim() : null,
      message: message.trim(),
      status: "UNREAD",
      createdAt: new Date(),
    };

    if (db && (db as any).userFeedback) {
      try {
        newFeedback = await (db as any).userFeedback.create({
          data: {
            category: category || "FEATURE",
            email: email ? email.trim() : null,
            message: message.trim(),
            status: "UNREAD",
          },
        });
      } catch (dbErr) {
        console.error("DB UserFeedback save error:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: newFeedback,
    });
  } catch (error: any) {
    console.error("POST /api/feedback error:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to submit feedback" } },
      { status: 400 }
    );
  }
}
