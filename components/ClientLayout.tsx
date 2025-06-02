"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import UserActions from "./UserActions";

export default function ClientLayout({ children, session }: { children: ReactNode; session: any }) {
  return (
    <SessionProvider session={session}>
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-indigo-600">SkillSync AI</h1>
          </Link>
          <nav className="flex gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-indigo-600 transition">Home</Link>
            <Link href="/about" className="hover:text-indigo-600 transition">About</Link>
            <Link href="/contact" className="hover:text-indigo-600 transition">Contact</Link>
          </nav>
          <UserActions />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>

      <footer className="bg-indigo-600 text-white py-8 px-4 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© {new Date().getFullYear()} SkillSync AI. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <Link href="/about" className="hover:underline hover:text-gray-200 transition">About</Link>
            <Link href="/contact" className="hover:underline hover:text-gray-200 transition">Contact Us</Link>
            <Link href="/auth/signin" className="hover:underline hover:text-gray-200 transition">Sign In</Link>
          </div>
        </div>
      </footer>
    </SessionProvider>
  );
}
