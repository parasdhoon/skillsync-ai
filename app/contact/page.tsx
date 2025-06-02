export default function ContactPage() {
  return (
    <div className="bg-white text-gray-800 space-y-8">
      <section className="text-center py-20 bg-gradient-to-br from-indigo-50 to-white px-4">
        <h2 className="text-4xl font-bold text-indigo-700">Get in Touch</h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
          We'd love to hear from you! Whether you have a question, feedback, or just want to connect—reach out to us through any of the methods below.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid gap-8 sm:grid-cols-2 text-gray-700">
          <div className="border rounded-xl p-6 shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">📧 Email</h3>
            <p>support@skillsync.ai</p>
          </div>
          <div className="border rounded-xl p-6 shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">💬 Live Chat</h3>
            <p>Coming soon! We’re working on integrating a chat system to support you better.</p>
          </div>
          <div className="border rounded-xl p-6 shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">📱 Social Media</h3>
            <p>
              Follow us on:
              <br />
              <a href="https://linkedin.com" className="text-indigo-600 underline">LinkedIn</a> | 
              <a href="https://twitter.com" className="text-indigo-600 underline ml-2">Twitter</a>
            </p>
          </div>
          <div className="border rounded-xl p-6 shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">📍 Location</h3>
            <p>New Delhi, India</p>
          </div>
        </div>
      </section>
    </div>
  );
}
