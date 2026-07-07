import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { waitlistStore } from "@/lib/waitlist/store";

export const runtime = "nodejs";

const csvEscape = (value: unknown) => {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
};

export async function GET(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");
  const maxLimit = format === "csv" ? 5000 : 500;
  const limit = Math.min(Number(searchParams.get("limit") ?? 100), maxLimit);
  const submissions = await waitlistStore.getSubmissions(limit);

  if (format === "csv") {
    const headers = ["Created At", "Name", "Email", "Phone", "Source", "Consent", "Message"];
    const rows = submissions.map((submission) => [
      submission.createdAt,
      submission.name,
      submission.email,
      submission.phone,
      submission.source,
      submission.consent ? "Yes" : "No",
      submission.message,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(csvEscape).join(","))
      .join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="micro-waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ submissions });
}
