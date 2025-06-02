import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { extractTextFromPdf } from '@/lib/pdfParser';
import { getGeminiInsights, getFollowupReply } from '@/lib/geminiClient';
import Chat from '@/models/chat';

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const chatId = formData.get("chatId")?.toString();
      const resumeFile = formData.get("resume") as File | null;
      const jdFile = formData.get("jd") as File | null;

      if (!chatId || !resumeFile || !jdFile) {
        return NextResponse.json({ error: "chatId, resume, and JD files are required." }, { status: 400 });
      }

      const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer());
      const jdBuffer = Buffer.from(await jdFile.arrayBuffer());

      const resumeText = await extractTextFromPdf(resumeBuffer);
      const jdText = await extractTextFromPdf(jdBuffer);

      const jobTitleMatch = jdText.match(/(?:Position|Title|Role):?\s*(.+)/i);
      const candidateMatch = resumeText.match(/(?:Name|Candidate|Profile):?\s*(.+)/i);

      const jobTitle = jobTitleMatch?.[1]?.split('\n')[0]?.trim() || "Job";
      const candidate = candidateMatch?.[1]?.split('\n')[0]?.trim() || "Candidate";

      const chatTitle = `Match: ${jobTitle} - ${candidate}`;


      const insights = await getGeminiInsights(resumeText, jdText);
      const parsed = parseGeminiResponse(insights);

      await Chat.findByIdAndUpdate(
        chatId,
        {
          resumeText,
          jdText,
          matchScore: parsed.matchScore,
          strengths: parsed.strengths,
          suggestions: parsed.suggestions,
          chatTitle,
        },
        { new: true }
      );

      return NextResponse.json(parsed);
    }

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { chatId, message } = body;

      if (!chatId || !message) {
        return NextResponse.json({ error: "chatId and message are required." }, { status: 400 });
      }

      const chat = await Chat.findById(chatId);
      if (!chat || !chat.resumeText || !chat.jdText) {
        return NextResponse.json({ error: "Invalid chat or missing resume/JD." }, { status: 400 });
      }

      const prompt = `
You are an AI career assistant. The user uploaded this resume and JD:
Resume: ${chat.resumeText}
JD: ${chat.jdText}
User Question: ${message}
Please give a helpful, concise reply.
      `.trim();

      const reply = await getFollowupReply(prompt);

      await Chat.findByIdAndUpdate(chatId, {
        $push: {
          messages: {
            $each: [
              { role: "user", content: message },
              { role: "ai", content: reply },
            ],
          },
        },
      });

      return NextResponse.json({ reply });
    }

    return NextResponse.json({ error: "Unsupported content type." }, { status: 415 });
  } catch (err) {
    console.error("Upload API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
};

function parseGeminiResponse(raw: string) {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
  }
  return JSON.parse(cleaned);
}
