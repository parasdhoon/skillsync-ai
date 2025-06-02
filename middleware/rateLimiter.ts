import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const tokenBucket = new Map<string, { tokens: number; lastRefill: number }>();
const RATE_LIMIT = 100;
const TIME_WINDOW = 60 * 1000;

export function rateLimiter(req: NextRequest) {
  const ip = req.ip ?? "unknown";

  const now = Date.now();
  const record = tokenBucket.get(ip);

  if (!record) {
    tokenBucket.set(ip, { tokens: RATE_LIMIT - 1, lastRefill: now });
    return null;
  }

  const elapsed = now - record.lastRefill;

  if (elapsed > TIME_WINDOW) {
    record.tokens = RATE_LIMIT - 1;
    record.lastRefill = now;
    return null;
  }

  if (record.tokens <= 0) {
    return new NextResponse(
      JSON.stringify({ message: "Too many requests. Try again later." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  record.tokens -= 1;
  return null;
}