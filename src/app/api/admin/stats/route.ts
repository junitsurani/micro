import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { analyticsStore } from "@/lib/analytics/store";

export async function GET(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ? Number(searchParams.get("from")) : undefined;
  const to = searchParams.get("to") ? Number(searchParams.get("to")) : undefined;

  const stats = await analyticsStore.getStats(from, to);
  return NextResponse.json(stats);
}
