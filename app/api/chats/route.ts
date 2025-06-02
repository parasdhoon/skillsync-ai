import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Chat from "@/models/chat";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chats = await Chat.find({ user: session.user.id }).sort({ updatedAt: -1 });
  const response = chats.map((chat: any) => ({
    id: chat._id.toString(),
    title: chat.title || "Untitled Chat",
  }));

  return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chat = await Chat.create({
    user: session.user.id,
    chatTitle: "New Match",
    resumeText: "",
    jdText: "",
    matchScore: null,
    strengths: [],
    suggestions: [],
  });

  return NextResponse.json({ id: chat._id.toString(), title: chat.title });
}
