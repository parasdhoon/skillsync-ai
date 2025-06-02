"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <section className="bg-gradient-to-br from-indigo-50 to-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-700">Welcome to SkillSync AI</h1>
          <p className="text-gray-600 text-lg">
            Upload your resume and a job description to receive a personalized match score, strengths, and AI-powered suggestions.
          </p>

          {session?.user ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard">
                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-200">
                  Go To Dashboard
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/signup">
                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-200">
                  Get Started
                </button>
              </Link>
              <Link href="/auth/signin">
                <button className="px-6 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition duration-200">
                  Sign In
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <h2 className="text-3xl font-bold text-indigo-600 text-center">What SkillSync AI Offers</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left text-gray-700">
            <li className="border p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="font-semibold text-lg text-indigo-700 mb-2">Smart Matching</h3>
              <p>AI evaluates your resume against job descriptions and gives a match score.</p>
            </li>
            <li className="border p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="font-semibold text-lg text-indigo-700 mb-2">Strength Highlights</h3>
              <p>Instant summary of your technical and project-based strengths relevant to the job.</p>
            </li>
            <li className="border p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="font-semibold text-lg text-indigo-700 mb-2">Actionable Feedback</h3>
              <p>Suggestions to improve your resume, from formatting tips to aligning skills with JD keywords.</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}