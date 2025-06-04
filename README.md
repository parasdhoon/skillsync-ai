# SkillSync AI

SkillSync AI helps you measure how well your resume matches a job description. Upload two files and get AI powered insights including a match score, key strengths, and suggestions to improve your resume. You can then chat with the assistant for follow‑up questions.

## Features

- **Upload & Analyse** – drag and drop your resume and job description in PDF or text format.
- **Gemini AI Scoring** – uses Google Generative AI to compute a match score and produce strengths and improvement tips.
- **Chat Interface** – ask follow‑up questions once the analysis is complete.
- **Authentication** – sign in with Google or email/password via NextAuth.
- **MongoDB Storage** – chat sessions are persisted with Mongoose.
- **Responsive UI** – built with Next.js 15, React 19 and Tailwind CSS.

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Create a `.env.local` file and provide the following variables:
   - `GEMINI_API_KEY` – Google Generative AI API key
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` – OAuth credentials
   - `MONGODB_URI` – MongoDB connection string
   - `NEXTAUTH_SECRET` – session encryption secret
   - `NEXTAUTH_URL` – base URL of the app
3. Run the development server
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Available Scripts

- `npm run dev` – start Next.js in development
- `npm run build` – build for production
- `npm start` – start the production build
- `npm run lint` – run ESLint

A small patch under `patches/` disables debug output from `pdf-parse` during PDF extraction.

---

This project was bootstrapped with `create-next-app` and showcases how generative AI can assist job seekers. Enjoy!
