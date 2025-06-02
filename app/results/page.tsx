"use client";

import { useEffect, useState } from "react";

export default function ResultsPage() {
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    try {
      const result = localStorage.getItem("skillsync-result");
      if (result) {
        const parsed = JSON.parse(result);

        if (
          typeof parsed.matchScore === "number" &&
          Array.isArray(parsed.strengths) &&
          Array.isArray(parsed.suggestions)
        ) {
          setMatchScore(parsed.matchScore);
          setStrengths(parsed.strengths);
          setSuggestions(parsed.suggestions);
        } else {
          console.warn("Invalid data structure in localStorage:", parsed);
        }

        console.log("Parsed skillsync-result:", parsed);
        console.log("Parsed keys:", Object.keys(parsed));
        console.log("Match Score:", parsed.matchScore);
        console.log("Strengths:", parsed.strengths);
        console.log("Suggestions:", parsed.suggestions);
      }
    } catch (error) {
      console.error("Error parsing skillsync-result:", error);
    }
  }, []);


  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8 space-y-8 mt-10">
      <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Your Match Report</h2>

      {matchScore !== null && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-indigo-600">Match Score</h3>
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div
              className="bg-indigo-600 h-6 rounded-full text-sm text-white text-center leading-6"
              style={{ width: `${matchScore}%` }}
            >
              {matchScore}%
            </div>
          </div>
        </div>
      )}

      {strengths.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-green-600 mb-2">Strengths</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-800">
            {strengths.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">Suggestions for Improvement</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-800">
            {suggestions.map((suggestion, idx) => (
              <li key={idx}>{suggestion}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
