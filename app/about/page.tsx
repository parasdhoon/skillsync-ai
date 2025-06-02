export default function AboutPage() {
  return (
    <div className="bg-white text-gray-800 space-y-8">
      <section className="text-center py-20 bg-gradient-to-br from-indigo-50 to-white px-4">
        <h2 className="text-4xl font-bold text-indigo-700">About SkillSync AI</h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
          SkillSync AI is your smart career companion. We help job seekers align their resumes with job descriptions using the power of AI. 
          Whether you're applying for internships or full-time roles, we give you a competitive edge by providing insights into your strengths and personalized suggestions for improvement.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Why Choose Us?</h3>
        <ul className="space-y-4 text-gray-700">
          <li>✅ Built for students and professionals seeking to optimize their resume impact.</li>
          <li>✅ AI-generated analysis that's fast, insightful, and tailored to job descriptions.</li>
          <li>✅ Easy-to-use, privacy-respecting platform with secure login and data handling.</li>
        </ul>
      </section>
    </div>
  );
}