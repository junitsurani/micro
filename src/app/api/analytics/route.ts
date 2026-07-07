import { NextRequest, NextResponse } from "next/server";
import { analyticsStore } from "@/lib/analytics/store";
import type { AnalyticsEvent } from "@/lib/analytics/types";

// --- Simple in-memory rate limiter ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 120; // requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

// Periodically clean stale rate-limit entries
if (typeof globalThis !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetAt) rateLimitMap.delete(key);
    }
  }, RATE_LIMIT_WINDOW * 2);
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * POST /api/analytics - receive batched analytics events
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    let body: { events?: AnalyticsEvent[] };

    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = JSON.parse(text);
    }

    const events = body?.events;
    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "No events provided" }, { status: 400 });
    }

    if (events.length > 100) {
      return NextResponse.json({ error: "Batch too large" }, { status: 400 });
    }

    await analyticsStore.trackEvents(events);

    return NextResponse.json({ ok: true, count: events.length });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

/**
 * GET /api/analytics - return aggregated stats
 * Query params: from (timestamp), to (timestamp)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ? Number(searchParams.get("from")) : undefined;
  const to = searchParams.get("to") ? Number(searchParams.get("to")) : undefined;

  const stats = await analyticsStore.getStats(from, to);
  return NextResponse.json(stats);
}
