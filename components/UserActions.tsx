"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function UserActions() {
  const { data: session } = useSession();

  return session?.user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-700">Hi, {session.user.name?.split(" ")[0] || "User"}</span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition"
      >
        Sign Out
      </button>
    </div>
  ) : (
    <Link href="/auth/signin">
      <button className="px-6 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition duration-200">
        Sign In
      </button>
    </Link>
  );
}