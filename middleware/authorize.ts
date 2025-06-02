import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function authorize(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return new NextResponse(
      JSON.stringify({ message: "Unauthorized - Please sign in" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return null;
}