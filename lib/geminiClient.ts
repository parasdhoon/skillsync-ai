import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function getGeminiInsights(resumeText: string, jdText: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  You are a resume reviewer. Compare the following resume and job description.

  Return a JSON object in this exact format:
  {
    "matchScore": number (0 to 100),
    "strengths": string[] (3 bullet points),
    "suggestions": string[] (3 or more bullet points)
  }

  Resume:
  ${resumeText}

  Job Description:
  ${jdText}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return text;
}

export async function getFollowupReply(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text.trim();
  } catch (err) {
    console.error("Gemini follow-up reply error:", err);
    return "Sorry, I couldn’t generate a response at the moment.";
  }
}