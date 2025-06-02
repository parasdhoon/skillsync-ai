"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function PromptPage({ chatId }: { chatId: string }) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [chatReady, setChatReady] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [matchData, setMatchData] = useState<any>(null);
  const router = useRouter();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChatStatus = async () => {
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
      if (data.resumeText && data.jdText) {
        setChatReady(true);
        setMatchData({
          matchScore: data.matchScore,
          strengths: data.strengths,
          suggestions: data.suggestions,
        });
        const normalized = (data.messages || []).map((m: any) => ({
          role: m.role,
          content: m.content,
        }));
        setChatHistory(normalized);
      } else {
        setChatReady(false);
        setMatchData(null);
        setChatHistory([]);
      }
    };
    fetchChatStatus();
  }, [chatId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "resume" | "jd") => {
    const file = e.target.files?.[0] || null;
    type === "resume" ? setResumeFile(file) : setJdFile(file);
  };

  const handleSubmit = async () => {
    if (!resumeFile || !jdFile) return alert("Please upload both files.");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jd", jdFile);
    formData.append("chatId", chatId);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("skillsync-result", JSON.stringify(data));
        console.log("Upload successful:", data);
        setMatchData({
          matchScore: data.matchScore,
          strengths: data.strengths,
          suggestions: data.suggestions,
        });
        setChatReady(true);
        setChatHistory([]);
      } else {
        alert(data.error || "Failed to parse PDF");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong during upload.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setChatHistory((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({ chatId, message: input }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    setIsThinking(false);

    if (response.ok) {
      setChatHistory((prev) => [...prev, { role: "ai", content: data.reply }]);
    } else {
      alert(data.error || "Failed to generate response");
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory]);

  if (!chatReady) {
    return (
      <div className="rounded-2xl shadow-xl border border-indigo-100 space-y-8 max-w-3xl w-full mx-auto bg-white p-10">
        <h2 className="text-2xl font-bold text-indigo-700 text-left font-orbitron">
          Start a New Resume Match
        </h2>
        <div className="space-y-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Resume (PDF)</label>
            <label className="w-full cursor-pointer rounded-xl border-2 border-dashed border-indigo-300 bg-white py-4 px-6 text-center text-indigo-600 font-semibold shadow-sm hover:bg-indigo-50 transition">
              {resumeFile ? resumeFile.name : "Click to upload resume"}
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, "resume")}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Job Description (PDF or TXT)</label>
            <label className="w-full cursor-pointer rounded-xl border-2 border-dashed border-indigo-300 bg-white py-4 px-6 text-center text-indigo-600 font-semibold shadow-sm hover:bg-indigo-50 transition">
              {jdFile ? jdFile.name : "Click to upload JD"}
              <input
                type="file"
                accept="application/pdf,text/plain"
                onChange={(e) => handleFileChange(e, "jd")}
                className="hidden"
              />
            </label>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-indigo-400"
          >
            {isLoading ? "Processing..." : "🚀 Upload & Analyze"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full max-w-5xl mx-auto mt-6 flex flex-col gap-4">
      {matchData && (
        <div className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-bold text-indigo-700 mb-4">📊 Match Report</h3>
          <p className="text-sm mb-2"><strong>Match Score:</strong> {matchData.matchScore}</p>
          <div className="text-left mb-2">
            <p className="text-sm font-semibold text-indigo-600">Strengths:</p>
            <ol className="list-decimal list-inside text-sm text-gray-800">
              {matchData.strengths.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-indigo-600">Suggestions:</p>
            <ol className="list-decimal list-inside text-sm text-gray-800">
              {matchData.suggestions.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
      <div
        ref={chatRef}
        className="rounded-2xl shadow-xl border border-indigo-200 p-6 bg-white h-[500px] overflow-y-auto space-y-3"
      >
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs sm:max-w-sm md:max-w-md p-3 rounded-lg text-sm whitespace-pre-wrap shadow-md
                ${msg.role === "user" ? "bg-indigo-500 text-white" : msg.role === "ai" ? "bg-gray-100 text-black" : "bg-yellow-100 text-gray-600 italic"}`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="max-w-xs sm:max-w-sm md:max-w-md p-3 rounded-lg text-sm whitespace-pre-wrap shadow-md bg-gray-100 text-gray-500 italic">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}