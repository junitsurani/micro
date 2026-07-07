import { NextResponse } from "next/server";

export const runtime = "nodejs";

type NewsletterPayload = {
  email?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const defaultSubstackUrl = "https://microbythefix.substack.com";

const getSubstackOrigin = () => {
  const configuredUrl =
    process.env.SUBSTACK_PUBLICATION_URL ??
    process.env.NEXT_PUBLIC_SUBSTACK_URL ??
    defaultSubstackUrl;

  const withProtocol = /^https?:\/\//i.test(configuredUrl)
    ? configuredUrl
    : `https://${configuredUrl}`;

  return new URL(withProtocol).origin;
};

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as NewsletterPayload;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !emailPattern.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 },
      );
    }

    const substackOrigin = getSubstackOrigin();
    if (!substackOrigin) {
      return NextResponse.json(
        { error: "Substack publication URL is not configured." },
        { status: 503 },
      );
    }

    const response = await fetch(`${substackOrigin}/api/v1/free?nojs=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": req.headers.get("user-agent") ?? "MICRO Website",
      },
      body: new URLSearchParams({
        email: normalizedEmail,
        source: "subscribe_page",
      }),
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "");
      throw new Error(`Substack subscription failed (${response.status}): ${details}`);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 },
    );
  }
}
