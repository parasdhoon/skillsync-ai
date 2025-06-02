import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Chat from "@/models/chat";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;

  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deleted = await Chat.findOneAndDelete({ _id: id, user: session.user.id });

    if (!deleted) {
      return NextResponse.json({ error: "Chat not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Failed to delete chat" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  context : { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = await context.params;
    const chat = await Chat.findOne({ _id: params.id, user: session.user.id });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: chat._id.toString(),
      title: chat.chatTitle,
      resumeText: chat.resumeText,
      jdText: chat.jdText,
      matchScore: chat.matchScore,
      strengths: chat.strengths,
      suggestions: chat.suggestions,
      messages: chat.messages,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    });
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}