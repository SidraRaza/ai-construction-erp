import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const feedbacks = await prisma.userFeedback.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: feedbacks,
    });
  } catch (error: any) {
    console.error("GET /api/feedback error:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to fetch user feedbacks" } },
      { status: 500 }
    );
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

    const newFeedback = await prisma.userFeedback.create({
      data: {
        category: category || "FEATURE",
        email: email ? email.trim() : null,
        message: message.trim(),
        status: "UNREAD",
      },
    });

    return NextResponse.json({
      success: true,
      data: newFeedback,
    });
  } catch (error: any) {
    console.error("POST /api/feedback error:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to submit user feedback" } },
      { status: 500 }
    );
  }
}
